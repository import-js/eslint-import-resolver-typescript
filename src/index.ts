import fs from 'node:fs'
import path from 'node:path'

import isNodeCoreModule from '@nolyfill/is-core-module'
import debug from 'debug'
import type { FileSystem, ResolveOptions, Resolver } from 'enhanced-resolve'
import enhancedResolve from 'enhanced-resolve'
import { createPathsMatcher, getTsconfig } from 'get-tsconfig'
import type { TsConfigResult } from 'get-tsconfig'
import type { Version } from 'is-bun-module'
import { isBunModule } from 'is-bun-module'
import stableHashExports from 'stable-hash'
import { globSync, isDynamicPattern } from 'tinyglobby'

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- esmodule interop
const stableHash = stableHashExports.default || stableHashExports

const IMPORTER_NAME = 'eslint-import-resolver-typescript'

const log = debug(IMPORTER_NAME)

export const defaultConditionNames = [
  'types',
  'import',

  // APF: https://angular.io/guide/angular-package-format
  'esm2020',
  'es2020',
  'es2015',

  'require',
  'node',
  'node-addons',
  'browser',
  'default',
]

/**
 * `.mts`, `.cts`, `.d.mts`, `.d.cts`, `.mjs`, `.cjs` are not included because `.cjs` and `.mjs` must be used explicitly
 */
export const defaultExtensions = [
  '.ts',
  '.tsx',
  '.d.ts',
  '.js',
  '.jsx',
  '.json',
  '.node',
]

export const defaultExtensionAlias = {
  '.js': [
    '.ts',
    // `.tsx` can also be compiled as `.js`
    '.tsx',
    '.d.ts',
    '.js',
  ],
  '.jsx': ['.tsx', '.d.ts', '.jsx'],
  '.cjs': ['.cts', '.d.cts', '.cjs'],
  '.mjs': ['.mts', '.d.mts', '.mjs'],
}

export const defaultMainFields = [
  'types',
  'typings',

  // APF: https://angular.io/guide/angular-package-format
  'fesm2020',
  'fesm2015',
  'esm2020',
  'es2020',

  'module',
  'jsnext:main',

  'main',
]

export const interfaceVersion = 2

export interface TsResolverOptions
  extends Omit<ResolveOptions, 'fileSystem' | 'useSyncFileSystemCalls'> {
  alwaysTryTypes?: boolean
  project?: string[] | string
  extensions?: string[]
}

type InternalResolverOptions = Required<
  Pick<
    ResolveOptions,
    | 'conditionNames'
    | 'extensionAlias'
    | 'extensions'
    | 'mainFields'
    | 'useSyncFileSystemCalls'
  >
> &
  ResolveOptions &
  TsResolverOptions

const fileSystem = fs as FileSystem

const JS_EXT_PATTERN = /\.(?:[cm]js|jsx?)$/
const RELATIVE_PATH_PATTERN = /^\.{1,2}(?:\/.*)?$/

let previousOptionsHash: string
let optionsHash: string
let cachedOptions: InternalResolverOptions | undefined

let prevCwd: string

let mappersCachedOptions: InternalResolverOptions
let mappers: Array<{
  files: Set<string>
  mapperFn: NonNullable<ReturnType<typeof createPathsMatcher>>
}> = []

let resolverCachedOptions: InternalResolverOptions
let cachedResolver: Resolver | undefined

/**
 * @param source the module to resolve; i.e './some-module'
 * @param file the importing file's full path; i.e. '/usr/local/bin/file.js'
 * @param options
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
export function resolve(
  source: string,
  file: string,
  options?: TsResolverOptions | null,
  resolver: Resolver | null = null,
): {
  found: boolean
  path?: string | null
} {
  if (
    !cachedOptions ||
    previousOptionsHash !== (optionsHash = stableHash(options))
  ) {
    previousOptionsHash = optionsHash
    cachedOptions = {
      ...options,
      conditionNames: options?.conditionNames ?? defaultConditionNames,
      extensions: options?.extensions ?? defaultExtensions,
      extensionAlias: options?.extensionAlias ?? defaultExtensionAlias,
      mainFields: options?.mainFields ?? defaultMainFields,
      fileSystem: new enhancedResolve.CachedInputFileSystem(
        fileSystem,
        5 * 1000,
      ),
      useSyncFileSystemCalls: true,
    }
  }

  if (!resolver) {
    if (!cachedResolver || resolverCachedOptions !== cachedOptions) {
      cachedResolver =
        enhancedResolve.ResolverFactory.createResolver(cachedOptions)
      resolverCachedOptions = cachedOptions
    }
    resolver = cachedResolver
  }

  log('looking for', source, 'in', file)

  source = removeQuerystring(source)

  // don't worry about core node/bun modules
  if (
    isNodeCoreModule(source) ||
    isBunModule(source, (process.versions.bun ?? 'latest') as Version)
  ) {
    log('matched core:', source)

    return {
      found: true,
      path: null,
    }
  }

  initMappers(cachedOptions)

  let mappedPaths = getMappedPaths(source, file, cachedOptions.extensions, true)

  if (mappedPaths.length > 0) {
    log('matched ts path:', ...mappedPaths)
  } else {
    mappedPaths = [source]
  }

  // note that even if we map the path, we still need to do a final resolve
  let foundNodePath: string | undefined
  for (const mappedPath of mappedPaths) {
    try {
      const resolved = resolver.resolveSync(
        {},
        path.dirname(path.resolve(file)),
        mappedPath,
      )
      if (resolved) {
        foundNodePath = resolved
        break
      }
    } catch {
      log('failed to resolve with', mappedPath)
    }
  }

  // naive attempt at `@types/*` resolution,
  // if path is neither absolute nor relative
  if (
    (JS_EXT_PATTERN.test(foundNodePath!) ||
      (cachedOptions.alwaysTryTypes && !foundNodePath)) &&
    !/^@types[/\\]/.test(source) &&
    !path.isAbsolute(source) &&
    !source.startsWith('.')
  ) {
    const definitelyTyped = resolve(
      '@types' + path.sep + mangleScopedPackage(source),
      file,
      options,
    )
    if (definitelyTyped.found) {
      return definitelyTyped
    }
  }

  if (foundNodePath) {
    log('matched node path:', foundNodePath)

    return {
      found: true,
      path: foundNodePath,
    }
  }

  log("didn't find ", source)

  return {
    found: false,
  }
}

export function createTypeScriptImportResolver(
  options?: TsResolverOptions | null,
) {
  const resolver = enhancedResolve.ResolverFactory.createResolver({
    ...options,
    conditionNames: options?.conditionNames ?? defaultConditionNames,
    extensions: options?.extensions ?? defaultExtensions,
    extensionAlias: options?.extensionAlias ?? defaultExtensionAlias,
    mainFields: options?.mainFields ?? defaultMainFields,
    fileSystem: new enhancedResolve.CachedInputFileSystem(fileSystem, 5 * 1000),
    useSyncFileSystemCalls: true,
  })

  return {
    interfaceVersion: 3,
    name: IMPORTER_NAME,
    resolve(source: string, file: string) {
      return resolve(source, file, options, resolver)
    },
  }
}

/** Remove any trailing querystring from module id. */
function removeQuerystring(id: string) {
  const querystringIndex = id.lastIndexOf('?')
  if (querystringIndex >= 0) {
    return id.slice(0, querystringIndex)
  }
  return id
}

const isFile = (path?: string | undefined): path is string => {
  try {
    return !!(path && fs.statSync(path, { throwIfNoEntry: false })?.isFile())
  } catch {
    // Node 12 does not support throwIfNoEntry.
    return false
  }
}

const isModule = (modulePath?: string | undefined): modulePath is string => {
  return !!modulePath && isFile(path.resolve(modulePath, 'package.json'))
}

/**
 * @param {string} source the module to resolve; i.e './some-module'
 * @param {string} file the importing file's full path; i.e. '/usr/local/bin/file.js'
 * @param {string[]} extensions the extensions to try
 * @param {boolean} retry should retry on failed to resolve
 * @returns The mapped path of the module or undefined
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
function getMappedPaths(
  source: string,
  file: string,
  extensions: string[] = defaultExtensions,
  retry?: boolean,
): string[] {
  const originalExtensions = extensions
  extensions = ['', ...extensions]

  let paths: string[] = []

  if (RELATIVE_PATH_PATTERN.test(source)) {
    const resolved = path.resolve(path.dirname(file), source)
    if (isFile(resolved)) {
      paths = [resolved]
    }
  } else {
    paths = [
      ...new Set(
        mappers
          .filter(({ files }) => files.has(file))
          .map(({ mapperFn }) =>
            mapperFn(source).map(item => [
              ...extensions.map(ext => `${item}${ext}`),
              ...originalExtensions.map(ext => `${item}/index${ext}`),
            ]),
          )
          .flat(2)
          .map(toNativePathSeparator),
      ),
    ].filter(mappedPath => {
      try {
        const stat = fs.statSync(mappedPath, { throwIfNoEntry: false })
        if (stat === undefined) return false
        if (stat.isFile()) return true

        // Maybe this is a module dir?
        if (stat.isDirectory()) {
          return isModule(mappedPath)
        }
      } catch {
        return false
      }

      return false
    })
  }

  if (retry && paths.length === 0) {
    const isJs = JS_EXT_PATTERN.test(source)
    if (isJs) {
      const jsExt = path.extname(source)
      const tsExt = jsExt.replace('js', 'ts')
      const basename = source.replace(JS_EXT_PATTERN, '')

      const mappedPaths = getMappedPaths(basename + tsExt, file)

      const resolved =
        mappedPaths.length > 0
          ? mappedPaths
          : getMappedPaths(
              basename + '.d' + (tsExt === '.tsx' ? '.ts' : tsExt),
              file,
            )

      if (resolved.length > 0) {
        return resolved
      }
    }

    for (const ext of extensions) {
      const mappedPaths = isJs ? [] : getMappedPaths(source + ext, file)
      const resolved =
        mappedPaths.length > 0
          ? mappedPaths
          : getMappedPaths(source + `/index${ext}`, file)

      if (resolved.length > 0) {
        return resolved
      }
    }
  }

  return paths
}

// eslint-disable-next-line sonarjs/cognitive-complexity
function initMappers(options: InternalResolverOptions) {
  if (
    mappers.length > 0 &&
    mappersCachedOptions === options &&
    prevCwd === process.cwd()
  ) {
    return
  }
  prevCwd = process.cwd()

  const configPaths = (
    typeof options.project === 'string'
      ? [options.project]
      : Array.isArray(options.project)
      ? options.project
      : [process.cwd()]
  ) // 'tinyglobby' pattern must have POSIX separator
    .map(config => replacePathSeparator(config, path.sep, path.posix.sep))

  // https://github.com/microsoft/TypeScript/blob/df342b7206cb56b56bb3b3aecbb2ee2d2ff7b217/src/compiler/commandLineParser.ts#L3006
  const defaultInclude = ['**/*']
  const defaultIgnore = ['**/node_modules/**']

  // Turn glob patterns into paths
  const projectPaths = [
    ...new Set([
      ...configPaths.filter(path => !isDynamicPattern(path)),
      ...globSync(
        configPaths.filter(path => isDynamicPattern(path)),
        {
          absolute: true,
          dot: true,
          expandDirectories: false,
          ignore: defaultIgnore,
        },
      ),
    ]),
  ]

  mappers = projectPaths
    .map(projectPath => {
      let tsconfigResult: TsConfigResult | null

      if (isFile(projectPath)) {
        const { dir, base } = path.parse(projectPath)
        tsconfigResult = getTsconfig(dir, base)
      } else {
        tsconfigResult = getTsconfig(projectPath)
      }

      if (!tsconfigResult) {
        // eslint-disable-next-line unicorn/no-useless-undefined
        return undefined
      }

      const mapperFn = createPathsMatcher(tsconfigResult)

      if (!mapperFn) {
        // eslint-disable-next-line unicorn/no-useless-undefined
        return undefined
      }

      const files =
        tsconfigResult.config.files === undefined &&
        tsconfigResult.config.include === undefined
          ? // Include everything if no files or include options
            globSync(defaultInclude, {
              absolute: true,
              cwd: path.dirname(tsconfigResult.path),
              dot: true,
              ignore: [
                ...(tsconfigResult.config.exclude ?? []),
                ...defaultIgnore,
              ],
            })
          : [
              // https://www.typescriptlang.org/tsconfig/#files
              ...(tsconfigResult.config.files !== undefined &&
              tsconfigResult.config.files.length > 0
                ? tsconfigResult.config.files.map(file =>
                    path.normalize(
                      path.resolve(path.dirname(tsconfigResult!.path), file),
                    ),
                  )
                : []),
              // https://www.typescriptlang.org/tsconfig/#include
              ...(tsconfigResult.config.include !== undefined &&
              tsconfigResult.config.include.length > 0
                ? globSync(tsconfigResult.config.include, {
                    absolute: true,
                    cwd: path.dirname(tsconfigResult.path),
                    dot: true,
                    ignore: [
                      ...(tsconfigResult.config.exclude ?? []),
                      ...defaultIgnore,
                    ],
                  })
                : []),
            ]

      if (files.length === 0) {
        // eslint-disable-next-line unicorn/no-useless-undefined
        return undefined
      }

      return {
        files: new Set(files.map(toNativePathSeparator)),
        mapperFn,
      }
    })
    .filter(isDefined)

  mappersCachedOptions = options
}

/**
 * For a scoped package, we must look in `@types/foo__bar` instead of `@types/@foo/bar`.
 */
function mangleScopedPackage(moduleName: string) {
  if (moduleName.startsWith('@')) {
    const replaceSlash = moduleName.replace(path.sep, '__')
    if (replaceSlash !== moduleName) {
      return replaceSlash.slice(1) // Take off the "@"
    }
  }
  return moduleName
}

/**
 * Replace path `p` from `from` to `to` separator.
 *
 * @param {string} p Path
 * @param {typeof path.sep} from From separator
 * @param {typeof path.sep} to To separator
 * @returns Path with `to` separator
 */
function replacePathSeparator(
  p: string,
  from: typeof path.sep,
  to: typeof path.sep,
) {
  return from === to ? p : p.replaceAll(from, to)
}

/**
 * Replace path `p` separator to its native separator.
 *
 * @param {string} p Path
 * @returns Path with native separator
 */
function toNativePathSeparator(p: string) {
  return replacePathSeparator(
    p,
    path[process.platform === 'win32' ? 'posix' : 'win32'].sep,
    path[process.platform === 'win32' ? 'win32' : 'posix'].sep,
  )
}

/**
 * Check if value is defined.
 *
 * Helper function for TypeScript.
 * Should be removed when upgrading to TypeScript >= 5.5.
 *
 * @param {T | null | undefined} value Value
 * @returns `true` if value is defined, `false` otherwise
 */
function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

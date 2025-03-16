import fs from 'node:fs'
import module from 'node:module'
import path from 'node:path'

import isNodeCoreModule from '@nolyfill/is-core-module'
import debug from 'debug'
import type { TsConfigResult } from 'get-tsconfig'
import { createPathsMatcher, getTsconfig } from 'get-tsconfig'
import type { Version } from 'is-bun-module'
import { isBunModule } from 'is-bun-module'
import { type NapiResolveOptions, ResolverFactory } from 'rspack-resolver'
import { stableHash } from 'stable-hash'
import { globSync, isDynamicPattern } from 'tinyglobby'
import type { SetRequired } from 'type-fest'

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

export interface TsResolverOptions extends NapiResolveOptions {
  alwaysTryTypes?: boolean
  project?: string[] | string
}

type InternalResolverOptions = SetRequired<
  NapiResolveOptions,
  'conditionNames' | 'extensionAlias' | 'extensions' | 'mainFields'
> &
  TsResolverOptions

const JS_EXT_PATTERN = /\.(?:[cm]js|jsx?)$/
const RELATIVE_PATH_PATTERN = /^\.{1,2}(?:\/.*)?$/

let previousOptionsHash: string
let optionsHash: string
let cachedOptions: InternalResolverOptions | undefined

let cachedCwd: string

let mappersCachedOptions: InternalResolverOptions
let mappers: Array<{
  path: string
  files: Set<string>
  mapperFn: NonNullable<ReturnType<typeof createPathsMatcher>>
}> = []

let resolverCachedOptions: InternalResolverOptions
let cachedResolver: ResolverFactory | undefined

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
  resolver?: ResolverFactory | null,
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
    }
  }

  if (!resolver) {
    if (!cachedResolver || resolverCachedOptions !== cachedOptions) {
      cachedResolver = new ResolverFactory(cachedOptions)
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

  /**
   * {@link https://github.com/webpack/enhanced-resolve/blob/38e9fd9acb79643a70e7bcd0d85dabc600ea321f/lib/PnpPlugin.js#L81-L83}
   */
  if (process.versions.pnp && source === 'pnpapi') {
    return {
      found: true,
      path: module.findPnpApi(file).resolveToUnqualified(source, file, {
        considerBuiltins: false,
      }),
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
      const resolved = resolver.sync(
        path.dirname(path.resolve(file)),
        mappedPath,
      )
      if (resolved.path) {
        foundNodePath = resolved.path
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
  const resolver = new ResolverFactory({
    ...options,
    conditionNames: options?.conditionNames ?? defaultConditionNames,
    extensions: options?.extensions ?? defaultExtensions,
    extensionAlias: options?.extensionAlias ?? defaultExtensionAlias,
    mainFields: options?.mainFields ?? defaultMainFields,
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
  if (querystringIndex !== -1) {
    return id.slice(0, querystringIndex)
  }
  return id
}

const isFile = (path?: string): path is string => {
  try {
    return !!(path && fs.statSync(path, { throwIfNoEntry: false })?.isFile())
  } catch {
    // Node 12 does not support throwIfNoEntry.
    return false
  }
}

const isModule = (modulePath?: string): modulePath is string =>
  !!modulePath && isFile(path.resolve(modulePath, 'package.json'))

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
    // Filter mapper functions associated with file
    let mapperFns: Array<NonNullable<ReturnType<typeof createPathsMatcher>>> =
      mappers
        .filter(({ files }) => files.has(file))
        .map(({ mapperFn }) => mapperFn)
    if (mapperFns.length === 0) {
      // If empty, try all mapper functions, starting with the nearest one
      mapperFns = mappers
        .map(mapper => ({
          mapperFn: mapper.mapperFn,
          counter: equalChars(path.dirname(file), path.dirname(mapper.path)),
        }))
        .sort(
          (a, b) =>
            // Sort in descending order where the nearest one has the longest counter
            b.counter - a.counter,
        )
        .map(({ mapperFn }) => mapperFn)
    }
    paths = mapperFns
      .map(mapperFn =>
        mapperFn(source).map(item => [
          ...extensions.map(ext => `${item}${ext}`),
          ...originalExtensions.map(ext => `${item}/index${ext}`),
        ]),
      )
      .flat(/* The depth is always 2 */ 2)
      .map(toNativePathSeparator)
      .filter(mappedPath => {
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
      // cjs -> cts, js -> ts, jsx -> tsx, mjs -> mts
      const tsExt = jsExt.replace('js', 'ts')

      const basename = source.replace(JS_EXT_PATTERN, '')

      let resolved = getMappedPaths(basename + tsExt, file)

      if (resolved.length === 0 && jsExt === '.js') {
        // js -> tsx
        const tsxExt = jsExt.replace('js', 'tsx')
        resolved = getMappedPaths(basename + tsxExt, file)
      }

      if (resolved.length === 0) {
        resolved = getMappedPaths(
          basename + '.d' + (tsExt === '.tsx' ? '.ts' : tsExt),
          file,
        )
      }

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

function initMappers(options: InternalResolverOptions) {
  if (
    mappers.length > 0 &&
    mappersCachedOptions === options &&
    cachedCwd === process.cwd()
  ) {
    return
  }
  cachedCwd = process.cwd()
  const configPaths = (
    typeof options.project === 'string'
      ? [options.project]
      : // eslint-disable-next-line sonarjs/no-nested-conditional
        Array.isArray(options.project)
        ? options.project
        : [cachedCwd]
  ) // 'tinyglobby' pattern must have POSIX separator
    .map(config => replacePathSeparator(config, path.sep, path.posix.sep))

  // https://github.com/microsoft/TypeScript/blob/df342b7206cb56b56bb3b3aecbb2ee2d2ff7b217/src/compiler/commandLineParser.ts#L3006
  const defaultInclude = ['**/*']
  const defaultIgnore = ['**/node_modules/**']

  // Turn glob patterns into paths
  const projectPaths = [
    ...new Set([
      ...configPaths
        .filter(p => !isDynamicPattern(p))
        .map(p => path.resolve(process.cwd(), p)),
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
        return
      }

      const mapperFn = createPathsMatcher(tsconfigResult)

      if (!mapperFn) {
        return
      }

      const files =
        tsconfigResult.config.files == null &&
        tsconfigResult.config.include == null
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
              ...(tsconfigResult.config.files != null &&
              tsconfigResult.config.files.length > 0
                ? tsconfigResult.config.files.map(file =>
                    path.normalize(
                      path.resolve(path.dirname(tsconfigResult.path), file),
                    ),
                  )
                : []),
              // https://www.typescriptlang.org/tsconfig/#include
              ...(tsconfigResult.config.include != null &&
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

      return {
        path: toNativePathSeparator(tsconfigResult.path),
        files: new Set(files.map(toNativePathSeparator)),
        mapperFn,
      }
    })
    .filter(Boolean)

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
 * Counts how many characters in strings `a` and `b` are exactly the same and in the same position.
 *
 * @param {string} a First string
 * @param {string} b Second string
 * @returns Number of matching characters
 */
function equalChars(a: string, b: string): number {
  if (a.length === 0 || b.length === 0) {
    return 0
  }

  let i = 0
  const length = Math.min(a.length, b.length)
  while (i < length && a.charAt(i) === b.charAt(i)) {
    i += 1
  }
  return i
}

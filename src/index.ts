import path from 'node:path'
import { fileURLToPath } from 'node:url'

import debug from 'debug'
import isGlob from 'is-glob'
import * as _resolve from 'resolve'
import { createSyncFn } from 'synckit'
import {
  ConfigLoaderSuccessResult,
  createMatchPath,
  loadConfig,
  ConfigLoaderResult,
  MatchPath,
} from 'tsconfig-paths'

const IMPORTER_NAME = 'eslint-import-resolver-typescript'

const log = debug(IMPORTER_NAME)

const _dirname =
  typeof __dirname === 'undefined'
    ? path.dirname(fileURLToPath(import.meta.url))
    : __dirname

const globSync = createSyncFn<typeof import('globby').globby>(
  path.resolve(_dirname, 'worker.mjs'),
)

/**
 * .mts, .cts, .d.mts, .d.cts, .mjs, .cjs are not included because .cjs and .mjs must be used explicitly.
 */
const defaultExtensions = [
  '.ts',
  '.tsx',
  '.d.ts',
  '.js',
  '.jsx',
  '.json',
  '.node',
]

export const interfaceVersion = 2

export type TsResolverOptions = _resolve.SyncOpts & {
  alwaysTryTypes?: boolean
  /**
   * @deprecated use `project` instead
   */
  directory?: string[] | string
  project?: string[] | string
  extensions?: string[]
  packageFilter?: (pkg: Record<string, string>) => Record<string, string>
}

/**
 * @param {string} source the module to resolve; i.e './some-module'
 * @param {string} file the importing file's full path; i.e. '/usr/local/bin/file.js'
 * @param {TsResolverOptions} options
 */
export function resolve(
  source: string,
  file: string,
  options: TsResolverOptions | null,
): {
  found: boolean
  path?: string | null
} {
  options = options ?? {}

  log('looking for:', source)

  source = removeQuerystring(source)

  // don't worry about core node modules
  if (_resolve.isCore(source)) {
    log('matched core:', source)

    return {
      found: true,
      path: null,
    }
  }

  initMappers(options)
  const mappedPath = getMappedPath(source)
  if (mappedPath) {
    log('matched ts path:', mappedPath.path)
  }

  // note that even if we map the path, we still need to do a final resolve
  let foundNodePath: string | null | undefined
  try {
    foundNodePath = tsResolve(mappedPath?.path ?? source, {
      ...options,
      extensions:
        mappedPath?.extensions ?? options.extensions ?? defaultExtensions,
      basedir: path.dirname(path.resolve(file)),
      packageFilter: options.packageFilter ?? packageFilterDefault,
    })
  } catch {
    foundNodePath = null
  }

  // naive attempt at @types/* resolution,
  // if path is neither absolute nor relative
  if (
    (/\.jsx?$/.test(foundNodePath!) ||
      (options.alwaysTryTypes && !foundNodePath)) &&
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

function packageFilterDefault(pkg: _resolve.PackageJSON) {
  pkg.main =
    pkg.types || pkg.typings || pkg.module || pkg['jsnext:main'] || pkg.main
  return pkg
}

function resolveExtension(id: string) {
  const idWithoutJsExt = removeJsExtension(id)

  if (idWithoutJsExt === id) {
    return
  }

  if (id.endsWith('.mjs')) {
    return {
      path: idWithoutJsExt,
      extensions: ['.mts', '.d.mts'],
    }
  }

  if (id.endsWith('.cjs')) {
    return {
      path: idWithoutJsExt,
      extensions: ['.cts', '.d.cts'],
    }
  }

  return {
    path: idWithoutJsExt,
  }
}

/**
 * Like `sync` from `resolve` package, but considers that the module id
 * could have a .js or .jsx extension.
 */
function tsResolve(id: string, opts: _resolve.SyncOpts): string {
  try {
    return _resolve.sync(id, opts)
  } catch (error) {
    const resolved = resolveExtension(id)
    if (resolved) {
      return _resolve.sync(resolved.path, {
        ...opts,
        extensions: resolved.extensions ?? opts.extensions,
      })
    }
    throw error
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

/** Remove .js or .jsx extension from module id. */
function removeJsExtension(id: string) {
  return id.replace(/\.([cm]js|jsx?)$/, '')
}

let mappersBuildForOptions: TsResolverOptions
let mappers:
  | Array<
      (source: string) =>
        | {
            path: string
            extensions?: string[]
          }
        | undefined
    >
  | undefined

/**
 * @param {string} source the module to resolve; i.e './some-module'
 * @param {string} file the importing file's full path; i.e. '/usr/local/bin/file.js'
 * @returns The mapped path of the module or undefined
 */
function getMappedPath(source: string) {
  const paths = mappers!.map(mapper => mapper(source)).filter(path => !!path)

  if (paths.length > 1) {
    log('found multiple matching ts paths:', paths)
  }

  return paths[0]
}

/**
 * Like `createMatchPath` from `tsconfig-paths` package, but considers
 * that the module id could have a .mjs, .cjs, .js or .jsx extension.
 *
 * The default resolved path does not include the extension, so we need to return it for reusing,
 * otherwise `.mts`, `.cts`, `.d.mts`, `.d.cts` will not be used by default, see also @link {defaultExtensions}.
 */
const createExtendedMatchPath: (
  ...createArgs: Parameters<typeof createMatchPath>
) => (...matchArgs: Parameters<MatchPath>) =>
  | {
      path: string
      extensions?: string[]
    }
  | undefined = (...createArgs) => {
  const matchPath = createMatchPath(...createArgs)

  return (id, readJson, fileExists, extensions) => {
    const match = matchPath(id, readJson, fileExists, extensions)

    if (match != null) {
      return {
        path: match,
      }
    }

    const resolved = resolveExtension(id)

    if (resolved) {
      const match = matchPath(
        resolved.path,
        readJson,
        fileExists,
        resolved.extensions ?? extensions,
      )
      if (match) {
        return {
          path: match,
          extensions: resolved.extensions,
        }
      }
    }
  }
}

function initMappers(options: TsResolverOptions) {
  if (mappers && mappersBuildForOptions === options) {
    return
  }

  // eslint-disable-next-line sonar/deprecation
  if (options.directory) {
    console.warn(
      `[${IMPORTER_NAME}]: option \`directory\` is deprecated, please use \`project\` instead`,
    )

    if (!options.project) {
      // eslint-disable-next-line sonar/deprecation
      options.project = options.directory
    }
  }

  const configPaths =
    typeof options.project === 'string'
      ? [options.project]
      : Array.isArray(options.project)
      ? options.project
      : [process.cwd()]

  const ignore = ['!**/node_modules/**']

  // turn glob patterns into paths
  const projectPaths = [
    ...new Set([
      ...configPaths.filter(path => !isGlob(path)),
      ...globSync([...configPaths.filter(path => isGlob(path)), ...ignore]),
    ]),
  ]

  mappers = projectPaths
    .map(loadConfig)
    .filter(isConfigLoaderSuccessResult)
    .map(configLoaderResult => {
      const matchPath = createExtendedMatchPath(
        configLoaderResult.absoluteBaseUrl,
        configLoaderResult.paths,
      )

      return (source: string) =>
        // look for files based on setup tsconfig "paths"
        matchPath(
          source,
          undefined,
          undefined,
          options.extensions ?? defaultExtensions,
        )
    })

  mappersBuildForOptions = options
}

function isConfigLoaderSuccessResult(
  configLoaderResult: ConfigLoaderResult,
): configLoaderResult is ConfigLoaderSuccessResult {
  if (configLoaderResult.resultType !== 'success') {
    // this can happen if the user has problems with their tsconfig
    // or if it's valid, but they don't have baseUrl set
    log('failed to init tsconfig-paths:', configLoaderResult.message)
    return false
  }
  return true
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

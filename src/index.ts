import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import debug from 'debug'
import { createPathsMatcher, getTsconfig } from 'get-tsconfig'
import isGlob from 'is-glob'
import { isCore, type PackageJSON, sync, SyncOpts } from 'resolve'
import { createSyncFn } from 'synckit'

const IMPORTER_NAME = 'eslint-import-resolver-typescript'

const log = debug(IMPORTER_NAME)

const _dirname =
  typeof __dirname === 'undefined'
    ? path.dirname(fileURLToPath(import.meta.url))
    : __dirname

const globSync = createSyncFn<typeof import('globby').globby>(
  path.resolve(_dirname, 'worker.mjs'),
)

export const interfaceVersion = 2

export type TsResolverOptions = SyncOpts & {
  alwaysTryTypes?: boolean
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
  if (isCore(source)) {
    log('matched core:', source)

    return {
      found: true,
      path: null,
    }
  }

  initMappers(options)

  const mappedPath = getMappedPath(source, file, true)
  if (mappedPath) {
    log('matched ts path:', mappedPath)
  }

  // note that even if we map the path, we still need to do a final resolve
  let foundNodePath: string | null | undefined
  try {
    foundNodePath = tsResolve(mappedPath ?? source, {
      ...options,
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

function packageFilterDefault(pkg: PackageJSON) {
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
function tsResolve(id: string, opts: SyncOpts): string {
  try {
    return sync(id, opts)
  } catch (error) {
    const resolved = resolveExtension(id)
    if (resolved) {
      return sync(resolved.path, {
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
let mappers: Array<((specifier: string) => string[]) | null> | undefined

const JS_EXT_PATTERN = /\.([cm]js|jsx?)$/
const RELATIVE_PATH_PATTERN = /^\.{1,2}(\/.*)?$/

const isFile = (path?: string | undefined): path is string => {
  try {
    return !!path && fs.statSync(path).isFile()
  } catch {
    return false
  }
}

/**
 * @param {string} source the module to resolve; i.e './some-module'
 * @param {string} file the importing file's full path; i.e. '/usr/local/bin/file.js'
 * @returns The mapped path of the module or undefined
 */
function getMappedPath(
  source: string,
  file: string,
  retry?: boolean,
): string | undefined {
  let paths: string[] | undefined = []

  if (RELATIVE_PATH_PATTERN.test(source)) {
    const resolved = path.resolve(path.dirname(file), source)
    if (isFile(resolved)) {
      paths = [resolved]
    }
  } else {
    paths = mappers!.flatMap(mapper => mapper?.(source)).filter(isFile)
  }

  if (retry && paths.length === 0) {
    if (JS_EXT_PATTERN.test(source)) {
      const jsExt = path.extname(source)
      const tsExt = jsExt.replace('js', 'ts')
      const basename = source.replace(JS_EXT_PATTERN, '')
      return (
        getMappedPath(basename + tsExt, file) ||
        getMappedPath(source + '/index.ts', file) ||
        getMappedPath(source + '/index.tsx', file) ||
        getMappedPath(source + '/index.js', file) ||
        getMappedPath(
          basename + '.d' + (tsExt === '.tsx' ? '.ts' : tsExt),
          file,
          false,
        )
      )
    }
    return (
      getMappedPath(source + '.ts', file) ||
      getMappedPath(source + '.tsx', file) ||
      getMappedPath(source + '.js', file) ||
      getMappedPath(source + '.d.ts', file) ||
      getMappedPath(source + '/index.ts', file) ||
      getMappedPath(source + '/index.tsx', file) ||
      getMappedPath(source + '/index.js', file)
    )
  }

  if (paths.length > 1) {
    log('found multiple matching ts paths:', paths)
  }

  return paths[0]
}

function initMappers(options: TsResolverOptions) {
  if (mappers && mappersBuildForOptions === options) {
    return
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

  mappers = projectPaths.map(projectPath => {
    const tsconfigResult = getTsconfig(projectPath)
    return tsconfigResult && createPathsMatcher(tsconfigResult)
  })

  mappersBuildForOptions = options
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

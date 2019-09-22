import path from 'path'

import {
  ConfigLoaderSuccessResult,
  createMatchPath,
  loadConfig,
  ConfigLoaderResult,
} from 'tsconfig-paths'
import isGlob from 'is-glob'

import { isCore, sync } from 'resolve'
import debug from 'debug'
import { sync as globSync } from 'glob'

const log = debug('eslint-import-resolver-ts')

const extensions = ['.ts', '.tsx', '.d.ts'].concat(
  // eslint-disable-next-line node/no-deprecated-api
  Object.keys(require.extensions),
)

export const interfaceVersion = 2

export interface TsResolverOptions {
  alwaysTryTypes?: boolean
  directory?: string | string[]
}

/**
 * @param {string} source the module to resolve; i.e './some-module'
 * @param {string} file the importing file's full path; i.e. '/usr/local/bin/file.js'
 */
export function resolve(
  source: string,
  file: string,
  options: TsResolverOptions = {},
): {
  found: boolean
  path?: string | null
} {
  log('looking for:', source)

  // don't worry about core node modules
  if (isCore(source)) {
    log('matched core:', source)

    return {
      found: true,
      path: null,
    }
  }

  initMappers(options)
  const mappedPath = getMappedPath(source, file)
  if (mappedPath) {
    log('matched ts path:', mappedPath)
  }

  // note that even if we map the path, we still need to do a final resolve
  let foundNodePath: string | null | undefined
  try {
    foundNodePath = sync(mappedPath || source, {
      extensions,
      basedir: path.dirname(path.resolve(file)),
      packageFilter,
    })
  } catch (err) {
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

  log("didn't find", source)

  return {
    found: false,
  }
}

function packageFilter(pkg: Record<string, string>) {
  pkg.main =
    pkg.types || pkg.typings || pkg.module || pkg['jsnext:main'] || pkg.main
  return pkg
}

let mappers:
  | Array<(source: string, file: string) => string | undefined>
  | undefined

/**
 * @param {string} source the module to resolve; i.e './some-module'
 * @param {string} file the importing file's full path; i.e. '/usr/local/bin/file.js'
 * @returns The mapped path of the module or undefined
 */
function getMappedPath(source: string, file: string) {
  const paths = mappers!
    .map(mapper => mapper(source, file))
    .filter(path => !!path)

  if (paths.length > 1) {
    log('found multiple matching ts paths:', paths)
  }

  return paths[0]
}

function initMappers(options: TsResolverOptions) {
  if (mappers) {
    return
  }

  const isArrayOfStrings = (array?: string | string[]) =>
    Array.isArray(array) && array.every(o => typeof o === 'string')

  const configPaths =
    typeof options.directory === 'string'
      ? [options.directory]
      : isArrayOfStrings(options.directory)
      ? options.directory
      : [process.cwd()]

  mappers = configPaths!
    // turn glob patterns into paths
    .reduce<string[]>(
      (paths, path) => paths.concat(isGlob(path) ? globSync(path) : path),
      [],
    )
    .map(path => loadConfig(path))
    .filter(isConfigLoaderSuccessResult)
    .map(configLoaderResult => {
      const matchPath = createMatchPath(
        configLoaderResult.absoluteBaseUrl,
        configLoaderResult.paths,
      )

      return (source: string, file: string) => {
        // exclude files that are not part of the config base url
        if (!file.includes(configLoaderResult.absoluteBaseUrl)) {
          return undefined
        }

        // look for files based on setup tsconfig "paths"
        return matchPath(source, undefined, undefined, extensions)
      }
    })
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

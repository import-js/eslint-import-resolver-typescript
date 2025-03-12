import { isBuiltin } from 'node:module'
import path from 'node:path'

import type { ResolvedResult } from 'eslint-plugin-import-x/types.js'
import {
  type FileMatcher,
  type TsConfigJsonResolved,
  createFilesMatcher,
  parseTsconfig,
} from 'get-tsconfig'
import { type Version, isBunModule } from 'is-bun-module'
import { ResolverFactory } from 'rspack-resolver'
import stableHash_ from 'stable-hash'

import { JS_EXT_PATTERN } from './constants.js'
import {
  mangleScopedPackage,
  removeQuerystring,
  sortProjectsByAffinity,
} from './helpers.js'
import { log } from './logger.js'
import { normalizeOptions } from './normalize-options.js'
import type { TypeScriptResolverOptions } from './types.js'

export * from './constants.js'
export * from './helpers.js'
export * from './normalize-options.js'
export type * from './types.js'

// CJS <-> ESM interop
const stableHash = 'default' in stableHash_ ? stableHash_.default : stableHash_

const resolverCache = new Map<string, ResolverFactory>()

const tsconfigCache = new Map<string, TsConfigJsonResolved>()

const matcherCache = new Map<string, FileMatcher>()

const oxcResolve = (
  source: string,
  file: string,
  resolver: ResolverFactory,
): ResolvedResult => {
  const result = resolver.sync(path.dirname(file), source)
  if (result.path) {
    return {
      found: true,
      path: result.path,
    }
  }
  if (result.error) {
    log('oxc resolve error:', result.error)
  }
  return {
    found: false,
  }
}

export const resolve = (
  source: string,
  file: string,
  options?: TypeScriptResolverOptions | null,
  resolver?: ResolverFactory | null,
  // eslint-disable-next-line sonarjs/cognitive-complexity
): ResolvedResult => {
  // don't worry about core node/bun modules
  if (
    isBuiltin(source) ||
    (process.versions.bun &&
      isBunModule(source, process.versions.bun as Version))
  ) {
    log('matched core:', source)

    return {
      found: true,
      path: null,
    }
  }

  options ||= {}

  if (!resolver) {
    const optionsHash = stableHash(options)
    options = normalizeOptions(options)
    // take `cwd` into account -- #217
    const cacheKey = `${optionsHash}:${process.cwd()}`
    let cached = resolverCache.get(cacheKey)
    if (!cached && !options.project) {
      resolverCache.set(cacheKey, (cached = new ResolverFactory(options)))
    }
    resolver = cached
  }

  source = removeQuerystring(source)

  // eslint-disable-next-line sonarjs/label-position, sonarjs/no-labels
  resolve: if (!resolver) {
    // must be a array with 2+ items here already ensured by `normalizeOptions`
    const project = options.project as string[]
    for (const tsconfigPath of project) {
      const resolverCached = resolverCache.get(tsconfigPath)
      if (resolverCached) {
        resolver = resolverCached
        break resolve
      }
      let tsconfigCached = tsconfigCache.get(tsconfigPath)
      if (!tsconfigCached) {
        tsconfigCache.set(
          tsconfigPath,
          (tsconfigCached = parseTsconfig(tsconfigPath)),
        )
      }
      let matcherCached = matcherCache.get(tsconfigPath)
      if (!matcherCached) {
        matcherCache.set(
          tsconfigPath,
          (matcherCached = createFilesMatcher({
            config: tsconfigCached,
            path: tsconfigPath,
          })),
        )
      }
      const tsconfig = matcherCached(file)
      if (!tsconfig) {
        log('tsconfig', tsconfigPath, 'does not match', file)
        continue
      }
      log('matched tsconfig at:', tsconfigPath, 'for', file)
      options = {
        ...options,
        tsconfig: {
          references: 'auto',
          ...options.tsconfig,
          configFile: tsconfigPath,
        },
      }
      resolver = new ResolverFactory(options)
      resolverCache.set(tsconfigPath, resolver)
      break resolve
    }

    log(
      'no tsconfig matched',
      file,
      'with',
      ...project,
      ', trying from the the nearest one',
    )
    for (const p of sortProjectsByAffinity(project, file)) {
      const resolved = resolve(
        source,
        file,
        { ...options, project: p },
        resolver,
      )
      if (resolved.found) {
        return resolved
      }
    }
  }

  if (!resolver) {
    return {
      found: false,
    }
  }

  const resolved = oxcResolve(source, file, resolver)

  const foundPath = resolved.path

  // naive attempt at `@types/*` resolution,
  // if path is neither absolute nor relative
  if (
    ((foundPath && JS_EXT_PATTERN.test(foundPath)) ||
      (options.alwaysTryTypes !== false && !foundPath)) &&
    !/^@types[/\\]/.test(source) &&
    !path.isAbsolute(source) &&
    !source.startsWith('.')
  ) {
    const definitelyTyped = oxcResolve(
      '@types/' + mangleScopedPackage(source),
      file,
      resolver,
    )

    if (definitelyTyped.found) {
      return definitelyTyped
    }
  }

  if (foundPath) {
    log('matched path:', foundPath)
  } else {
    log(
      "didn't find",
      source,
      'with',
      options.tsconfig?.configFile || options.project,
    )
  }

  return resolved
}

export const createTypeScriptImportResolver = (
  options?: TypeScriptResolverOptions | null,
) => {
  options = normalizeOptions(options)
  const resolver = options.project ? null : new ResolverFactory(options)
  return {
    interfaceVersion: 3,
    name: 'eslint-import-resolver-typescript',
    resolve(source: string, file: string) {
      return resolve(source, file, options, resolver)
    },
  }
}

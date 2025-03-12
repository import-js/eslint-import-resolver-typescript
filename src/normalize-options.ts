import type { TsconfigOptions } from 'oxc-resolver'
import { globSync, isDynamicPattern } from 'tinyglobby'

import {
  defaultConditionNames,
  defaultExtensions,
  defaultExtensionAlias,
  defaultMainFields,
  DEFAULT_CONFIGS,
  DEFAULT_TRY_PATHS,
  DEFAULT_IGNORE,
} from './constants.js'
import { tryFile } from './helpers.js'
import { log } from './logger.js'
import type { TsResolverOptions, TypeScriptResolverOptions } from './types.js'

export let defaultConfigFile: string

const configFileMapping = new Map<string, TypeScriptResolverOptions>()

export function normalizeOptions(
  options?: TypeScriptResolverOptions | null,
): TsResolverOptions
// eslint-disable-next-line sonarjs/cognitive-complexity
export function normalizeOptions(
  options?: TsResolverOptions | null,
): TsResolverOptions {
  let { project, tsconfig } = (options ??= {})

  let { configFile, references }: Partial<TsconfigOptions> = tsconfig ?? {}

  let ensured: boolean | undefined

  if (configFile) {
    configFile = tryFile(configFile)
    ensured = true
  } else if (project) {
    project = Array.isArray(project) ? project : [project]
    if (project.some(p => isDynamicPattern(p))) {
      project = globSync(project, {
        absolute: true,
        dot: true,
        onlyFiles: false,
        ignore: DEFAULT_IGNORE,
      })
    }
    project = project.flatMap(p => tryFile(DEFAULT_TRY_PATHS, false, p) || [])
    log('resolved projects:', ...project)
    if (project.length === 1) {
      configFile = project[0]
      ensured = true
    }
    if (project.length <= 1) {
      project = undefined
    }
  }

  if (!project && !configFile) {
    configFile = defaultConfigFile ||= tryFile(DEFAULT_CONFIGS)
    ensured = true
  }

  if (configFile) {
    const cachedOptions = configFileMapping.get(configFile)
    if (cachedOptions) {
      log('using cached options for', configFile)
      return cachedOptions
    }
  }

  if (!ensured && configFile && configFile !== defaultConfigFile) {
    configFile = tryFile(DEFAULT_TRY_PATHS, false, configFile)
  }

  options = {
    conditionNames: defaultConditionNames,
    extensions: defaultExtensions,
    extensionAlias: defaultExtensionAlias,
    mainFields: defaultMainFields,
    ...options,
    project,
    tsconfig: {
      references: references ?? 'auto',
      configFile: configFile || '',
    },
  }

  if (configFile) {
    configFileMapping.set(configFile, options)
  }

  return options
}

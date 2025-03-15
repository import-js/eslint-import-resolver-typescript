import type { NapiResolveOptions } from 'oxc-resolver'

export interface TypeScriptResolverOptions extends NapiResolveOptions {
  project?: string[] | string
  /**
   * @default true - whether to always try to resolve `@types` packages
   */
  alwaysTryTypes?: boolean
  noWarnOnMultipleProjects?: boolean
}

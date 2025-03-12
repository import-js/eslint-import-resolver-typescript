import type { NapiResolveOptions } from 'rspack-resolver'

export interface TypeScriptResolverOptions extends NapiResolveOptions {
  project?: string[] | string
  /**
   * @default true - whether to always try to resolve `@types` packages
   */
  alwaysTryTypes?: boolean
  noWarnOnMultipleProjects?: boolean
}

import type { NapiResolveOptions } from 'unrs-resolver'

export interface TypeScriptResolverOptions extends NapiResolveOptions {
  project?: string[] | string
  /**
   * @default true - whether to always try to resolve `@types` packages
   */
  alwaysTryTypes?: boolean
  /**
   * Whether `bun` core modules should be accounted
   */
  bun?: boolean
  noWarnOnMultipleProjects?: boolean
}

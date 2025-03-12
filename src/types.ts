import type { NapiResolveOptions } from 'oxc-resolver'

export interface TsResolverOptions extends NapiResolveOptions {
  project?: string[] | string
  alwaysTryTypes?: boolean
}

export type TypeScriptResolverOptions = TsResolverOptions | null

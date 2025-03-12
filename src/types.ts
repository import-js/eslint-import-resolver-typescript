import type { NapiResolveOptions } from 'rspack-resolver'

export interface TsResolverOptions extends NapiResolveOptions {
  project?: string[] | string
  alwaysTryTypes?: boolean
}

export type TypeScriptResolverOptions = TsResolverOptions | null

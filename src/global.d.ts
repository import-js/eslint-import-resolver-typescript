import '@total-typescript/ts-reset'
import type * as pnpapi from 'pnpapi'

declare module 'module' {
  namespace Module {
    function findPnpApi(source: string): typeof pnpapi
  }
}

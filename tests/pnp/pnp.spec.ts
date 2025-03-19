import { describe, expect, it } from 'vitest'
import { exec } from 'tinyexec'

import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'
import path from 'node:path'

describe('createTypeScriptImportResolver', () => {
  it('should work with pnp', async () => {
    await exec('yarn', ['install'], {
      nodeOptions: {
        cwd: import.meta.dirname,
      },
    })

    const resolver = createTypeScriptImportResolver()

    expect(resolver.resolve('pnpapi', import.meta.filename))
      .toMatchInlineSnapshot(`
        {
          "found": true,
          "path": "<ROOT>/tests/pnp/.pnp.cjs",
        }
      `)

    expect(resolver.resolve('lodash.zip', import.meta.filename))
      .toMatchInlineSnapshot(`
        {
          "found": true,
          "path": "<HOME>/.yarn/berry/cache/lodash.zip-npm-4.2.0-5299417ec8-10.zip/node_modules/lodash.zip/index.js",
        }
      `)
  })
})

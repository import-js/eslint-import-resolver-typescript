import { describe, expect, it } from 'vitest'
import { exec } from 'tinyexec'

import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'

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
          "path": "<ROOT>/tests/pnp/.yarn/cache/lodash.zip-npm-4.2.0-5299417ec8-cb06530d81.zip/node_modules/lodash.zip/index.js",
        }
      `)
  }, 10_000)
})

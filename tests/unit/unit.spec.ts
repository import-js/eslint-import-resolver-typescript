import path from 'node:path'

import { exec } from 'tinyexec'

import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'

describe('createTypeScriptImportResolver', async () => {
  const pnpDir = path.resolve(import.meta.dirname, 'pnp')

  await exec('yarn', [], {
    nodeOptions: {
      cwd: pnpDir,
    },
  })

  const resolver = createTypeScriptImportResolver()

  it('should work with pnp', async () => {
    const testfile = path.resolve(pnpDir, '__test__.js')

    expect(resolver.resolve('pnpapi', testfile)).toMatchInlineSnapshot(`
        {
          "found": true,
          "path": "<ROOT>/tests/unit/pnp/.pnp.cjs",
        }
      `)

    expect(resolver.resolve('lodash.zip', testfile)).toMatchInlineSnapshot(`
        {
          "found": true,
          "path": "<ROOT>/tests/unit/pnp/.yarn/cache/lodash.zip-npm-4.2.0-5299417ec8-cb06530d81.zip/node_modules/lodash.zip/index.js",
        }
      `)
  })
})

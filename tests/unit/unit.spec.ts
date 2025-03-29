import path from 'node:path'

import { exec } from 'tinyexec'

import {
  createTypeScriptImportResolver,
  TSCONFIG_NOT_FOUND_REGEXP,
} from 'eslint-import-resolver-typescript'

describe('createTypeScriptImportResolver', async () => {
  const { dirname } = import.meta

  const pnpDir = path.resolve(dirname, 'pnp')

  await exec('yarn', [], {
    nodeOptions: {
      cwd: pnpDir,
    },
  })

  it('should work with pnp', async () => {
    const resolver = createTypeScriptImportResolver()

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

  it('should error on malformed tsconfig reference', () => {
    const project = path.resolve(dirname, 'malformed-reference')

    const resolver = createTypeScriptImportResolver({ project })

    const testfile = path.resolve(project, '__test__.js')

    expect(() => resolver.resolve('index.js', testfile)).toThrowError(
      TSCONFIG_NOT_FOUND_REGEXP,
    )
  })
})

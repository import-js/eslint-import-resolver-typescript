import path from 'node:path'

import { exec } from 'tinyexec'

import {
  createTypeScriptImportResolver,
  TSCONFIG_NOT_FOUND_REGEXP,
} from 'eslint-import-resolver-typescript'

const { dirname } = import.meta

describe('createTypeScriptImportResolver', async () => {
  const resolver = createTypeScriptImportResolver()

  it('should work with pnp', async () => {
    const pnpDir = path.resolve(dirname, 'pnp')

    await exec('yarn', [], {
      nodeOptions: {
        cwd: pnpDir,
      },
    })

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
        "path": "<ROOT>/tests/unit/pnp/.yarn/cache/lodash.zip-npm-4.2.0-5299417ec8-e596da80a6.zip/node_modules/lodash.zip/index.js",
      }
    `)

    expect(
      resolver.resolve('@atlaskit/pragmatic-drag-and-drop/combine', testfile),
    ).toMatchInlineSnapshot(`
      {
        "found": true,
        "path": "<ROOT>/tests/unit/pnp/.yarn/cache/@atlaskit-pragmatic-drag-and-drop-npm-1.7.0-2fb827d798-dc5f297086.zip/node_modules/@atlaskit/pragmatic-drag-and-drop/dist/types/entry-point/combine.d.ts",
      }
    `)
  })

  it('should resolve .d.ts with .ts extension', () => {
    const dtsDir = path.resolve(dirname, 'dts')

    const testfile = path.resolve(dtsDir, '__test__.js')

    expect(resolver.resolve('./foo.ts', testfile)).toMatchInlineSnapshot(`
      {
        "found": true,
        "path": "<ROOT>/tests/unit/dts/foo.d.ts",
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

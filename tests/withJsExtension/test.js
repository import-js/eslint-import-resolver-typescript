/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path')
const assert = require('assert')

const { resolve } = require('../../')

const config = {
  project: path.join(__dirname, 'tsconfig.json'),
}

const file = path.join(__dirname, 'index.ts')

function assertResolve(id, relativePath) {
  const filePath = path.join(__dirname, relativePath)
  assert.deepStrictEqual(resolve(id, file, config), {
    found: true,
    path: filePath,
  })
  assert.deepStrictEqual(
    resolve(id, file, { ...config, alwaysTryTypes: true }),
    { found: true, path: filePath },
  )
}

// import relative

assertResolve('./jsImportee.js', 'jsImportee.js')

assertResolve('./cjsImportee.cjs', 'cjsImportee.cjs')

assertResolve('./mjsImportee.mjs', 'mjsImportee.mjs')

assertResolve('./tsImportee.js', 'tsImportee.ts')

assertResolve('./tsxImportee.jsx', 'tsxImportee.tsx')

assertResolve('./ctsImportee.cjs', 'ctsImportee.cts')

assertResolve('./mtsImportee.mjs', 'mtsImportee.mts')

assertResolve('./dtsImportee.js', 'dtsImportee.d.ts')

assertResolve('./dtsImportee.jsx', 'dtsImportee.d.ts')

assertResolve('./d-ctsImportee.cjs', 'd-ctsImportee.d.cts')

assertResolve('./d-mtsImportee.mjs', 'd-mtsImportee.d.mts')

assertResolve('./foo', 'foo/index.ts')

assertResolve('./foo.js', 'foo.js/index.ts')

assertResolve('./foo.jsx', 'foo.jsx/index.ts')

assertResolve('./foo.cjs', 'foo.cjs/index.ts')

assertResolve('./foo.mjs', 'foo.mjs/index.ts')

assertResolve('./bar', 'bar/index.tsx')

// import using tsconfig.json path mapping

assertResolve('#/tsImportee.js', 'tsImportee.ts')

assertResolve('#/tsxImportee.jsx', 'tsxImportee.tsx')

assertResolve('#/cjsImportee.cjs', 'cjsImportee.cjs')

assertResolve('#/mjsImportee.mjs', 'mjsImportee.mjs')

assertResolve('#/ctsImportee.cjs', 'ctsImportee.cts')

assertResolve('#/mtsImportee.mjs', 'mtsImportee.mts')

assertResolve('#/dtsImportee.js', 'dtsImportee.d.ts')

assertResolve('#/dtsImportee.jsx', 'dtsImportee.d.ts')

assertResolve('#/d-ctsImportee.cjs', 'd-ctsImportee.d.cts')

assertResolve('#/d-mtsImportee.mjs', 'd-mtsImportee.d.mts')

assertResolve('#/foo', 'foo/index.ts')

assertResolve('#/foo.js', 'foo.js/index.ts')

assertResolve('#/foo.jsx', 'foo.jsx/index.ts')

assertResolve('#/bar', 'bar/index.tsx')

// import using tsconfig.json base url

assertResolve('tsImportee.js', 'tsImportee.ts')

assertResolve('tsxImportee.jsx', 'tsxImportee.tsx')

assertResolve('cjsImportee.cjs', 'cjsImportee.cjs')

assertResolve('mjsImportee.mjs', 'mjsImportee.mjs')

assertResolve('ctsImportee.cjs', 'ctsImportee.cts')

assertResolve('mtsImportee.mjs', 'mtsImportee.mts')

assertResolve('dtsImportee.js', 'dtsImportee.d.ts')

assertResolve('dtsImportee.jsx', 'dtsImportee.d.ts')

assertResolve('d-ctsImportee.cjs', 'd-ctsImportee.d.cts')

assertResolve('d-mtsImportee.mjs', 'd-mtsImportee.d.mts')

assertResolve('foo', 'foo/index.ts')

assertResolve('foo.js', 'foo.js/index.ts')

assertResolve('foo.jsx', 'foo.jsx/index.ts')

assertResolve('bar', 'bar/index.tsx')

// import from node_module

assertResolve(
  'typescript/lib/typescript.js',
  '../../node_modules/typescript/lib/typescript.js',
)

// resolves symlinks by default
assertResolve('dummy.js', '../../dummy.js/index.js')

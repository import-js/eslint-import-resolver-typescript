const path = require('path')
const { createTypeScriptImportResolver } = require('../../lib/index.cjs')

const globPattern = './packages/*/tsconfig.json'

// in normal cases this is not needed because the __dirname would be the root
const absoluteGlobPath = path.join(__dirname, globPattern)

module.exports = {
  ...require('eslint-plugin-import-x').flatConfigs.typescript,
  settings: {
    ...require('eslint-plugin-import-x').flatConfigs.typescript.settings,
    'import-x/resolver-next': [
      createTypeScriptImportResolver({
        project: absoluteGlobPath,
        alwaysTryTypes: true,
      }),
    ],
  },
}

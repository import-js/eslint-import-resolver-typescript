const path = require('path')
const importX = require('eslint-plugin-import-x')

const { createTypeScriptImportResolver } = require('../..')

const globPattern = './packages/*/tsconfig.json'

// in normal cases this is not needed because the __dirname would be the root
const absoluteGlobPath = path.join(__dirname, globPattern)

const base = require('../baseEslintConfig.cjs')()

module.exports = {
  files: ['**/*.ts', '**/*.tsx'],
  plugins: {
    import: importX,
  },
  settings: {
    ...importX.flatConfigs.typescript.settings,
    'import-x/resolver-next': [
      createTypeScriptImportResolver({
        project: absoluteGlobPath,
      }),
    ],
  },
  rules: base.rules,
}

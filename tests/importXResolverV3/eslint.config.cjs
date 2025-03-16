const path = require('node:path')

const {
  createTypeScriptImportResolver,
} = require('eslint-import-resolver-typescript')
const importX = require('eslint-plugin-import-x')

const globPattern = './packages/*/tsconfig.json'

// in normal cases this is not needed because the __dirname would be the root
const absoluteGlobPath = path.join(__dirname, globPattern)

const base = require('../base.eslintrc.cjs')()

module.exports =
  // eslint-disable-next-line no-magic-numbers -- don't run on node 16 because lacking of `structuredClone`
  +process.versions.node.split('.')[0] <= 16
    ? {}
    : {
        files: ['**/*.ts', '**/*.tsx'],
        plugins: {
          'import-x': importX,
        },
        settings: {
          ...importX.flatConfigs.typescript.settings,
          'import-x/resolver-next': [
            createTypeScriptImportResolver({
              project: absoluteGlobPath,
              noWarnOnMultipleProjects: true,
            }),
          ],
        },
        rules: base.rules,
      }

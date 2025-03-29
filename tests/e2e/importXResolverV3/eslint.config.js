import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'
import importX, { flatConfigs } from 'eslint-plugin-import-x'

import base from '../base.eslintrc.cjs'

const globPattern = './packages/*/tsconfig.json'

// in normal cases this is not needed because the `dirname` would be the root
const absoluteGlobPath = path.resolve(
  fileURLToPath(import.meta.url),
  '..',
  globPattern,
)

export default +process.versions.node.split('.')[0] <= 16
  ? {}
  : {
      files: ['**/*.ts', '**/*.tsx'],
      plugins: {
        'import-x': importX,
      },
      settings: {
        ...flatConfigs.typescript.settings,
        'import-x/resolver-next': [
          createTypeScriptImportResolver({
            project: absoluteGlobPath,
            noWarnOnMultipleProjects: true,
          }),
        ],
      },
      rules: base().rules,
    }

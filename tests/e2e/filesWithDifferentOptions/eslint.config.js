import { defineConfig, globalIgnores } from 'eslint/config'
import { defaultExtensions } from 'eslint-import-resolver-typescript'
import importX, { flatConfigs } from 'eslint-plugin-import-x'

export default defineConfig(
  globalIgnores(['eslint.config.js']),
  {
    files: ['**/*.foo.js', '**/*.bar.js'],
    plugins: {
      'import-x': importX,
    },
    settings: {
      ...flatConfigs.typescript.settings,
      'import-x/resolver': {
        typescript: {},
      },
    },
    rules: {
      'import-x/no-unresolved': 'error',
    },
  },
  // .foo.js files should prefer importing other .foo.js files.
  {
    files: ['**/*.foo.js'],
    settings: {
      'import-x/resolver': {
        typescript: {
          extensions: ['.foo.js', ...defaultExtensions],
        },
      },
    },
  },
  // .bar.js files should prefer importing other .bar.js files.
  {
    files: ['**/*.bar.js'],
    settings: {
      'import-x/resolver': {
        typescript: {
          extensions: ['.bar.js', ...defaultExtensions],
        },
      },
    },
  },
)

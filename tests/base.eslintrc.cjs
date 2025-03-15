/**
 * @import {TSESLint} from '@typescript-eslint/utils'
 * @param {string} project
 * @returns {TSESLint.ClassicConfig.Config}
 */
const base = project => ({
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import-x/errors',
    'plugin:import-x/typescript',
  ],
  settings: {
    'import-x/resolver': {
      typescript: {
        project,
        alwaysTryTypes: true,
      },
    },
  },
  rules: {
    'import-x/no-duplicates': 0,
    'import-x/no-unresolved': 2,
    'import-x/extensions': [
      2,
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'node/no-extraneous-import': 0,
    'node/no-missing-import': 0,
  },
  overrides: [
    {
      files: '**/.*.cjs',
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
      },
    },
  ],
})

module.exports = base

// @ts-check

import base from '@1stg/eslint-config'

/**
 * @import {TSESLint} from '@typescript-eslint/utils'
 * @type {TSESLint.FlatConfig.ConfigArray}
 */
const config = [
  {
    ignores: ['tests'],
  },
  ...base,
  {
    files: ['dummy.js/*'],
    languageOptions: {
      globals: {
        module: false,
      },
    },
  },
  {
    files: ['src/*'],
    rules: {
      'prefer-const': ['error', { destructuring: 'all' }],
      'sonarjs/no-nested-assignment': 'off',
    },
  },
]

export default config

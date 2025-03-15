// @ts-check

import recommended from '@1stg/eslint-config'

/**
 * @import {TSESLint} from '@typescript-eslint/utils'
 * @type {TSESLint.FlatConfig.ConfigArray}
 */
const config = [
  {
    ignores: ['tests'],
  },
  ...recommended,
  {
    files: ['dummy.js/*'],
    languageOptions: {
      globals: {
        module: false,
      },
    },
  },
]

export default config

/**
 * @param {string} project
 */
module.exports = project => ({
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/typescript',
  ],
  settings: {
    'import/resolver': {
      typescript: {
        project,
        alwaysTryTypes: true,
      },
    },
  },
  rules: {
    'import/no-duplicates': 0,
    'import/no-unresolved': 2,
    'import/extensions': [
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
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
})

const path = require('path')

module.exports = dirname => ({
  env: {
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['import'],
  rules: {
    'import/no-unresolved': 'error',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
  },
  settings: {
    'import/resolver': {
      [path.resolve(__dirname, '../lib/cjs.js')]: {
        directory: dirname,
        alwaysTryTypes: true,
      },
    },
  },
})

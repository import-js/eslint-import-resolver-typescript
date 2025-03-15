/* eslint-env node */
const config = require('../base.eslintrc.cjs')(__dirname)

module.exports = {
  ...config,
  rules: {
    ...config.rules,
    'import-x/extensions': [
      2,
      'ignorePackages',
      {
        ts: 'never',
        tsx: 'never',
      },
    ],
  },
}

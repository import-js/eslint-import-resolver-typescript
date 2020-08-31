/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */
const config = require('../baseEslintConfig')(__dirname)

module.exports = {
  ...config,
  rules: {
    ...config.rules,
    'import/extensions': [
      2,
      'ignorePackages',
      {
        ts: 'never',
        tsx: 'never',
      },
    ],
  },
}

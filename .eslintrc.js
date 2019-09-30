const { js } = require('@1stg/eslint-config/overrides')

module.exports = {
  extends: ['@1stg', 'plugin:import/typescript', 'plugin:mdx/recommended'],
  overrides: [js],
  rules: {
    'node/no-unsupported-features/es-syntax': 0,
  },
}

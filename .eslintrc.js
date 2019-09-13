const { js, md, mdx } = require('@1stg/eslint-config/overrides')

module.exports = {
  extends: ['@1stg', 'plugin:import/typescript'],
  overrides: [js, md, mdx],
  rules: {
    'node/no-unsupported-features/es-syntax': 0,
  },
}

const { md, mdx } = require('@1stg/eslint-config/overrides')

module.exports = {
  extends: ['plugin:prettier/recommended'],
  overrides: [md, mdx],
  rules: {
    'prettier/prettier': 2,
  },
}

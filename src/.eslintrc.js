const { ts } = require('@1stg/eslint-config/overrides')

module.exports = {
  extends: '@1stg',
  overrides: [
    ...ts,
    {
      files: '*.ts',
      rules: {
        '@typescript-eslint/no-use-before-define': [
          2,
          {
            functions: false,
          },
        ],
      },
    },
  ],
}

const { ts } = require('@1stg/eslint-config/overrides')

module.exports = {
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

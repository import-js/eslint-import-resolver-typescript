const path = require('path')

module.exports = {
    env: {
        es6: true,
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: [
        'import'
    ],
    rules: {
        'import/no-unresolved': 'error',
        'import/extensions': 'error',
    },
    settings: {
        'import/resolver': {
            [path.resolve(`${__dirname}/../index.js`)]: {
                directory: __dirname,
            },
        },
    },
}

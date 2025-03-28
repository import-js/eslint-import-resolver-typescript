const path = require('node:path')

module.exports = require('../base.eslintrc.cjs')(
  path.resolve(__dirname, 'tsconfig.json'),
)

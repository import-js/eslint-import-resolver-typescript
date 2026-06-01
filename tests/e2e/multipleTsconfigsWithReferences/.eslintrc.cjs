const path = require('node:path')

const project = [
  path.resolve(__dirname, 'tsconfig.node.json'),
  path.resolve(__dirname, 'tsconfig.web.json'),
]

module.exports = require('../base.eslintrc.cjs')(project)

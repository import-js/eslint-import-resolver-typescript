const path = require('node:path')

const project = [
  'tsconfig.json',
  'a/tsconfig.json',
  'a/b/tsconfig.json',
  'a/b/c/tsconfig.json',
].map(tsconfig => path.resolve(__dirname, tsconfig))

module.exports = require('../base.eslintrc.cjs')(project)

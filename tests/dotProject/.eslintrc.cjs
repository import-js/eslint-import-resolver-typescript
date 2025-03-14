const path = require('node:path')

const globPattern = './packages/*/*/tsconfig.json'

// in normal cases this is not needed because the __dirname would be the root
const absoluteGlobPath = path.join(__dirname, globPattern)

module.exports = require('../base.eslintrc.cjs')(absoluteGlobPath)

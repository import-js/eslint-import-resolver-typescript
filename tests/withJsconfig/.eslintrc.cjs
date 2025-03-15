const path = require('node:path')

const configPath = path.join(__dirname, 'jsconfig.json')

module.exports = require('../base.eslintrc.cjs')(configPath)

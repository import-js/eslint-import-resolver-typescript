const path = require('path')

const configPath = path.join(__dirname, 'jsconfig.json')

module.exports = require('../baseEslintConfig.cjs')(configPath)

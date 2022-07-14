const { dependencies } = require('./package.json')

/** @see https://github.com/ai/size-limit/issues/291 */
const external = Object.keys(dependencies)

module.exports = [
  {
    path: './lib/index.js',
    ignore: external,
  },
  {
    path: './lib/worker.mjs',
    ignore: external,
  },
]

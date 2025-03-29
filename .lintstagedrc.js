import base from '@1stg/lint-staged/tsc'

export default {
  ...base,
  'tests/e2e/absoluteAlias/**/*.ts?(x)': () =>
    'tsc -p tests/e2e/absoluteAlias --noEmit',
}

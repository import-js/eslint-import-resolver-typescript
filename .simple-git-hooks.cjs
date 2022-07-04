module.exports = {
  'pre-commit': 'yarn lint-staged',
  'commit-msg': `yarn commitlint -e`,
}

#!/bin/sh

set -e

GH_BRANCH=${GH_BRANCH:-$TRAVIS_BRANCH}
GH_REPO=${GH_REPO:-$TRAVIS_REPO_SLUG}

git remote set-url origin "https://user:$GH_TOKEN@github.com/$GH_REPO.git"
npm set //registry.npmjs.org/:_authToken "$NPM_TOKEN"

git fetch origin "$GH_BRANCH":"$GH_BRANCH"
git checkout "$GH_BRANCH"

PKG_VERSION=$(jq -r '.version' package.json)

git fetch origin v"$PKG_VERSION" || {
  yarn global add standard-version
  standard-version -a --release-as "$PKG_VERSION"
  git push --follow-tags origin "$GH_BRANCH"
  npm publish
}

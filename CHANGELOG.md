# Changelog

## 3.1.2

### Patch Changes

- [#118](https://github.com/import-js/eslint-import-resolver-typescript/pull/118) [`01f525e`](https://github.com/import-js/eslint-import-resolver-typescript/commit/01f525ecd02523ef02d127bc280d591ac26e8cfe) Thanks [@JounQin](https://github.com/JounQin)! - docs: update repository, document `exports` support

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.1.1](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/compare/v3.1.0...v3.1.1) (2022-06-27)

### Bug Fixes

- add conditionNames support ([#114](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/114)) ([c74fe0e](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/c74fe0e99d219e4a28348e833fc605664f02be18))

## [3.1.0](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/compare/v3.0.0...v3.1.0) (2022-06-25)

### ⚠ BREAKING CHANGES

- use enhanced-resolve instead

### Features

- support angular-package-format out of box ([7e0cd04](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/7e0cd043e66f1a6ccc89ac57fe7d695228d5a2df))
- use enhanced-resolve instead ([39ab8b1](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/39ab8b1d0e99e76a7a333f3c74498fd21add0b4a)), closes [#85](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/85) [#107](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/107)

## [3.0.0](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/compare/v2.7.1...v3.0.0) (2022-06-25)

### ⚠ BREAKING CHANGES

- remove depracated directory option
- use get-tsconfig to replace tsconfig-paths
- bump globby, use synckit for sync fn
- **deps:** bump tsconfig-paths to ^4.0.0 (#104)

### Features

- bump globby, use synckit for sync fn ([322cb29](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/322cb291f9af6f7ce1d6330cf13c33ce5a70f9a7))
- ignore `node_modules` folder in `projects` option glob ([#105](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/105)) ([1e1b5a6](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/1e1b5a6f09c71685d58aef400ac6254af892d669))
- remove depracated directory option ([67c8d59](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/67c8d59f51dc7fc58a0abb0838274c001c1dec6c))
- use get-tsconfig to replace tsconfig-paths ([78a08e0](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/78a08e082dcd5ff9e3490759f4919316e715d3ff))

- **deps:** bump tsconfig-paths to ^4.0.0 ([#104](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/104)) ([b2edbc8](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/b2edbc85a6700c590d73887ce65211677305b914))

### [2.7.1](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/compare/v2.7.0...v2.7.1) (2022-04-03)

### Bug Fixes

- per package.json warning ([#101](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/101)) ([664465f](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/664465fa75e6b197f990cd6e89ab5f086bb8d4f2))

## [2.7.0](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/compare/v2.6.0...v2.7.0) (2022-03-23)

### Features

- support `.cjs` `.mjs` `.cts` `.mts` extensions ([#84](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/84)) ([1e39028](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/1e39028d33e660fbd0321ea045488ba8ba8b9783))

## [2.6.0](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/compare/v2.5.0...v2.6.0) (2022-03-23)

### Bug Fixes

- upgrade (dev)Dependencies ([#99](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/99)) ([2e7b4f4](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/2e7b4f420d03fe313386bb0079872c1c4be24eb5))

## [2.5.0](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/compare/v2.4.0...v2.5.0) (2021-09-13)

### Features

- allow passing through custom options to resolve ([#79](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/79)) ([34c94c8](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/34c94c87066ba42fb2b52727b95f3e34259c227f))

### Bug Fixes

- bump (dev)Dependencies, apply stricter rules ([#75](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/75)) ([866f32f](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/866f32f2191dc7fc8df7d973cdacefa48c64a927))

## [2.4.0](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/compare/v2.3.0...v2.4.0) (2021-02-16)

### Features

- remove any querystring from imports ([#67](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/67)) ([82ef357](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/82ef3573fa1258e0de8d8181de57ae7109e35ec5))

### Bug Fixes

- remove .tsbuildinfo and d.ts.map files from package ([#57](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/57)) ([15f2849](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/15f2849c49bf1b4eb7719f027c61ca48b6e1f2a2))
- remove redundant condition ([#69](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/69)) ([ba62e65](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/ba62e65e7cfe382ff976238de3f100cd41c73e8f))

## [2.3.0](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/compare/v2.2.1...v2.3.0) (2020-09-01)

### Features

- import with .js and .jsx file extensions ([#56](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/56)) ([5340f96](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/5340f969fad38165f8cfb28025a5e15233d0e6f9))

### [2.2.1](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/compare/v2.2.0...v2.2.1) (2020-08-14)

### Bug Fixes

- replace postintall with prepare - fix [#54](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/54) ([f3ffd16](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/f3ffd16b93ba12c6cc0f4902efb7c14d021bd02e))

## [2.2.0](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/compare/v2.1.0...v2.2.0) (2020-07-30)

### Features

- rename option `directory` to `project` - close [#23](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/23) ([a662fc1](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/a662fc14f6833daf3b7a71f9137d1cbf9abb2b7c))

## [2.1.0](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/compare/v2.0.0...v2.1.0) (2020-07-30)

### Bug Fixes

- options could be null - close [#42](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/42) ([81db8eb](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/81db8eb0ae81af437e11b6341d8f237bc4bc4e39))
- typo ([#40](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/40)) ([585509e](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/585509e95f93adf8b7ef5839029c19c55edbe76e))
- wrong path resolution in multiple eslintrc configurations ([#51](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/51)) ([d563eeb](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/d563eeb2af2938b9ff7f75e0492a5a26112a4772)), closes [#50](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/50)

## [2.0.0](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/compare/v1.1.1...v2.0.0) (2019-10-17)

### Features

- add alwaysTryTypes option, add tests ([fe0aa6f](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/fe0aa6f0001904274c122d78cf0fd0757005b61f))
- replace glob with tiny-glob for faster speed, close [#12](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/12) ([f436627](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/f436627deb910afb332d6de9764a13f05b231dab))
- replace glob with tiny-glob for faster speed, close [#12](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/12) ([#13](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/13)) ([5f87698](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/5f8769830abcbb87e67e5788d4bbcda7a5e632c7))
- resolve .ts/.tsx/.d.ts first, and then fallback to @types/\* ([b11ede3](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/b11ede3c9fafbc548db011729fd64e958cde6e51))
- support scoped packages from DefinitelyTyped ([b4e72a5](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/b4e72a54966bda12ef70791f09df5cbe0f04b889))
- use types/typings/module first to use .d.ts whenever possible ([74de3d9](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/74de3d9fa2552b5d1b0eb799638a657c9af67887))

### Bug Fixes

- add pretest script which is required ([1ffcd83](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/1ffcd834931ebc1f721543ed89d071a91fadb1ae))
- **deps:** bump configurations, use resolutions to simplify tests ([5eb4874](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/5eb48749870f8bcc5ff246a39d15daf19d11af39))
- only check alwaysTryTypes if foundNodePath is null ([23e2e8c](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/23e2e8cf71ee6c19da9f55e85b2ab34543d2a12e))

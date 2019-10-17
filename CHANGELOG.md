# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.0](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/compare/v1.1.1...v2.0.0) (2019-10-17)


### Features

* add alwaysTryTypes option, add tests ([fe0aa6f](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/fe0aa6f0001904274c122d78cf0fd0757005b61f))
* replace glob with tiny-glob for faster speed, close [#12](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/12) ([f436627](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/f436627deb910afb332d6de9764a13f05b231dab))
* replace glob with tiny-glob for faster speed, close [#12](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/12) ([#13](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/issues/13)) ([5f87698](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/5f8769830abcbb87e67e5788d4bbcda7a5e632c7))
* resolve .ts/.tsx/.d.ts first, and then fallback to @types/* ([b11ede3](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/b11ede3c9fafbc548db011729fd64e958cde6e51))
* support scoped packages from DefinitelyTyped ([b4e72a5](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/b4e72a54966bda12ef70791f09df5cbe0f04b889))
* use types/typings/module first to use .d.ts whenever possible ([74de3d9](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/74de3d9fa2552b5d1b0eb799638a657c9af67887))


### Bug Fixes

* add pretest script which is required ([1ffcd83](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/1ffcd834931ebc1f721543ed89d071a91fadb1ae))
* **deps:** bump configurations, use resolutions to simplify tests ([5eb4874](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/5eb48749870f8bcc5ff246a39d15daf19d11af39))
* only check alwaysTryTypes if foundNodePath is null ([23e2e8c](https://github.com/alexgorbatchev/eslint-import-resolver-typescript/commit/23e2e8cf71ee6c19da9f55e85b2ab34543d2a12e))

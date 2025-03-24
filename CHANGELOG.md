# Changelog

## 4.2.3

### Patch Changes

- [#402](https://github.com/import-js/eslint-import-resolver-typescript/pull/402) [`f21bf15`](https://github.com/import-js/eslint-import-resolver-typescript/commit/f21bf152311cdaa85bdf390bba2824c56cb111da) Thanks [@SunsetTechuila](https://github.com/SunsetTechuila)! - fix: don't resolve not implemented node modules in `bun`

  `is-bun-module` is marked as `dependency`, again, for correctness

## 4.2.2

### Patch Changes

- [#397](https://github.com/import-js/eslint-import-resolver-typescript/pull/397) [`14a7688`](https://github.com/import-js/eslint-import-resolver-typescript/commit/14a76885499cf99b0e5ea588aeb916a881c4efcb) Thanks [@JounQin](https://github.com/JounQin)! - chore: bump `rspack-resolver` for better P'n'P support

  Now `rspack-resolver` resolves `pnpapi` natively.

## 4.2.1

### Patch Changes

- [#394](https://github.com/import-js/eslint-import-resolver-typescript/pull/394) [`9f11f6b`](https://github.com/import-js/eslint-import-resolver-typescript/commit/9f11f6bb94f1f9eae6794eea3e4624b80ceac305) Thanks [@JounQin](https://github.com/JounQin)! - fix: don't set empty `configFile` when no `tsconfig` found

- [#394](https://github.com/import-js/eslint-import-resolver-typescript/pull/394) [`9f11f6b`](https://github.com/import-js/eslint-import-resolver-typescript/commit/9f11f6bb94f1f9eae6794eea3e4624b80ceac305) Thanks [@JounQin](https://github.com/JounQin)! - chore: bump `rspack-resolver` to v1.2.0

## 4.2.0

### Minor Changes

- [#391](https://github.com/import-js/eslint-import-resolver-typescript/pull/391) [`c8121e5`](https://github.com/import-js/eslint-import-resolver-typescript/commit/c8121e5eb4ce25a79396ae75df16d35fc67acbc6) Thanks [@JounQin](https://github.com/JounQin)! - feat: make `is-bun-module` as optional peer dependency

  Technically this is a BREAKING CHANGE, but considering we just raise out v4 recently and this only affects `bun` users, `bun --bun eslint` even works without this dependency, so I'd consider this as a minor change.

  So for `bun` users, there are three options:

  1. install `is-bun-module` dependency manually and use `bun: true` option
  2. run `eslint` with `bun --bun eslint` w/o `bun: true` option
  3. enable `run#bun` in [`bunfig.toml`](https://bun.sh/docs/runtime/bunfig#run-bun-auto-alias-node-to-bun) w/o `bun: true` option

## 4.1.1

### Patch Changes

- [#389](https://github.com/import-js/eslint-import-resolver-typescript/pull/389) [`1b97d8a`](https://github.com/import-js/eslint-import-resolver-typescript/commit/1b97d8a5913e15bdfcf5f64152e8a4173b18dab1) Thanks [@JounQin](https://github.com/JounQin)! - fix: should prefer `module.isBuiltin` when `process.versions.bun` available

## 4.1.0

### Minor Changes

- [#387](https://github.com/import-js/eslint-import-resolver-typescript/pull/387) [`ef5cd10`](https://github.com/import-js/eslint-import-resolver-typescript/commit/ef5cd1083207d560b35694b99ccfefa4a1234acb) Thanks [@JounQin](https://github.com/JounQin)! - feat: add a new `bun?: boolean` option for `bun` users - close #386

  `process.versions.bun` is unavailable even with `bun eslint` due to its own design,
  but checking `bun` modules for non-bun users is incorrect behavior and just wasting time,
  so a new option is added for such case, you can still run with `bun --bun eslint` without this option enabled

## 4.0.0

### Major Changes

- [#368](https://github.com/import-js/eslint-import-resolver-typescript/pull/368) [`2fd7c2e`](https://github.com/import-js/eslint-import-resolver-typescript/commit/2fd7c2ea63f30c9990e19a52dbd07fd8131558e9) Thanks [@JounQin](https://github.com/JounQin)! - feat!: rewrite, speed up by using [`rspack-resolver`](https://github.com/unrs/rspack-resolver) which supports `references` natively under the hood

  BREAKING CHANGES:

  - drop Node 14 support, Node `^16.17.0 || >=18.6` is now required
  - `alwaysTryTypes` is enabled by default, you can set it as `false` to opt-out
  - array type of `project` is discouraged but still supported, single `project` with `references` are encouraged for better performance, you can enable `noWarnOnMultipleProjects` option to supress the warning message
  - root `tsconfig.json` or `jsconfig.json` will be used automatically if no `project` provided

## 3.9.1

### Patch Changes

- [#382](https://github.com/import-js/eslint-import-resolver-typescript/pull/382) [`4a9176e`](https://github.com/import-js/eslint-import-resolver-typescript/commit/4a9176e6e2b6013dc24b5634aea42feebd324e41) Thanks [@JounQin](https://github.com/JounQin)! - fix: use [`rspack-resolver`](https://github.com/unrs/rspack-resolver) fork for pnp support

## 3.9.0

### Minor Changes

- [#379](https://github.com/import-js/eslint-import-resolver-typescript/pull/379) [`6814443`](https://github.com/import-js/eslint-import-resolver-typescript/commit/681444336fc66104b9b490838a67ea7bf8ac8b61) Thanks [@JounQin](https://github.com/JounQin)! - feat: migrate `enhanced-resolve` to `oxc-resolver`

## 3.8.7

### Patch Changes

- [#377](https://github.com/import-js/eslint-import-resolver-typescript/pull/377) [`a14fdd9`](https://github.com/import-js/eslint-import-resolver-typescript/commit/a14fdd95011c4c09b74f71854410f684c0f04bc5) Thanks [@carlocorradini](https://github.com/carlocorradini)! - fix: include mapper with no files and force non-dynamic projects to use absolute paths

## 3.8.6

### Patch Changes

- [#374](https://github.com/import-js/eslint-import-resolver-typescript/pull/374) [`c9d5ab0`](https://github.com/import-js/eslint-import-resolver-typescript/commit/c9d5ab0fa963bd891b6f2ae312ae3ec10a397b7c) Thanks [@JounQin](https://github.com/JounQin)! - fix: add support for importing with .js extension as tsx importee

## 3.8.5

### Patch Changes

- [#372](https://github.com/import-js/eslint-import-resolver-typescript/pull/372) [`366eeaf`](https://github.com/import-js/eslint-import-resolver-typescript/commit/366eeaf8ba87adf7c2e165b0a73406292c002ad9) Thanks [@carlocorradini](https://github.com/carlocorradini)! - fix: if file has no corresponding mapper function, apply all of them, starting with the nearest one.

## 3.8.4

### Patch Changes

- [#370](https://github.com/import-js/eslint-import-resolver-typescript/pull/370) [`c940785`](https://github.com/import-js/eslint-import-resolver-typescript/commit/c94078504cfb6fd17b775c53d268962a56a2d118) Thanks [@JounQin](https://github.com/JounQin)! - fix: support multiple matching ts paths

## 3.8.3

### Patch Changes

- [#360](https://github.com/import-js/eslint-import-resolver-typescript/pull/360) [`8192976`](https://github.com/import-js/eslint-import-resolver-typescript/commit/81929767a9e440eaa730f4c76b932da7bbd9eed7) Thanks [@carlocorradini](https://github.com/carlocorradini)! - Force tiniglobby to expand dot directories

- [#360](https://github.com/import-js/eslint-import-resolver-typescript/pull/360) [`8192976`](https://github.com/import-js/eslint-import-resolver-typescript/commit/81929767a9e440eaa730f4c76b932da7bbd9eed7) Thanks [@carlocorradini](https://github.com/carlocorradini)! - Update tinyglobby to latest version

## 3.8.2

### Patch Changes

- [#357](https://github.com/import-js/eslint-import-resolver-typescript/pull/357) [`5fd349e`](https://github.com/import-js/eslint-import-resolver-typescript/commit/5fd349e17c3650aafcc804858a3c3b07cfda8e0d) Thanks [@carlocorradini](https://github.com/carlocorradini)! - Update the `tinyglobby` to the latest version to solve performance regressions.

## 3.8.1

### Patch Changes

- [#352](https://github.com/import-js/eslint-import-resolver-typescript/pull/352) [`0c6303d`](https://github.com/import-js/eslint-import-resolver-typescript/commit/0c6303d336093ecdac522da0bc1f57ef3ba85f9d) Thanks [@carlocorradini](https://github.com/carlocorradini)! - Set cwd while resolving tsconfig include

## 3.8.0

### Minor Changes

- [#345](https://github.com/import-js/eslint-import-resolver-typescript/pull/345) [`fcc8883`](https://github.com/import-js/eslint-import-resolver-typescript/commit/fcc8883c0f023247fcb9a453004f8bd3e6b7c0e2) Thanks [@carlocorradini](https://github.com/carlocorradini)! - Enable the mapper function just for a set of allowed files. Improves project discovery using glob and POSIX separator.

- [#346](https://github.com/import-js/eslint-import-resolver-typescript/pull/346) [`c124e87`](https://github.com/import-js/eslint-import-resolver-typescript/commit/c124e874b6429167b230697ee9f0a69e2efa5f96) Thanks [@carlocorradini](https://github.com/carlocorradini)! - Update get-tsconfig to the the latest version. We now support the `${configDir}` variable, introduced in TypeScript 5.5.

## 3.7.0

### Minor Changes

- [#326](https://github.com/import-js/eslint-import-resolver-typescript/pull/326) [`93ea130`](https://github.com/import-js/eslint-import-resolver-typescript/commit/93ea1305d0317db62a71edf029688eb410c2d261) Thanks [@SukkaW](https://github.com/SukkaW)! - This version has implemented the `eslint-plugin-import-x`'s v3 resolver interface. This allows you to use import/require to reference `eslint-import-resolver-typescript` directly in your ESLint flat config:

  **Previously**

  ```js
  // eslint.config.js
  module.exports = {
    settings: {
      'import-x/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
        // or
        require.resolve('eslint-import-resolver-typescript'):
          alwaysTryTypes: true,
        }
      }
    }
  }
  ```

  **Now**

  ```js
  // eslint.config.js
  const {
    createTypeScriptImportResolver,
  } = require('eslint-import-resolver-typescript')

  module.exports = {
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
        }),
      ],
    },
  }
  ```

  Note that this only works with `eslint-plugin-import-x@>=4.5.0`. You can't use `createTypeScriptImportResolver` with the older versions of `eslint-plugin-import-x` or any existing versions of `eslint-plugin-import`.

## 3.6.3

### Patch Changes

- [#305](https://github.com/import-js/eslint-import-resolver-typescript/pull/305) [`f8d7b82`](https://github.com/import-js/eslint-import-resolver-typescript/commit/f8d7b82d3e1137c9537f3c4bd7d67044b310475d) Thanks [@SukkaW](https://github.com/SukkaW)! - Fix resolve for `node:test`, `node:sea`, and `node:sqlite` without sacrificing installation size

- [#288](https://github.com/import-js/eslint-import-resolver-typescript/pull/288) [`a4c6c78`](https://github.com/import-js/eslint-import-resolver-typescript/commit/a4c6c78904e8e7123503f6784fdbded3d4a026ed) Thanks [@SunsetTechuila](https://github.com/SunsetTechuila)! - fix: ignore bun built-in modules

## 3.6.2

### Patch Changes

- [#294](https://github.com/import-js/eslint-import-resolver-typescript/pull/294) [`10f9b17`](https://github.com/import-js/eslint-import-resolver-typescript/commit/10f9b17d9ec96c9d38085894710f041bdce5aa86) Thanks [@RobinTail](https://github.com/RobinTail)! - Allow either eslint-plugin-import-x or eslint-plugin-import plugin as a peer dependency.

- [#295](https://github.com/import-js/eslint-import-resolver-typescript/pull/295) [`ff3d3c6`](https://github.com/import-js/eslint-import-resolver-typescript/commit/ff3d3c6fc0bc8d88b4c33abe2d4449db47232d17) Thanks [@wojtekmaj](https://github.com/wojtekmaj)! - chore(deps): remove `is-core-module` dependency

## 3.6.1

### Patch Changes

- [#241](https://github.com/import-js/eslint-import-resolver-typescript/pull/241) [`cf5d67f`](https://github.com/import-js/eslint-import-resolver-typescript/commit/cf5d67f8482bbb2b8ef3e7572f4791a00b4119aa) Thanks [@klippx](https://github.com/klippx)! - Fix CJS import to make it compatible with ESM projects

## 3.6.0

### Minor Changes

- [#235](https://github.com/import-js/eslint-import-resolver-typescript/pull/235) [`b5ea367`](https://github.com/import-js/eslint-import-resolver-typescript/commit/b5ea367d8361d3a71154545831dfcf8e03aca8e1) Thanks [@SukkaW](https://github.com/SukkaW)! - refactor: drop `globby` and `synckit`

## 3.5.5

### Patch Changes

- [`84b0649`](https://github.com/import-js/eslint-import-resolver-typescript/commit/84b0649096d81c4556bc506285fd2e3e56dadf09) Thanks [@JounQin](https://github.com/JounQin)! - fix: mark eslint-module-utils as dep

## 3.5.4

### Patch Changes

- [`25f3920`](https://github.com/import-js/eslint-import-resolver-typescript/commit/25f3920cdef31701396fe25dd0942c472400b3a6) Thanks [@JounQin](https://github.com/JounQin)! - fix: enhanced-resolve is commonjs only - close #213

- [#219](https://github.com/import-js/eslint-import-resolver-typescript/pull/219) [`0bf6ffb`](https://github.com/import-js/eslint-import-resolver-typescript/commit/0bf6ffb82bad35e96b22b7b7b91b94aa7ed875f8) Thanks [@lsmurray](https://github.com/lsmurray)! - fix: check if cwd changed to bust mapper cache

## 3.5.3

### Patch Changes

- [#206](https://github.com/import-js/eslint-import-resolver-typescript/pull/206) [`6531bad`](https://github.com/import-js/eslint-import-resolver-typescript/commit/6531bad1c58831ef63124b9f660b8c457f1d9e44) Thanks [@marvinhagemeister](https://github.com/marvinhagemeister)! - Only try to resolve a module directory when we know that the path is a directory. This can lead to a 15% speedup on projects with many files.

## 3.5.2

### Patch Changes

- [#193](https://github.com/import-js/eslint-import-resolver-typescript/pull/193) [`8756a26`](https://github.com/import-js/eslint-import-resolver-typescript/commit/8756a26aec2ad55b94a1198ec5be9660d2eac3f7) Thanks [@Rialgar](https://github.com/Rialgar)! - chore(package): remove node 12 from engines field

- [#187](https://github.com/import-js/eslint-import-resolver-typescript/pull/187) [`7a91daf`](https://github.com/import-js/eslint-import-resolver-typescript/commit/7a91daf305ab968b7dd54eae8b727bcdb9c6d9a2) Thanks [@scott-ut](https://github.com/scott-ut)! - fix: resolve modules if folder contains a package.json file

## 3.5.1

### Patch Changes

- [#182](https://github.com/import-js/eslint-import-resolver-typescript/pull/182) [`afeb928`](https://github.com/import-js/eslint-import-resolver-typescript/commit/afeb928b304e7196b10f71aec873fca739a9ad93) Thanks [@chenxinyanc](https://github.com/chenxinyanc)! - perf: disable `throwIfNoEntry` on Node 14+

## 3.5.0

### Minor Changes

- [#174](https://github.com/import-js/eslint-import-resolver-typescript/pull/174) [`66a3e6c`](https://github.com/import-js/eslint-import-resolver-typescript/commit/66a3e6c4349fe1821a5ada967b7cff1b8191dfe4) Thanks [@JounQin](https://github.com/JounQin)! - feat: reuse `eslint-module-utils/hash.js` for better caching

### Patch Changes

- [#172](https://github.com/import-js/eslint-import-resolver-typescript/pull/172) [`00abb6f`](https://github.com/import-js/eslint-import-resolver-typescript/commit/00abb6fed2c9b9bedd053a5a7c575a367a707692) Thanks [@JounQin](https://github.com/JounQin)! - fix: incorrect exports mapping

## 3.4.2

### Patch Changes

- [`594df9c`](https://github.com/import-js/eslint-import-resolver-typescript/commit/594df9c586fccab3cf29add6e9116c1dfece7935) Thanks [@HanSeo0507](https://github.com/HanSeo0507)! - chore(deps): update dependency synckit to ^0.8.3 for yarn PnP ([#169](https://github.com/import-js/eslint-import-resolver-typescript/pull/169))

## 3.4.1

### Patch Changes

- [#166](https://github.com/import-js/eslint-import-resolver-typescript/pull/166) [`8892a8c`](https://github.com/import-js/eslint-import-resolver-typescript/commit/8892a8c1d0b54965501dd03113873ac66a50f74f) Thanks [@thatsmydoing](https://github.com/thatsmydoing)! - perf: add filesystem caching support

## 3.4.0

### Minor Changes

- [#161](https://github.com/import-js/eslint-import-resolver-typescript/pull/161) [`82d090b`](https://github.com/import-js/eslint-import-resolver-typescript/commit/82d090b2411853f94909a3c9a0ed3b8bbe1bef11) Thanks [@rbong](https://github.com/rbong)! - feat: add support for `jsconfig.json`

## 3.3.0

### Minor Changes

- [#154](https://github.com/import-js/eslint-import-resolver-typescript/pull/154) [`42f2dd6`](https://github.com/import-js/eslint-import-resolver-typescript/commit/42f2dd6f57c4b053f7773081ea7f1e07f73a513d) Thanks [@JounQin](https://github.com/JounQin)! - feat: add `externsionAlias` option support, `.d.([cm]?ts|tsx)` are always preferred than `.([cm]?js|jsx)`

  `typescript` resolves `typescript/lib/typescript.d.ts` instead of `typescript/lib/typescript.js` by default

- [#154](https://github.com/import-js/eslint-import-resolver-typescript/pull/154) [`42f2dd6`](https://github.com/import-js/eslint-import-resolver-typescript/commit/42f2dd6f57c4b053f7773081ea7f1e07f73a513d) Thanks [@JounQin](https://github.com/JounQin)! - feat: exports `globSync`, `defaultExtensions`, `defaultMainFields`, `defaultConditionNames` and `defaultExtensionAlias` for reusing

### Patch Changes

- [#154](https://github.com/import-js/eslint-import-resolver-typescript/pull/154) [`42f2dd6`](https://github.com/import-js/eslint-import-resolver-typescript/commit/42f2dd6f57c4b053f7773081ea7f1e07f73a513d) Thanks [@JounQin](https://github.com/JounQin)! - perf: cache `options` and `resolver`

- [#154](https://github.com/import-js/eslint-import-resolver-typescript/pull/154) [`42f2dd6`](https://github.com/import-js/eslint-import-resolver-typescript/commit/42f2dd6f57c4b053f7773081ea7f1e07f73a513d) Thanks [@JounQin](https://github.com/JounQin)! - chore: align with Angular Package Format correctly

  reference: https://angular.io/guide/angular-package-format

- [#156](https://github.com/import-js/eslint-import-resolver-typescript/pull/156) [`4bd60c3`](https://github.com/import-js/eslint-import-resolver-typescript/commit/4bd60c37ab27d87be0e554d2563f0fea59fd4058) Thanks [@JounQin](https://github.com/JounQin)! - docs: document options from `enhanced-resolve`

## 3.2.7

### Patch Changes

- [`60ff431`](https://github.com/import-js/eslint-import-resolver-typescript/commit/60ff431a4d3812dbdd793d40b6213b79c8b2db9d) Thanks [@JounQin](https://github.com/JounQin)! - chore: bump synckit

## 3.2.6

### Patch Changes

- [#146](https://github.com/import-js/eslint-import-resolver-typescript/pull/146) [`7edb823`](https://github.com/import-js/eslint-import-resolver-typescript/commit/7edb82307676f507b5094448431eb117b035a712) Thanks [@JounQin](https://github.com/JounQin)! - chore: use latest `get-tsconfig` package

## 3.2.5

### Patch Changes

- [#136](https://github.com/import-js/eslint-import-resolver-typescript/pull/136) [`abf8907`](https://github.com/import-js/eslint-import-resolver-typescript/commit/abf89078298ab9de2dcdf197d73cd39452fa043b) Thanks [@JounQin](https://github.com/JounQin)! - build: use pnpm as manager, yarn pnp is still supported

## 3.2.4

### Patch Changes

- [#139](https://github.com/import-js/eslint-import-resolver-typescript/pull/139) [`3e93659`](https://github.com/import-js/eslint-import-resolver-typescript/commit/3e93659b6e20b84ec3805794e07494eb64a7e98f) Thanks [@JounQin](https://github.com/JounQin)! - fix: run prerelease manually for yarn v3, 2nd try

## 3.2.3

### Patch Changes

- [#137](https://github.com/import-js/eslint-import-resolver-typescript/pull/137) [`a3f6ba3`](https://github.com/import-js/eslint-import-resolver-typescript/commit/a3f6ba3cd87aa1a0d9de68a5923ad2939759f83d) Thanks [@JounQin](https://github.com/JounQin)! - fix: run prerelease manually for yarn v3

## 3.2.2

### Patch Changes

- [#133](https://github.com/import-js/eslint-import-resolver-typescript/pull/133) [`d944b26`](https://github.com/import-js/eslint-import-resolver-typescript/commit/d944b26e44c3f4e56ce41bb21584b86f8b4b8da5) Thanks [@JounQin](https://github.com/JounQin)! - fix: use yarn v3 with PnP linker, close #130

## 3.2.1

### Patch Changes

- [#131](https://github.com/import-js/eslint-import-resolver-typescript/pull/131) [`fb88af2`](https://github.com/import-js/eslint-import-resolver-typescript/commit/fb88af2ecf797f014bfe0b38994f040a535dcdba) Thanks [@JounQin](https://github.com/JounQin)! - fix: try index file with extensions automatically

## 3.2.0

### Minor Changes

- [#128](https://github.com/import-js/eslint-import-resolver-typescript/pull/128) [`56775b3`](https://github.com/import-js/eslint-import-resolver-typescript/commit/56775b3e574efb712fe8f449667524c5bc0042f1) Thanks [@JounQin](https://github.com/JounQin)! - refactor: support custom extensions on resolving

- [#128](https://github.com/import-js/eslint-import-resolver-typescript/pull/128) [`56775b3`](https://github.com/import-js/eslint-import-resolver-typescript/commit/56775b3e574efb712fe8f449667524c5bc0042f1) Thanks [@JounQin](https://github.com/JounQin)! - feat: try extensionless file by default

## 3.1.5

### Patch Changes

- [#126](https://github.com/import-js/eslint-import-resolver-typescript/pull/126) [`9cf60cb`](https://github.com/import-js/eslint-import-resolver-typescript/commit/9cf60cb1e7929884039c7d67317b0713aad50031) Thanks [@JounQin](https://github.com/JounQin)! - fix: auto try extensions

## 3.1.4

### Patch Changes

- [`f88a8c9`](https://github.com/import-js/eslint-import-resolver-typescript/commit/f88a8c9f3bc2061d3b896764acf79e0cc3886f69) Thanks [@JounQin](https://github.com/JounQin)! - refactor: use non-capturing groups for perf

## 3.1.3

### Patch Changes

- [#121](https://github.com/import-js/eslint-import-resolver-typescript/pull/121) [`35d3022`](https://github.com/import-js/eslint-import-resolver-typescript/commit/35d30226b964522bc698e842eb32eccfcf92545d) Thanks [@JounQin](https://github.com/JounQin)! - fix: try index.d.ts automatically

## 3.1.2

### Patch Changes

- [#118](https://github.com/import-js/eslint-import-resolver-typescript/pull/118) [`01f525e`](https://github.com/import-js/eslint-import-resolver-typescript/commit/01f525ecd02523ef02d127bc280d591ac26e8cfe) Thanks [@JounQin](https://github.com/JounQin)! - docs: update repository, document `exports` support

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

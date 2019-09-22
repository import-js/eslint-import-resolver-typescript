# eslint-import-resolver-ts

[![GitHub Actions](https://github.com/rx-ts/eslint-import-resolver-ts/workflows/Node%20CI/badge.svg)](https://github.com/rx-ts/eslint-import-resolver-ts/actions)
[![type-coverage](https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2Frx-ts%2Feslint-import-resolver-ts%2Fmaster%2Fpackage.json)](https://github.com/plantain-00/type-coverage)
[![npm](https://img.shields.io/npm/v/eslint-import-resolver-ts.svg)](https://www.npmjs.com/package/eslint-import-resolver-ts)
[![GitHub Release](https://img.shields.io/github/release/rx-ts/eslint-import-resolver-ts)](https://github.com/rx-ts/eslint-import-resolver-ts/releases)

[![David Peer](https://img.shields.io/david/peer/rx-ts/eslint-import-resolver-ts.svg)](https://david-dm.org/rx-ts/eslint-import-resolver-ts?type=peer)
[![David](https://img.shields.io/david/rx-ts/eslint-import-resolver-ts.svg)](https://david-dm.org/rx-ts/eslint-import-resolver-ts)
[![David Dev](https://img.shields.io/david/dev/rx-ts/eslint-import-resolver-ts.svg)](https://david-dm.org/rx-ts/eslint-import-resolver-ts?type=dev)

[![Conventional Commits](https://img.shields.io/badge/conventional%20commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![codechecks.io](https://raw.githubusercontent.com/codechecks/docs/master/images/badges/badge-default.svg?sanitize=true)](https://codechecks.io)

This plugin adds TypeScript support to [`eslint-plugin-import`](https://www.npmjs.com/package/eslint-plugin-import).

This means you can:

- `import`/`require` files with extension `.ts`/`.tsx`!
- Use [`paths`](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping) defined in `tsconfig.json`.
- Prefer resolve `@types/*` definitions over plain `.js`.
- Multiple tsconfigs support just like normal.

## TOC <!-- omit in toc -->

- [Installation](#installation)
- [Configuration](#configuration)
- [Contributing](#contributing)

## Installation

```sh
# npm
npm i -D eslint-plugin-import @typescript-eslint/parser eslint-import-resolver-ts

# yarn
yarn add -D eslint-plugin-import @typescript-eslint/parser eslint-import-resolver-ts
```

## Configuration

Add the following to your `.eslintrc` config:

```jsonc
{
  "plugins": ["import"],
  "rules": {
    // turn on errors for missing imports
    "import/no-unresolved": "error"
  },
  "settings": {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      // use <root>/tsconfig.json
      "ts": {
        "alwaysTryTypes": true // always try to resolve types under `<roo/>@types` directory even it doesn't contain any source code, like `@types/unist`
      },

      // use <root>/path/to/folder/tsconfig.json
      "ts": {
        "directory": "./path/to/folder"
      },

      // Multiple tsconfigs (Useful for monorepos)

      // use a glob pattern
      "ts": {
        "directory": "./packages/*/tsconfig.json"
      },

      // use an array
      "ts": {
        "directory": [
          "./packages/module-a/tsconfig.json",
          "./packages/module-b/tsconfig.json"
        ]
      },

      // use an array of glob patterns
      "ts": {
        "directory": [
          "./packages/*/tsconfig.json",
          "./other-packages/*/tsconfig.json"
        ]
      }
    }
  }
}
```

## Contributing

- Make sure your change is covered by a test import.
- Make sure that `yarn test` passes without a failure.
- Make sure that `yarn lint` passes without conflicts.
- Make sure your code changes match our [type-coverage](https://github.com/plantain-00/type-coverage) settings: `yarn type-coverage`.

We have [GitHub Actions](https://github.com/rx-ts/eslint-import-resolver-ts/actions) which will run the above commands on your PRs.

If either fails, we won't be able to merge your PR until it's fixed.

# eslint-import-resolver-ts

[![Travis](https://img.shields.io/travis/com/rx-ts/eslint-import-resolver-ts.svg)](https://travis-ci.com/rx-ts/eslint-import-resolver-ts)

This plugin adds typescript support to [`eslint-plugin-import`](https://www.npmjs.com/package/eslint-plugin-import).

This means you can:

- `import`/`require` files with extension `.ts`/`.tsx`!
- Use [`paths`](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping) defined in `tsconfig.json`.
- prefer resolve `@types/*` definitions over plain `.js`
- Multiple tsconfigs just like normal

## Installation

```sh
# npm
npm i -D eslint-plugin-import @typescript-eslint/parser eslint-import-resolver-ts

# yarn
yarn add -D eslint-plugin-import @typescript-eslint/parser eslint-import-resolver-ts
```

## Configuration

Add the following to your `.eslintrc` config:

```JSONC
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
      "ts": {},

      // use <root>/path/to/folder/tsconfig.json
      "ts": {
        "directory": "./path/to/folder"
      },

      // Multiple tsconfigs (Useful for monorepos)

      // use a glob pattern
      "ts": {
        "directory": "./packages/**/tsconfig.json"
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
          "./packages/**/tsconfig.json",
          "./other-packages/**/tsconfig.json"
        ]
      }
    }
  }
}
```

## Contributing

- Make sure your change is covered by a test import.
- Make sure that `npm test` passes without a failure.
- Make sure your code is formatted `npm format`.

We have an [automatic travis build](https://travis-ci.org/rx-ts/eslint-import-resolver-ts) which will run the above on your PRs.

If either fails, we won't be able to merge your PR until it's fixed.

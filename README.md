# eslint-import-resolver-typescript

[![Build Status](https://travis-ci.org/alexgorbatchev/eslint-import-resolver-typescript.svg?branch=master)](https://travis-ci.org/alexgorbatchev/eslint-import-resolver-typescript)

This plugin adds typescript support to [`eslint-plugin-import`](https://www.npmjs.com/package/eslint-plugin-import).

This means you can:

- `import`/`require` files with extension `.ts`/`.tsx`!
- Use [`paths`](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping) defined in `tsconfig.json`.

## Installation

```bash
npm install --save-dev eslint-plugin-import typescript-eslint-parser eslint-import-resolver-typescript
```

## Configuration

Add the following to your `.eslintrc` config:

```CJSON
{
  "settings": {
    "parser": "typescript-eslint-parser",
    "plugins": [
      "import"
    ],
    "rules": {
      // turn on errors for missing imports
      "import/no-unresolved": "error"
    },
    "import/resolver": {
      // use <root>/tsconfig.json
      "typescript": {},

      // use <root>/path/to/folder/tsconfig.json
      "typescript": {
        "directory": "./path/to/folder"
      }
    }
  }
}
```

## Contributing

- Make sure your change is covered by a test import.
- Make sure that `npm test` passes without a failure.
- Make sure your code is formatted `npm format`.

We have an [automatic travis build](https://travis-ci.org/alexgorbatchev/eslint-import-resolver-typescript) which will run the above on your PRs.
If either fails, we won't be able to merge your PR until it's fixed.

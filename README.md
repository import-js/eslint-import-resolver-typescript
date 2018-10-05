# eslint-import-resolver-typescript

This plugin allows you to resolve `typescript` files with `eslint-plugin-import`.

The resolution respects the [`paths`](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping) you have defined in your `tsconfig.json`.

![](screenshot.png)

## Installation

```bash
npm install --save-dev eslint-import-resolver-typescript
```

Add the following to your eslint config:

```JSON
"settings": {
  "import/resolver": {
    "typescript": true
  }
}
```

# eslint-plugin-import-typescript-resolver

This plugin allows you to use `eslint-plugin-import` with `.ts` and `.tsx` files.

![](screenshot.png)

## Installation

```
npm install --save-dev eslint-plugin-import-typescript-resolver
```

Add the following to your eslint config:

```
"settings": {
  "import/resolver": {
    "node": true,
    "eslint-plugin-import-typescript-resolver": true
  }
}
```

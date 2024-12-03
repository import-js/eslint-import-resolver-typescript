---
'eslint-import-resolver-typescript': minor
---

This version has implemented the `eslint-plugin-import-x`'s v3 resolver interface. This allows you to use import/require to reference `eslint-import-resolver-typescript` directly in your ESLint flat config:

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

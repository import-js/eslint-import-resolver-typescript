---
"eslint-import-resolver-typescript": minor
---

feat: add `externsionAlias` option support, `.d.([cm]?ts|tsx)` are always preferred than `.([cm]?js|jsx)`

`typescript` resolves `typescript/lib/typescript.d.ts` instead of `typescript/lib/typescript.js` by default

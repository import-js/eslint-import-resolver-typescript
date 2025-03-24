---
"eslint-import-resolver-typescript": patch
---

fix: don't resolve not implemented node modules in `bun`

`is-bun-module` is marked as `dependency`, again, for correctness

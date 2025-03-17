---
"eslint-import-resolver-typescript": minor
---

feat: add a new `bun?: boolean` option for `bun` users - close #386

`process.versions.bun` is unavailable even with `bun eslint` due to its own design,
but checking `bun` modules for non-bun users is incorrect behavior and just wasting time,
so a new option is added for such case, you can still run with `bun --bun eslint` without this option enabled

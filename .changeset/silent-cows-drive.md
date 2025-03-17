---
"eslint-import-resolver-typescript": minor
---

feat: make `is-bun-module` as optional peer dependency

Technically this is a BREAKING CHANGE, but considering we just raise out v4 recently and this only affects `bun` users, `bun --bun eslint` even works without this dependency, so I'd consider this as a minor change.

So for `bun` users, there are two options:

1. install `is-bun-module` dependency manually and use `bun: true` option
2. run `eslint` with `bun --bun eslint` w/o `bun: true` option

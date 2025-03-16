---
"eslint-import-resolver-typescript": major
---

feat!: rewrite, speed up by using `rspack-resolver` which supports `references` natively under the hood

BREAKING CHANGES:

- drop Node 14 support, Node `^16.17.0 || >=18.6` is now required
- `alwaysTryTypes` is enabled by default, you can set it as `true` to opt-out
- array type of `project` is discouraged but still supported, single `project` with `references` are encouraged for better performance, you can enable `noWarnOnMultipleProjects` option to supress the warning message
- root `tsconfig.json` or `jsconfig.json` will be used automatically if no `project` provided

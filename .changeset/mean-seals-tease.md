---
'eslint-import-resolver-typescript': patch
---

Only try to resolve a module directory when we know that the path is a directory. This can lead to a 15% speedup on projects with many files.

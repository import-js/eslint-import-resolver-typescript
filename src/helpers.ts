import fs from 'node:fs'
import path from 'node:path'

/**
 * For a scoped package, we must look in `@types/foo__bar` instead of
 * `@types/@foo/bar`.
 */
export function mangleScopedPackage(moduleName: string) {
  if (moduleName.startsWith('@')) {
    const replaceSlash = moduleName.replace('/', '__')
    if (replaceSlash !== moduleName) {
      return replaceSlash.slice(1) // Take off the "@"
    }
  }
  return moduleName
}

/** Remove any trailing querystring from module id. */
export function removeQuerystring(id: string) {
  const querystringIndex = id.lastIndexOf('?')
  if (querystringIndex !== -1) {
    return id.slice(0, querystringIndex)
  }
  return id
}

export const tryFile = (
  filename?: string[] | string,
  includeDir = false,
  base = process.cwd(),
): string => {
  if (typeof filename === 'string') {
    const filepath = path.resolve(base, filename)
    return fs.existsSync(filepath) &&
      (includeDir || fs.statSync(filepath).isFile())
      ? filepath
      : ''
  }

  for (const file of filename ?? []) {
    const filepath = tryFile(file, includeDir, base)
    if (filepath) {
      return filepath
    }
  }

  return ''
}

const computeAffinity = (projectDir: string, targetDir: string): number => {
  const a = projectDir.split(path.sep)
  const b = targetDir.split(path.sep)
  let lca = 0
  while (lca < a.length && lca < b.length && a[lca] === b[lca]) {
    lca++
  }
  return a.length - lca + (b.length - lca)
}

export const sortProjectsByAffinity = (projects: string[], file: string) => {
  const fileDir = path.dirname(file)
  return projects
    .map(project => ({
      project,
      affinity: computeAffinity(path.dirname(project), fileDir),
    }))
    .sort((a, b) => a.affinity - b.affinity)
    .map(item => item.project)
}

export const toGlobPath = (pathname: string) => pathname.replaceAll('\\', '/')

export const toNativePath = (pathname: string) =>
  '/' === path.sep ? pathname : pathname.replaceAll('/', '\\')

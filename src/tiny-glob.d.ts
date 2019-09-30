declare module 'tiny-glob/sync' {
  interface Options {
    cwd?: string
    dot?: boolean
    absolute?: boolean
    filesOnly?: boolean
    flush?: boolean
  }

  const globSync: (str: string, opts?: Options) => string[]

  export = globSync
}

import type { Options } from 'globby'
import { runAsWorker } from 'synckit'

runAsWorker(
  async (
    patterns: string | readonly string[],
    options: Options & { objectMode: true },
  ) => {
    const { globby } = await import('globby')
    return globby(patterns, options)
  },
)

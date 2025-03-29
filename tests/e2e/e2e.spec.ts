import fs from 'node:fs/promises'
import path from 'node:path'

import { tryFile } from '@pkgr/core'
import { exec } from 'tinyexec'

describe('e2e cases', async () => {
  const { dirname } = import.meta

  const dirents = await fs.readdir(dirname, { withFileTypes: true })

  for (const dirent of dirents) {
    const dirName = dirent.name

    if (!dirent.isDirectory() || dirName === '__snapshots__') {
      continue
    }

    const absoluteDir = path.resolve(dirname, dirName)

    if (tryFile('yarn.lock', false, absoluteDir)) {
      await exec('yarn', ['--immutable'], {
        nodeOptions: {
          cwd: absoluteDir,
        },
      })
    }

    it('should exec eslint successfully', async () => {
      const eslintConfig = tryFile('eslint.config.js', false, absoluteDir)
      expect(
        await exec(
          'yarn',
          [
            'eslint',
            ...(eslintConfig
              ? ['-c', eslintConfig]
              : ['--ignore-pattern', '!.dot']),
            '--ext',
            'cjs,cts,js,jsx,mjs,mts,ts,tsx',
            '--report-unused-disable-directives',
            absoluteDir,
          ],
          {
            nodeOptions: {
              env: {
                ESLINT_USE_FLAT_CONFIG: eslintConfig ? undefined : 'false',
                NODE_OPTIONS: '--no-warnings=ESLintRCWarning',
              },
            },
          },
        ),
      ).toMatchSnapshot(dirName)
    })
  }
})

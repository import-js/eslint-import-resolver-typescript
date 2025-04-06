import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      'eslint-import-resolver-typescript': new URL(
        'src/index.ts',
        import.meta.url,
      ).pathname,
    },
  },
  test: {
    globals: true,
    coverage: {
      enabled: true,
      include: ['src/**/*.ts'],
    },
    setupFiles: ['vitest.setup.ts'],
  },
})

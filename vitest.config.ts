import autoImport from 'unplugin-auto-import/vite'
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
  plugins: [
    autoImport({
      imports: ['vitest'],
    }),
  ],
  test: {
    coverage: {
      enabled: true,
      include: ['src/**/*.ts'],
    },
    setupFiles: ['vitest.setup.ts'],
  },
})

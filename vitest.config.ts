import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      include: ['src/**/*.ts'],
    },
    setupFiles: ['vitest.setup.ts'],
  },
})

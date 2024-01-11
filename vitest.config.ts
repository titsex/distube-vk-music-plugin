import { defineConfig } from 'vitest/config'

import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        globals: true,
        setupFiles: ['dotenv/config'],
        include: ['**/*.test.ts'],
    },
})

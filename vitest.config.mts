import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		dir: './tests',
		setupFiles: './setup-tests.ts',
		coverage: {
			provider: 'istanbul',
		}
	},
})

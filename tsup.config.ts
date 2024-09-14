import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['src/plugin.ts'],
	clean: true,
	dts: true,
	target: 'es2022',
	format: 'cjs',
})

import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src'],
    clean: true,
    dts: true,
    target: 'es2022',
    format: 'cjs',
})

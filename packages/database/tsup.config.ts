import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/*.ts'],
  format: ['cjs', 'esm'],
  dts: false, // We'll handle types separately with tsc
  clean: true,
  splitting: false,
  sourcemap: true,
  minify: false,
  skipNodeModulesBundle: true,
  external: ['@prisma/client'],
}) 
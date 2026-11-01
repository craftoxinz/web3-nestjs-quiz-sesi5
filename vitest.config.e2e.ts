import { defineConfig } from 'vitest/config';
// import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
  },
});

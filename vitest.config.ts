/// <reference types="vitest" />

import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    testTimeout: 10000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'dist/',
        '.wrangler/',
        'tests/',
        '**/*.d.ts'
      ]
    },
    include: ['tests/**/*.test.ts'],
    exclude: ['node_modules', 'dist', '.wrangler']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  esbuild: {
    sourcemap: 'inline'
  }
});

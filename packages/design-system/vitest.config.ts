import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    css: true, // Enable CSS processing for Mantine styles
    setupFiles: ['./src/test-setup.ts'],
  },
});

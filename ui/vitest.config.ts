/**
 * Vitest Configuration
 * 
 * Configures the Vitest testing framework for the React application.
 * Sets up the test environment, global variables, and coverage reporting.
 */
/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Configure plugins
  plugins: [react()],

  // Test configuration
  test: {
    // Enable global test variables (describe, it, expect)
    globals: true,

    // Use jsdom for browser-like environment in tests
    environment: 'jsdom',

    // Setup files to run before tests
    setupFiles: ['./src/test/setup.ts'],

    // Enable CSS processing in tests
    css: true,

    // Configure code coverage reporting
    coverage: {
      provider: 'v8',  // Use V8 coverage provider
      reporter: ['text', 'json', 'html'],  // Output formats for coverage reports
    },
  },
});

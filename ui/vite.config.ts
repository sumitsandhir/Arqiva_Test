/**
 * Vite Configuration
 * 
 * Configures the Vite build tool for the React application.
 * Sets up the React plugin and configures API proxy for development.
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Configure plugins
  plugins: [react()],

  // Development server configuration
  server: {
    // API proxy configuration to avoid CORS issues during development
    proxy: {
      '/contributions': {
        target: 'http://localhost:8000', // Target backend server
        changeOrigin: true, // Changes the origin of the request to match the target URL
      },
    },
  },
})

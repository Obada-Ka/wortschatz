/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
    watch: {
      // Needed for hot reload inside Docker bind mounts (set in docker-compose.yml)
      usePolling: process.env.CHOKIDAR_USEPOLLING === 'true',
      interval: 100
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['**/*.spec.ts', '**/*.d.ts', 'src/main.ts', 'scripts/**']
    }
  }
})

/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, '/')
          if (!normalizedId.includes('/node_modules/')) return undefined
          if (
            normalizedId.includes('/motion/') ||
            normalizedId.includes('/motion-dom/') ||
            normalizedId.includes('/motion-utils/') ||
            normalizedId.includes('/framer-motion/')
          ) {
            return 'motion'
          }
          if (normalizedId.includes('/gsap/')) return 'gsap'
          if (
            normalizedId.includes('/bootstrap/') ||
            normalizedId.includes('/react-bootstrap/')
          ) {
            return 'bootstrap'
          }
          if (
            normalizedId.includes('/react/') ||
            normalizedId.includes('/react-dom/') ||
            normalizedId.includes('/react-router') ||
            normalizedId.includes('/scheduler/')
          ) {
            return 'react'
          }
          return undefined
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        silenceDeprecations: ['import', 'mixed-decls', 'color-functions', 'global-builtin'],
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: false,
  },
})

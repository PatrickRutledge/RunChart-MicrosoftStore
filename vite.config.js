import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const isStore = mode === 'store'

  return {
    plugins: [vue()],
    base: isStore ? './' : '/',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          manualChunks: undefined,
          // Ensure UTF-8 with BOM for Microsoft Store compliance
          charset: 'utf8'
        }
      },
      // Microsoft Store requires UTF-8 BOM for all text files
      target: 'es2020'
    },
    esbuild: {
      charset: 'utf8'
    }
  }
})

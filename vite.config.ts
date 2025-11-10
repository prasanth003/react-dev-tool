import path from "path";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        devtools: resolve(__dirname, 'src/devtools.ts'),
        panel: resolve(__dirname, 'src/main.tsx'),
        content: resolve(__dirname, 'src/content/content.ts'),
        'main-world': resolve(__dirname, 'src/content/main-world.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
      }
    }
  }
})

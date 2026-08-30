import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// Video.js v10 custom elements used directly in templates — see
// https://videojs.org/docs/how-to/use-videojs-with-vue
const videoJsElements = new Set(['video-player'])

// SPA build — no lib mode, no dts generation
// https://vite.dev/config/
export default defineConfig({
  base: "/videojs10-vue",
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => videoJsElements.has(tag),
        },
      },
    }),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist-web',
    emptyOutDir: true,
  },
})

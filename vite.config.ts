import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import dts from 'vite-plugin-dts'

// Video.js v10 custom elements used directly in templates — see
// https://videojs.org/docs/how-to/use-videojs-with-vue
const videoJsElements = new Set(['video-player'])

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => videoJsElements.has(tag),
        },
      },
    }),
    vueDevTools(),
    dts({
      tsconfigPath: './tsconfig.app.json'
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name: 'Videojs10Vue',
      fileName: 'videojs10-vue'
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library — @videojs/html is a peer dep, and its subpath
      // imports (e.g. '@videojs/html/video/player') must stay external too,
      // otherwise Rollup bundles the vendor's UI-element internals into
      // this library's own output.
      external: (id) => id === 'vue' || id === '@videojs/html' || id.startsWith('@videojs/html/'),
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
          '@videojs/html': 'VideojsHtml',
          '@videojs/html/video': 'VideojsHtml',
          '@videojs/html/video/player': 'VideojsHtml',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'videojs10-vue.css';
          return assetInfo.name || '';
        },
      },
    },
  },
})

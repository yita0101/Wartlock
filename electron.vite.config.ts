import react from '@vitejs/plugin-react'
import {
  bytecodePlugin,
  defineConfig,
  externalizeDepsPlugin,
  swcPlugin,
} from 'electron-vite'
import { resolve } from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin(), swcPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin()],
  },
  renderer: {
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@renderer': resolve('src/renderer/src'),
        '@main': resolve('src/main'),
        '@preload': resolve('src/preload'),
      },
    },
    plugins: [react(), tsconfigPaths()],
  },
})

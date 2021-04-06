const { default: svgSpritePlugin } = require('../dist')
const vue = require('@vitejs/plugin-vue')
import path from "path"
import { defineConfig } from "vite"

module.exports = defineConfig({
  plugins: [svgSpritePlugin({ symbolId: (name) => "icon-" + name, component: { type: 'vue' } }), vue()],
  resolve: {
    alias: {
      '/@': path.join(__dirname, 'src')
    }
  }
  // It is recommended to use this plugin, otherwise you will need to manually import all svg files
})
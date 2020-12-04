import svgSpritePlugin from "vite-plugin-svg-sprite-component"
import path from "path"
const sharedConfig = {
  alias: {
    '/@/': path.resolve(__dirname, 'src')
  }
}
module.exports = {
  plugins: [svgSpritePlugin({ symbolId: (name) => "icon-" + name })],
  ...sharedConfig,
  // It is recommended to use this plugin, otherwise you will need to manually import all svg files
  transforms: [require('vite-transform-globby-import')(sharedConfig)]
}
# vite-plugin-svg-sprite-component
Vite plugin for creating SVG sprites and components
## install
`npm i vite-plugin-svg-sprite-component -D`

`yarn add vite-plugin-svg-sprite-component -D`

## usage
```js
// vite.config.js
import svgSpritePlugin from "vite-plugin-svg-sprite-component"

module.exports = {
  plugins: [svgSpritePlugin({ symbolId: (name)=> "icon-" + name })],
}
```
```js
// main.js
// globby import
const svgs = import.meta.globEager('/**your svg path*/*.svg')
// normal
import example from '/**your svg path*/example.svg'
//  You should call it at least once so it will not be tree shaked
svgs
example
```
### Any where you want
```html
<template>
  <svg>
    <use xlink:href="#icon-example" />
  </svg>
</template>

```

### Used as a component
```html
<template>
  <IconExample />
</template>
<script>
import { IconExample } from '/@/icons/svg/example.svg'
export default {
  components:{ IconExample }
}
</script>
```
When option `defaultExport` be true
```html
<template>
  <Icon />
</template>
<script>
import Icon from '/@/icons/svg/example.svg'
export default {
  components:{ Icon }
}
</script>
```

## Configuration
```ts
export type Options = {
  /**
   * How <symbol> id attribute should be named
   * Default behavior: /@/icons/example.svg => example
   */
  symbolId?: (name: string, path: string) => string,
  /**
   * Remove attributes also include members in  style sttr
   * @default ['width','height']
   */
  removeAttrs?: string[],

  component?: {
    /** The export component type, Only Vue now */
    type: 'vue',
    /** export const [exportName] as VNode
 * Default behavior: icon-example => IconExample
 */
    exportName?: (name: string, path: string) => string,
    
    /**
     *  export default [exportName] as VNode
     * @default false
     */
    defaultExport?: boolean,
  }
}

```
## License
MIT


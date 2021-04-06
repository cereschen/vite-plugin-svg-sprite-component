import { readFileSync } from "fs"
import { parseDOM, DomUtils } from "htmlparser2"
import { default as render } from "dom-serializer"
import { Element } from "domhandler"
import { Plugin } from "vite"
import { basename } from "path";

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

function createPlugin(options: Options = {}): Plugin {
  const { symbolId, component, removeAttrs } = options;



  const cache = new Map();
  return {
    name: 'svg-sprite-component',
    transform: async (source, path) => {
      if (!path.match(/\.svg$/i)) {
        return source
      }
      let tmp = cache.get(path);
      if (tmp) {
        return tmp
      }

      let code = readFileSync(path).toString();

      let svgName = basename(path, '.svg')

      const finalSymbolId = symbolId ? symbolId(svgName, path) : svgName

      let svgCode = code.match(/<svg[^]*<\/svg>/)
      if (!svgCode) return source
      let svgNode = parseDOM(svgCode[0])[0] as Element
      svgNode.name = 'symbol'
      svgNode.attribs.id = finalSymbolId
      if (!Reflect.has(svgNode.attribs, 'viewBox')) {
        let { width, height } = svgNode.attribs
        svgNode.attribs.viewBox = `0 0 ${width || 200} ${height || 200}`
      }

      const childElements = DomUtils.getElementsByTagName('*', svgNode)

      const removeAttrList = removeAttrs || ['width', 'height']

      childElements.map(element => {
        removeAttrList.map(attr => {
          Reflect.deleteProperty(element.attribs, attr)
        })

        if (Reflect.has(element.attribs, 'style')) {
          let style = element.attribs['style'].split(';')
          let obj: Record<string, string> = {}
          let keys = []
          style.map(item => {
            let kv = item.split(':')
            if (kv[0]) {
              keys.push(kv[0])
              obj[kv[0]] = kv[1]
            }
          })
          removeAttrList.map(attr => {
            Reflect.deleteProperty(obj, attr)
          })

          let styleStr = ''
          for (let i in obj) {
            styleStr += `${i}:${obj[i]};`
          }

          if (styleStr.trim()) {
            element.attribs['style'] = styleStr
          } else {
            Reflect.deleteProperty(element.attribs, 'style')
          }
        }
      })

      let componentCode = ''

      if (component) {
        const { exportName, defaultExport } = component
        let componentName = ''
        if (exportName) {
          componentName = exportName(svgName, path)
        } else {
          componentName = finalSymbolId.substr(0, 1).toUpperCase() + finalSymbolId.substr(1).replace(/-([a-z])?/g, (val, $1) => {
            return $1 ? $1.toUpperCase() : ''
          })
        }
        if (component.type === 'vue') {
          componentCode = `
        import {h} from "vue";
        export const ${componentName} = (props)=> h('svg',props,h('use',{'xlink:href':'#${finalSymbolId}'}));
        ${defaultExport ? `export default ${componentName}` : source};
        `
        }
      }

      const htmlCode = `
      let node = document.getElementById('${finalSymbolId}');
      let wrap  = document.getElementById('svg-sprite-component-wrap');
      if(!wrap){
        wrap = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        wrap.id = 'svg-sprite-component-wrap';
        wrap.style.setProperty('display', 'none');
        document.body.appendChild(wrap);
      }
      if(!node){
        let symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol')
        wrap.appendChild(symbol);
        symbol.outerHTML = \`${render(svgNode)}\`;
      }\n
      `
      cache.set(path, htmlCode + componentCode)

      return htmlCode + componentCode
    }
  };
};

export default createPlugin

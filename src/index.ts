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

  /** export const [exportName] as VNode
   * Default behavior: icon-example => IconExample
   */
  exportName?: (name: string, path: string) => string,

  /**
   *  export default [exportName] as VNode
   * @default false
   */
  defaultExport?: boolean,

  /**
   * Remove attributes also include members in  style sttr
   * @default ['width','height']
   */
  removeAttrs?: string[]
}

function createPlugin(options: Options = {}): Plugin {
  const { symbolId, exportName, defaultExport, removeAttrs } = options;

  const cache = new Map();
  return {
    transforms: [
      {
        test: ({ path, query, isBuild }) => {
          const isSVG = path.endsWith('.svg');
          return isBuild
            ? isSVG
            : isSVG && query.import != null;
        },
        transform: async ({ code: source, isBuild, path }) => {
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

          let wrapNode = parseDOM('<svg></svg>')[0] as Element

          DomUtils.appendChild(wrapNode, svgNode)

          let componentName = ''
          if (exportName) {
            componentName = exportName(svgName, path)
          } else {
            componentName = finalSymbolId.substr(0, 1).toUpperCase() + finalSymbolId.substr(1).replace(/-([a-z])?/g, (val, $1) => {
              return $1 ? $1.toUpperCase() : ''
            })
          }


          const componentCode = `
       import {h} from "vue";
       export const ${componentName} = h('svg',{},h('use',{'xlink:href':'#${finalSymbolId}'}));
       ${defaultExport ? `export default ${componentName}` : source};
       `
          const htmlCode = `
          let node = document.getElementById('${finalSymbolId}');
          let wrap  = document.getElementById('svg-sprite-component-wrap');
          if(!wrap){
            wrap = document.createElement('div')
            wrap.id = 'svg-sprite-component-wrap'
            document.body.appendChild(wrap);
          }
          if(!node){
            let svg = document.createElement('div');
            svg.style = 'display:none';
            svg.innerHTML = \`${render(wrapNode)}\`;
            wrap.appendChild(svg);
          }\n
          `
          cache.set(path, htmlCode + componentCode)

          return htmlCode + componentCode
        },
      },
    ],
  };
};

export default createPlugin
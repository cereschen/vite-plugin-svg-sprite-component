import { App } from "vue";
import SvgIcon from "./SvgIcon/index.vue"
const svgs = import.meta.globEager('./svg/*.svg')
export function registerIcons(app: App) {
  app.component('svg-icon', SvgIcon as any)
}

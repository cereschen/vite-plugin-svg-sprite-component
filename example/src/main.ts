// const svgs = import.meta.globEager('./icons/svg/*.svg')
// svgs
import { registerIcons } from '/@/icons' // icon
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
registerIcons(app)
app.mount('#app')


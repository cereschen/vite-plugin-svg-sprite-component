import { registerIcons } from '/@/icons' // icon
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
registerIcons(app)
app.mount('#app')


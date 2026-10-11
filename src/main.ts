import '@fontsource-variable/bricolage-grotesque'
import '@fontsource-variable/newsreader'
import '@fontsource-variable/newsreader/wght-italic.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import './assets/main.css'
import App from './App.vue'
import router from './router'

createApp(App).use(createPinia()).use(router).mount('#app')

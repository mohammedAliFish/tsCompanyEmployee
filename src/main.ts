
import { registerPlugins } from '@/plugins'
import { createPinia } from "pinia";

import App from './App.vue'
import './styles/style.css'
import vuetify from './plugins/vuetify';
import { createApp } from 'vue'

const app = createApp(App)
app.use(vuetify);
const pinia = createPinia();
app.use(pinia);
registerPlugins(app)

app.mount('#app')

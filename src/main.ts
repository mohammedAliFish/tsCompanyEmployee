
import { registerPlugins } from '@/plugins'
import { createPinia } from "pinia";

import App from './App.vue'
import './styles/style.css'
import vuetify from './plugins/vuetify';
import { createApp } from 'vue'



import { i18n } from './Languages/locales';




const app = createApp(App);
app.use(i18n);
app.use(vuetify);

const pinia = createPinia();
app.use(pinia);
registerPlugins(app)

app.mount('#app')

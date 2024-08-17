import { createApp } from 'vue';
import App from './App.vue';
import Router from './router.js';
import { configure } from 'vee-validate';
import socket from './plugins/socket';
import store from './store'; // Vuex 스토어를 가져옵니다.

// css
import './assets/DesignSystem/Color.css';
import './assets/DesignSystem/Text.css';

// Create the Vue application instance
const app = createApp(App);

// Set up the global properties
app.config.globalProperties.$socket = socket;

// Use the Vuex store
app.use(store);

// Configure VeeValidate
configure({
  classes: {
    valid: 'is-valid',
    invalid: 'is-invalid',
  },
});

// Use the router and mount the app
app.use(Router).mount('#app');

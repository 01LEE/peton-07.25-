import { createApp } from 'vue';
import App from './App.vue';
import Router from './router.js';
import { configure } from 'vee-validate';

// css
import './assets/DesignSystem/Color.css';
import './assets/DesignSystem/Text.css';

// Configure VeeValidate
configure({
  classes: {
    valid: 'is-valid',
    invalid: 'is-invalid',
  },
});

createApp(App).use(Router).mount('#app');

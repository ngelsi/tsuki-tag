import Vue from 'vue'
import axios from 'axios'
import vuetify from '@/plugins/vuetify'
import '@mdi/font/css/materialdesignicons.min.css'

import App from './App'
import router from './router'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: {
    App
  },
  router,
  vuetify,
  template: '<App/>'
}).$mount('#app')
import Vue from 'vue'
import App from './App.vue'
import store from './store'
Vue.config.productionTip = false

import {VueFeathers} from './../../src/index.js'
import {feathersClient} from './feathers-client.js'
Vue.use(VueFeathers, {feathersClient})

const app = new Vue({
  store,
  render: h => h(App)
})

app.$mount('#app')

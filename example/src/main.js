import Vue from 'vue'
import App from './App.vue'
import store from './store'

Vue.config.productionTip = false
Vue.use(VueFeathers, {feathersClient})

const app = new Vue({
  store,
  render: h => h(App)
})
import {VueFeathers} from './../../src/index.js'
import {feathersClient} from './feathers-client.js'
console.log(app)
app.$mount('#app')

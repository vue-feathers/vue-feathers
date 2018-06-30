import Vue from 'vue'
import App from './App.vue'

import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import reactive from 'feathers-reactive'
import io from 'socket.io-client'

const socket = io('http://localhost:3030', {transports: ['websocket']})

const feathersClient = feathers()
.configure(socketio(socket))
.configure(reactive({idField:'_id'}))

import {VueFeathers} from '@vue-feathers/vue-feathers'

Vue.use(VueFeathers, {feathersClient})

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')

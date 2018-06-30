# Vue-Feathers

### Getting Started
```
npm install @vue-feathers/vue-feathers
```
You'll need to set up a feathers client in your app. Each client is different. This example uses SocketIO and feathers-reactive for real-time events.
```js
import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import reactive from 'feathers-reactive'
import io from 'socket.io-client'

const socket = io('http://localhost:3030', {transports: ['websocket']})

const feathersClient = feathers()
  .configure(socketio(socket))
  .configure(reactive({idField:'_id'}))
```
Then import and install the `vue-feathers` plugin
```js
import Vue from 'vue'
import {VueFeathers} from '@vue-feathers/vue-feathers'
Vue.use(VueFeathers, feathersClient)
```

### Nuxt

In Nuxt, just put the feathers client in its own file, export it, and make a plugin like so: 
```js
import feathersClient from '~/path/to/feathersClient.js'
import Vue from 'vue'
import {VueFeathers} from '@vue-feathers/vue-feathers'
Vue.use(VueFeathers, feathersClient)
```
Don't forget to rigister this alongisde your other plugins in your nuxt.config.js

## Usage

### The Feathers Client: $F

The plugin registers the feathers client on all Vue components under `this.$F`, so in a component you could fetch and display all users like so:

```html
<template>
  <div style="display: flex; flex-direction: column;">
    <span v-for="user in users" :key="user.id">{{user.name}}</span>
  </div>
</template>
```

```js
export default {
  data() {
    return {
      users: [], // Initialize for storing fetched users 
    }
  },
  mounted() { // When the component is mounted...
    this.$F.service('users').find() // find all users.
      .then(users => { // When the data arrives... 
        this.users = users // store it.
      })
  },
}
```

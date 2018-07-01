# Vue-Feathers

> Realtime-frist Vue integrations for Feathers 

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
Don't forget to register this alongisde your other plugins in your nuxt.config.js

## The Feathers Client: $F

The plugin registers the feathers client on all Vue components under `this.$F`, so in a component you could fetch and display all users like so:

```html
<template>
  <div>
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

## Mixins

The above scenario is so common that I wrapped it in a mixin. Using the same example with the same HTML:
```js
import {mixins} from '@vue-feathers/vue-feathers'
const usersMixin = mixins.ListsMixin(['users']) // takes a list of service names

export default {
  mixins: [usersMixin], // handles the data hookup and provides some useful methods
  mounted() {
    this.find('users') // or use this.findAll() to fetch all at once
  },
}
```

This approach scales nicely:
```js
const mixin = mixins.ListsMixin(['users', 'groups', 'roles', 'permissions', 'profiles'])

export default {
  mixins: [mixin],
  mounted() {
    this.findAll()
  },
}
```

### Real-Time Data

`feathers-reactive` provides data stream interfaces that we can tap into. Assuming your feathers client has feathers-reactive installed, you can make a reactive list for the users example above like so:
```js
export default {
  data() {
    return {
      users: [], // Initialize for storing fetched users 
    }
  },
  mounted() { // When the component is mounted...
    this.$F.service('users')
      .watch({listStrategy: 'always'}) // watch for changes and always send the full dataset on change
      .find() // fetch all
      .subscribe(users => { // Whenever data arrives... 
        this.users = users // store it.
      })
  },
}
```

And again I provide a mixin to simplify:
```js
import {mixins} from '@vue-feathers/vue-feathers'
const usersMixin = mixins.StreamsMixin(['users'])

export default {
  mixins: [usersMixin],
  mounted() {
    this.sub('users') // or use this.subAll() to subscribe to all at once
  },
}
```

And it scales in the same manner as the ListsMixin.

## Components

Here's where the magic happens. These data providers dynamically fetch and provide data. They render no DOM, like `<template>` elements.

Both components are installed globally by the plugin.

### FeathersData

Recreating the same users example:

```html
<template>
  <feathers-data endpoints="['users']"/>
    <span slot-scope="{data}" v-for="user in data.users" :key="user.id">
      {{user.name}}
    </span>
  </feathers-data/>
</template>
```

A little bit more HTML, but **zero** JavaScript. 

### FeathersStream

A FeathersStream works just the same way except it keeps the data it provides constantly up to date. 

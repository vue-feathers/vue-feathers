# vue-feathers

> A component to handle your feathers connections 

### Versioning

gitlab link: [https://gitlab.com/VueFeathers/vue-feathers](https://gitlab.com/VueFeathers/vue-feathers)

version: 0.2.1

todos:
  * example needs feathers client
  * plugin update

roadmap:
  * feathers-reactive first, then vanilla feathers

### What's Feathers?

It's a framework that runs both server-side and client-side. On the server, it wraps your backends (DB connections, API connections, etc.) and automagically provides both REST endpoints and socket connections for interfacing with these connected backends. 

On the frontend, it provides a standardized syntax for interfacing with any given DB. This frees you to change the backend without changing the frontend at all. It also uses a data format that plays very nicely with JSON and NoSQL DBs.

### What will vue-feathers do for me?

Three things:
* Makes the full feathers client readily availabile in your Vue components
* Helpful pre-made utility functions and mixins
* A swiss army knife Vue component that handles the hard parts for you

## Getting Started
```
npm install @vue-feathers/vue-feathers
```
You'll need to set up a feathers client in your app. Each client is different. This example client uses SocketIO and feathers-reactive for real-time events.
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

In Nuxt, you should put the feathers client in its own file and export it so that you can use the same client in other places of your app for consistency. Then make a nuxt plugin: 
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
  <observable-stream :queryset="{users:{isAdmin: true}, roles: {}}"/>
    <span slot-scope="{streams}" v-for="endpoint in Object.keys(streams)" :key="endpoint">
      Returns an array of records
      {{endpoint.data}}
    </span>
  </feathers-stream/>
</template>
```

A little bit more HTML, but **zero** JavaScript. 

### FeathersStream

A FeathersStream works just the same way except it keeps the data it provides constantly up to date. 

### Observable Object

Fetches the first element of the provided query from a single endpoint.
```html
<observable-object endpoint="users" :query="{username: 'moot'}">
  <div slot-scope="{object}">
    {{datum}}
  </div>
</observable-object>
```
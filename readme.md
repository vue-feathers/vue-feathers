# vue-feathers

Feathers helpers and components for Vue

## Getting Started
```
npm install @vue-feathers/vue-feathers
```

You'll need to set up a feathers client in your app. Each client is different. This example client uses SocketIO and feathers-reactive for real-time events.

> <details>
>   <summary>Example Feathers Client</summary>
>
>```js
> import feathers from '@feathersjs/feathers'
> import socketio from '@feathersjs/socketio-client'
> import reactive from 'feathers-reactive'
> import io from 'socket.io-client'
>
> const socket = io('http://localhost:3030', {transports: ['websocket']})
>
> export const feathersClient = feathers()
>   .configure(socketio(socket))
>   .configure(reactive({idField:'_id'}))
>```
> </details>

Then import and install the `vue-feathers` plugin

```js
import Vue from 'vue'
import feathersClient from 'path/to/your/feathers/client'
import VueFeathers from '@vue-feathers/vue-feathers'

Vue.use(VueFeathers, { feathersClient })
```

### Nuxt

Just put the above code in a js file and register it in nuxt.config.js as a plugin.

## The Feathers Client: $F

The plugin registers the feathers client on all Vue components under `this.$F`, so in a component you could fetch and display all users like so:

```js
export default {
  data() {
    return {
      users: [], // Initialize for storing fetched users 
    }
  },
  mounted() {
    this.findUsers()
  },
  methods: {
    findUsers() {
      this.$F.service('users')
        .find()               // Find all users.
        .then(users => {      // When the data arrives... 
          this.users = users  // store it.
        })
    }
  }
}
```

## Mixins

The above scenario is so common that I wrapped it in a mixin. Using the same example with the same HTML:

```js
import { mixins } from '@vue-feathers/vue-feathers'
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
      subscription: null, // Initialize for storing the subscription to the 'users' endpoint 
    }
  },
  mounted() {
    this.sub()
  },
  methods: {
    sub(query) {
      this.unsub() // Unsub before sub in case component is remounted (ex. hot reload in dev mode)
      this.subscription = this.$F.service('users')
        .watch() // Watch 'users' for changes.
        .find({ query })  // On change, fetch all records.
        .subscribe(users => { // Whenever data arrives... 
          this.users = users  // store it.
        })
    },
    unsub() {
      if (this.subscription) {
        this.subscription.unsubscribe()
        this.subscription = null
      }
    }
  }
}
```

And again I provide a mixin to simplify:

```js
import {mixins} from '@vue-feathers/vue-feathers'
const usersMixin = mixins.StreamsMixin(['users'])

export default {
  mixins: [usersMixin],
  mounted() {
    this.sub('users', { /* optional query goes here */ }) 
    // or use this.subAll(query) to subscribe to all at once
  },
}
```

And it scales in the same manner as the ListsMixin.

## Data Provider Components

Here's where the magic happens. These data providers dynamically fetch and provide data via scoped slots. 

Notes: 
- they render no DOM, like `<template>` and `<slot>` elements
- :class and such do nothing on these components

### Observable Stream

Recreating the same users example:

```html
<observable-stream paginated endpoint="users" :query="{ active: true }">
  <template v-slot="{ stream, loading, refresh, pagination }">
    
    <div v-for="(record, i) in stream" :key="`record-${i}`">
      {{ stream }}
    </div>
    
  </template>
</observable-stream>
```

#### Scoped Props

- `stream` is an array of DB records, defaulting to an empty array before data arrives
- `loading` is false when requested data has been fetched, true when waiting for requested data
- `refresh` is a function that resets the stream and re-fetches data
- `pagination` is data is present when "paginated" is set to true on observable-stream

### Observable Streams (deprecated)

Given an object of the form { endpoint: query, ... }, this component provides an object of the form { endpoint: stream,... }
```html
<observable-stream paginated :queryset="{ users: { active: true } }">
  <template v-slot="{ users }">
    <pre>{{ users }}</pre>
  </span>
</observable-stream>
```

### Observable Object (deprecated)

Fetches the first element of the provided query from a single endpoint.
```html
<observable-object endpoint="users" :query="{username: 'moot'}">
  <div v-slot="{object}">
    {{datum}}
  </div>
</observable-object>
```
const ListsMixin = (endpoints) => {
  return {
    data() {
      let obj = {}
      for (let endpoint of endpoints) {
        obj[endpoint] = []
      }
      return obj
    },
    methods: {
      find(endpoint, findParams) {
        this.$F.service(endpoint)
          .find(findParams)
          .then(d => {
            this[endpoint] = d
          })
      },
      findAll(findParams) {
        for (let endpoint of endpoints) {
          this.find(endpoint, findParams)
        }
      }
    },
  }
}

const StreamsMixin = (endpoints) => {
  return {
    data() {
      let obj = {
        subscriptions: {}
      }
      for (let endpoint of endpoints) {
        obj[endpoint] = []
        obj.subscriptions[endpoint] = null
      }
      return obj
    },
    methods: {
      sub(endpoint, findParams) {
        this.unsub(endpoint) // unsub() before subbing in case component is re-mounted.
        this.$set( // vm.$set() avoids Vue.js caveat on object update reactivity.
          this.subscriptions,
          endpoint,
          this.$F.service(endpoint)
            .watch({listStrategy: 'always'})
            .find(findParams)
            .subscribe(d => {
              this[endpoint] = d
            })
        )
      },
      subAll(findParams) {
        for (let endpoint of endpoints) {
          this.sub(endpoint, findParams)
        }
      },
      unsub(endpoint) {
        if (this.subscriptions[endpoint]) {
          this.subscriptions[endpoint].unsubscribe()
          this.$set(this.subscriptions, endpoint, null)
        }
      },
      unsubAll() {
        for (let endpoint of endpoints) {
          this.unsub(endpoint)
        }
      },
    },
  }
}

export default {
  ListsMixin,
  StreamsMixin,
}
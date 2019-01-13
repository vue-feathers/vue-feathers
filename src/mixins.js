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
      find(endpoint) {
        this.$F.service(endpoint)
          .find()
          .then(d => {
            this[endpoint] = d
          })
      },
      findAll() {
        for (let endpoint of endpoints) {
          this.$F.service(endpoint)
            .find()
            .then(d => {
              this[endpoint] = d
            })
        }
      },
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
      sub(endpoint) {
        this.unsub(endpoint) // unsub() before subbing in case component is re-mounted.
        this.$set( // vm.$set() avoids Vue.js caveat on object update reactivity.
          this.subscriptions,
          endpoint,
          this.$F.service(endpoint)
            .watch({listStrategy: 'always'})
            .find()
            .subscribe(d => {
              this[endpoint] = d
            })
        )
      },
      subAll() {
        for (let endpoint of endpoints) {
          this.sub(endpoint)
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
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
      let obj = {}
      for (let endpoint of endpoints) {
        obj[endpoint] = []
      }
      return obj
    },
    methods: {
      sub(endpoint) {
        this.$F.service(endpoint)
          .watch({listStrategy: 'always'})
          .find()
          .subscribe(d => {
            this[endpoint] = d
          })
      },
      subAll() {
        for (let endpoint of endpoints) {
          this.$F.service(endpoint)
            .watch({listStrategy: 'always'})
            .find()
            .subscribe(d => {
              this[endpoint] = d
            })
        }
      },
    },
  }
}

module.exports = {
  ListMixin,
  StreamsMixin,
}
module.exports = {
  props: {
    'endpoint': {
      type: String,
      required: true,
    },
    'id': {
      type: String,
      default: null,
    },
    'query': {
      type: Object,
      default: null,
    },
    'realtime': {
      type: Boolean,
      default: false,
    },
    'immediate': {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      datum: {},
      dat: [],
      fetchedId: null,
      subscription: null,
    }
  },
  computed: {
    _query() {
      return this.fetchedId
        ? {id: this.fetchedId}
        : this.query 
          ? this.query 
          : this.id
            ? {id: this.id}
            : null
    }
  },
  methods: {
    sub() {
      this.subscription = this.$F.service(this.endpoint)
        .watch({listStrategy: 'always'})
        .find({query: this._query})
        .subscribe(d => {
          if (d[0]) {
            this.datum = d[0]
            this.fetchedId = d[0].id
          } else if (this.fetchedId) {
            this.reSeed()
          }
        })
    },
    reSeed() {
      this.$F.service(this.endpoint)
        .find({query: {id: this.fetchedId}})
        .then(d => {this.datum = d[0]})
    },
    reset() {
      this.datum = {}
      this.fetchedId = null
      if (this.subscription) {
        this.subscription.unsubscribe()
        this.subscription = null
      }
    },
  },
  watch: {
    endpoint() {
      this.reset()
    },
    query() {
      this.reset()
    },
    _query() {
      if (this._query ) {
        if (!this.subscription) {
          this.sub()
        }
      }
    },
  },
  render() {
    return this.$scopedSlots.default({
      datum: this.datum,
      dat: this.dat,
      sub: this.sub,
      query: this._query,
    })
  },
}
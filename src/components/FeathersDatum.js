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
    }
  },
  computed: {
    _query() {
      return this.query 
        ? this.query 
        : this.id
          ? {id: this.id}
          : null
    }
  },
  methods: {
    find() {
      this.$F.service(this.endpoint)
        .find({query: this._query})
        .then(d => {this.datum = d[0]})
    },
    sub() {
      this.$F.service(this.endpoint)
        .watch({listStrategy: 'always'})
        .find({query: this._query})
        .subscribe(d => {
          if (d[0]) {
            this.datum = d[0]
          }
        })
    },
  },
  watch: {
    _query() {
      if (this._query && this.immediate) {
        if (this.immediate && this.realtime) {
          this.sub()
        } else {
          this.find()
        }
      }
    },
  },
  render() {
    return this.$scopedSlots.default({
      datum: this.datum,
      dat: this.dat,
      find: this.find,
      sub: this.sub,
      query: this._query,
    })
  },
}
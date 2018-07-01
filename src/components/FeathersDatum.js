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
      datum: {}
    }
  },
  computed: {
    _query() {
      return this.query ? this.query : {id: this.id}
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
        .subscribe(d => {this.datum = d[0]})
    },
  },
  mounted() {
    if (this.immediate) {
      if (this.immediate && this.realtime) {
        this.sub()
      } else {
        this.find()
      }
    }
  },
  render() {
    return this.$scopedSlots.default({
      datum: this.datum,
      find: this.find,
      sub: this.sub,
      query: this._query,
    })
  },
}
module.exports = {
  props: {
    'endpoints': {
      type: Array,
      default: [],
    },
    'immediate': {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      wrapper: {}
    }
  },
  methods: {
    init() {
      for (let endpoint of this.endpoints) {
        this.$set(this.wrapper, endpoint, [])
      }
    },
    sub(endpoint) {
      this.$F.service(endpoint)
        .watch({listStrategy: 'always'})
        .find()
        .subscribe(d => {this.wrapper[endpoint] = d})
    },
    subAll() {
      for (let endpoint of this.endpoints) {
        this.sub(endpoint)
      }
    },
  },
  mounted() {
    this.init()
    if (this.immediate) {
      this.subAll()
    }
  },
  render() {
    return this.$scopedSlots.default({
      data: this.wrapper,
      sub: this.sub,
      subAll: this.subAll,
    })
  },
}
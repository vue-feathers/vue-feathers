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
    find(endpoint) {
      this.$F.service(endpoint)
        .find()
        .then(d => {this.wrapper[endpoint] = d})
    },
    findAll() {
      for (let endpoint of this.endpoints) {
        this.find(endpoint)
      }
    },
  },
  mounted() {
    this.init()
    if (this.immediate) {
      this.findAll()
    }
  },
  render() {
    this.$scopedSlots.default({
      data: this.wrapper,
      find: this.sub,
      findAll: this.subAll,
    })
  },
}
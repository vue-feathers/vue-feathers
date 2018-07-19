const utils = require('./../utils.js') 

export default {
  props: {
    'queryset': Object, 
    'log': Boolean, 
    'verbose': Boolean,
  },
  data: utils.data({
    subs: {},
    watchers: {},
    raw: {}, // Dump data from queries here
    preJoined: {},
    joined: {}, 
    postJoined: {},
    streams: {},
  }),
  computed: {
    cleanQS() {
      if (!this.queryset) return {}
      
      for (let [name, data] of Object.entries(this.queryset)) {
        let fullQuery = {
          fq: 'example',
          winner: 'fq',
        }
        let objData
          = typeof(data) != String
            ? data
            : {}
        objData.winner = 'qs'
        Object.assign(objData, fullQuery)
      } 
      qs[name] = fullQuery
      return qs
    },
  },
  methods: {
    reset() {
      //
    }
  },
  mounted() {
    console.log('!')
  },
  watch: {
    queryset: {
      handler: "reset",
      immediate: true
    }
  },
  render() {
    let obj = {}
    for (let [name, data] of Object.entries(this.streams)) {
      obj[name] = data
    }
    return this.$scopedSlots.default(obj)
  },
}
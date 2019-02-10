export default {
  props: {
    'queryset': {
      type: Object,
      default: null,
      required: true,
    },
  },
  computed: {
    endpoints() {
      return Object.keys(this.queryset)
    },
    _streams() {
      let output = {}
      for (let endpoint of this.endpoints) {
        output[endpoint] 
        = this.streams[endpoint] && this.streams[endpoint].data 
          ? this.streams[endpoint].data
          : [] 
      }
      return output
    }
  },
  data() {
    return {
      init: false,
      streams: {},
    }
  },
  methods: {
    sub() {
      for (let endpoint of this.endpoints) {
        this.$set(this.streams, endpoint, {})
        this.$set(this.streams[endpoint], 'subscription', {})
        this.$set(this.streams[endpoint], 'data', {})
        this.streams[endpoint].subscription = this.$F.service(endpoint)
          .watch({ listStrategy: 'always' })
          .find({ query: this.queryset[endpoint] })
          .subscribe(d => {
            this.streams[endpoint].data = d
          })
      }
    },
    fetchIfAble() {
      if (Object.keys(this.queryset).length) {
        if (!this.subscription) {
          // console.log('>>> fetching')
          this.unsub()
          this.sub()
          this.init = true
        }
      }
    },
    unsub() {
      for (let endpoint of this.endpoints) {
        if (endpoint in this.streams && this.streams[endpoint].subscription) {
          this.streams[endpoint].subscription.unsubscribe()
          this.streams[endpoint].subscription = null
        }
      }
    },
    reset() {
      // console.log('>>> resetting')
      this.init= false
      this.unsub()
      this.streams = {}
    },
  },
  watch: {
    queryset() {
      // console.log('>>> queryset changed')
      this.init ? this.reset() : null
      this.fetchIfAble()
    },
  },
  mounted() {
    // console.log('>>> mounted')
    this.fetchIfAble()
  },
  render() {
    return this.$scopedSlots.default(this._streams)
  },
}

/* WORKFLOWS 

  Page Fetched
    >>> mounted // but it can't fetch yet because the query is null
    >>> query changed
    >>> fetching
    >>> data retrieved

  Hot Reload
    >>> mounted // query is not null
    >>> fetching
    >>> data retrieved

  Service Changed
    >>> query changed // b/c component is initialized, will reset before fetching
    >>> resetting
    >>> ubsubscribing
    >>> fetching

  Datum Updated
    >>> data retrieved
    >>> data retrieved // unsure why it's doubled over
  
  Datum Deleted
    >>> data may have been deleted
    >>> reseeding
  
  Datum Created
    >>> data retrieved
*/
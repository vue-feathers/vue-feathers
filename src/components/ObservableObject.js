export default {
  props: {
    'endpoint': {
      type: String,
      required: true,
    },
    'query': {
      type: Object,
      default: null,
      required: true,
    },
  },
  data() {
    return {
      init: false,
      datum: {},
      fetchedId: null,
      subscription: null,
    }
  },
  methods: {
    sub() {
      // Run the 
      this.subscription = this.$F.service(this.endpoint)
        .watch({listStrategy: 'always'})
        .find({query: this.query})
        .subscribe(d => {
          if (d[0]) {
            // console.log(">>> data retrieved")
            this.datum = d[0]
            this.fetchedId = d[0].id
          } else if (this.fetchedId) {
            // console.log(">>> data may have been deleted")
            this.reSeed()
          }
        })
    },
    reSeed() {
      // Manual fetch by ID to confirm deletion when subscription returns an empty array.
      this.$F.service(this.endpoint)
        .find({query: {id: this.fetchedId}})
        .then(d => {
          // console.log('>>> reseeding')
          this.datum = d[0]
        })
    },
    reset() {
      // console.log('>>> resetting')
      this.init= false
      this.datum = {}
      this.fetchedId = null
      this.unsub()
    },
    fetchIfAble() {
      if (this.query && this.query.service) {
        if (!this.subscription) {
          // console.log('>>> fetching')
          this.unsub()
          this.sub()
          this.init = true
        }
      }
    },
    unsub() {
      if (this.subscription) {
        // console.log('>>> unsubscribing')
        this.subscription.unsubscribe()
        this.subscription = null
      }
    },
  },
  watch: {
    endpoint() {
      // console.log('>>> endpoint changed')
      this.reset()
    },
    query() {
      // console.log('>>> query changed')
      this.init ? this.reset() : null
      this.fetchIfAble()
    },
  },
  mounted() {
    // console.log('>>> mounted')
    this.fetchIfAble()
  },
  render() {
    return this.$scopedSlots.default({
      datum: this.datum,
    })
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
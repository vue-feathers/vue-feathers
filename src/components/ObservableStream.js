export default {
  props: {
    endpoint: {
      type: String,
      required: true
    },
    query: Object,
    paginated: Boolean
  },
  data() {
    return {
      init: false,
      loading: false,
      stream: [],
      subscription: null,
      total: null,
      skip: null,
      limit: null,
    }
  },
  computed: {
    pagination() {
      return this.paginated 
        ? {
            pagination: {
              total: this.total,
              skip: this.skip,
              limit: this.limit 
            }
          }
        : {}
    }
  },
  methods: {
    sub() {
      this.loading = true
      this.subscription = this.$F.service(this.endpoint)
        .watch({ listStrategy: 'always' })
        .find({ query: this.query })
        .subscribe(d => {
          this.loading = false
          if (this.paginated) {
            this.stream = d.data
            this.total = d.total
            this.skip = d.skip
            this.limit = d.limit
          } else {
            this.stream = d
          }
        })
    },
    unsub() {
      if (this.subscription) {
        this.subscription.unsubscribe()
        this.subscription = null
      }
    },
    reset() {
      // console.log('>>> resetting')
      this.init = false
      this.unsub()
      this.stream = []
      this.total = null
      this.skip = null
      this.limit = null
    },
    fetchIfAble() {
      // console.log('>>> fetching')
      if (this.query) {
        this.unsub()
        this.sub()
        this.init = true
      }
    },
    refresh() {
      this.reset()
      this.fetchIfAble()
    }
  },
  watch: {
    query() {
      // console.log('>>> queryset changed')
      this.refresh()
    },
  },
  mounted() {
    // console.log('>>> mounted')
    this.fetchIfAble()
  },
  render() {
    return this.$scopedSlots.default({
      stream: this.stream,
      loading: this.loading,
      refresh: this.refresh,
      paginated: this.paginated,
      ...this.pagination
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
import utils from './../utils.js' 

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

// Given a queryset
//   for each stream:
//     copy streamName into this.streams w/ boilerplate objects as values
//     if value is String, turn into Object with the String value as the endpoint
//     if no endpoint, set endpoint to stream name
//     create CRUD methods
//     subscribe to the endpoint
//       take into account query and pagniate, if present
//       store subscriptions in this.subs
//       store fetched data in this.raw
//     after data arrives, init post-processing 
//       filter
//       sort
//       store result in this.streams[streamName].data
//     resolve joins if able
//   then build up the output data

// function data(obj) {
//   return () => obj
// }

// {
//   props: {
//     queryset: Object,
//   },
//   data({
//     subs: {},
//     watchers: {},
//     raw: {},
//     processed: {},
//     joined: {},
//     streams: {},
//   }),
//   watch: {
//     queryset: {
//       handler: reset(),
//       immediate: true
//     }
//   },
//   methods: {
//     reset() {
//       this.teardown()
//       this.setup()
//     },
//     this.setup() {
//       toArray(this.queryset, 'streamName')
//         .map(streamify)
//         .map(createStream)
//         .map(registerStream)
//         .map(addCrudMethods)
//         .map(createRawData)
//         .map(createRawDataWatcher) // Creates next data struct
//         .map(createProcessedData)
//         .map(createProcessedDataWatcher) // Creates next data struct
//         .map(createJoinedData)
//         .map(createJoinedDataWatcher) // Creates output data struct
//         .map(createStream)
//         .map(registerStream)
//         .map(createSubscriber)
//         .map(subscribe)
//     },
//     this.teardown() {
//       this.subs
//         .map(unsubscribe)
//       this.subs = {}
//       this.watchers
//         .map(unwatch)
//       this.watchers = {}
//     },
//   },
//   render() {
//     let output = {}
//     for (let [streamName, stream] of Object.entries(this.streams)) {
//       output[streamName] = stream
//     }
//     return this.$scopedSlots.default(output)
//   },
// }

// input

// queryset = {
//     streamName: {
//         endpoint: '', // defaults to streamName
//         query: {},
//         paginate: {},
//         filter: [filterFunction, filterFunction2...],
//         sort: [filterFunction, filterFunction2...],
//         join: {
//           streamName: joinFunction(fk, pk),
//           streamName2...,
//         },
//         solo, // if truthy, return only the first element of the stream
//     }
// }

// output

// streams = {
//     streamName: {
//         endpoint: '',
//         paginate: {}, // not present if queryset param solo is toggled
//         loading: true,
//         resolved: true, // only if there are joins
//         data: [],
//         create(),
//         update(),
//         delete(),
//     }
// }

const components = require('./components.js')

module.exports = {
  install: (Vue, options) => {
    Vue.prototype.$F = options.feathersClient
    Vue.component('observable-object', components.ObservableObject)
    Vue.component('observable-stream', components.ObservableStream)
    Vue.component('feathers-stream', components.FeathersStream)
  },
}
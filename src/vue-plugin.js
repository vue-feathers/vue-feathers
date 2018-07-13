const components = require('./components.js')

module.exports = {
  install: (Vue, options) => {
    Vue.prototype.$F = options.feathersClient
    Vue.component('feathers-observable', components.FeathersObservable)
    Vue.component('feathers-stream', components.FeathersObservableStream)
  },
}
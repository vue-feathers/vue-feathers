const components = require('./components.js')

module.exports = {
  install: (Vue, options) => {
    Vue.prototype.$F = options.feathersClient
    Vue.component('feathers-data', components.FeathersData)
    Vue.component('feathers-stream', components.FeathersStream)
  },
}
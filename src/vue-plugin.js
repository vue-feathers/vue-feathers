import components from './components.js'

export default (Vue, options) => {
  Vue.prototype.$F = options.feathersClient
  Vue.component('feathers-stream', components.FeathersStream)
}
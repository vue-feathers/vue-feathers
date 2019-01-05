import components from './components.js'

export default (Vue, options) => {
  Vue.prototype.$F = options.feathersClient
  Vue.component('observable-object', components.ObservableObject)
  Vue.component('observable-stream', components.ObservableStream)
}
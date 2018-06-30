module.exports = {
  install: (Vue, options) => {
    Vue.prototype.$F = options.feathersClient
  },
}
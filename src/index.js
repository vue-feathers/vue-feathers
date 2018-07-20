const plugin = require('./vue-plugin.js')
const _mixins = require('./mixins.js')

export const VueFeathers = plugin
export const mixins = _mixins

export default {
  VueFeathers: plugin,
  mixins,
}

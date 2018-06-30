<template>
  <div id="app" style="display: flex; flex-direction: column; align-items: center;">
    <img src="./assets/logo.png">
    <span v-for="meta in metas" :key="meta.id">
      {{meta}}
    </span>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  components: {
    HelloWorld
  },
  data() {
    return {
      metas: [],
    }
  },
  mounted() {
    this.$F.service('meta').find()
      .then(metas=>{this.metas = metas})
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

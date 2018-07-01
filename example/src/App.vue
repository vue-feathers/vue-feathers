<template>
  <div id="app" style="display: flex; flex-direction: column; align-items: center;">
    <h1>Meta Objects</h1>
    <feathers-stream :endpoints="['meta']">
      <div slot-scope="{data}">
        <div v-for="meta in data.meta" :key="meta.id">
          <pre style="text-align:left;">{{meta}}</pre>
        </div>
      </div>
    </feathers-stream>
  </div>
</template>

<script>
export default {
  name: 'app',
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

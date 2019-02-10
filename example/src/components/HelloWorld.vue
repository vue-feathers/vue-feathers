<template>
  <div class="hello">
    
    <observable-stream paginated endpoint="notions" :query="{ }">
      <div slot-scope="{ stream, loading, refresh, pagination }">
        <h1>ObservableStream</h1>
        <h2 @click="refresh">Loading: {{loading}} (click to refresh)</h2>
        <h2 style="text-align: left; margin: auto; width: fit-content;"><pre>{{ pagination }}</pre></h2>
        <h2 style="text-align: left; margin: auto; width: fit-content;"><pre>{{ stream }}</pre></h2>
      </div>
    </observable-stream>
    
    <observable-streams :queryset="{ notions: {} }">
      <div slot-scope="{ notions }">
        <h1>ObservableStreams</h1>
        <h2 style="text-align: left; margin: auto; width: fit-content;"><pre>{{ notions }}</pre></h2>
      </div>
    </observable-streams>
  
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

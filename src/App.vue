<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import DevicePixelRatio from "./util/devicePixelRatio";

  export default {
    name: 'App',
    created() {
      new DevicePixelRatio().init();
    }
  }
</script>

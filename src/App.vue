<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
  export default {
    mounted() {
      // let link = document.createElement('link')
      // link.rel = 'stylesheet'
      // link.href = 'http://' + '10.10.0.147:8000' + '/api/file/getFile/cdn/Cesium/Widgets/widgets.css'
      // document.getElementsByTagName('head')[0].appendChild(link)
      // let script = document.createElement('script')
      // script.type = 'text/javascript'
      // script.src = 'http://' + '10.10.0.147:8000' + '/api/file/getFile/cdn/Cesium/Cesium.js'
      // document.getElementsByTagName('head')[0].appendChild(script)
    }
  }
</script>

<style lang="less">
  @import '~ant-design-vue/dist/antd.less';
  @import "styles/main.less";

  html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }
  *{
    margin: 0;
    padding: 0;
  }

  #app {
    width: 100%;
    height: 100%;
  }


</style>

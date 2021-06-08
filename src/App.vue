<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
  export default {
    mounted() {
      this.$electron.on('gotoWhere', (event, message) => {
        // console.log(message)
        if (message === "数据管理") {
          this.gotoData()
          return
        }
        if (message === "训练管理") {
          this.gotoTrain()
          return
        }

      })
    },
    methods: {
      gotoData() {
        this.$store.commit("SET_DATAFILESTATUS", true)
        setTimeout(() => {
          this.$router.push('/data')
        }, 1000)

      },
      gotoTrain() {
        this.$store.commit("SET_DATATRAINSTATUS", true)
        setTimeout(() => {
          this.$router.push('/marking')
        }, 1000)
      }
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

  * {
    margin: 0;
    padding: 0;
  }

  #app {
    width: 100%;
    height: 100%;
  }


</style>

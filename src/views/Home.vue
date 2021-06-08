<template>
  <div class="home layout-center"
       :style="{'background-color':$publicConfig.backgroundColor}">
    <div style="width:500px;height:400px;">
      <img
        src="../assets/img/login.png"
        alt=""
        style="width: 100%;height: auto;"
      >
    </div>
  </div>
</template>

<script>
  // @ is an alias to /src


  export default {
    name: 'Home',
    components: {},
    data() {
      return {
        showFlag: true
      }
    },
    created() {
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

<style lang="less" scoped>
  .home {
    width: 100%;
    height: 100%;
  }
</style>

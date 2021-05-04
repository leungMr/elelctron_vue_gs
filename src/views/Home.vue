<template>
  <div class="home layout-center"
       :style="{'background-color':$publicConfig.backgroundColor}">
    <div style="width: 500px;height: 400px;" class="layout-left-top"
    >
      <div
        style="width:150px;height: 80px;border: 1px solid #000;border-radius: 10px;font-size: 20px;margin: 20px;cursor: pointer;position: relative;"
        class="layout-center"
        @click="gotoData"
      >
        数据管理
        <a-spin :spinning="$store.getters.dataFileStatus"></a-spin>
      </div>
      <div
        style="width:150px;height: 80px;border: 1px solid #000;border-radius: 10px;font-size: 20px;margin: 20px;cursor: pointer;"
        class="layout-center"
        @click="gotoTrain"
      >
        训练管理
      </div>

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
        this.$router.push('/data')
      },
      gotoTrain() {
        this.$router.push("/marking")
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

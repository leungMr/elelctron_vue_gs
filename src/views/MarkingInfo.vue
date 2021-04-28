<template>
  <div
    style="width: 100%;height: 100%;"
    :style="{'background-color':$publicConfig.backgroundColor}"
  >
    <div style="width: 100%;height: 40px;border-bottom: 1px solid #d9d9b7"
         class="layout-side">
      <span style="margin-left: 10px;font-size: 16px;">训练详情</span>
      <a-icon type="home" style="font-size: 20px;margin-right: 20px;" @click="$router.push('/home')"/>
    </div>
    <!--主题区域S-->
    <div style="width: 100%;height: calc(100% - 40px);padding-top: 2px;" class="layout-side">
      <div style="width: 500px;background-color: #5e716c;height: 100%;"></div>
      <div style="width: calc(100% - 500px);"></div>
    </div>
    <!--主题区域E-->
  </div>
</template>
<script>
  export default {
    data() {
      return {
        trainInfo: [],
      }
    },
    mounted() {
      this.initTheTrainInfo()
    },
    methods: {
      initTheTrainInfo() {
        let examDesignId = this.$route.query.examDesignId
        // 这是同步
        let thetrainInfo = this.$electron.sendSync('getTrainInfo_', examDesignId)
        this.trainInfo = thetrainInfo._doc
        let toputoNodes = JSON.parse(this.trainInfo.toputoNodes)
        console.log(toputoNodes)
        console.log(this.trainInfo)

      }
    }
  }
</script>
<style scoped lang="less"></style>
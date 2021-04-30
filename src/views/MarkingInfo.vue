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
    <!--主体区域S-->
    <div style="width: 100%;height: calc(100% - 40px);padding-top: 2px;" class="layout-side">
      <!--左S-->
      <div style="width:calc(100% - 250px - 10px);height: 100%;border-right: 1px solid rgba(0, 0, 0, 0.2);box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);">
        <div style="width: 100%;height: 100%;">
          <TopotuDisplay
            ref="topotuDisplay"
          ></TopotuDisplay>
        </div>
      </div>
      <!--左E-->
      <!--右S-->
      <div style="width: 250px;height: 100%;">
        <ExameRightList></ExameRightList>
      </div>
      <!--右E-->
    </div>
    <!--主体区域E-->
  </div>
</template>
<script>
  import TopotuDisplay from './template/TopotuDisplay'
  import ExameRightList from "./template/ExameRightList";
  export default {
    data() {
      return {
        trainInfo: [],
      }
    },
    mounted() {
      this.initTheTrainInfo()
    },
    components:{
      TopotuDisplay,
      ExameRightList
    },
    methods: {
      // 初始化考试详情
      initTheTrainInfo() {
        let examDesignId = this.$route.query.examDesignId
        // 这是同步
        let thetrainInfo = this.$electron.sendSync('getTrainInfo_', examDesignId)
        this.trainInfo = thetrainInfo._doc
        console.log(this.trainInfo)

      },
      // 初始化拓扑图
      initTuoputo(){
        this.$nextTick(() => {
          this.$refs.topotuDisplay.showNipEditor2(JSON.parse(this.nodesArr.toputoNodes))
        })
      }


    }
  }
</script>
<style scoped lang="less"></style>
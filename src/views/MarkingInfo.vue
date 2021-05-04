<template>
  <div
    style="width: 100%;height: 100%;"
    :style="{'background-color':$publicConfig.backgroundColor}"
  >
    <div style="width: 100%;height: 40px;border-bottom: 1px solid #d9d9b7"
         class="layout-side">
      <span style="margin-left: 10px;font-size: 16px;">{{trainInfo.trainingTitleName}}
        <a-icon type="info-circle" style="margin-left: 0px;" @click="$refs.markingInfoModal.isShowTrainDetail = true"/>
      </span>
      <a-icon type="rollback" style="font-size: 20px;margin-right: 20px;" @click="$router.push('/marking')"/>
    </div>
    <!--主体区域S-->
    <div style="width: 100%;height: calc(100% - 40px);padding-top: 2px;" class="layout-side">
      <!--左S-->
      <div
        style="width:calc(100% - 250px - 10px);height: 100%;border-right: 1px solid rgba(0, 0, 0, 0.2);box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);">
        <div style="width: 100%;height: 100%;">
          <!--左上S-->
          <div style="width: 100%;height: calc(100% - 60px);">
            <TopotuDisplay
              ref="topotuDisplay"
            ></TopotuDisplay>
          </div>
          <!--左上E-->
          <!--左下S-->
          <div style="width: 100%;height: 60px;overflow: hidden;">
            <DataPlayer @timeEcho="timeEcho"
                        @progressNotification="progressNotification"
                        :duration="duration"
                        ref="datapalyer"
                        style="bottom: 0;z-index: 1000;">
            </DataPlayer>
          </div>
          <!--左下E-->
        </div>
      </div>
      <!--左E-->
      <!--右S-->
      <div
        style="width: 250px;height: 100%;border-left: 1px solid rgba(0, 0, 0, 0.2);box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);">
        <ExameRightList></ExameRightList>
      </div>
      <!--右E-->
    </div>
    <!--主体区域E-->
    <MarkingInfoModal :trainInfo="trainInfo" ref="markingInfoModal"></MarkingInfoModal>
  </div>
</template>
<script>
  import TopotuDisplay from "./template/TopotuDisplay"
  import ExameRightList from "./template/ExameRightList"
  import DataPlayer from "./template/DataPlayer"
  import MarkingInfoModal from "./template/MarkingInfoModal"
  import {getTimeDuration} from "./config/tool"

  export default {
    data() {
      return {
        // 考试所有信息
        trainInfo: [],
        // 时间进度条长度
        duration: 1,
      }
    },
    async mounted() {
      let getTrainInfo = await this.initTheTrainInfo()
      if (getTrainInfo.status === 0) {
        this.$message.error("数据库错误")
        return
      } else {
        this.trainInfo = getTrainInfo.data
        console.log(this.trainInfo)
      }
      // 初始化拓扑图
      this.initTuoputo(JSON.parse(this.trainInfo.toputoNodes))
      // 初始化时间组件
      this.initDataPlayerTime(this.trainInfo.beginTime, this.trainInfo.endTime)
    },
    components: {
      TopotuDisplay,
      ExameRightList,
      DataPlayer,
      MarkingInfoModal
    },
    methods: {
      // 初始化时间组件
      initDataPlayerTime(time1, time2) {
        this.duration = getTimeDuration(time1, time2)
      },
      // 开始播放执行一次 结束播放也要执行一次
      progressNotification(e) {
        // code: 0,explain: "开始"
        // 1-----暂停
        // 2-----继续
        // console.log(e)
      },
      timeEcho(e) {
      },
      // 初始化考试详情
      initTheTrainInfo() {
        return new Promise((resolve, reject) => {
          let examDesignId = this.$route.query.examDesignId
          // 这是同步
          let thetrainInfo = this.$electron.sendSync('getTrainInfo_', examDesignId)
          if (thetrainInfo.status === 1) {
            resolve(
              {
                status: 1, data: thetrainInfo.data._doc
              }
            )
          } else {
            reject(
              {
                status: 0, data: thetrainInfo.data
              }
            )
          }
        })

      },
      // 初始化拓扑图
      initTuoputo(data) {
        this.$nextTick(() => {
          this.$refs.topotuDisplay.showNipEditor2(data)
        })
      }


    }
  }
</script>
<style scoped lang="less"></style>
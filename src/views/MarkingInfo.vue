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
        style="width:calc(100% - 250px - 10px);height: 100%;border-right: 1px solid rgba(0, 0, 0, 0.2);box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);overflow: hidden;">
        <div style="width: 100%;height: 100%;position: relative;">
          <!--左上S-->
          <div style="width: 100%;height: calc(100% - 60px);position:relative;padding-left: 4px;">
            <CesiumMaps ref="cesiumMaps"></CesiumMaps>
            <VoiceControl
              ref="voiceControl"
            ></VoiceControl>
          </div>
          <!--左上E-->
          <!--左下S-->
          <div
            style="width: 100%;height: 60px;position: absolute;left: 0;bottom: 0;"
            class="layout-center  800"
          >
            <DataPlayer @timeEcho="timeEcho"
                        @progressNotification="progressNotification"
                        :duration="duration"
                        ref="datapalyer"
                        style="bottom: 0;z-index: 1000;">
            </DataPlayer>
            <!--通话锚点S-->
            <div style="width: calc(100% - 140px);height: 100px;background-color: red;position: relative;z-index:1001;">
              <template v-for="(item,index) in poneNodes">
                <!--锚点S-->
                <div
                  style="position: absolute;width: 8px;height: 8px;border-radius: 50%;background-color: #DD4A68;bottom: 142px;"
                  :style="{'left':item.left}"
                  :key="index"
                  @mouseover="mouseoverMaodian(item.left)"
                  @mouseout="mouseleavessssMaodian(item.left)"
                ></div>
                <!--锚点E-->
                <!--内容S-->
                <div
                  style="position: absolute;width: 120px;height: 50px;background-color: rgba(0,0,0,0.5);transform: translateX(-60px);color:#DD4A68;font-size: 13px;padding-left: 3px;border-radius: 5px;bottom: 155px;"
                  :style="{'left':item.left}"
                  :key="index+ 'w'"
                  v-show="item.isShow"
                >
                  <span>{{item.content.call}}</span>
                  与
                  <span v-for="(ele,index2) in item.content.byCall" :key="index2">【{{ele}}】</span>
                  通话
                </div>
                <!--内容E-->
              </template>
            </div>
            <!--通话锚点E-->
          </div>

          <!--左下E-->
        </div>
      </div>
      <!--左E-->
      <!--右S-->
      <div
        style="width: 250px;height: 100%;border-left: 1px solid rgba(0, 0, 0, 0.2);box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);">
        <ExameRightList ref="exameRightList"></ExameRightList>
      </div>
      <!--右E-->
    </div>
    <!--主体区域E-->
    <MarkingInfoModal :trainInfo="trainInfo" ref="markingInfoModal"></MarkingInfoModal>
  </div>
</template>
<script>
  import ExameRightList from "./template/ExameRightList"
  import DataPlayer from "./template/DataPlayer"
  import MarkingInfoModal from "./template/MarkingInfoModal"
  import {getTimeDuration} from "./config/tool"
  import CesiumMaps from "../views/template/CesiumMaps"
  import VoiceControl from "@/views/template/VoiceControl"
  import moment from 'moment'

  export default {
    data() {
      return {
        // 考试所有信息
        trainInfo: [],
        // 时间进度条长度
        duration: 1,
        // 全时间实时信息
        allRealTimeData: [],
        // 时间段实时信息
        pointRealTimeData: [],
        // 人员设置关联数组
        deviceAndUserArr: [],
        // 通话锚点S
        poneNodes: [
          {
            left: '0%',
            content: {
              call: "张三",
              byCall: ["李四", "王麻子"]
            },
            isShow: false
          },
          {
            left: '50%',
            content: {
              call: "张五",
              byCall: ["李六", "王小二"]
            },
            isShow: false

          },
          {
            left: '100%',
            content: {
              call: "张五",
              byCall: ["李六", "王小二"]
            },
            isShow: false

          }
        ]
        // 通话锚点E
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
      // 初始化时间组件
      this.initDataPlayerTime(this.trainInfo.beginTime, this.trainInfo.endTime)
      // 初始化人员设备关联数组
      this.deviceAndUserArr = this.getUserAndDevice(this.trainInfo.trainingDesignRelevanceList)
      // 初始化所有的实时操作信息
      this.getAllRealTimeData(this.trainInfo)

      this.$nextTick(() => {
        // 初始化设备位置
        this.$refs.cesiumMaps.initDeviceLocation(this.trainInfo)
        // 初始化设备音量
        this.$refs.voiceControl.initAllDeviceVoice(this.deviceAndUserArr, this.trainInfo.examDesignId)
      })


    },
    components: {
      ExameRightList,
      DataPlayer,
      MarkingInfoModal,
      CesiumMaps,
      VoiceControl
    },
    methods: {
      mouseoverMaodian(left) {
        this.poneNodes.forEach(item => {
          if (item.left === left) {
            item.isShow = true
          }
        })
      },
      mouseleavessssMaodian(left) {
        this.poneNodes.forEach(item => {
          if (item.left === left) {
            item.isShow = false
          }
        })
      },
      // 初始化时间组件
      initDataPlayerTime(time1, time2) {
        this.duration = getTimeDuration(time1, time2)
      },
      // 根据时间戳判断当前传给右边进行渲染的有哪些信息
      getPointTimeData(timeEcho) {
        this.pointRealTimeData = this.allRealTimeData.filter(item => {
          let duration = moment(item.time).diff(moment(this.trainInfo.beginTime), 'seconds')
          if (duration <= timeEcho) {
            return item
          }
        })
        // 渲染实时信息组件
        this.$refs.exameRightList.getRealTimeData(this.pointRealTimeData)
        // 渲染地图
        this.$refs.cesiumMaps.getRealTimeData(this.pointRealTimeData)
      },
      // 开始播放执行一次 结束播放也要执行一次
      progressNotification(e) {
        // code: 0,explain: "开始"
        // 1-----暂停
        // 2-----继续
        // console.log(e)
        // console.log(e.explain)
        this.$message.info(e.explain)
        // 点击之后刚好开始
        if (e.explain === "开始" || e.explain === "继续") {
          this.$refs.voiceControl.timeEchoStart()
        }
        if (e.explain === "暂停") {
          this.$refs.voiceControl.timeEchoPause()
        }
      },
      // 当前的时间戳,一秒一秒的
      timeEcho(e) {
        // 组装右边实时信息
        this.getPointTimeData(e)
        // 同步音频播放进度
        this.$refs.voiceControl.getMp3PlayProcess(e)
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
      // 获取人员与设备绑定的数组
      getUserAndDevice(data) {
        let deviceAndUserArr = []
        for (let i of data) {
          for (let j of i.netList) {
            j.id = j.equipmentUnit.deviceCode
            let obj = {
              username: j.examineUser.userEntity.name,
              userId: j.examineUser.userEntity.militaryId,
              deviceName: j.equipmentUnit.equipmentName,
              deviceId: j.equipmentUnit.deviceCode,
            }
            deviceAndUserArr.push(obj)
          }
        }
        return deviceAndUserArr
      },
      getAllRealTimeData(data) {
        // 在这里要把设备id转化为人员名字
        // 组装通话=========================
        this.allRealTimeData = []
        if (data.communications && data.communications.length > 0) {
          data.communications.forEach(item => {
            // 过滤考试未开始的数据
            if (moment(item.time).diff(moment(this.trainInfo.beginTime), 'seconds') < 0) {
              return
            }
            let obj = {}
            // 通用
            obj.status = "业务通信"
            // 通用
            obj.mainId = this.deviceIdToUser(item.deviceId)
            // 通用
            obj.time = item.time
            // 通用
            obj.mainDeviceId = item.deviceId
            obj.deviceIdWith = item.deviceIds
            obj.idWith = this.deviceArrToUserArr(item.deviceIds)

            this.allRealTimeData.push(obj)
          })
        }
        // 组装组网=========================
        if (data.equipmentNetworking && data.equipmentNetworking.length > 0) {
          data.equipmentNetworking.forEach(item => {
            // 过滤考试未开始的数据
            if (moment(item.timeOr).diff(moment(this.trainInfo.beginTime), 'seconds') < 0) {
              return
            }
            let obj = {}
            // 通用
            obj.status = "组网"
            // 通用
            obj.mainId = this.deviceIdToUser(item.networkingId)
            // 通用
            obj.time = item.timeOr
            // 通用
            obj.mainDeviceId = item.networkingId
            obj.deviceIdWith = item.networkIdWith
            obj.idWith = this.deviceArrToUserArr(item.networkIdWith)

            this.allRealTimeData.push(obj)
          })
        }

        // 组装设备上下线=========================
        if (data.trainingDesignStateUpAndDowns && data.trainingDesignStateUpAndDowns.length > 0) {
          data.trainingDesignStateUpAndDowns.forEach(item => {
            // 过滤考试未开始的数据
            if (moment(item.beginTime).diff(moment(this.trainInfo.beginTime), 'seconds') < 0) {
              return
            }
            let obj = {}
            obj.status = "设备状态"
            obj.mainId = this.deviceIdToUser(item.deviceId)
            obj.time = item.beginTime
            obj.state = item.upAndDownState
            this.allRealTimeData.push(obj)
          })
        }
        // 汇总排序
        this.allRealTimeData = this.sortArrByTime(this.allRealTimeData)
        // console.log(this.allRealTimeData)
      },
      // 根据时间排序数组
      sortArrByTime(arr) {
        arr.sort(function (a, b) {
          if (new Date(a.time) > new Date(b.time)) {
            return -1;
          } else if (new Date(a.time) < new Date(b.time)) {
            return 1;
          }
          return 0;
        })
        return arr
      },
      // 设备id数组转人员数组
      deviceArrToUserArr(arr) {
        if (arr.length === 0) {
          return []
        }
        let arr2 = []
        arr.forEach(item => {
          this.deviceAndUserArr.forEach(ele => {
            if (item === ele.deviceId) {
              arr2.push(ele.username)
            }
          })
        })
        return arr2
      },
      // 设备id转人员名字
      deviceIdToUser(id) {
        let name
        this.deviceAndUserArr.forEach(ele => {
          if (id === ele.deviceId) {
            name = ele.username
          }
        })
        return name
      },


    }
  }
</script>
<style scoped lang="less"></style>
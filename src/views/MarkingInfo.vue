<template>
  <div
    style="width: 100%;height: 100%;padding: 10px;overflow: hidden;"
    :style="{'background-color':$publicConfig.backgroundColor}"
  >
    <!--总中S-->
    <div style="width: 100%;height: calc(100% - 0px - 60px);padding-top: 2px;" class="layout-side">
      <!--中左S-->
      <div
        style="height: 100%;width: 250px;border-right: 1px solid rgba(0, 0, 0, 0.2);box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);">
        <div style="width: 100%;height: 40px;padding: 0 10px;" class="layout-side bor-b">
          <a-icon type="rollback" style="font-size: 20px;" @click="$router.push('/marking')"></a-icon>
          <span style="font-size: 20px;">{{trainInfo.trainingTitleName}}</span>
          <a-icon type="info-circle" style="font-size: 20px;"
                  @click="$refs.markingInfoModal.isShowTrainDetail = true"></a-icon>
        </div>
        <div style="width:100%;height: 220px;" class="bor-b layout-center-top">
          <span style="margin-top:15px;margin-bottom:10px;font-size:16px;">训练计时</span>
          <CountDown
            ref="count1"
            color="#FFEEBB"
            :active="true">
          </CountDown>
          <span style="font-size:16px;margin-bottom:10px;">阶段计时</span>
          <CountDown
            ref="count2"
            color="#FFEEBB"
            :active="true">
          </CountDown>
        </div>
        <div style="height:10px;"></div>
        <div style="width: 100%;height: 40px;padding: 0 10px;" class="layout-center   bor-b">
          <span style="font-size: 16px;">人员设备</span>
        </div>
        <div style="width:100%;height: calc(100% - 80px - 220px - 10px);overflow: auto;">
          <PeopleAndDevice ref="peopleAndDevice"></PeopleAndDevice>
        </div>

      </div>
      <!--中左E-->
      <!--中中S-->
      <div
        style="width:calc(100% - 250px - 10px - 250px - 10px);height: 100%;border-right: 1px solid rgba(0, 0, 0, 0.2);box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);">
        <div style="width: 100%;height: 100%;position: relative;">
          <div style="width: 100%;height: calc(100% - 0px);position:relative;">
            <CesiumMaps ref="cesiumMaps"></CesiumMaps>
            <VoiceControl
              ref="voiceControl"
            ></VoiceControl>
            <OperationControl ref="operationControl"></OperationControl>
          </div>
        </div>
      </div>
      <!--中中E-->
      <!--中右S-->
      <div
        style="width: 250px;height: 100%;border-left: 1px solid rgba(0, 0, 0, 0.2);box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);">
        <ExameRightList ref="exameRightList"></ExameRightList>
      </div>
      <!--中右E-->
    </div>
    <!--总中E-->
    <!--总下S-->
    <div style="width: 100%;height: 60px;">
      <div
        style="width: 100%;height: 60px;position: relative;"
        class="layout-center  800"
      >
        <DataPlayer @timeEcho="timeEcho"
                    @progressNotification="progressNotification"
                    :duration="duration"
                    ref="datapalyer"
                    style="bottom: 0;z-index: 1000;">
        </DataPlayer>
        <!--通话锚点S-->
        <div
          style="width: calc(100% - 140px);height: 100px;background-color: transparent;position: relative;z-index:1001;">
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
    </div>
    <!--总下E-->
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
  import CountDown from "./template/CounDown"
  import PeopleAndDevice from "./template/PeopleAndDevice"
  import OperationControl from "@/views/template/OperationControl";
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
        // 通话锚点
        poneNodes: []
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
        // 初始化人员设备信息,这是一个数组,里面装的考试的组信息
        this.initDeviceAndPeople(this.trainInfo.trainingDesignRelevanceList)
      })
    },
    components: {
      ExameRightList,
      DataPlayer,
      MarkingInfoModal,
      CesiumMaps,
      VoiceControl,
      CountDown,
      PeopleAndDevice,
      OperationControl
    },
    methods: {
      // 初始化人员设备组件
      initDeviceAndPeople(e) {
        // console.log(e)
        e.forEach(item => {
          item.netList.forEach(ele => {
            // 可变值S
            ele.deviceState = ""
            // 离线
            ele.userState = "1"
            // 可变值E
            ele.deviceId = ele.examineUser.deviceId
            ele.militaryId = ele.examineUser.userEntity.militaryId
            ele.userId = ele.examineUser.userId
            ele.devicename = ele.equipmentUnit.deviceCode
            ele.equiTitle = ele.equipmentUnit.equipmentName
            ele.deviceImg = ele.equipmentUnit.equipmentType.faceBase64
            ele.username = ele.examineUser.userEntity.name
            ele.userImg = ele.examineUser.userEntity.faceBase64
            ele.subject = ele.subject
            // ele.relationTemplateEntity = ele.relationTemplateEntity
            // ele.secondRelation = ele.secondRelation
            // ele.seatIndex = ele.seatIndex
            // ele.equipmentAlias = ele.equipmentAlias
          })
        })
        this.$refs.peopleAndDevice.resolveData(e)
        // e就是楼下这位家伙,所以楼下这位家伙也会被改变
        // console.log(this.trainInfo.trainingDesignRelevanceList)
      },
      // 根据时间处理人员设备组件
      // this.trainInfo.trainingDesignRelevanceList作为第二个参数也会自动被改变
      handelDeviceAndPeopleByTime(pointRealTimeData, currentGroupInfo) {
        let pointRealTimeData2 = JSON.parse(JSON.stringify(pointRealTimeData))
        // 反转这样会改变原数组
        pointRealTimeData2.reverse()
        if (pointRealTimeData2.length === 0) {
          // 全部变为离线
          this.initDeviceAndPeople(currentGroupInfo)
          return
        }
        pointRealTimeData2.forEach(item => {
          if (item.status === "设备状态") {
            currentGroupInfo.forEach(ele => {
              ele.netList.forEach(uu => {
                if (uu.devicename === item.mainDeviceId) {
                  uu.deviceState = item.state
                }
              })
            })
          }
        })
        this.$refs.peopleAndDevice.resolveData(currentGroupInfo)
      },

      // 处理卫勤各个阶段时间的展示
      handleStageTime(e) {
        // 节点开始和结束信息需要查另外一张表
        // console.log(e)
      },
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
        // 渲染右侧实时信息组件
        this.$refs.exameRightList.getRealTimeData(this.pointRealTimeData)
        // 渲染左侧人员组件
        this.handelDeviceAndPeopleByTime(this.pointRealTimeData, this.trainInfo.trainingDesignRelevanceList)
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
        // 训练计时
        this.$refs.count1.autoSetTime(e * 1000)
        // 处理阶段计时
        this.handleStageTime(e)
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
          // 得到所有的通话节点
          this.getPhoneNodes(data.communications)
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
            obj.mainDeviceId = item.deviceId
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
      // 得到所有的通话节点
      getPhoneNodes(data) {
        this.poneNodes = []
        data && data.forEach(item => {
          // 前提是得与人通话而不是退出通话
          if (item.deviceIds.length === 0) return
          let obj = {
            content: {
              call: '',
              byCall: []
            }
          }
          // 通话点距离开始时间的秒数
          let spotDuration = moment(item.time).diff(moment(this.trainInfo.beginTime), 'seconds')
          obj.left = (spotDuration / this.duration).toFixed(4) * 100 + '%'
          obj.content.call = this.deviceIdToUser(item.deviceId)
          obj.content.byCall = this.deviceArrToUserArr(item.deviceIds)
          obj.isShow = false
          this.poneNodes.push(obj)
        })
        // console.log(this.poneNodes)
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
      // 兄弟组件传递事件
      backStartPoint(){
        this.$refs.cesiumMaps.positionMe()
      },


    }
  }
</script>
<style scoped lang="less">
  .bor-t {
    border-top: 1px solid rgba(0, 0, 0, 0.2);
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
  }

  .bor-b {
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
  }

  .bor-l {
    border-left: 1px solid rgba(0, 0, 0, 0.2);
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
  }

  .bor-r {
    border-right: 1px solid rgba(0, 0, 0, 0.2);
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
  }
</style>
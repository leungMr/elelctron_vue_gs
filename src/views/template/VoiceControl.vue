<template>
  <div
    style="width: 200px;height: 400px;position: absolute;left: 4px;top: 10%;"
  >
    <div style="width: 100%;height: 100%;">
      <div
        class="disturb"
        v-if="openDisturb"
        style="width:30px;height: 35px;"
      >
        <a-tooltip>
          <template slot="title">
            展开音量操作框
          </template>
          <a-icon @click="openDisturb=false" style="font-size: 25px;line-height: 25px;color: #fff" type="right"/>
        </a-tooltip>
      </div>
      <div
        class="closes"
        v-else
        style="width: 100%;height: 100%;"
      >
        <div style="width: 30px;height:35px;margin-left:5px">
          <a-tooltip>
            <template slot="title">
              关闭操作框
            </template>
            <a-icon @click="openDisturb=true" style="font-size: 25px;line-height: 30px;color: #fff" type="left"/>
          </a-tooltip>
        </div>
        <div style="width: 100%;height:calc(100% - 35px);">
          <div class="layout-left-center" v-for="(item,index) in allDeviceVoiceArr" :key="index"
               style="width: 100%;margin: 0px 10px;height: 40px;">
            <div style="margin-right: 10px;width: 60px;">{{item.username}}</div>
            <a-switch
              :checked="item.isVoice"
              @change="controlItemVoiveChange(item)"
              :disabled="!item.audioUrl"
            />
          </div>
        </div>
      </div>
      <!--音频S-->
      <div style="width: 100%;height: 500px;overflow: hidden;display: none;">
        <audio
          v-for="(item,index) in allDeviceVoiceArr"
          :key="index"
          :src="item.audioUrl"
          controls
          :ref="item.deviceId+'audio'"></audio>
      </div>
      <!--音频E-->
    </div>

  </div>
</template>


<script>
  export default {
    data() {
      return {
        openDisturb: true,
        allDeviceVoiceArr: [],
      }
    },
    mounted() {

    },
    methods: {
      // 拿给父组件调用
      // 初始化音量控制以及初始化音频 他们是用同一个数组来渲染的
      async initAllDeviceVoice(deviceAndUserArr, examDesignId) {
        let allMp3FilesById = await this.getAllMp3FilesById(examDesignId)
        // console.log(allMp3FilesById)
        this.allDeviceVoiceArr = []
        deviceAndUserArr.forEach(item => {
          let obj = JSON.parse(JSON.stringify(item))
          obj.isVoice = true
          allMp3FilesById.deviceArr.forEach(uu => {
            if (uu.indexOf(obj.deviceId) !== -1) {
              obj.audioUrl = uu
            }
          })
          this.allDeviceVoiceArr.push(obj)
          // 等标签渲染完
          this.$nextTick(() => {
            this.$refs[obj.deviceId + 'audio'][0].src = obj.audioUrl
            this.$refs[obj.deviceId + 'audio'][0].load()
            // 暂停播放 点击进度开始时才开始播放
            this.$refs[obj.deviceId + 'audio'][0].pause()
            // 初始化音量
            // 有没有声音是通过控制音量来实现的 而不是暂停
            // 一来声音全开,音量应当为1
            this.$refs[obj.deviceId + 'audio'][0].volume = 1
          })
        })
      },
      // 拿给父组件调用 时间组件点击开始
      // 始终保持几个音频文件同步播放
      timeEchoStart() {
        this.allDeviceVoiceArr.forEach(item => {
          // 浏览器自动播放的Bug 需要去浏览器设置允许一下
          this.$refs[item.deviceId + 'audio'][0].play().catch(err=>{
            // console.log(err)
          })
        })
      },
      timeEchoPause() {
        this.allDeviceVoiceArr.forEach(item => {
          this.$refs[item.deviceId + 'audio'][0].pause()
        })
      },
      // 父组件根据时间戳同步音频播放进度 防止音频拖动
      getMp3PlayProcess(e) {
        this.allDeviceVoiceArr.forEach(item => {
          this.$refs[item.deviceId + 'audio'][0].currentTime = e
        })
      },
      // 根据本场考试id,去获取本场考试的所有音频路径
      getAllMp3FilesById(id) {
        return new Promise((resolve, reject) => {
          let result = this.$electron.sendSync('getAllMp3FilesById', id)
          if (result.code === 1) {
            resolve(result.data._doc)
          } else {
            this.$message.error("数据库服务错误")
          }
        })
      },
      controlItemVoiveChange(item) {
        item.isVoice = !item.isVoice
        if (item.isVoice === true) {
          this.$refs[item.deviceId + 'audio'][0].volume = 1
        } else {
          this.$refs[item.deviceId + 'audio'][0].volume = 0
        }
      },

    }
  }
</script>

<style lang="less" scoped>
  .disturb {
    padding: 5px;
    color: rgba(255, 255, 255, 0.9);
    transition: all .2s;
    background: #235c46;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    cursor: pointer;
  }

  .closes {
    background: #235c46;
    padding: 10px;
    transition: all .2s;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  .ant-switch-checked {
    background-color: #64b51d;
  }
</style>
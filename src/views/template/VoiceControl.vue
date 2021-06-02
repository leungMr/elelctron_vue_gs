<template>
  <div
    style="width: 200px;height: 400px;position: absolute;left: 4px;top: 10%;background-color: darkseagreen;"
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
            <a-switch :checked="item.isVoice" @change="item.isVoice=!item.isVoice"/>
          </div>
        </div>
      </div>
      <!--音频S-->
      <div style="width: 100%;height: 500px;background-color: yellow;">
        <audio
          v-for="(item,index) in allDeviceVoiceArr"
          :key="index"
          src="file:///C:/Users/lenovo/Desktop/test/123%E5%89%AF%E6%9C%AC-589097132628115457-802007120002.wav"
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
      //拿给父组件调用
      initAllDeviceVoice(deviceAndUserArr, examDesignId) {
        this.allDeviceVoiceArr = []
        deviceAndUserArr.forEach(item => {
          let obj = JSON.parse(JSON.stringify(item))
          obj.isVoice = true
          this.allDeviceVoiceArr.push(obj)
        })
        console.log(this.allDeviceVoiceArr)
      },
      // 根据本场考试id,去获取本场考试的所有音频路径
      getAllMp3FilesById(id) {
        return new Promise((resolve, reject) => {
          let result = this.$electron.sendSync('getAllMp3FilesById', id)
          if (result.code === 1) {
            resolve(result.findResult)
          } else {
            reject(result)
          }
        })
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
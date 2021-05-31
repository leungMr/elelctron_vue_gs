<template>
  <div
    style="width: 100%;height: 100%;"
    :style="{'background-color':$publicConfig.backgroundColor}"
  >
    <div style="width: 100%;height: 40px;border-bottom: 1px solid #d9d9b7"
         class="layout-side">
      <span style="margin-left: 10px;font-size: 16px;">数据管理</span>
      <a-icon type="home" style="font-size: 20px;margin-right: 20px;" @click="goHome"/>
    </div>
    <!--内容区S-->
    <!--数据库文件导入S-->
    <div style="width: 100%;padding-top: 2px;">
      <a-button @click="importJsonFile('databaseFileImport')">导入数据库文件</a-button>
      <div
        style="width: 80%;min-height: 100px;border: 1px solid #d9d9b7;margin:10px auto;"
        class="layout-left-top"
      >
        <div
          style="width: 100px;height: 50px;margin: 10px;"
          class="layout-center"
          v-for="(item,index) in dumpFiles"
          :key="index"
        >
          <a-icon type="database" style="font-size: 30px;"/>
          <div style="width: 100%;text-align: center;">{{item.substring(0,item.length-5)}}</div>
        </div>
      </div>
    </div>
    <!--数据库文件导入E-->
    <div style="height: 20px;"></div>
    <!--音频文件导入S-->
    <div style="width: 100%;padding-top: 2px;">
      <a-button @click="importJsonFile('mp3FileImport')">导入音频文件</a-button>
      <div
        style="width: 80%;min-height: 100px;border: 1px solid #d9d9b7;margin:10px auto;"
        class="layout-left-top"
      >
        <div
          style="width: 100px;height: 50px;margin: 10px;"
          class="layout-center"
          v-for="(item,index) in []"
          :key="index"
        >
          <a-icon type="database" style="font-size: 30px;"/>
          <div style="width: 100%;text-align: center;">{{item.substring(0,item.length-5)}}</div>
        </div>
      </div>
    </div>
    <!--音频文件导入E-->
    <!--内容区E-->
    <!--数据导入通用S-->
    <input @change="importInformation($event)"
           id="fileInput" slot="content" style="display: none;"
           ref="fileBtn"
           multiple
           type="file"/>
    <!--数据导入通用E-->
  </div>
</template>

<script>


  export default {
    components: {},
    data() {
      return {
        // 导入的是什么类型的文件
        fileTypeImportFlag: '',
        // 展示的集合
        dumpFiles: '',
      }
    },
    created() {
    },
    mounted() {
      this.readDumpFile()
    }
    ,
    methods: {

      // 导入json文件或者音频文件,根据flag来判断
      importJsonFile(e) {
        this.fileTypeImportFlag = e
        document.getElementById("fileInput").click()
      },
      importInformation(obj) {
        const that = this
        // G:\gs_books\8.0electron\electron_gyy\static\mongodb\exportData\1.json
        // 导入数据库文件
        if (this.fileTypeImportFlag === 'databaseFileImport') {

          // 不管你导入多少个文件,我只取第一个
          if (obj.target.files[0].type !== "application/json") {
            this.$message.error("导入的文件类型错误")
            that.$refs.fileBtn.value = ''
            return
          }
          let theFilePath = obj.target.files[0].path
          let result = that.$electron.sendSync('importToLocalDataByJsonFile', {
            filePath: theFilePath
          })
          if (result.code === 1) {
            this.$message.success("重复数据已被过滤,导入数据成功")
            this.readDumpFile()
            this.fileTypeImportFlag = ''
          } else {
            this.$message.success("导入数据失败,请联系管理员")
            this.fileTypeImportFlag = ''
          }
        }
        // 导入音频文件
        else if (this.fileTypeImportFlag === 'mp3FileImport') {
          // 不管你导入多少个文件,有一个格式不为音频就重新导入
          for (let uu of obj.target.files) {
            if (uu.type !== "audio/wav") {
              this.$message.error("存在导入的文件类型错误")
              that.$refs.fileBtn.value = ''
              // 整个函数的return
              return
            }
          }
          let theFilePath = obj.target.files
          // 先去数据库查出所有的考试id
          let examToDeviceArr = []
          let allExam = that.$electron.sendSync('getInitExamData_')
          if (allExam.length === 0) {
            this.$message.error("考试数据为空,请先导入考试数据")
            that.$refs.fileBtn.value = ''
            return
          }
          let examArr = []
          allExam.forEach(item => {
            examArr.push(item._doc.examDesignId)
          })
          // 分离出考试id与这场考试下的设备id,存储在数据库
          for (let ele of examArr) {
            let deviceArr_ = []
            // 未带考试id的文件会被过滤
            for (let item of theFilePath) {
              if (item.path.indexOf(ele) !== -1) {
                deviceArr_.push(item.path)
              } else {
                this.$message.error("存在导入的文件格式错误")
                that.$refs.fileBtn.value = ''
                return
              }
            }
            let obj = {}
            obj.examDesignId = ele
            obj.deviceArr = deviceArr_
            examToDeviceArr.push(obj)
          }
          // 写入数据库 同步要拿到返回之后才能执行下一步
          let result = that.$electron.sendSync('examToDeviceArrimportMp3', {
            examToDeviceArr: examToDeviceArr
          })
          // console.log(result.code)
          if (result.code === 0) {
            this.$message.error("导入数据失败")
            this.fileTypeImportFlag = ''
          } else if (result.code === 1) {
            this.$message.success("重复数据已被过滤,导入数据成功")
            this.readDumpFile()
            this.fileTypeImportFlag = ''
          }
        }
        that.$refs.fileBtn.value = ''
      },
      readDumpFile() {
        let dumpFiles_ = this.$electron.sendSync('readDumpFile')
        if (dumpFiles_.code === 0) {
          this.$message.error("数据库错误")
          return
        }
        let dumpFiles2 = dumpFiles_.data
        // 如果gs_db里面没有集合 则dump不会dump gs_db  dumpFiles2就为[]
        if (dumpFiles2.length === 0) {
          this.dumpFiles = []
        } else {
          this.dumpFiles = dumpFiles2[0]['gs_db'] ? dumpFiles2[0]['gs_db'] : []
          this.dumpFiles = this.dumpFiles.filter(item => {
            if (item.indexOf(".metadata.") === -1) {
              return item
            }
          })
        }
        this.$store.commit("SET_DATAFILESTATUS", false)
      },
      goHome() {
        this.$router.push('/home')
      }
    }
  }
</script>

<style lang="less" scoped>


</style>




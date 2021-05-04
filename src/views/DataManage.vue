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
      <a-button @click="importJsonFile">导入数据库文件</a-button>
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
      <a-button @click="importJsonFile">导入音频文件</a-button>
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
           accept=".json"
           id="fileInput" slot="content" style="display: none"
           ref="fileBtn"
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
      // 导入json文件
      importJsonFile() {
        this.fileTypeImportFlag = 'databaseFileImport'
        document.getElementById("fileInput").click()
      },
      importInformation(obj) {
        const that = this
        // G:\gs_books\8.0electron\electron_gyy\static\mongodb\exportData\1.json
        let theFilePath = obj.target.files[0].path
        if (this.fileTypeImportFlag === 'databaseFileImport') {
          let result = that.$electron.sendSync('importToLocalDataByJsonFile', {
            filePath: theFilePath
          })
          if (result.code === 1) {
            this.$message.success("导入数据成功")
            this.readDumpFile()
            this.fileTypeImportFlag = ''
          } else {
            this.$message.success("导入数据失败,请联系管理员")
            this.fileTypeImportFlag = ''
          }
        }
        that.$refs.fileBtn.value = ''
      },
      readDumpFile() {
        let dumpFiles2 = this.$electron.sendSync('readDumpFile')
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




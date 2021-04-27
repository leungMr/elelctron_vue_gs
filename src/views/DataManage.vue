<template>
  <div style="width: 100%;height: 100%;background-color: #2f3d39;">
    <!--主体S-->
    <div style="width: 100%;height: 40px;border-bottom: 1px solid #d9d9b7"
         class="layout-side">
      <span style="margin-left: 10px;font-size: 16px;">数据管理</span>
      <a-icon type="home" style="font-size: 20px;margin-right: 20px;" @click="goHome"/>
    </div>
    <div style="width: 100%;height: calc(100% - 40px);padding-top: 2px;">
      <a-button @click="importDataButton" style="margin-left: 10px;">导入集合</a-button>
      <a-button @click="exportData">导出集合</a-button>
      <input @change="importInformation($event)"
             accept=".json"
             id="upload2" slot="content" style="display: none"
             ref="fileBtn"
             type="file"/>
      <br>
      <div
        style="width: 80%;min-height: 100px;border: 1px solid #d9d9b7;margin:10px auto;"
        class="layout-left-top"
      >
        <!--{{dumpFiles}}-->
        <div
          style="width: 100px;height: 50px;margin: 10px;"
          class="layout-center"
          v-for="(item,index) in dumpFiles"
          :key="index"
        >
          <a-icon type="database" style="font-size: 30px;"/>
          <div style="width: 100%;text-align: center;">{{item}}</div>
        </div>
      </div>

    </div>
    <!--主体E-->
    <a-modal title="集合导入"
             v-model="ishshowModal1"
             :maskClosable="false"
             width="724px"
             @cancel="handleCancelModal1"
             @ok="handleOkModal1">
      <!--<template slot="footer">-->
      <!--  <a-button key="back" @click="onDisturbDeviceCancel">取消操作</a-button>-->
      <!--  <a-button v-if="disturbDeviceLevel!==0" key="submit" type="primary" @click="onDisturbDeviceHandleOk">-->
      <!--    开始干扰-->
      <!--  </a-button>-->
      <!--  <a-button v-if="disturbDeviceLevel===0" key="submit" type="primary" @click="onDisturbDeviceHandleOk">-->
      <!--    停止干扰-->
      <!--  </a-button>-->
      <!--</template>-->
      <div style="width: 100%;">
        <div style="margin: 5px 0;">固定集合：</div>
        <div style="width: 100%;">
          <a-button
            style="margin: 0 5px;"
            v-for="(item,index) in mustTables"
            :key="index"
            :style="{'background-color':item.status==='success'?'':''}"
            @click="importMustTable(item)"
          >
            {{item.name}}
          </a-button>
        </div>
        <hr style="width: 100%;border-bottom: 1px dashed #fff;margin:20px 0;">
        <div style="margin: 5px 0;">自定义集合：</div>
        <div style="width: 100%;" class="layout-left-center">
          <a-input placeholder="请输入导入集合的名字" style="width: 30%;"></a-input>
          <div style="width: 10px;"></div>
          <a-button>导入</a-button>
        </div>


      </div>
    </a-modal>

  </div>


</template>

<script>


  export default {
    components: {},
    data() {
      return {
        // 当前导入的集合的名字
        currentImportTbaleName: '',
        // 是否展示模态框1
        ishshowModal1: false,
        // 展示的集合
        dumpFiles: '',
        // 必须导入的集合
        mustTables: [
          {
            name: 'TrainingDesign',
            status: 'success'
          },
          {
            name: 'User',
            status: 'fail'
          }
        ],
      }
    },
    created() {
    },
    mounted() {
      this.readDumpFile()
    }
    ,
    methods: {
      // 模态框操作相关S
      handleOkModal1() {
        this.ishshowModal1 = false
        // 刷新集合
        this.readDumpFile()
      },
      handleCancelModal1() {
        this.ishshowModal1 = false
        // 刷新集合
        this.readDumpFile()
      },
      importMustTable(item) {
        this.currentImportTbaleName = item.name
        document.getElementById("upload2").click()
      },
      // 模态框操作相关E
      //导入按钮
      importDataButton(event) {
        this.ishshowModal1 = true
        // 弹出弹框
        // document.getElementById("upload2").click();
      },
      //导入信息功能
      importInformation(obj) {
        // G:\gs_books\8.0electron\electron_gyy\static\mongodb\exportData\1.json
        let theFilePath = obj.target.files[0].path
        const {ipcRenderer} = require("electron");
        let result = ipcRenderer.sendSync('importToLocalData', {
          filePath: theFilePath,
          tableName: this.currentImportTbaleName
        })
        this.$message.success("导入成功")
        this.$refs.fileBtn.value = ''
      },
      readDumpFile() {
        const {ipcRenderer} = require("electron");
        let dumpFiles2 = ipcRenderer.sendSync('readDumpFile')
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
      },
      // 导出本地集合
      exportData() {
        const {ipcRenderer} = require("electron");
        // 这里是从sj的数据库中导出
        let tableName = 'TrainingDesign'
        // let tableName = 'User'
        ipcRenderer.sendSync('exportLocalData', tableName)
        this.$message.success("导出成功")
      }
    }
  }
</script>

<style lang="less" scoped>


</style>




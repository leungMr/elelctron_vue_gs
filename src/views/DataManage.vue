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
      <a-button @click="importJsonFile('databaseFileImport')">导入考试文本文件</a-button>
      <div
        style="width: 80%;min-height: 100px;max-height:250px;overflow:auto;border: 1px solid #d9d9b7;margin:10px auto;padding: 10px;"
        class="layout-left-top"
      >
        <div style="width: 100%" class="layout-left-top">
          <div style="width: 40px;" class="layout-left-top">序号</div>
          ---------
          <div style="width: 150px;" class="layout-center-top">时间</div>
          ---------
          <div style="width: 150px;" class="layout-center-top">考试名称</div>
          ---------
          <div style="width: 40px;" class="layout-center-top">操作</div>
        </div>
        <div style="width: 100%" class="layout-left-top" v-for="(item,index) in examTestFiles" :key="index">
          <div style="width: 40px;" class="layout-left-top">{{index}}</div>
          ---------
          <div style="width: 150px;" class="layout-center-top">{{item._doc.beginTime}}</div>
          ---------
          <div style="width: 150px;" class="layout-center-top">{{item._doc.trainingTitleName}}</div>
          ---------
          <a-popconfirm
            title="删除此数据会删除对应的音频文件?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="confirm_1(item)"
            @cancel="cancel_1"
          >
            <div style="width: 40px;cursor: pointer;" class="layout-center-top">
              删除
            </div>
          </a-popconfirm>
        </div>

      </div>
    </div>
    <!--数据库文件导入E-->
    <div style="height: 20px;"></div>
    <!--音频文件导入S-->
    <div style="width: 100%;padding-top: 2px;">
      <a-button @click="importJsonFile('mp3FileImport')">导入考试音频文件</a-button>
      <div
        style="width: 80%;min-height: 100px;max-height:400px;border: 1px solid #d9d9b7;margin:10px auto;overflow: auto;"
        class="layout-left-top"
      >
        <template
          v-for="(item,index) in allMp3Files"
        >
          <div
            :key="index"
            v-if="item._doc.deviceArr.length"
            style="width: 100%;min-height: 100px;margin-top:10px;margin-left:10px;"
            class="layout-left-top"
          >
            <div style="width: 100%;" class="layout-left-top">
              <div style="width: 40px;" class="layout-left-top">{{index}}</div>
              ---------
              <div style="width: 150px;" class="layout-center-top">{{getExamNameById(item._doc.examDesignId)}}</div>
            </div>
            <div
              v-for="(ele,index2) in item._doc.deviceArr"
              :key="index2+'110'"
              style="width: 100%;"
              class="layout-side"
            >
              <span>{{ele}}</span>
              <a-popconfirm
                title="删除此音频文件?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="confirm_2(item,ele)"
                @cancel="cancel_2"
              >
                <span style="margin-right: 100px;cursor: pointer;">删除</span>
              </a-popconfirm>


            </div>
            <hr style="width: 100%;border-bottom: 0px dashed #d4d4b3;">
          </div>
        </template>
      </div>
    </div>
    <!--音频文件导入E-->
    <div style="height: 20px;"></div>
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
        // 音频文件
        allMp3Files: [],
        // 考试文本文件
        examTestFiles: [],
      }
    },
    created() {
    },
    mounted() {
      this.readDumpFile()
      this.readMp3Files()
      this.readExamTestFiles()
    }
    ,
    methods: {
      cancel_1() {
        this.$message.success('你取消了删除')
      },
      confirm_1(item) {
        this.deleteTextExam(item)
      },
      cancel_2() {
        this.$message.success('你取消了删除')
      },
      confirm_2(item, ele) {
        this.deleteMp3File(item, ele)
      },
      deleteMp3File(item, ele) {
        let obj = {
          examId: item._doc.examDesignId,
          deleteData: ele
        }
        let result = this.$electron.sendSync('deleteMp3File', obj)
        if (result.code === 1) {
          this.$message.success("删除成功")
          this.readMp3Files()
        } else {
          this.$message.success("删除失败")
        }
      },
      deleteTextExam(item) {
        console.log(item)
        let result = this.$electron.sendSync('deleteExamtext', item._doc.examDesignId)
        if (result.code === 1) {
          this.$message.success("删除数据成功")
          this.readMp3Files()
          this.readExamTestFiles()
        } else {
          this.$message.error("删除数据失败")
        }
      },

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
            this.readExamTestFiles()
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
            if (uu.type !== "audio/wav" || uu.path.split('-').length !== 3) {
              this.$message.error("存在导入的文件类型错误")
              that.$refs.fileBtn.value = ''
              // 整个函数的return
              return
            }
          }
          let theFilePath = obj.target.files
          // 先去数据库查出所有的考试id
          let examToDeviceArr = {}
          let allExam2 = that.$electron.sendSync('getInitExamData_')
          if (allExam2.code === 0) {
            this.$message.error("数据库服务错误")
            return;
          }
          let allExam = allExam2.data

          if (allExam.length === 0) {
            this.$message.error("考试数据为空,请先导入考试数据")
            that.$refs.fileBtn.value = ''
            return
          }
          let examArr = []
          allExam.forEach(item => {
            examArr.push(item._doc.examDesignId)
            examToDeviceArr[item._doc.examDesignId] = []
          })
          for (let item of theFilePath) {
            let flag = false
            for (let ele of examArr) {
              // 路径中间一项必须包含现有的考试id
              // 也就是在现存id之外的路径会报错
              if (item.path.split('-')[1] === ele) {
                // 这项路径包含这个考试id
                flag = ele
              }
            }
            // 说明这项路径不包含一个id
            // 路径不在现存的考试id之内导不进去
            if (flag === false) {
              this.$message.error("存在导入的文件格式错误或导入的文件不在现有考试范围之内")
              that.$refs.fileBtn.value = ''
              return
            } else {
              examToDeviceArr[flag].push(item.path)
            }
          }
          // 所有现有的考试都在此,只是有些音频文件为[]
          let examToDeviceArr2 = []
          for (let key in examToDeviceArr) {
            let obj = {
              examDesignId: key,
              deviceArr: examToDeviceArr[key]
            }
            examToDeviceArr2.push(obj)
          }
          // console.log(examToDeviceArr2)
          let result = that.$electron.sendSync('examToDeviceArrimportMp3', {
            examToDeviceArr: examToDeviceArr2
          })
          // console.log(result.code)
          if (result.code === 0) {
            this.$message.error("导入数据失败")
            this.fileTypeImportFlag = ''
          } else if (result.code === 1) {
            this.$message.success("重复数据已被过滤,导入数据成功")
            this.readDumpFile()
            this.readMp3Files()
            this.fileTypeImportFlag = ''
          }
        }
        that.$refs.fileBtn.value = ''
      },
      readMp3Files() {
        let files = this.$electron.sendSync('readMp3File')
        if (files.code === 1) {
          this.allMp3Files = files.data
          // console.log(this.allMp3Files)
        } else {
          this.$message.error("数据库服务错误")
        }
      },
      readExamTestFiles() {
        let files = this.$electron.sendSync('getInitExamData_')
        if (files.code === 1) {
          this.examTestFiles = files.data
          // console.log(this.examTestFiles)
        } else {
          this.$message.error("数据库服务错误")
        }
      },
      readDumpFile() {
        this.$store.commit("SET_DATAFILESTATUS", false)
      },
      goHome() {
        this.$router.push('/home')
      },
      getExamNameById(id) {
        // console.log(this.examTestFiles)
        let name = "此音频无对应考试"
        this.examTestFiles.forEach(item => {
          if (item._doc.examDesignId === id) {
            name = item._doc.trainingTitleName
          }
        })
        return name
      }
    }
  }
</script>

<style lang="less" scoped>


</style>




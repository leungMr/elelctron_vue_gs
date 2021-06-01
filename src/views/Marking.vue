<template>
  <div
    style="width: 100%;height:100%;"
    :style="{'background-color':$publicConfig.backgroundColor}"
  >
    <div style="width: 100%;height: 40px;border-bottom: 1px solid #d9d9b7"
         class="layout-side">
      <span style="margin-left: 10px;font-size: 16px;">训练列表</span>
      <a-icon type="home" style="font-size: 20px;margin-right: 20px;" @click="$router.push('/home')"/>
    </div>
    <!--主题区域S-->
    <div style="width: 100%;height: calc(100% - 40px);padding-top: 2px;">
      <!--表格S-->
      <div style="width: 100%;height: 500px;overflow: hidden;">
        <a-table class="tableDesign"
                 :rowKey="record => record.examDesignId"
                 :columns="markingTable"
                 :dataSource="finishTrains"
                 :pagination="false"
        >
          <!--训练时长-->
          <span slot="trainingTime" slot-scope="text, record">
          <span>{{getTimeDuration(record.beginTime,record.endTime)}}</span>
        </span>
          <!--操作-->
          <span slot="tags" slot-scope="text, record">
          <template>
            <a-icon
              type="search"
              class="table-options color-green table-icons"
              title="查看"
              @click="searchExamInfo(record)"
            ></a-icon>&nbsp;
          </template>
          </span>
        </a-table>
      </div>

      <!--表格E-->
    </div>
    <!--主体区域E-->


  </div>


</template>

<script>

  import {markingTable} from "./config/markingTable"

  export default {
    components: {},
    data() {
      return {
        markingTable: markingTable,
        // 已经完成的考试
        finishTrains: []
      }
    },
    created() {},
    mounted() {
      this.getInitExamData()
    }
    ,
    methods: {
      // 获取初始化考试列表数据
      getInitExamData() {
        let allTrains2 = this.$electron.sendSync('getInitExamData_')
        if(allTrains2.code===0){
          this.$message.error("数据库服务错误")
          return
        }
        let allTrains = allTrains2.data
        allTrains = allTrains.filter(item => {
          if (item._doc.examState === '3') {
            return item
          }
        })
        this.finishTrains = []
        allTrains.forEach(item => {
          this.finishTrains.push(item._doc)
        })
        this.$store.commit("SET_DATATRAINSTATUS", false)
      },
      // 查看每场考试的详情
      searchExamInfo(e) {
        // console.log(e)
        let examId = e.examDesignId
        this.$router.push("/markingInfo?examDesignId=" + examId)
      },
      // *************以下是工具函数*****************
      getTimeDuration(time1, time2) {
        const dateBegin = new Date(time1.replace(/-/g, "/"));//将-转化为/，使用new Date
        const dateEnd = new Date(time2.replace(/-/g, "/"));
        const dateDiff = dateEnd.getTime() - dateBegin.getTime();//时间差的毫秒数
        const dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
        const leave1 = dateDiff % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
        const hours = Math.floor(leave1 / (3600 * 1000)); //计算出小时数
        //计算相差分钟数
        const leave2 = leave1 % (3600 * 1000);    //计算小时数后剩余的毫秒数
        const minutes = Math.floor(leave2 / (60 * 1000)); //计算相差分钟数
        //计算相差秒数
        const leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数
        const seconds = Math.round(leave3 / 1000);
        return dayDiff + "天 " + hours + "小时 " + minutes + " 分钟" + seconds + " 秒"
      },
    }
  }
</script>

<style lang="less" scoped>

</style>




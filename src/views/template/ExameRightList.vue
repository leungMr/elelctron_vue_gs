<template>
  <div style="width: 100%;height: 100%;overflow: hidden;"
       :style="{'background-color':$publicConfig.backgroundColor}">
    <!--上S-->
    <div
      style="height: 40px;border-bottom: 1px solid rgba(0, 0, 0, 0.2);box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);"
      class="layout-center relative">
      <div class="width-100-per layout-center">
        <span style="font-weight: bold;font-size: 14px;">实时操作信息</span>
      </div>
    </div>
    <!--上E-->
    <!--下S-->
    <div
      style="width: 100%;height: calc(100% - 40px);padding-top: 10px;">
      <a-timeline>
        <a-timeline-item
          v-for="(item,index) in beOnlineData"
          :key="index"
          color="yellow"
        >
          <!--业务通信S-->
          <div v-if="item.status==='业务通信' && item.idWith.length>0" style="color: yellow;">
            <span>{{item.mainId}}</span>
            <span>与</span>
            <span v-for="(ele,index) in item.idWith" :key="index+'111'">【{{ele}}】</span>
            <span>进行业务通信</span>
          </div>
          <div v-else-if="item.status==='业务通信' && item.idWith.length===0" style="color: gray;">
            <span>{{item.mainId}}</span>
            <span>退出</span>
            <span>业务通信</span>
          </div>
          <!--业务通信E-->
          <!--设备状态S-->
          <div v-else-if="item.status==='设备状态'&& item.state === '5'" style="color: green;">
            <span>{{item.mainId}}</span>
            <span>上线</span>
          </div>
          <div v-else-if="item.status==='设备状态'&& item.state === '6'" style="color: gray;">
            <span>{{item.mainId}}</span>
            <span>下线</span>
          </div>
          <!--设备状态E-->
          <!--组网S-->
          <div v-else-if="item.status==='组网' && item.idWith.length>0" style="color: orange;">
            <span>{{item.mainId}}</span>
            <span>与</span>
            <span v-for="(ele,index) in item.idWith" :key="index+'111'">【{{ele}}】</span>
            <span>进行组网</span>
          </div>
          <div v-else-if="item.status==='组网' && item.idWith.length===0" style="color: gray;">
            <span>{{item.mainId}}</span>
            <span>退出</span>
            <span>组网</span>
          </div>
          <!--组网E-->
        </a-timeline-item>
      </a-timeline>
    </div>
    <!--下E-->
  </div>
</template>
<script>
  export default {
    data() {
      return {
        beOnlineData: [],
      }
    },
    methods: {
      getRealTimeData(e) {
        // console.log(e)
        this.beOnlineData = e
      }
    }
  }
</script>
<style lang="less" scoped>

</style>
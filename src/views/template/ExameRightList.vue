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
        <a-timeline-item color="red">
          <p>Solve initial network problems 1</p>
          <p>Solve initial network problems 2</p>
          <p>Solve initial network problems 3 2015-09-01</p>
        </a-timeline-item>
      </a-timeline>
    </div>
    <!--下E-->
  </div>
</template>
<script>
  export default {
    data() {
      return {}
    }
  }
</script>
<style lang="less" scoped>

</style>
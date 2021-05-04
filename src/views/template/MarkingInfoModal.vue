<template>
  <div>
    <a-modal
      title="训练详情"
      :visible="isShowTrainDetail"
      @ok="handleOk"
      @cancel="handleCancel"
      ok-text="确认"
      cancel-text="取消"
    >
      <div>训练名称：{{trainInfo.trainingTitleName}}</div>
      <div>开始时间：{{trainInfo.beginTime}}</div>
      <div>训练地点：{{trainInfo.locationEntity.name}}</div>
      <div>监训人员：{{trainInfo.supervisorsEntity[0].name}}</div>
    </a-modal>
  </div>
</template>

<script>


  export default {
    components: {},
    data() {
      return {
        isShowTrainDetail: false
      }
    },
    props: ["trainInfo"],
    created() {
    },
    methods: {
      handleOk() {
        this.isShowTrainDetail = false
      },
      handleCancel() {
        this.isShowTrainDetail = false
      }
    }
  }
</script>

<style lang="less" scoped>

</style>

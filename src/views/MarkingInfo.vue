<template>
  <div
    style="width: 100%;height: 100%;"
    :style="{'background-color':$publicConfig.backgroundColor}"
  >
    哈哈哈,我是详情页
  </div>
</template>
<script>
  export default {
    data() {
      return {
        trainInfo: []
      }
    },
    mounted() {
      this.initTheTrainInfo()
    },
    methods: {
      initTheTrainInfo() {
        let examDesignId = this.$route.query.examDesignId

      }
    }
  }
</script>
<style scoped lang="less"></style>
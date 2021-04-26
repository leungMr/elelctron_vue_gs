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
    <div style="width: 100%;height: calc(100% - 40px);padding-top: 2px;">
    </div>

  </div>


</template>

<script>


  export default {
    components: {},
    data() {
      return {}
    },
    created() {

      this.$http.get('/api/test').then(res => {
        console.log(res.data)
      })
    },
    mounted() {

    }
    ,
    methods: {}
  }
</script>

<style lang="less" scoped>

</style>




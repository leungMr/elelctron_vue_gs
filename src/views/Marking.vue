<template>
  <div class="home layout-center">


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




<template>
  <div
    class="absolute docker"
  >
    <!--<div class="absolute docker-message" style="left: 10px;"></div>-->
    <div
      class="absolute docker-tools"
    >
      <div
        class="height-100-per width-100-per relative"
      >
        <!--控制块S-->
        <div
          class="top layout-center"
          :style="{top:isContentShow?'-20px':'40px'}"
          style="transition:all ease 0.5s"
        >
          <div class="layout-center shrink">
            <a-icon :type="!isContentShow?'caret-up':'caret-down'" @click="caretDown"/>
          </div>
        </div>
        <!--控制块E-->
        <!--一级被控制块S-->
        <!--它刚好60那么高-->
        <transition name='one_transtion'>
          <div class="content layout-center"
               v-if="isContentShow"
               style="position: absolute;top:0;left:0;"
          >
            <div class="content-two layout-side">
              <div
                class="layout-center"
                @click="$store.commit('SET_VOIVECONTROLSHOW',{
                isShow:true,
                type:'语音控制'
              })">
                <svg-icon class="one" :h="30" :w="30" name="biaohui"/>
                <span class="two">语音控制</span>
              </div>
              <div
                class="layout-center"
                @click="$parent.showWhichOne('地图操作')"
              >
                <svg-icon class="one" :h="30" :w="30" name="map"/>
                <span class="two">地图操作</span>
              </div>
              <div
                class="layout-center"
                @click="$parent.showWhichOne('界面控制')"
              >
                <svg-icon class="one" :h="30" :w="30" name="zuwang"/>
                <span class="two">界面控制</span>
              </div>
              <a-divider style="height: 15px" type="vertical"/>
              <div
                class="layout-center"
                @click="$parent.showWhichOne('其他')"
              >
                <svg-icon class="one" :h="30" :w="30" name="qita"/>
                <span class="two">其他</span>
              </div>
            </div>
          </div>
        </transition>
        <!--一级被控制块E-->
      </div>
    </div>
    <!--<div class="absolute docker-message" style="right: 10px;"></div>-->
  </div>
</template>

<script>
  import SvgIcon from 'vue2-svg-icon/Icon.vue';

  export default {
    data() {
      return {
        isContentShow: true,
      }
    },
    methods: {
      caretDown() {
        // console.log("你点击了下拉")
        this.isContentShow = !this.isContentShow
      }
    },
    components: {
      SvgIcon
    }
  }

</script>

<style lang="less" scoped>
  .docker {
    bottom: 0px;
    left: 0;
    right: 0
  }

  .docker .docker-message {
    width: 280px;
    height: 560px;
    background: rgba(0, 0, 0, 0.45);
    bottom: 0;
    border: 1px solid;
    border-bottom: none;
  }

  .docker .docker-tools {
    bottom: 0;
    left: 50%;
    transform: translateX(-50%;);
    /*right: 300px;*/
    width: 520px;
    line-height: 60px;
    height: 60px;
  }

  .docker .docker-tools .top {
    height: 20px;
    left: 0;
    right: 0;
    position: absolute;
  }

  .docker .docker-tools .top .shrink {
    background: rgba(0, 0, 0, 0.45);
    height: 20px;
    width: 40px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    font-size: 20px;
  }

  .docker .docker-tools .content {
    width: 100%;
    height: 100%;
  }

  .docker .docker-tools .content .content-two {
    height: 100%;
    background: rgba(0, 0, 0, 0.45);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border: 1px solid;
    border-bottom: none;
  }

  .docker .docker-tools .content .content-two div {
    cursor: pointer;
    padding: 5px 0;
  }

  .docker .docker-tools .content .content-two div .one {
    font-size: 30px;
    width: 100%
  }

  .docker .docker-tools .content .content-two div .two {
    height: 20px;
    line-height: 20px;
    font-size: 13px;
  }

  // 底部地图控制动画
  .one_transtion-enter, .one_transtion-leave-to {
    opacity: 0;
    transform: translateY(60px);
  }

  .one_transtion-enter-active, .one_transtion-leave-active {
    transition: all 0.5S ease
  }


</style>
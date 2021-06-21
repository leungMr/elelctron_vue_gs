<template>
  <div style="width: 100%;height:100%;position: absolute;left: 0;top: 0;" class="my_">
    <template
      v-for="(item,index) in menutoolObj">
      <a-menu
        mode="inline"
        style="width: 170px;position: absolute;bottom: 85px;"
        :key="item.key"
        :style="index !== menutoolObj.length-1?{'left':index*82+'px'}:{'right':0}"
        v-if="whichOneShow===item.title"
        @click="clickMenuItem"
        class="animated fadeInUp"
      >
        <template v-for="ele in item.children">
          <a-sub-menu :key="ele.key" v-if="ele.children">
            <span slot="title">
              <!--<a-icon type="appstore"/>-->
              <span>{{ele.title}}</span>
            </span>
            <a-menu-item :key="uu.key" v-for="uu in ele.children">
              {{uu.title}}
            </a-menu-item>
          </a-sub-menu>
          <template v-else>
            <a-menu-item :key="ele.key">
              {{ele.title}}
            </a-menu-item>
          </template>
        </template>
      </a-menu>
    </template>
  </div>
</template>

<script>
  import {menutoolObj} from "./toolMenu2";

  export default {
    components: {

    },
    data() {
      return {
        menutoolObj: menutoolObj,
        // 决定显示哪个菜单
        whichOneShow: '地图操作',
      }
    },
    methods: {
      clickMenuItem(e) {
        // console.log(e)
        this.$parent.clickMenuItem(e)
      },
      // 由父组件点击决定
      showWhichOne(e) {
        if (this.whichOneShow === e) {
          this.whichOneShow = ''
          return
        }
        this.whichOneShow = e
      },
    }
  }
</script>

<style  lang="less">
  .my_ {
    .ant-menu {
      background: rgba(0, 0, 0, 0.45);

      .ant-menu-submenu-title {
        font-size: 18px;
      }

      .anticon {
        font-size: 18px;
      }

      .ant-menu-item {
        font-size: 18px;
      }


      span {
        font-size: 18px;
      }
    }
    .ant-menu-submenu > .ant-menu {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
</style>
<template>
  <div class="width-100-per height-100-per overflow-hidden">
    <!--<div style="width: 100%;height: 40px;">-->
    <!--  <a-button class="layout-left-center" @click="enterEdit">-->
    <!--    更改战略部署关系-->
    <!--  </a-button>-->
    <!--</div>-->
    <!--拓扑图盒子S-->
    <div class="width-100-per" style="height: calc(100% - 0px);">
      <div
        ref="topology"
        style="height: 100%;width: 100%;" id="topology"
        :class="{isEditMode:!isEditMode}"
      >
        <a-spin :spinning="editorLoading" class="layout-center width-100-per height-100-per " size="large"
                tip="加载中...">
          <nip-editor :grid="grid"
                      :nodes="nodes"
                      :closeNodeDrag="isEditMode"
                      :width="nipEditorWidth"
                      :height="nipEditorHeight"
                      :zoom="zoom"
                      @nipAttribute="nipAttribute"
                      ref="canvas"
                      :fitViewPadding="fitViewPadding"
                      :fitView="fitView"
                      v-if="closeCanvas"
          />
        </a-spin>
      </div>
    </div>
    <!--拓扑图盒子E-->
  </div>

</template>

<script>
  import {NipEditor} from 'nip-graph-editor';
  import Soldier from '@/assets/img/Soldier1_128x128.png';
  import {
    Spin,
    Button
  } from 'ant-design-vue'

  export default {
    components: {
      NipEditor,
      ASpin: Spin,
      AButton: Button,
    },
    data() {
      return {
        // 是否是拓扑图编辑模式
        isEditMode: false,
        // 拓扑图
        grid: true,
        nodes: {
          // nodes: [{
          //   id: 'node1',
          //   x: 100,
          //   y: 100,
          //   img: Soldier,
          //   textFontSize: 16,
          //   textFill: 'red',
          //   label: 'node1',
          //   shape: 'nip-image',
          //   nip: [],
          //   isAp: true,
          //   ap: [1, 2, 4, 5, 6, 8, 9, 10, 12, 13, 14, 16],
          //   size: [60, 60],
          //   // border: {
          //   //   color: 'red',
          //   // },
          // },
          //   {
          //   id: 'node2',
          //   x: 100,
          //   y: 600,
          //   size: [60, 60],
          //   shape: 'nip-image',
          //   label: 'node2',
          //   ap: [1, 2, 4, 5, 6, 8, 9, 10, 12, 13, 14, 16],
          //   isAp: true,
          //   textFill: 'red',
          //   img: Soldier,
          //   textFontSize: 16,
          //   // border: {
          //   //   color: 'red',
          //   //   lineWidth: 3
          //   // },
          // },
          //   {
          //   id: 'node3',
          //   x: 400,
          //   y: 500,
          //   size: [60, 60],
          //   nip: [],
          //   shape: 'nip-image',
          //   label: 'node3',
          //   textFontSize: 16,
          //   textFill: 'red',
          //   isAp: true,
          //   img: Soldier,
          //   ap: [1, 2, 4, 5, 6, 8, 9, 10, 12, 13, 14, 16],
          // }],
          // edges: [
          //   {
          //     id: 'edge1',
          //     source: 'node1',
          //     target: 'node2',
          //     style: {
          //       startArrow: {
          //         path: 'M 5,0 L -5,-5 L -5,5 Z',  // 自定义箭头为中心点在(0, 0)，指向 x 轴正方向的path
          //         d: 10
          //       },
          //       endArrow: {
          //         path: 'M 5,0 L -5,-5 L -5,5 Z',  // 自定义箭头为中心点在(0, 0)，指向 x 轴正方向的path
          //         d: 10
          //       }, //箭头方向
          //       animateFill: 'blue',
          //       stroke: "red",
          //       lineDash: [5] //虚线
          //     },
          //     animateStart: true, // 动画开启与关闭，默认关闭
          //     animateHZ: 5000, // 动画速率，默认3000
          //     shape: 'nip-animate-edge',
          //     label: '你好,我好',
          //     labelCfg: {
          //       style: {stroke: 'white', lineWidth: 5} // 加白框
          //     }
          //   },
          //   {
          //     id: 'edge2',
          //     source: 'node3',
          //     target: 'node4',
          //     style: {
          //       lineDash: [5, 2, 5] //单点虚线
          //     },
          //     animateStart: true,
          //     shape: 'nip-animate-edge',
          //   },
          //   {
          //     id: 'edge5',
          //     source: 'node2',
          //     target: 'node4',
          //     label: '随便连换行',
          //     shape: 'nip-animate-edge',
          //     labelCfg: {
          //       style: {stroke: 'white', lineWidth: 5} // 加白框
          //     }
          //   }]
        },
        zoom: {
          minZoom: 0.1,
          maxZoom: 10,
        },
        closeCanvas: true,
        editorLoading: false,
        nipEditorWidth: 0,
        nipEditorHeight: 0,
        fitView: false,
        fitViewPadding: 10,
        colorList: ["red", "orange", "blue", "black"],
        allPersonInfo: '',
      }
    },
    mounted() {
      let allLine = this.$refs.canvas.getEdges()
      // console.log(allLine)

    },
    methods: {
      // 进入拓扑图编辑模式
      enterEdit() {
        this.isEditMode = true

        this.intNipEditor()
      },
      // 刷新拓扑图
      render() {
        this.$refs.canvas.render()
      },
      // 根据两点制造飞线
      // 数组的第一个元素是头
      // ["463705583581659136","384367784030633984","384383112349483008"]
      // this.edges = this.canvas.getEdges();
      // 红圈圈与地图还有战术拓扑图都是做了刷新持久化的
      makeFlyLine(arr) {
        arr.forEach((item, index) => {
          if (index === 0) return
          let lineObj = {
            id: arr[0] + arr[1] + 'flyline',
            source: arr[0],
            target: arr[index],
            style: {
              // startArrow: {
              //   path: 'M 5,0 L -5,-5 L -5,5 Z',
              //   d: 10
              // },
              endArrow: {
                path: 'M 5,0 L -5,-5 L -5,5 Z',
                d: 10
              },
              animateFill: 'yellow',
              stroke: "yellow",
              lineDash: [5]
            },
            animateStart: true, // 动画开启与关闭，默认关闭
            animateHZ: 2000, // 动画速率，默认3000
            shape: 'nip-animate-edge',
            label: '通话中',
            labelCfg: {
              // style: {stroke: 'white', lineWidth: 5}
            }
          }
          this.nodes.edges.push(lineObj)
        })
        this.render()
      },
      // 删除拓扑图通话飞线
      // 根据节点id数组
      // 先获取所有的飞线,找到要删除的线,从数组中移除,然后再刷新
      deleteFlyLine(arr) {
        let mainId = arr[0]
        console.log(mainId)
        // let allLine = this.$refs.canvas.getEdges()
        // console.log(allLine)
        // console.log(this.nodes.edges)
        this.nodes.edges = this.nodes.edges.filter(item => {
          if (!item.id.startsWith(mainId)) {
            return item
          }
        })
        this.render()
      },
      // 展现人员节点
      showNipEditor(nodes) {
        this.allPersonInfo = JSON.parse(JSON.stringify(nodes))
        this.nodes.nodes = []
        this.allPersonInfo.forEach((group, index) => {
          group.netList.forEach((item, index2) => {
            let obj = {
              // 证件号
              id: item.examineUser.userEntity.militaryId,
              x: 100 + index * 100,
              y: 100 + index2 * 100,
              img: Soldier,
              textFontSize: 16,
              textFill: this.colorList[index],
              label: item.examineUser.userEntity.name,
              shape: 'nip-image',
              nip: [],
              isAp: true,
              ap: [1, 2, 4, 5, 6, 8, 9, 10, 12, 13, 14, 16],
              size: [60, 60],
              // border: {
              //   color: 'red',
              // },
            }
            // console.log(obj)
            this.nodes.nodes.push(obj)

          })
        })
        this.$nextTick(() => {
          this.intNipEditor()
        })

      },
      // 根据后端返回的数据展现人员节点
      // !!!战术拓扑图的节点id是人员那排数据库的id
      showNipEditor2(nodes) {
        this.nodes = {}
        this.nodes = nodes
        this.$nextTick(() => {
          this.intNipEditor()
        })
      },


      // 拓扑图相关
      //拓扑图初始化
      intNipEditor() {
        //因为一开始为了等数据,把大盒子hidden了
        //所以应该等到大盒子显示出来再调用 详情见p8
        this.nipEditorHeight = this.$refs.topology.clientHeight;
        this.nipEditorWidth = this.$refs.topology.clientWidth;
        this.refresh()
      },
      //定义一个刷新画布的方法
      refresh() {
        const that = this;
        that.closeCanvas = false;
        that.editorLoading = true;
        setTimeout(() => {
          that.closeCanvas = true;
          that.editorLoading = false;
        }, 1000);
      },
      nipAttribute() {
        // 拓扑图是用的人的id
        // this.makeFlyLine(["802007120001", "802007120002", "802007120003"])
      },
    }
  }
</script>

<style lang="less" scoped>
  .isEditMode {
  }
</style>
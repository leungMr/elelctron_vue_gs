<template>
  <div style="width: 100%;height: 100%;position:relative;">
    <div class="base-map-bar">
      <div style="height: 100%;width: 100%">
        <div style="height: 100%; float: left">
          经度：{{mapBaseData.lng}}
          |
          纬度：{{mapBaseData.lat}}
          |
          高程：{{mapBaseData.height}}米
        </div>
        <div style="height: 100%; float: right">
          镜头高度:{{mapBaseData.cameraHeight}}米
        </div>
      </div>
    </div>
    <div style="position: absolute;bottom: 40px;right: 53px;z-index: 99;">
      <a-icon type="environment" title="回到起始点" style="font-size: 20px" @click="positionMe"/>
    </div>
    <!--<div style="position: absolute;bottom:37px;right:80px;z-index: 99;">-->
    <!--  <a-icon type="column-width" title="查看设备间距离" style="font-size: 28px" @click="lookGap"/>-->
    <!--</div>-->
    <!--<div style="position: absolute;bottom:37px;right:120px;z-index: 99;">-->
    <!--  <a-icon type="block" title="2D、3D地图切换" style="font-size: 28px" @click="swmap"/>-->
    <!--</div>-->
    <div id="cesiumContainer" class="width-100-per height-100-per absolute"></div>

  </div>
</template>

<script>
  import {NipCesium} from '../../../packages'
  import layer_yx from "./layer_yx.png";
  // import layer_dg from "./layer_dg.png";
  let viewer, command;

  export default {
    data(){
      return{
        // 地图相关
        mapBaseData: {
          lng: 0,
          lat: 0,
          height: 0,
          cameraHeight: 0
        },
        viewModes: [
          {
            name: "卫星影像",
            tooltip: "卫星影像",
            iconUrl: layer_yx,
            type: 0,
            // url: "http://10.10.0.115:3000/title?x={x}&y={y}&z={z}"
            url:require("../../assets/img/mapbase.png")
          },
          // {
          //   name: "等高线图",
          //   tooltip: "等高线图",
          //   iconUrl: layer_dg,
          //   type: 0,
          //   url: "http://10.10.0.99:8000/api/map/tile?source=striograph&x={x}&y={y}&z={z}"
          // },
          // {
          //   name: "90M高程",
          //   tooltip: "90M高程",
          //   iconUrl: layer_dg,
          //   type: 1,
          //   url: "http://10.10.0.99:8000/api/map/dem"
          // }
        ],
      }
    },
    mounted() {
      this.addmap()
    },
    methods:{
      addmap() {
        // 镜头位置
        let init = new NipCesium.Init('cesiumContainer', this.viewModes, this.receiveMapInfo,
          this.mapLoadNullFunc, () => {
          }, {
            x: "106.379390",
            y: "29.534726",
            z: "13000"
          }, this.mode);
        viewer = init.viewer;
        command = new NipCesium.Command();
      },
      mapLoadNullFunc(e) {
        console.log("地图加载完了")
      },
      receiveMapInfo(e) {
        this.mapBaseData = e;
      },
      //回到起始点
      positionMe() {
        command.positionMe({x: "106.379390", y: "29.534726", z: "13000"});
      }
      ,
      //查看距离
      lookGap() {
      //   const that = this;
      //   if (that.gapStop) {
      //     let arr = this.markers
      //     // console.log(arr)
      //     let arr2 = [{
      //       id: "802007120001",
      //       x: '',
      //       y: '',
      //       z: ''
      //     }]
      //     let num = 0;
      //     let list = [];
      //     for (let i in arr) {
      //       for (let j in arr) {
      //         if (arr[i].id !== arr[j].id) {
      //           num++;
      //           // 用来存一共有多少条测距线
      //           that.gapList.push({
      //             id: num,
      //             equId: arr[i].id,
      //           })
      //           let distance = getFlatternDistance(Number(arr[i].x), Number(arr[i].y), Number(arr[j].x),
      //             Number(arr[j].y))
      //           command.addMarker(5, {
      //             id: num,
      //             color: "rgba(255,255,255,1)",
      //             text: parseInt(distance) + '',
      //             fontColor: "rgba(255,255,255,1)",
      //             // 字体高度
      //             altitude: 500,
      //             start: {
      //               name: '点一',
      //               x: Number(arr[i].x),
      //               y: Number(arr[i].y),
      //               //线的高度
      //               h: arr[i].z === undefined ? 500 : Number(arr[i].z)
      //             },
      //             to: {
      //               name: '点二',
      //               x: Number(arr[j].x),
      //               y: Number(arr[j].y),
      //               // h: 800,
      //               h: arr[j].z === undefined ? 500 : Number(arr[j].z)
      //             },
      //           });
      //         }
      //       }
      //     }
      //     that.gapStop = false;
      //   } else {
      //     for (let j of that.gapList) {
      //       command.deleteEntity(j.id + "");
      //       command.deleteEntity("label" + j.id);
      //     }
      //     that.gapStop = true;
      //   }
      }
    }
  }
</script>




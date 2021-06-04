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
  import {NipCesium} from '../../../public/packages'
  import layer_yx from "./layer_yx.png";
  // import layer_dg from "./layer_dg.png";
  let viewer, command;

  export default {
    data() {
      return {
        labelColor: ["white", "yellow", "red", "blue", "orange", "black", "orange", "black"],
        // 地图相关===========================
        mapBaseData: {
          lng: 0,
          lat: 0,
          height: 0,
          cameraHeight: 0
        },
        viewModes: [
          {
            name: "本地地图",
            tooltip: "本地地图",
            iconUrl: layer_yx,
            type: 0,
            url: require("../../assets/img/mapbase.jpg")
          },
          {
            name: "卫星影像",
            tooltip: "卫星影像",
            iconUrl: layer_yx,
            type: 0,
            url: "http://10.10.0.99:8000/api/map/tile?source=openstreatmap_transport&x={x}&y={y}&z={z}"
            // url: require("../../assets/img/mapbase.jpg")
            // 可以测试这个地址是否可以请求到,如果可以请求到则采用远程地址
            // http://10.10.0.99:8000/api/map/tile?source=openstreatmap_transport&x=1&y=1&z=1
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
          // },
        ],
        // 逻辑数据相关===========================
        // 最后一次组网的数组(去重用)
        lastNetArr: [],
        // 最后一次连线的数组(去重用)
        lastPhoneArr: [],
      }
    },
    mounted() {
      // 先去请求瓦片地址
      // 初始化地图
      this.addmap()
    },
    methods: {
      // 根据传过来的实时信息渲染各种动画
      // e 从最近时间的对象 开始排
      // 已经过滤了考试未开始的数据
      getRealTimeData(e) {
        // 设备通话
        let communications = []
        // 设备组网
        let equipmentNetworking = []
        e.forEach(item => {
          if (item.status === '业务通信') {
            communications.unshift(item)
            return
          }
          if (item.status === '组网') {
            equipmentNetworking.unshift(item)
            return
          }
        })
        this.opPhoneConnectLine(communications)
        this.opNetworkLine(equipmentNetworking)

      },
      // 组网数据连线操作
      opNetworkLine(netWorkings) {
        // 以前的组网数据也会推送过来,所以取最新的一项
        // console.log(netWorkings)
        if (JSON.stringify(netWorkings) === JSON.stringify(this.lastNetArr)) {
          // console.log("与上次组网想等")
          return
        }
        this.lastNetArr = JSON.parse(JSON.stringify(netWorkings))
        let allLine = command.getLines()
        let allLine2 = JSON.parse(JSON.stringify(allLine))
        // console.log(allLine2)
        if (allLine2.length > 0) {
          allLine2.forEach(item => {
            if (item.id.endsWith('new2')) {
              command.deleteEntity('label' + item.id)
              command.deleteEntity(item.id)
            } else {
              // command.deleteEntity(item.id)
            }
          })
        }
        netWorkings.forEach(item => {
          if (item.deviceIdWith.length === 0) {
            this.breakMakeNetWorking(item.mainDeviceId, "组网")
            return
          }
          let objArr = []
          objArr = [item.mainDeviceId, ...item.deviceIdWith]
          let allLocation = command.getImgs()
          let allLocation2 = JSON.parse(JSON.stringify(allLocation))
          let makeArr = this.orgnizeNetwork(objArr, allLocation2)
          this.makeNetWorking(makeArr)
        })
      },
      makeNetWorking(arr) {
        // console.log(arr)
        let maxleng = arr.length
        arr.forEach((item, index) => {
          let num = maxleng - index - 1
          // console.log(num)
          for (let i = 0; i < num; i++) {
            // console.log(index + i + 1)
            // 先删除
            command.deleteEntity('label' + arr[index].deviceId + arr[index + i + 1].deviceId + 'new2')
            command.deleteEntity(arr[index].deviceId + arr[index + i + 1].deviceId + 'new2')
            // 后添加
            command.addMarker(5, {
              // 主+次+new2
              id: arr[index].deviceId + arr[index + i + 1].deviceId + 'new2',
              color: "rgba(255,255,255,1)",
              text: '',
              fontColor: "rgba(255,255,255,1)",
              // 字体高度
              altitude: 100,
              start: {
                name: arr[index].deviceId,
                x: JSON.parse(arr[index].locationSongParam).lon / 100,
                y: JSON.parse(arr[index].locationSongParam).lat / 100,
                h: 1000
              },
              to: {
                name: arr[index + i + 1].deviceId,
                x: JSON.parse(arr[index + i + 1].locationSongParam).lon / 100,
                y: JSON.parse(arr[index + i + 1].locationSongParam).lat / 100,
                h: 1000
              }
            })
          }
        })
      },
      // 打电话连线或者是退打电话线
      opPhoneConnectLine(phoneInfos) {
        if (JSON.stringify(phoneInfos) === JSON.stringify(this.lastPhoneArr)) {
          // console.log("与上次打电话的数组相同")
          return
        }
        this.lastPhoneArr = JSON.parse(JSON.stringify(phoneInfos))
        let allLine = command.getLines()
        let allLine2 = JSON.parse(JSON.stringify(allLine))
        if (allLine2.length > 0) {
          allLine2.forEach(item => {
            // new打电话  new2组网
            if (item.id.endsWith('new')) {
              command.deleteEntity(item.id)
            }
          })
        }
        phoneInfos.forEach(item => {
          if (item.deviceIdWith.length === 0) {
            this.breakMakeNetWorking(item.mainDeviceId, "打电话")
            return
          }
          let idList = []
          idList.push(item.mainDeviceId)
          item.deviceIdWith.forEach((item, index) => {
            idList.push(item)
          })
          let allLocation = command.getImgs()
          let allLocation2 = JSON.parse(JSON.stringify(allLocation))
          let makeArr = this.orgnizeNetwork(idList, allLocation2)
          this.makeFlyLine(makeArr)
        })

      },
      makeFlyLine(arr) {
        for (let i = 0; i < arr.length; i++) {
          command.deleteEntity(arr[0].deviceId + arr[i].deviceId + 'new');
        }
        for (let i = 0; i < arr.length; i++) {
          if (i > 0) {
            command.addLine(1, {
              id: arr[0].deviceId + arr[i].deviceId + 'new',
              start: {
                name: arr[0].deviceId,
                x: JSON.parse(arr[0].locationSongParam).lon / 100,
                y: JSON.parse(arr[0].locationSongParam).lat / 100,
                // 飞线高度
                h: 1000
              },
              to: {
                name: arr[i].deviceId,
                x: JSON.parse(arr[i].locationSongParam).lon / 100,
                y: JSON.parse(arr[i].locationSongParam).lat / 100,
                h: 1000
              },
              // 弧线顶点高度
              peakHeight: 1000
            })
          }
        }
      },
      // 断开组网或者断开打电话
      breakMakeNetWorking(id, type) {
        let allLine = command.getLines()
        let allLine2 = JSON.parse(JSON.stringify(allLine))
        if (type === '打电话') {
          allLine2.forEach(item => {
            if (item.start.name === id || item.to.name === id) {
              if (item.id.endsWith("new")) {
                command.deleteEntity(item.id)
              }
            }
          })
        }
        if (type === '组网') {
          allLine2.forEach(item => {
            if (item.start.name === id || item.to.name === id) {
              if (item.id.endsWith("new2")) {
                command.deleteEntity(item.id);
                command.deleteEntity('label' + item.id);
              }
            }
          })
        }
      },
      // 组织组网或者打电话的数组
      orgnizeNetwork(arr, allLocation2) {
        let makeArr = []
        arr.forEach(ele => {
          allLocation2.forEach(aa => {
            if (ele === aa.id) {
              let obj = {
                // deviceBattery: "0",
                // timeOur: "2020-10-29 15:33:34",
                // latAnnotation: "N",
                lon: aa.lng * 100,
                // equipmentVoltage: "73",
                deviceId: ele,
                lat: aa.lat * 100,
                // lonAnnotation: "E",
                // height: "255.600",
              }
              let obj2 = {
                deviceId: ele,
                locationSongParam: JSON.stringify(obj)
              }
              makeArr.push(obj2)
            }
          })
        })
        return makeArr
      },
      // 根据上个页面的坐标初始化设备位置
      initDeviceLocation(nodeArr) {
        for (let i = 0; i < nodeArr.trainingDesignRelevanceList.length; i++) {
          let a = nodeArr.trainingDesignRelevanceList[i].netList;
          for (let j = 0; j < a.length; j++) {
            let obj = {
              id: String(a[j].equipmentUnit.deviceCode),
              lng: Number(a[j].x),
              lat: Number(a[j].y),
              alt: a[j].z === undefined ? 500 : Number(a[j].z),
              // 初始化设备在地图上的高度
              // 是否允许拖动设备
              noDragging: true,
              label: {
                name: a[j].examineUser.userEntity.name,
                size: "11",
                x: 0,
                y: -60,
                color: this.labelColor[i]
              },
              image: {
                // url: this.fileUrl + a[j].equipmentUnit.equipmentType.faceBase64,
                url: require("../../assets/img/TCR173 高速数据电台模拟器.png"),
                width: 50,
                height: 50,
              }
            }
            command.addMarker(3, obj, this.debounce(this.receiveMap, 200), this.clickImg, this.upDwun)
          }
        }
      },
      debounce(func, wait) {
        let timeout;
        return function () {
          let that = this;
          let args = arguments;
          if (timeout) clearTimeout(timeout);
          timeout = setTimeout(() => {
            func.apply(that, args)
          }, wait)
        }
      },
      addmap() {
        // 镜头位置
        let init = new NipCesium.Init('cesiumContainer', this.viewModes, this.receiveMapInfo,
          this.mapLoadNullFunc, () => {
          }, {
            x: "106.379390",
            y: "29.534726",
            z: "13000"
          }, this.mode);
        // 上面这个就是中心点位置,与主体软件是一样的
        viewer = init.viewer;
        command = new NipCesium.Command();
      },
      mapLoadNullFunc(e) {
        // console.log("地图加载完了")
      },
      receiveMapInfo(e) {
        this.mapBaseData = e;
      },
      //回到起始点
      positionMe() {
        command.positionMe({x: "106.379390", y: "29.534726", z: "13000"});
      }
      ,
      // 拖动
      receiveMap(e) {

      },
      clickImg(e) {

      },
      upDwun(e) {

      },
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




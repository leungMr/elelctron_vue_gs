# cesium

创建人：邓文明

创建时间：2021-02-02

场景：3D地图组件

## 定义图源
```
创建地图需要的图源；
 viewModes: [
          {
            name: "卫星影像",
            tooltip: "卫星影像",
            iconUrl: layer_yx,
            type: 0,
            url: config.url.map.topographicMap
          },
          {
            name: "等高线图",
            tooltip: "等高线图",
            iconUrl: layer_dg,
            type: 0,
            url: config.url.map.contourMap
          },
          {
            name: "90M高程",
            tooltip: "90M高程",
            iconUrl: layer_dg,
            type: 1,
            url: config.url.map.elevationMaps
          }
        ]
 ```       
 ### mounted中引入
  ```
  地图实体创建到Windows下，不要挂载到vue的data里，性能有影响
  
          let init = new NipCesium.Init('cesiumContainer', this.viewModes, this.receiveMapInfo, this.loadingComplete, {
            x: config.url.map.lon,
            y: config.url.map.lat,
            z: config.url.map.height
          }, 3);
          viewer = init.viewer;
          command = new NipCesium.Command();
          measure = new Cesium.Measure(viewer)
          mp = new NipCesium.MilitaryPlotting(true, "rgba(0,255,0,0.6)");
```
### 地图API

####删除地图
```
command.removeMap() ;//并把创建的地图实体清空
```

####实时获取经纬度
```
//加载地图时
receiveMapInfo(e) ;//接收e的值
```

####地图瓦片加载完毕回调
```
loadingComplete() ;
```

####添加文字描述图片
```
   let obj= {
        id: 图片ID,
        lng: 经度,
        lat: 纬度,
        alt: 高度,//不传为默认贴地
        noDragging: 是否可以拖动,
        label: { //label文字
          name: //label文字,
          size: 文字大小,
          x: 文字位置,
          y: 文字位置,
          color: 文字颜色,
        },
       image: {
          url: 图片路径,
          width: 图片宽度,
          height: 图片高度,
          color: 图片颜色
       },
     }

command.addMarker(3,obj,拖动图片的方法, 点击拖动图片的方法, 鼠标按下图片的方法);
```

####添加飞线
```
let obj= {
      id: 飞线id,
      start: {
        name: '点aa一',
        x: 106.253081,
        y: 29.596626,
        h: 283.3
      },
      to: {
        name: '点aa二',
        x: 106.403754,
        y: 29.595537,
        h: 522.5
      },
      peakHeight: 1000
    }
 command.addLine(1,obj);
```

####删除实体
```
command.deleteEntity();//传入需要删除实体的ID
```

####镜头旋转
```           
                     开启或关闭旋转           旋转需要的经纬度和高度
command.addMarker(4, true/false, {x: "29.598239330361537", y: "106.37250154072453", z: "15.5"});
```

####文字标注线
```
let obj= {
      id: '123',
      color: "rgba(255,0,0,1)",
      text: "距离太远了",
      fontColor: "rgba(255,255,255,1)",
      altitude: 200,
      start: {
        name: '点aa一',
        x: 106.253081,
        y: 29.596626,
        h: 283.3
      },
      to: {
        name: '点aa二',
        x: 106.403754,
        y: 29.595537,
        h: 522.5
      },
      peakHeight: 1000
    },
    command.addMarker(5,obj);
```


####获取所有线段
```
command.getLines();
```
####获取所有图片
```
command.getImgs();
```
####添加3D模型
```
let obj = {
  id: "123",
  name: "飞机",
  lon: "106.37198678771822",
  lat: "29.601218448869593",
  alt: "1000",
  HeadingPitchRoll: [130, -90, 80],//头部俯仰角
  modelUrl: "http://10.10.0.99:8000/api/file/getFile/gltfl/fbx/missile/daodan.gltf",//模型路径
  scale: 10,//模型放大倍数
  modelSize: 100,
};
command.addMarker(6, obj);
```
####添加圆扩散扫描
```
command.showCircleScan();
```
####添加雷达扫描
```
command.showRadarScan();
```
####回到起始点
```
command.positionMe();
```
####点击获取经纬度
```
                      传入获取经纬度方法
command.addMarker(7, this.getxyz);
```
####生成飞行实体
```
let obj = {
  blackBox: [
    {longitude: 106.36881417, dimension: 29.57344987, height: 1000, time: 0},
    {longitude: 106.32216168, dimension: 29.64088978, height: 1000, time: 10},
    {longitude: 106.40456339, dimension: 29.63486246, height: 1000, time: 20},
    {longitude: 106.36881417, dimension: 29.57344987, height: 1000, time: 30},
  ],//飞行路径list
  id: "1100",飞行物ID
  multiplier: 1,飞行速率
  stop: 30,结束时间
  clockRange: true,是否循环飞行
  model: {
    uri: 'http://10.10.0.99:8000/api/file/getFile/image/model3D/Cesium_Air.glb',飞行物引入路径
    minimumPixelSize: 80, 飞行物大小
    color: "rgba(0,194,255,1)" 飞行物颜色
  },
  path: { //飞行路径显示
    color: "",
    width: "5",
  },
  cylinder: { 飞行物下扫描动画
    width: 1000,
    color: "rgba(255,255,0,0)",
    numberOfVerticalLines: 50,
    lineColor: "rgba(255,255,0,0)",
  },
  interpolationDegree: 5,
};
command.flight(obj)
```
####创建热力图
```     
                 热力图实体      热力图范围
command.heatMap(canvas, {latMin: latMin, latMax: latMax, lonMin: lonMin, lonMax: lonMax})

```
####创建圆锥
```
let obj = {
  id: "shan",
  name: "山",
  lon: "106.351047",                 //经度
  lat: "29.586362",                  //维度
  alt: "44000",                      //离地高度
  color:"rgba(128,128,128,1)",       //圆锥颜色
  height:500000,                     //圆锥高度
  bottomRadius:500000                //圆锥底部直径
};
command.cone(obj)
```
####天气
```
command.weather(0,true); //
```
####开启节点编辑
```
mp.controlDrawEdit(true/false);

```
####js标绘
```
 [
          {
            id: 100,
            name: "点"
          },
          {
            id: 101,
            name: "线"
          },
          {
            id: 102,
            name: "曲线"
          },
          {
            id: 103,
            name: "自由线"
          },
          {
            id: 104,
            name: "面"
          },
          {
            id: 105,
            name: "自由面"
          },
          {
            id: 106,
            name: "圆"
          },
          {
            id: 107,
            name: "椭圆"
          },
          {
            id: 108,
            name: "矩形"
          },
          {
            id: 109,
            name: "弓形线"
          },
          {
            id: 110,
            name: "闭合曲面"
          },
          {
            id: 111,
            name: "弓形"
          },
          {
            id: 112,
            name: "扇形"
          },
          {
            id: 113,
            name: "集结地"
          },
          {
            id: 114,
            name: "粗单直箭头"
          },
          {
            id: 115,
            name: "进攻方向"
          },
          {
            id: 116,
            name: "进攻方向（尾）"
          },
          {
            id: 117,
            name: "分队战斗行动"
          },
          {
            id: 118,
            name: "分队战斗行动（尾）"
          },
          {
            id: 119,
            name: "细单直箭头"
          },
          {
            id: 120,
            name: "钳击"
          },
          {
            id: 121,
            name: "矩形旗"
          },
          {
            id: 122,
            name: "三角旗"
          },
          {
            id: 123,
            name: "波浪旗"
          }
        ]
mp.draw(type); //type标绘的id
```



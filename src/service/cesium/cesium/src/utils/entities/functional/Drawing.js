import {getLinkedPointList} from "../../Bezier";
import {LineFlowMaterialProperty} from './polylineLineFlowMaterial';
import "../lib/CesiumGeometry"
let tempEntities = [];
let imgList=[];
//画点
export function drawPoints(callback) {
  // const that = this;
  let position = [];
  let handler = new Cesium.ScreenSpaceEventHandler(earth.scene.canvas);
  handler.setInputAction(function (movement) {
    position = earth.camera.pickEllipsoid(movement.position, earth.scene.globe.ellipsoid);
    let point = drawPoint(position);
    tempEntities.push(point);
    let arr = [];
    for (let j of tempEntities) {
      arr.push(Cartesian3_to_WGS84(j.position._value))
    }
    console.log(arr)
    if (arr.length === 2) {
      let lentns = getFlatternDistance(arr[0].lat, arr[0].lng, arr[1].lat, arr[1].lng)
      console.log("直线距离约" + parseInt(lentns) + "米")
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  handler.setInputAction(function () {
    handler.destroy();//关闭事件句柄
    handler = null;
  }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
  handler.setInputAction(function () {
    handler.destroy();//关闭事件句柄
    handler = null;
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}
//画线
export function drawLineString(callback) {
  let handler = new Cesium.ScreenSpaceEventHandler(earth.scene.canvas);
  let tempPoints = [];
// //鼠标移动事件
//   handler.setInputAction(function (movement) {
//     tooltip.style.left = movement.endPosition.x + 10 + "px";
//     tooltip.style.top = movement.endPosition.y + 20 + "px";
//   }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
//左键点击操作
  handler.setInputAction(function (click) {
//调用获取位置信息的接口
    let position = earth.camera.pickEllipsoid(click.position, earth.scene.globe.ellipsoid);
    tempPoints.push(position);
    let tempLength = tempPoints.length;
//调用绘制点的接口
    let point = drawPoint(tempPoints[tempPoints.length - 1]);
    tempEntities.push(point);
    if (tempLength > 1) {
      let pointline = drawPolyline([tempPoints[tempPoints.length - 2], tempPoints[tempPoints.length - 1]]);
      tempEntities.push(pointline);
    }
    return;
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
//右键点击操作
  handler.setInputAction(function (click) {

    tempPoints = [];
    handler.destroy();//关闭事件句柄
    handler = null;
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}

//画面
export function drawArea(callback) {

  let tempPoints = [];
  let handler = new Cesium.ScreenSpaceEventHandler(earth.scene.canvas);
// //鼠标移动事件
//   handler.setInputAction(function (movement) {
//     tooltip.style.left = movement.endPosition.x + 10 + "px";
//     tooltip.style.top = movement.endPosition.y + 20 + "px";
//   }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
//左键点击操作
  handler.setInputAction(function (click) {
//调用获取位置信息的接口
    let position = earth.camera.pickEllipsoid(click.position, earth.scene.globe.ellipsoid);
    tempPoints.push(position);
    let tempLength = tempPoints.length;
//调用绘制点的接口
    let point = drawPoint(position);
    tempEntities.push(point);
    if (tempLength > 1) {
      let pointline = drawPolyline([tempPoints[tempPoints.length - 2], tempPoints[tempPoints.length - 1]]);
      tempEntities.push(pointline);
    }
    return;

  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
//右键点击操作
  handler.setInputAction(function (click) {
    let cartesian = earth.camera.pickEllipsoid(click.position, earth.scene.globe.ellipsoid);
    if (cartesian) {
      let tempLength = tempPoints.length;
      if (tempLength < 3) {
        alert('请选择3个以上的点再执行闭合操作命令');
      } else {
//闭合最后一条线
        let pointline = drawPolyline([tempPoints[tempPoints.length - 1], tempPoints[0]]);
        tempEntities.push(pointline);
        drawPolygon(tempPoints);
        tempEntities.push(tempPoints);
        handler.destroy();//关闭事件句柄
        handler = null;
      }
    }
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}

//画点方法
function drawPoint(position, config) {
  config = config ? config : {};
  let pointGeometry = earth.entities.add({
    name: "点",
    position: position,
    point: {
      color: Cesium.Color.RED,
      pixelSize: 5,
      // outlineColor: Cesium.Color.YELLOW,
      // outlineWidth: 3,
      disableDepthTestDistance: Number.POSITIVE_INFINITY
    }
  });
  return pointGeometry;
}

//画面方法
function drawPolygon(positions, config) {
  if (positions.length < 2) return;
  config = config ? config : {};
  let polygonGeometrys = earth.entities.add({
    name: "面",
    polygon: {
      height: 0.1,
      hierarchy: new Cesium.PolygonHierarchy(positions),
      material: config.color ? new Cesium.Color.fromCssColorString(config.color).withAlpha(.2) : new Cesium.Color.fromCssColorString("#FFD700").withAlpha(.2),
      perPositionHeight: true,
    }
  });
  return polygonGeometrys;
}
let lineList=[];
//画线方法和添加线段
export function drawPolyline(positions, config) {
  config = config ? config : {};
  let item=0;
  if (lineList.length===0) {
    lineList.push(positions);
  }else {
    for (let j in lineList) {
      if (lineList[j].id===positions.id) {
        lineList[j]=positions;
      }  else {
        item++;
      }
    }
    if (item === lineList.length) {
      lineList.push(positions);
      item = 0;
    }
  }
  let polylineGeometry = earth.entities.add({
    id: positions.id,
    name: "线",
    polyline: {
      positions: getLinkedPointList(Cesium.Cartesian3.fromDegrees(positions.start.x, positions.start.y, positions.start.h ? positions.start.h : 1), Cesium.Cartesian3.fromDegrees(positions.to.x, positions.to.y, positions.to.h ? positions.to.h : 1)),
      width: 3,
      material: new Cesium.PolylineGlowMaterialProperty({
        color:  Cesium.Color.fromCssColorString(positions.color),
      }),
    },
  });
  let x = (positions.start.x + positions.to.x) / 2;
  let y = (positions.start.y + positions.to.y) / 2;
  // let h = positions.start.h > positions.to.h ? positions.start.h : positions.to.h;
  // let gap = getFlatternDistance(positions.start.y, positions.start.x, positions.to.y, positions.to.x);
  labelPosition(x, y, positions.altitude?positions.altitude:0, positions.text, positions.id,positions.fontColor);
  return polylineGeometry;
}
export function getLines(){
 return lineList
}
//添加线段文字
function labelPosition(x, y, h, gap, id,color) {
  let height = null;
    let ll = new Cesium.Cartographic.fromDegrees(Number(x), Number(y));
    height = earth.scene.globe.getHeight(ll);
  let label = new Cesium.Entity({
    position: Cesium.Cartesian3.fromDegrees(x, y, height+Number(h)),
    name: "坐标",
    id: "label" + id,
    label: {
      text: gap,//文字 string
      font: "12pt monospace",//字体大小 string
      fillColor:  Cesium.Color.fromCssColorString(color),
      style: Cesium.LabelStyle.FILL,
      outlineWidth: 2,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    },
  });
  earth.entities.add(label);
}

//笛卡尔坐标系转WGS84坐标系
function Cartesian3_to_WGS84(point) {
  var cartesian33 = new Cesium.Cartesian3(point.x, point.y, point.z);
  var cartographic = Cesium.Cartographic.fromCartesian(cartesian33);
  var lat = Cesium.Math.toDegrees(cartographic.latitude);
  var lng = Cesium.Math.toDegrees(cartographic.longitude);
  var alt = cartographic.height;
  return {lat: lat, lng: lng, alt: alt};
}

//WGS84坐标系转笛卡尔坐标系
function WGS84_to_Cartesian3(point) {
  let car33 = Cesium.Cartesian3.fromDegrees(point.lng, point.lat, point.alt);
  let x = car33.x;
  let y = car33.y;
  let z = car33.z;
  return {x: x, y: y, z: z}
}

//计算两点间距离
function getFlatternDistance(lat1, lng1, lat2, lng2) {
  var EARTH_RADIUS = 6378137.0;    //单位M
  var PI = Math.PI;

  function getRad(d) {
    return d * PI / 180.0;
  }

  var f = getRad((lat1 + lat2) / 2);
  var g = getRad((lat1 - lat2) / 2);
  var l = getRad((lng1 - lng2) / 2);

  var sg = Math.sin(g);
  var sl = Math.sin(l);
  var sf = Math.sin(f);

  var s, c, w, r, d, h1, h2;
  var a = EARTH_RADIUS;
  var fl = 1 / 298.257;

  sg = sg * sg;
  sl = sl * sl;
  sf = sf * sf;

  s = sg * (1 - sl) + (1 - sf) * sl;
  c = (1 - sg) * (1 - sl) + sf * sl;

  w = Math.atan(Math.sqrt(s / c));
  r = Math.sqrt(s * c) / w;
  d = 2 * w * a;
  h1 = (3 * r - 1) / 2 / c;
  h2 = (3 * r + 1) / 2 / s;

  return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
}
//添加图片
export function addImg(imgObj, receiveMapInfoTwo,clickImg,upDown) {
  let item=0;
  if (imgList.length===0) {
    imgList.push(imgObj);
  }else {
    for (let j in imgList) {
      if (imgList[j].id===imgObj.id) {
        imgList[j]=imgObj;
      }  else {
        item++;
      }
    }
    if (item === imgList.length) {
      imgList.push(imgObj);
      item = 0;
    }
  }
  let height = null;
  if (!imgObj.alt) {
    let ll = new Cesium.Cartographic.fromDegrees(Number(imgObj.lng), Number(imgObj.lat));
    height = earth.scene.globe.getHeight(ll);
  }
  earth.entities.add({
    id: imgObj.id === "" ? "" : imgObj.id, //图片ID string
    position: Cesium.Cartesian3.fromDegrees(Number(imgObj.lng?imgObj.lng:"106.253081"), Number(imgObj.lat?imgObj.lat:"29.596626"), height ? height : Number(imgObj.alt?imgObj.alt:"500")), //图片经度，纬度，高程。 number'
    clampToGround: true,
    data:imgObj.data,
    label: {
      text: imgObj.label.name,//文字 string
      font: imgObj.label.size == null ? "12" : imgObj.label.size + "pt monospace",//字体大小 string
      fillColor: Cesium.Color.fromCssColorString(imgObj.label.color?imgObj.label.color:"rgba(0,0,0,0)"),
      backgroundColor:Cesium.Color.fromCssColorString(imgObj.label.bgColor?imgObj.label.bgColor:"rgba(0,0,0,0)"),
      backgroundPadding:new Cesium.Cartesian2(-18,-9),
      showBackground:true,
      style: Cesium.LabelStyle.FILL,
      outlineWidth: 2,
      verticalOrigin: Cesium.VerticalOrigin.TOP,
      pixelOffset: new Cesium.Cartesian2(Number(imgObj.label.x), Number(imgObj.label.y))//字体位置 number
    },
    billboard: {
      image: imgObj.image.url,//图片路径 string
      width: imgObj.image.width == null ? 60 : imgObj.image.width,//图片宽 number
      height: imgObj.image.height == null ? 60 : imgObj.image.height,//图片高 number
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      color:Cesium.Color.fromCssColorString(imgObj.image.color?imgObj.image.color:"")
    }
  });
  let pointDraged = null;
  let leftDownFlag = false;
  earth.screenSpaceEventHandler.setInputAction(leftDownAction, Cesium.ScreenSpaceEventType.LEFT_DOWN);
  earth.screenSpaceEventHandler.setInputAction(leftUpAction, Cesium.ScreenSpaceEventType.LEFT_UP);
  earth.screenSpaceEventHandler.setInputAction(mouseMoveAction, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  earth.screenSpaceEventHandler.setInputAction(leftDoubleClickAction, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

  function leftDownAction(e) {
    pointDraged = earth.scene.pick(e.position);//获取当前图片
    if (pointDraged) {
      upDown(pointDraged.id.id)
    }else {
      upDown(pointDraged)
    }
    leftDownFlag = true;
    if (pointDraged) {
      earth.scene.screenSpaceCameraController.enableRotate = false;//锁定相机
    }
  }

  function leftUpAction() {
    pointDraged = null;
    leftDownFlag = false;
    earth.scene.screenSpaceCameraController.enableRotate = true;
  }

  let ad = !imgObj.noDragging ? imgObj.noDragging : true; //禁止拖动true和false
  function mouseMoveAction(e) {
    if (ad === true) {
      return
    }
    if (pointDraged) {
      if (pointDraged.id.name==="yuan") return;
    }
    if (leftDownFlag === true && pointDraged != null) {
      let ray = earth.camera.getPickRay(e.endPosition);
      let cartesian = earth.scene.globe.pick(ray, earth.scene);
      if (cartesian) {
        let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        let y = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6);
        let x = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6);
        let z = cartographic.height.toFixed(2);
        pointDraged.id.position = Cesium.Cartesian3.fromDegrees(Number(x), Number(y), Number(z));
        for (let j in imgList) {
          if (imgList[j].id===pointDraged.id.id) {
            imgList[j].lng=x;
            imgList[j].lat=y
          }
        }
        receiveMapInfoTwo({
          id: pointDraged.id.id,
          name: pointDraged.id.label.text._value,
          coordinate: {
            x: x,
            y: y,
            z: z
          }
        })
      }
    }
  }

  function leftDoubleClickAction(e) {
    let active=earth.scene.pick(e.position);//获取当前实体
    if (active) {
      clickImg(active.id.id)
    }else {
      clickImg(active)
    }
  }
}
export function getImgs(){
  return imgList
}
//点击获取经纬度高度
export function getxyz(obj) {
  let handler = new Cesium.ScreenSpaceEventHandler(earth.scene.canvas);
  handler.setInputAction(function (e) {
    let ray = earth.camera.getPickRay(e.position);
    let cartesian = earth.scene.globe.pick(ray, earth.scene);
    if (cartesian) {
      let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      let x = Cesium.Math.toDegrees(cartographic.longitude).toFixed(8);
      let y = Cesium.Math.toDegrees(cartographic.latitude).toFixed(8);
      let z = cartographic.height.toFixed(2);
      obj({x:x,y:y,z:z})
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}
//添加3D模型
export function add3dModel(obj) {
  let position= Cesium.Cartesian3.fromDegrees(Number(obj.lon),Number(obj.lat),Number(obj.alt));//经纬度高程
  let heading=Cesium.Math.toRadians(Number(obj.HeadingPitchRoll[0]));
  let pitch=Number(obj.HeadingPitchRoll[1]);
  let roll=Number(obj.HeadingPitchRoll[2]);
  let hpr= new Cesium.HeadingPitchRoll(heading,pitch,roll);//头部俯仰角
  let orientation=Cesium.Transforms.headingPitchRollQuaternion(
    position,
    hpr
  );
  let entity=earth.entities.add({
    name:obj.name,
    id:obj.id+"3dModel",
    position:position,
    orientation:orientation,
    model:{
      uri:obj.modelUrl,
      minimumPixelSize:Number(obj.modelSize),
      maximumScale:20000,
      scale:Number(obj.scale),
    }
  });
  let handler = new Cesium.ScreenSpaceEventHandler(earth.scene.canvas);
  handler.setInputAction(function (evt) {
    let pickedObject=earth.scene.pick(evt.position);
    if (pickedObject) {
      if (pickedObject.id.id.substring(pickedObject.id.id.length-7)==="3dModel"){
        earth.trackedEntity=pickedObject.id;
      }
    }else {
      earth.trackedEntity=null;
    }
  },Cesium.ScreenSpaceEventType.LEFT_CLICK)
}
let num=-1;
//镜头旋转
export function rotate(e,val) {
  if (num<0) {
    let handler = new Cesium.ScreenSpaceEventHandler(earth.scene.canvas);
    handler.setInputAction(function () {
      rotate(true,val)
      num++;
      handler.destroy();//关闭事件句柄
      handler = null;
    },Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }else {
    num=-1
  }
  let options = {
    lng:Number(val.y?val.y:"29.598239"),
    lat: Number(val.x?val.x:"106.372501"),
    height: Number(val.z?val.z:"15.5"),
    heading: 0.0,
    pitch: 0.0,
    roll: 0.0
  };
  let position = Cesium.Cartesian3.fromDegrees(options.lng, options.lat, options.height);
// 相机看点的角度，如果大于0那么则是从地底往上看，所以要为负值，这里取-30度
  let pitch = Cesium.Math.toRadians(-45);
// 给定飞行一周所需时间，比如10s, 那么每秒转动度数
  let angle = 360 / 30;
// 给定相机距离点多少距离飞行，这里取值为5000m
  let distance = 10000;
  let startTime = Cesium.JulianDate.fromDate(new Date());
  let s = 1000;
  if (e) {
    s = 0
  }
  let stopTime = Cesium.JulianDate.addSeconds(startTime, s, new Cesium.JulianDate());

  earth.clock.startTime = startTime.clone();  // 开始时间
  earth.clock.stopTime = stopTime.clone();     // 结速时间
  earth.clock.currentTime = startTime.clone(); // 当前时间
  earth.clock.clockRange = Cesium.ClockRange.CLAMPED; // 行为方式
  earth.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK; // 时钟设置为当前系统时间; 忽略所有其他设置。
// 相机的当前heading
  let initialHeading = earth.camera.heading;
  let Exection = function TimeExecution() {
    // 当前已经过去的时间，单位s
    let delTime = Cesium.JulianDate.secondsDifference(earth.clock.currentTime, earth.clock.startTime);
    let heading = Cesium.Math.toRadians(delTime * angle) + initialHeading;
    earth.scene.camera.setView({
      destination: position, // 点的坐标
      orientation: {
        heading: heading,
        pitch: pitch,
      }
    });
    earth.scene.camera.moveBackward(distance);
    if (Cesium.JulianDate.compare(earth.clock.currentTime, earth.clock.stopTime) >= 0) {
      earth.clock.onTick.removeEventListener(Exection);
    }
  };

  earth.clock.onTick.addEventListener(Exection);
}
//计算高程
export function reckon(e) {
  let ll = new Cesium.Cartographic.fromDegrees(Number(e.x), Number(e.y));
  return earth.scene.globe.getHeight(ll);
}
//

export function deleteLine(object, viewer) {
  let obj = viewer.entities.getById(object);
  if (obj) {
    viewer.entities.remove(obj)
  }
  for (let j in lineList) {
    if (object===lineList[j].id) {
      lineList.splice(j,1)
    }
  }
  for (let j in imgList) {
    if (object===imgList[j].id) {
      imgList.splice(j,1)
    }
  }
}

const pointNum = 50;
export function baseLine(object, viewer) {
  let item=0;
  if (lineList.length===0) {
    lineList.push(object);
  }else {
    for (let j in lineList) {
      if (lineList[j].id===object.id) {
        lineList[j]=object;
      }  else {
        item++;
      }
    }
    if (item === lineList.length) {
      lineList.push(object);
      item = 0;
    }
  }
  line(0, object, viewer)
}

export function animationLine(object, viewer) {
  let item=0;
  if (lineList.length===0) {
    lineList.push(object);
  }else {
    for (let j in lineList) {
      if (lineList[j].id===object.id) {
        lineList[j]=object;
      }  else {
        item++;
      }
    }
    if (item === lineList.length) {
      lineList.push(object);
      item = 0;
    }
  }
  line(1, object, viewer)
}

function line(type, object, viewer) {
  const start = object.start;
  const to = object.to;
  const peakHeight = object.peakHeight;
  // if (start.h) {
  //   let promise = Cesium.sampleTerrain(terrain, terrainLevel, [Cesium.Cartographic.fromDegrees(start.x, start.y), Cesium.Cartographic.fromDegrees(to.x, to.y)]);
  //   Cesium.when(promise, function (updatedPositions) {
  //     createLine(type, object.id, Cesium.Cartesian3.fromDegrees(start.x, start.y, updatedPositions[0].height.toFixed(2)), Cesium.Cartesian3.fromDegrees(to.x, to.y, updatedPositions[1].height.toFixed(2)), peakHeight ? peakHeight : 10000, viewer)
  //   });
  // } else {
  createLine(type, object.id, Cesium.Cartesian3.fromDegrees(start.x, start.y, start.h ? start.h : 1), Cesium.Cartesian3.fromDegrees(to.x, to.y, to.h ? to.h : 1), peakHeight ? peakHeight : 10000, viewer)
  // }

}

function createLine(type, id, start, end, peakHeight, viewer) {
  if (type === 0) {
    return viewer.entities.add({
      id: id,
      name: start.name,
      polyline: {
        positions: getLinkedPointList(start, end, peakHeight, pointNum),
        width: 2,
        material: new Cesium.PolylineGlowMaterialProperty({
          color: Cesium.Color.ORANGE,
          taperPower: 10
        }),
      },
    });
  } else {
    return viewer.entities.add({
      id: id,
      name: start.name,
      polyline: {
        positions: getLinkedPointList(start, end, peakHeight, pointNum),
        width: 2,
        material: new LineFlowMaterialProperty(new Cesium.Color(1, 0.79, 0.15, 1), 2e3),
      },
    });
  }
}


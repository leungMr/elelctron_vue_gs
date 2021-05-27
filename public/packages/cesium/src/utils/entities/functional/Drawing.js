import {getLinkedPointList} from "../../Bezier";
import {LineFlowMaterialProperty} from './polylineLineFlowMaterial';
import "../lib/CesiumGeometry"
let imgList=[];
let lineList=[];
const pointNum = 50;
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
//获取图片list
export function getImgs(){
  return imgList
}
//添加线段
export function drawPolyline(positions) {
  // config = config ? config : {};
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
//获取线段list
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
//删除线
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
//直线
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
//动画线
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

// //WGS84坐标系转笛卡尔坐标系
// function WGS84_to_Cartesian3(point) {
//   let car33 = Cesium.Cartesian3.fromDegrees(point.lng, point.lat, point.alt);
//   let x = car33.x;
//   let y = car33.y;
//   let z = car33.z;
//   return {x: x, y: y, z: z}
// }
//
// //笛卡尔坐标系转WGS84坐标系
// function Cartesian3_to_WGS84(point) {
//   var cartesian33 = new Cesium.Cartesian3(point.x, point.y, point.z);
//   var cartographic = Cesium.Cartographic.fromCartesian(cartesian33);
//   var lat = Cesium.Math.toDegrees(cartographic.latitude);
//   var lng = Cesium.Math.toDegrees(cartographic.longitude);
//   var alt = cartographic.height;
//   return {lat: lat, lng: lng, alt: alt};
// }
//
// //计算两点间距离
// function getFlatternDistance(lat1, lng1, lat2, lng2) {
//   var EARTH_RADIUS = 6378137.0;    //单位M
//   var PI = Math.PI;
//
//   function getRad(d) {
//     return d * PI / 180.0;
//   }
//
//   var f = getRad((lat1 + lat2) / 2);
//   var g = getRad((lat1 - lat2) / 2);
//   var l = getRad((lng1 - lng2) / 2);
//
//   var sg = Math.sin(g);
//   var sl = Math.sin(l);
//   var sf = Math.sin(f);
//
//   var s, c, w, r, d, h1, h2;
//   var a = EARTH_RADIUS;
//   var fl = 1 / 298.257;
//
//   sg = sg * sg;
//   sl = sl * sl;
//   sf = sf * sf;
//
//   s = sg * (1 - sl) + (1 - sf) * sl;
//   c = (1 - sg) * (1 - sl) + sf * sl;
//
//   w = Math.atan(Math.sqrt(s / c));
//   r = Math.sqrt(s * c) / w;
//   d = 2 * w * a;
//   h1 = (3 * r - 1) / 2 / c;
//   h2 = (3 * r + 1) / 2 / s;
//
//   return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
// }

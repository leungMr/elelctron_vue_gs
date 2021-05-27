let activeShapePoints = [];
let activeShape;
let floatingPoint;
let shape;
let radius=null;
export function round(blast) {
  let handler = new Cesium.ScreenSpaceEventHandler(window.earth.scene.canvas);
  //鼠标左键
  handler.setInputAction(function (event) {
    let earthPosition = window.earth.scene.pickPosition(event.position);
    if (Cesium.defined(earthPosition)) {
      if (activeShapePoints.length === 0) {
        floatingPoint = createPoint(earthPosition);
        activeShapePoints.push(earthPosition);
        let dynamicPositions = new Cesium.CallbackProperty(function () {
          return activeShapePoints;
        }, false);
        activeShape = drawShape(dynamicPositions);//绘制动态图
      }
      activeShapePoints.push(earthPosition);
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  //鼠标移动
  handler.setInputAction(function (event) {
    if (Cesium.defined(floatingPoint)) {
      let newPosition = window.earth.scene.pickPosition(event.endPosition);
      if (Cesium.defined(newPosition)) {
        floatingPoint.position.setValue(newPosition);
        activeShapePoints.pop();
        activeShapePoints.push(newPosition);
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  //鼠标右键
  handler.setInputAction(function () {
    terminateShape();
    let xyz=Cartesian3_to_WGS84(shape._position._value);
    blast(xyz,radius)
    handler.destroy();//关闭事件句柄
    handler = null;
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}

export function deleteRound() {
  window.earth.entities.remove(shape)
}
//绘制点
function createPoint(worldPosition) {
  let point = window.earth.entities.add({
    position: worldPosition,
    point: {
      color: Cesium.Color.RED,
      pixelSize: 5,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
    }
  });
  return point;
}

//绘制图形
function drawShape(positionData) {
  //当positionData为数组时绘制最终图，如果为function则绘制动态图
  let value = typeof positionData.getValue === 'function' ? positionData.getValue(0) : positionData;
  radius=parseInt(Math.sqrt(Math.pow(value[0].x - value[value.length - 1].x, 2) + Math.pow(value[0].y - value[value.length - 1].y, 2)))
  shape = window.earth.entities.add({
    position: activeShapePoints[0],
    name: 'yuan',
    type: 'Selection tool',
    ellipse: {
      semiMinorAxis: new Cesium.CallbackProperty(function () {
        //半径 两点间距离
        let r = Math.sqrt(Math.pow(value[0].x - value[value.length - 1].x, 2) + Math.pow(value[0].y - value[value.length - 1].y, 2));
        return r ? r : r + 1;
      }, false),
      semiMajorAxis: new Cesium.CallbackProperty(function () {
        let r = Math.sqrt(Math.pow(value[0].x - value[value.length - 1].x, 2) + Math.pow(value[0].y - value[value.length - 1].y, 2));
        return r ? r : r + 1;
      }, false),
      material: Cesium.Color.RED.withAlpha(0.5),
      outline: true
    }
  });
  return shape;
}

function terminateShape() {
  activeShapePoints.pop();//去除最后一个动态点
  if (activeShapePoints.length) {
    drawShape(activeShapePoints);//绘制最终图
  }
  window.earth.entities.remove(floatingPoint);//去除动态点图形（当前鼠标点）
  window.earth.entities.remove(activeShape);//去除动态图形
  floatingPoint = undefined;
  activeShape = undefined;
  activeShapePoints = [];
}

//笛卡尔坐标系转WGS84坐标系
function Cartesian3_to_WGS84(point) {
  let cartesian33 = new Cesium.Cartesian3(point.x, point.y, point.z);
  let cartographic = Cesium.Cartographic.fromCartesian(cartesian33);
  let lat = Cesium.Math.toDegrees(cartographic.latitude);
  let lng = Cesium.Math.toDegrees(cartographic.longitude);
  let alt = cartographic.height;
  return {lat: lat, lng: lng, alt: alt};
}

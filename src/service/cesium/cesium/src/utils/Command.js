import {getBezierArray} from "./Bezier";
import {drawPoints, drawLineString, drawArea, addImg, rotate, drawPolyline,add3dModel,getxyz,reckon,getLines,baseLine, animationLine,deleteLine,getImgs} from './entities/functional/Drawing'
import {reset} from "./entities/functional/reset"
import {flight} from "./entities/functional/flight"
import {heatMap} from "./entities/functional/heatMap"
import {round,deleteRound} from "./entities/functional/round"
import {missile,boom} from "./entities/functional/missile"
import {showCircleScan,showRadarScan} from "./entities/functional/Radar"
import {cone} from "./entities/functional/cone"
import {scanning} from "./entities/functional/scanning"
import { createSnowStage,createRainStage } from "./entities/functional/weather"

function Command() {
}

Command.prototype = {
  calcPathElevation: function (start, end, callback) {
    let s = Cesium.Cartesian3.fromDegrees(start[0], start[1], start[2]);
    let e = Cesium.Cartesian3.fromDegrees(end[0], end[1], end[2]);
    let positions = [Cesium.Cartographic.fromCartesian(s)];
    // 插值100个点（自定义）
    let count = 100;
    for (let i = 1; i < count; i++) {
      let cart = Cesium.Cartesian3.lerp(s, e, i / count, new Cesium.Cartesian3());
      positions.push(Cesium.Cartographic.fromCartesian(cart));
    }
    positions.push(Cesium.Cartographic.fromCartesian(e));

    let promise = Cesium.sampleTerrainMostDetailed(earth.terrainProvider, positions);
    Cesium.when(promise, callback);
  },
  bezier: function (x1, y1, z1, x2, y2, z2) {
    return getBezierArray(x1, y1, z1, x2, y2, z2)
  },
  //添加线
  addLine: function (type, object) {
    switch (type) {
      case 0:
        baseLine(object, earth);
        break;
      case 1:
        animationLine(object, earth);
        break;
    }
  },
  deleteEntity: function (object) {
    deleteLine(object, earth);
  },
  addMarker: function (type, obj, receiveMapInfoTwo,clickImg,upDown) {
    switch (type) {
      case 0:
        drawPoints([], earth);
        break;
      case 1:
        drawLineString(obj, earth);
        break;
      case 2:
        drawArea([], earth);
        break;
      case 3:
        addImg(obj, receiveMapInfoTwo,clickImg,upDown);
        break;
      case 4:
        rotate(obj,receiveMapInfoTwo);
        break;
      case 5:
        drawPolyline(obj);
        break;
      case 6:
        add3dModel(obj);
        break;
      case 7:
        getxyz(obj);
      break;
    }
  },
  positionMe:function () {
    reset()
  },
  flight:function(obj){
    flight(obj)
  },
  heatMap:function(obj,ns){
    heatMap(obj,ns)
  },
  reckon:function(e){
   return reckon(e)
  },
  removeMap:function () {
    window.earth.destroy()
    window.earth=null
  },
  round:function (blast) {
    round(blast)
  },
  deleteRound:function () {
    deleteRound()
  },
  missile:function (obj) {
    missile(obj)
  },
  boom:function (e,val) {
    boom(e,val)
  },
  getLines:function(){
    return getLines();
  },
  getImgs:function () {
    return getImgs();
  },
  add3dTiles(url,height){
    let tileset = new Cesium.Cesium3DTileset({
      url:url,
      maximumScreenSpaceError: 2,        //最大的屏幕空间误差
      maximumNumberOfLoadedTiles: 5000,  //最大加载瓦片个数
    });
    window.earth.scene.primitives.add(tileset);
    tileset.readyPromise.then(function (currentModel) {
      let boundingSphere = tileset.boundingSphere;
      let cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
      let surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0);
      let offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height);
      let translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
      currentModel.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
    });
  },
  showCircleScan:function () {
    showCircleScan()
  },
  showRadarScan:function () {
    showRadarScan()
  },
  cone(){
    cone()
  },
  scanning(e){
    scanning(e)
  },
  weather(e,bul){
    switch (e) {
      case 0:
        createSnowStage(bul);
        break;
      case 1:
        createRainStage(bul);
        break;
    }
  }
};
export {Command}

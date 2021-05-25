import {getBezierArray} from "./Bezier";
import {addImg, drawPolyline,getLines,baseLine,animationLine,deleteLine,getImgs} from './entities/functional/Drawing' //图片线段综合
import {getxyz} from "./entities/functional/getxyz" //点击获取经纬度高程
import {add3dModel} from "./entities/functional/add3dModel" //添加3D模型
import {reckon} from "./entities/functional/reckon" //经纬度获取高程
import {rotate} from "./entities/functional/rotate" //经纬度获取高程
import {reset} from "./entities/functional/reset"  //回到起始点
import {flight} from "./entities/functional/flight"    //绘制飞行模型..绘制飞行扫描
import {heatMap} from "./entities/functional/heatMap" //绘制热力图
import {round,deleteRound} from "./entities/functional/round" //绘制轰炸区..删除轰炸区
import {missile,boom} from "./entities/functional/missile"   //轰炸..导弹飞行..爆炸效果
import {showCircleScan,showRadarScan} from "./entities/functional/radar"   //绘制扫描雷达
import {cone} from "./entities/functional/cone"  //绘制圆锥
import {scanning} from "./entities/functional/scanning"   //相控雷达
import { createSnowStage,createRainStage ,offWeather} from "./entities/functional/weather" //天气
import { ranging } from "./entities/functional/ranging" //测距

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
  positionMe:function (e) {
    reset(e)
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
  weather(e,obj){
    switch (e) {
      case 0:
        createSnowStage(obj);
        break;
      case 1:
        createRainStage(obj);
        break;
    }
  },
  offWeather(){
    offWeather()
  },
  ranging(){
    ranging()
  }
};
export {Command}

// 所有军事标绘的父类
import {poin2dsToPoint3ds} from "../PlotUtils/utils3d"

export default class MilitaryPlotBase {
  constructor(viewer, baseInfo, properties) {
    this.viewer = viewer;
    this.baseInfo = baseInfo; //baseInfo中包括二维点集points
    this.properties = properties;
    this.plotCode = baseInfo.plotCode;
    this.initCosts();
    this.setHeight(baseInfo.height || 0);
    this.setPoints(baseInfo.points || []);
    this.fillColor = properties.fillColor ? properties.fillColor : Cesium.Color.RED.withAlpha(0.8);
  }

  //初始化常量 初始化常量要放在构造点的之前 否则构造点的时候读不到参数 就会报错
  initCosts() {

  }

  //新建的时候调用该方法
  setPlotCode(plotCode) {
    this.baseInfo.plotCode = plotCode;
    this.plotCode = plotCode;
  }

  openEditMode(isEdit) {

  }

  setHeight(height) {
    this.baseInfo.height = height;
    this.height = height;
  }

  getHeight() {
    return this.height;
  }

  setPoints(value) {
    this.points = value ? value : [];
    if (this.points.length >= 1)
      this.generate();
  }

  getPoints() {
    return this.points.slice(0);
  }

  getPointCount() {
    return this.points.length;
  }

  generate() {
  }

  //二维点转成三维点 在generate方法中将二维点转为三维点
  generatePositions(points) {
    this.positions = poin2dsToPoint3ds(points, this.getHeight());
  }
}

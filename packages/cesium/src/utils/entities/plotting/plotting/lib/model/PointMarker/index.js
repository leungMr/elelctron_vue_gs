//面标绘 面标绘类是所有面状军事标绘的父类 默认贴对象
import PlotBase from "../../PlotBase"
import PlotTypes from "../../PlotTypes"
import PlottingTypes from "../../PlotTypes";

export default class PointMarker extends PlotBase {
  constructor(viewer, baseInfo, properties) {
    super(viewer, baseInfo, properties);
    this.baseInfo.plotName = PlotTypes.POINT_MARKER;
    this.generateEntity();
    this.minPointCount = 1;
  }
  initCosts() {
    this.fixPointCount = 100;
  }

  //构造Entity
  generateEntity() {
    this.createEntity(this.positions[0])
  }

  generate() {
    this.generatePositions(this.points);
  }

  //开启编辑模式
  openEditMode(isEdit) {
  }
  continueClick(){
    this.createEntity(this.positions[this.positions.length-1])
  }
  createEntity(e){
    this.polygonEntity = this.viewer.entities.add({
      plotType: "MilitaryPlot",
      plotCode: this.baseInfo.plotCode,
      position: e,
      point: {
        color: this.fillColor,
        pixelSize: 10,
        outlineColor: Cesium.Color.YELLOW,
        outlineWidth: 2,
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      }
    });
  }
  //移除标绘对象
  remove() {
    this.viewer.entities.remove(this.polygonEntity);
  }
}

//面标绘 面标绘类是所有面状军事标绘的父类 默认贴对象
import PlotBase from "../../PlotBase"
import PlotTypes from "../../PlotTypes"

export default class FlagBase extends PlotBase {
  constructor(viewer, baseInfo, properties) {
    super(viewer, baseInfo, properties);
    this.baseInfo.plotName = PlotTypes.RECTANGLE_FLAG;
    this.generateEntity();
    this.minPointCount = 3;
  }

  //构造Entity
  generateEntity() {
    this.polygonEntity = this.viewer.entities.add({
      plotType: "MilitaryPlot",
      plotCode: this.baseInfo.plotCode,
      polygon: {
        hierarchy: new Cesium.PolygonHierarchy(this.positions || []),
        material: this.fillColor,
        classificationType: Cesium.ClassificationType.BOTH
      },
    });
  }

  generate() {
    if (this.getPointCount() < 2) {
      return;
    }
    this.generatePositions(this.points);
  }

  //开启编辑模式
  openEditMode(isEdit) {
    if (isEdit) {
      this.polygonEntity.polygon.hierarchy = new Cesium.CallbackProperty(e => {
        return new Cesium.PolygonHierarchy(this.positions || []);
      }, false)
    } else {
      this.polygonEntity.polygon.hierarchy = new Cesium.PolygonHierarchy(this.positions || []);
    }
  }

  //移除标绘对象
  remove() {
    this.viewer.entities.remove(this.polygonEntity);
  }

  continueClick() {

  }
}

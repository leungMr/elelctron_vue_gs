// 矩形标绘类
import Polygon from "../Polygon"
import PlotTypes from "../../PlotTypes"

export default class Rectangle extends Polygon {

  constructor(viewer, baseInfo, properties) {
    super(viewer, baseInfo, properties);
    this.baseInfo.plotName = PlotTypes.RECTANGLE;

  }

  initCosts() {
    this.fixPointCount = 4;
  }

  generate() {
    if (this.getPointCount() >= 2) {
      let pnt1 = this.points[0];
      let pnt2 = this.points[1];
      let xMin = Math.min(pnt1[0], pnt2[0]);
      let xMax = Math.max(pnt1[0], pnt2[0]);
      let yMin = Math.min(pnt1[1], pnt2[1]);
      let yMax = Math.max(pnt1[1], pnt2[1]);
      this.generatePositions([[xMin, yMax], [xMax, yMax], [xMax, yMin], [xMin, yMin]]);
    }
  }
}

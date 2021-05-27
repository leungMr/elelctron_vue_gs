// 矩形标绘类
import Polygon from "../Polygon"
import PlotTypes from "../../PlotTypes"
import * as PlotUtils from "../../PlotUtils/utils2d";

export default class Rectangle extends Polygon {

  constructor(viewer, baseInfo, properties) {
    super(viewer, baseInfo, properties);
    this.baseInfo.plotName = PlotTypes.TRIANGLE_FLAG;
  }

  initCosts() {
    this.fixPointCount = 3;
  }

  generate() {
    if (this.getPointCount() >= 2) {
      let xMin = Math.min(this.points[0][0], this.points[1][0]);
      let xMax = Math.max(this.points[0][0], this.points[1][0]);
      let yMin = Math.min(this.points[0][1], this.points[1][1]);
      let yMax = Math.max(this.points[0][1], this.points[1][1]);
      if (this.points[2]) {
        let d1 = PlotUtils.distance([xMin, yMax], [xMax, yMax]) - PlotUtils.distance([xMin, yMax], [xMin, yMin]);
        if (!(d1 > 0)) {
          if (this.points[2][0] > this.points[1][0] && this.points[2][1] <= yMax && this.points[2][1] >= yMin) { //右
            this.generatePositions([[xMin, yMax], [xMax, yMax], [...this.points[2]], [xMax, this.points[2][1]], [xMax, yMin], [xMin, yMin]]);
          }
          if (this.points[2][0] < this.points[0][0] && this.points[2][1] <= yMax && this.points[2][1] >= yMin) {//左
            this.generatePositions([[xMin, yMax], [xMax, yMax], [xMax, yMin], [xMin, yMin], [xMin, this.points[2][1]], [...this.points[2]]]);
          }
        } else {
          if (this.points[2][1] > this.points[1][1] && this.points[2][0] <= xMax && this.points[2][0] >= xMin) { //上
            this.generatePositions([[xMin, yMax], [...this.points[2]], [this.points[2][0], yMax], [xMax, yMax], [xMax, yMin], [xMin, yMin]]);
          }
          if (this.points[2][1] < this.points[0][1] && this.points[2][0] <= xMax && this.points[2][0] >= xMin) {//下
            this.generatePositions([[xMin, yMax], [xMax, yMax], [xMax, yMin], [this.points[2][0], yMin], [...this.points[2]], [xMin, yMin]]);
          }
        }
      } else {
        this.generatePositions([[xMin, yMax], [xMax, yMax], [xMax, yMin], [xMin, yMin]]);
      }
    }
  }
}

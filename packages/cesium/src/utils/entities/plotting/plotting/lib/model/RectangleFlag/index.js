//
import FlagBase from "../FlagBase"
import PlotTypes from "../../PlotTypes"
import {poin2dsToPoint3ds} from "../../PlotUtils/utils3d";
import * as PlotUtils from "../../PlotUtils/utils2d";

export default class RectangleFlag extends FlagBase {

  constructor(viewer, baseInfo, properties) {
    super(viewer, baseInfo, properties);
    this.baseInfo.plotName = PlotTypes.RECTANGLE_FLAG;
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
          if (this.points[2][0] > this.points[1][0] && this.points[2][1] <= yMax && this.points[2][1] >= yMin) { //右、上
            this.generatePositions([[xMin, yMax], [xMax, yMax], [this.points[2][0], yMax], [...this.points[2]], [xMax, this.points[2][1]], [xMax, yMin], [xMin, yMin]]);
          }
          if (this.points[2][0] < this.points[0][0] && this.points[2][1] <= yMax && this.points[2][1] >= yMin) {//左、下
            this.generatePositions([[xMin, yMax], [xMax, yMax], [xMax, yMin], [xMin, yMin], [xMin, this.points[2][1]], [...this.points[2]], [this.points[2][0], yMax]]);
          }
        } else {
          if (this.points[2][1] > this.points[1][1] && this.points[2][0] <= xMax && this.points[2][0] >= xMin) { //上
            this.generatePositions([[xMin, yMax], [xMin,this.points[2][1]], [...this.points[2]], [this.points[2][0], yMax], [xMax, yMax], [xMax, yMin], [xMin, yMin]]);
          }
          if (this.points[2][1] < this.points[0][1] && this.points[2][0] <= xMax && this.points[2][0] >= xMin) {//下
            this.generatePositions([[xMin, yMax], [xMax, yMax], [xMax, yMin], [this.points[2][0], yMin], [...this.points[2]], [xMin,this.points[2][1]], [xMin, yMin]]);
          }
        }

      } else {
        this.generatePositions([[xMin, yMax], [xMax, yMax], [xMax, yMin], [xMin, yMin]]);
      }
    }
  }
}

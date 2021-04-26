//闭合曲面
import * as PlotUtils from "../../PlotUtils/utils2d"
import * as Constants from "../../Constants"
import Polygon from "../Polygon"
import PlotTypes from "../../PlotTypes"

export default class ClosedCurve extends Polygon {

  constructor(viewer, baseInfo, properties) {
    super(viewer, baseInfo, properties);
    this.baseInfo.plotName = PlotTypes.CLOSED_CURVE;
  }

  initCosts() {
    this.t = 0.3;
  }

  generate() {
    if (this.getPointCount() < 2) {
      return;
    }
    if (this.getPointCount() === 2) {
      this.generatePositions(this.points);
    } else {
      let points = this.getPoints();
      points.push(points[0], points[1]);
      let normals = [];
      for (let i = 0; i < points.length - 2; i++) {
        let normalPoints = PlotUtils.getBisectorNormals(this.t, points[i], points[i + 1], points[i + 2]);
        normals = normals.concat(normalPoints);
      }
      let count = normals.length;
      normals = [normals[count - 1]].concat(normals.slice(0, count - 1));

      let pList = [];
      for (let i = 0; i < points.length - 2; i++) {
        let pnt1 = points[i];
        let pnt2 = points[i + 1];
        pList.push(pnt1);
        for (let t = 0; t <= Constants.FITTING_COUNT; t++) {
          let pnt = PlotUtils.getCubicValue(t / Constants.FITTING_COUNT, pnt1, normals[i * 2], normals[i * 2 + 1], pnt2);
          pList.push(pnt);
        }
        pList.push(pnt2);
      }
      this.generatePositions(pList);
    }
  }
}

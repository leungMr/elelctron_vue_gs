// 椭圆
import * as PlotUtils from "../../PlotUtils/utils2d"
import * as Constants from "../../Constants"
import PlotTypes from "../../PlotTypes"
import Polygon from "../Polygon"

export default class Ellipse extends Polygon {

  constructor(viewer, baseInfo, properties) {
    super(viewer, baseInfo, properties);
    this.baseInfo.plotName = PlotTypes.ELLIPSE;
  }

  initCosts() {
    this.fixPointCount = 2;
  }

  generate() {
    if (this.getPointCount() < 2) {
      return;
    }
    let pnt1 = this.points[0];
    let pnt2 = this.points[1];
    this.generatePositions(this.generatePoints(PlotUtils.mid(pnt1, pnt2), Math.abs((pnt1[0] - pnt2[0]) / 2), Math.abs((pnt1[1] - pnt2[1]) / 2)));
  }

  generatePoints(center, majorRadius, minorRadius) {
    let points = [];
    for (let i = 0; i <= Constants.FITTING_COUNT; i++) {
      let angle = Math.PI * 2 * i / Constants.FITTING_COUNT;
      points.push([center[0] + majorRadius * Math.cos(angle), center[1] + minorRadius * Math.sin(angle)]);
    }
    return points;
  }
}

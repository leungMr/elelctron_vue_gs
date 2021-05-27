// 直箭头标绘类
import * as PlotUtils from "../../PlotUtils/utils2d"
import * as Constants from "../../Constants"
import PlotTypes from "../../PlotTypes"
import Polygon from "../Polygon"

export default class FineArrow extends Polygon {

  constructor(viewer, baseInfo, properties) {
    super(viewer, baseInfo, properties);
    this.baseInfo.plotName = PlotTypes.FINE_ARROW;
  }

  initCosts() {
    this.tailWidthFactor = 0.1; //0.15;
    this.neckWidthFactor = 0.2;
    this.headWidthFactor = 0.25;
    this.headAngle = Math.PI / 8.5;
    this.neckAngle = Math.PI / 13;
    this.fixPointCount = 2;
  }

  generate() {
    if (this.getPointCount() < 2) {
      return;
    }
    let points = this.getPoints();
    let pnt1 = points[0];
    let pnt2 = points[1];
    let len = PlotUtils.getBaseLength(points);
    let tailWidth = len * this.tailWidthFactor;
    let neckWidth = len * this.neckWidthFactor;
    let headWidth = len * this.headWidthFactor;
    let pList = [
      PlotUtils.getThirdPoint(pnt2, pnt1, Constants.HALF_PI, tailWidth, true),
      PlotUtils.getThirdPoint(pnt1, pnt2, this.neckAngle, neckWidth, false),
      PlotUtils.getThirdPoint(pnt1, pnt2, this.headAngle, headWidth, false),
      pnt2,
      PlotUtils.getThirdPoint(pnt1, pnt2, this.headAngle, headWidth, true),
      PlotUtils.getThirdPoint(pnt1, pnt2, this.neckAngle, neckWidth, true),
      PlotUtils.getThirdPoint(pnt2, pnt1, Constants.HALF_PI, tailWidth, false)
    ];

    this.generatePositions(pList);
  }
}

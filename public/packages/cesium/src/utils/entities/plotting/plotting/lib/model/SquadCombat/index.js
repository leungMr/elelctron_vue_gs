// 分队战斗
import * as PlotUtils from "../../PlotUtils/utils2d"
import * as Constants from "../../Constants"
import PlotTypes from "../../PlotTypes"
import AttackArrow from "../AttackArrow"

export default class SquadCombat extends AttackArrow {

  constructor(viewer, baseInfo, properties) {
    super(viewer, baseInfo, properties);
    this.baseInfo.plotName = PlotTypes.SQUAD_COMBAT;
  }

  initCosts() {
    this.headHeightFactor = 0.18;
    this.headWidthFactor = 0.3;
    this.neckHeightFactor = 0.85;
    this.neckWidthFactor = 0.15;
    this.tailWidthFactor = 0.1;
  }

  generate() {
    let count = this.getPointCount();
    if (count < 2) {
      return;
    }
    let points = this.getPoints();
    let tailPoints = this.getTailPoints(points);
    let headPoints = this.getArrowHeadPoints(points, tailPoints[0], tailPoints[1]);
    let bodyPoints = this.getArrowBodyPoints(points, headPoints[0], headPoints[4], this.tailWidthFactor);
    count = bodyPoints.length;
    let leftPoints = [tailPoints[0]].concat(bodyPoints.slice(0, count / 2));
    leftPoints.push(headPoints[0]);
    let rightPoints = [tailPoints[1]].concat(bodyPoints.slice(count / 2, count));
    rightPoints.push(headPoints[4]);

    this.generatePositions(PlotUtils.getQBSplinePoints(leftPoints).concat(headPoints, PlotUtils.getQBSplinePoints(rightPoints).reverse()));
  }

  getTailPoints(points) {
    return [
      PlotUtils.getThirdPoint(points[1], points[0], Constants.HALF_PI, PlotUtils.getBaseLength(points) * this.tailWidthFactor, false),
      PlotUtils.getThirdPoint(points[1], points[0], Constants.HALF_PI, PlotUtils.getBaseLength(points) * this.tailWidthFactor, true)
    ];
  }
}

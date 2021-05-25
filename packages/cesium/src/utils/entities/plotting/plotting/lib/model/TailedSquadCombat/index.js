// 分队战斗尾
import * as PlotUtils from "../../PlotUtils/utils2d"
import * as Constants from "../../Constants"
import PlotTypes from "../../PlotTypes"
import AttackArrow from "../AttackArrow"

export default class TailedSquadCombat extends AttackArrow {

  constructor(viewer, baseInfo, properties) {
    super(viewer, baseInfo, properties);
    this.baseInfo.plotName = PlotTypes.TAILED_SQUAD_COMBAT;
  }

  initCosts() {
    this.headHeightFactor = 0.18;
    this.headWidthFactor = 0.3;
    this.neckHeightFactor = 0.85;
    this.neckWidthFactor = 0.15;
    this.tailWidthFactor = 0.1;
    this.swallowTailFactor = 1;
    this.swallowTailPnt = null;
  }

  generate() {
    if (this.getPointCount() < 2) {
      return;
    }
    let tailPoints = this.getTailPoints(this.getPoints());
    let headPoints = this.getArrowHeadPoints(this.getPoints(), tailPoints[0], tailPoints[2]);
    let bodyPoints = this.getArrowBodyPoints(this.getPoints(), headPoints[0], headPoints[4], this.tailWidthFactor);
    let leftPoints = [tailPoints[0]].concat(bodyPoints.slice(0, bodyPoints.length / 2));
    leftPoints.push(headPoints[0]);
    let rightPoints = [tailPoints[2]].concat(bodyPoints.slice(bodyPoints.length / 2, bodyPoints.length));
    rightPoints.push(headPoints[4]);
    leftPoints = PlotUtils.getQBSplinePoints(leftPoints);
    rightPoints = PlotUtils.getQBSplinePoints(rightPoints);
    this.generatePositions(leftPoints.concat(headPoints, rightPoints.reverse(), [tailPoints[1], leftPoints[0]]));
  }

  getTailPoints(points) {
    let tailWidth = PlotUtils.getBaseLength(points) * this.tailWidthFactor;
    return [
      PlotUtils.getThirdPoint(points[1], points[0], Constants.HALF_PI, tailWidth, false),
      PlotUtils.getThirdPoint(points[1], points[0], 0, tailWidth * this.swallowTailFactor, true),
      PlotUtils.getThirdPoint(points[1], points[0], Constants.HALF_PI, tailWidth, true)
    ];
  }
}

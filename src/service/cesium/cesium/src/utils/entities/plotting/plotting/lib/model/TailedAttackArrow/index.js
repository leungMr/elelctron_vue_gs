// 进攻方向尾翼
import * as PlotUtils from "../../PlotUtils/utils2d"
import AttackArrow from "../AttackArrow"
import PlotTypes from "../../PlotTypes"

export default class TailedAttackArrow extends AttackArrow {

  constructor(viewer, baseInfo, properties) {
    super(viewer, baseInfo, properties);
    this.baseInfo.plotName = PlotTypes.TAILED_ATTACK_ARROW;
  }

  initCosts() {
    this.headHeightFactor = 0.18;
    this.headWidthFactor = 0.3;
    this.neckHeightFactor = 0.85;
    this.neckWidthFactor = 0.15;
    this.tailWidthFactor = 0.1;
    this.headTailFactor = 0.8;
    this.swallowTailFactor = 1;
    this.swallowTailPnt = null;
  }

  generate() {
    if (this.getPointCount() < 2) {
      return;
    }
    if (this.getPointCount() === 2) {
      this.generatePositions(this.points);
      return;
    }
    let tailLeft = this.getPoints()[0];
    let tailRight = this.getPoints()[1];
    if (PlotUtils.isClockWise(this.getPoints()[0], this.getPoints()[1], this.getPoints()[2])) {
      tailLeft = this.getPoints()[1];
      tailRight = this.getPoints()[0];
    }
    let bonePoints = [PlotUtils.mid(tailLeft, tailRight)].concat(this.getPoints().slice(2));
    let headPoints = this.getArrowHeadPoints(bonePoints, tailLeft, tailRight);
    let tailWidth = PlotUtils.distance(tailLeft, tailRight);
    let allLen = PlotUtils.getBaseLength(bonePoints);
    let len = allLen * this.tailWidthFactor * this.swallowTailFactor;
    this.swallowTailPnt = PlotUtils.getThirdPoint(bonePoints[1], bonePoints[0], 0, len, true);
    let bodyPoints = this.getArrowBodyPoints(bonePoints, headPoints[0], headPoints[4], tailWidth / allLen);
    let leftPoints = [tailLeft].concat(bodyPoints.slice(0, bodyPoints.length / 2));
    leftPoints.push(headPoints[0]);
    let rightPoints = [tailRight].concat(bodyPoints.slice(bodyPoints.length / 2, bodyPoints.length));
    rightPoints.push(headPoints[4]);

    leftPoints = PlotUtils.getQBSplinePoints(leftPoints);
    rightPoints = PlotUtils.getQBSplinePoints(rightPoints);

    this.generatePositions(leftPoints.concat(headPoints, rightPoints.reverse(), [this.swallowTailPnt, leftPoints[0]]));
  }
}

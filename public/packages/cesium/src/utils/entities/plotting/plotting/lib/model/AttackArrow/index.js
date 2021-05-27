//进攻方向
import * as PlotUtils from "../../PlotUtils/utils2d"
import * as Constants from "../../Constants"
import Polygon from "../Polygon"
import PlotTypes from "../../PlotTypes"

export default class AttackArrow extends Polygon {

  constructor(viewer, baseInfo, properties) {
    super(viewer, baseInfo, properties);
    this.baseInfo.plotName = PlotTypes.ATTACK_ARROW;
  }

  initCosts() {
    this.headHeightFactor = 0.18;
    this.headWidthFactor = 0.3;
    this.neckHeightFactor = 0.85;
    this.neckWidthFactor = 0.15;
    this.headTailFactor = 0.8;
    this.minPointCount = 2; //最少三个点
  }

  generate() {
    if (this.getPointCount() < 2) {
      return;
    }
    if (this.getPointCount() === 2) {
      this.generatePositions(this.points);
      return;
    }
    let points = this.getPoints();
    // 计算箭尾
    let tailLeft = points[0];
    let tailRight = points[1];
    if (PlotUtils.isClockWise(points[0], points[1], points[2])) {
      tailLeft = points[1];
      tailRight = points[0];
    }
    let bonePoints = [PlotUtils.mid(tailLeft, tailRight)].concat(points.slice(2));
    // 计算箭头
    let headPoints = this.getArrowHeadPoints(bonePoints, tailLeft, tailRight);
    // 计算箭身
    let bodyPoints = this.getArrowBodyPoints(bonePoints, headPoints[0], headPoints[4], PlotUtils.distance(tailLeft, tailRight) / PlotUtils.getBaseLength(bonePoints));
    // 整合
    let leftPoints = [tailLeft].concat(bodyPoints.slice(0, bodyPoints.length / 2));
    leftPoints.push(headPoints[0]);
    let rightPoints = [tailRight].concat(bodyPoints.slice(bodyPoints.length / 2, bodyPoints.length));
    rightPoints.push(headPoints[4]);

    leftPoints = PlotUtils.getQBSplinePoints(leftPoints);
    rightPoints = PlotUtils.getQBSplinePoints(rightPoints);

    this.generatePositions(leftPoints.concat(headPoints, rightPoints.reverse()));
  }

  getArrowHeadPoints(points, tailLeft, tailRight) {
    let len = PlotUtils.getBaseLength(points);
    let headHeight = len * this.headHeightFactor;
    let headPnt = points[points.length - 1];
    len = PlotUtils.distance(headPnt, points[points.length - 2]);
    let tailWidth = PlotUtils.distance(tailLeft, tailRight);
    if (headHeight > tailWidth * this.headTailFactor) {
      headHeight = tailWidth * this.headTailFactor;
    }
    let headWidth = headHeight * this.headWidthFactor;
    let neckWidth = headHeight * this.neckWidthFactor;
    headHeight = headHeight > len ? len : headHeight;
    let neckHeight = headHeight * this.neckHeightFactor;
    let headEndPnt = PlotUtils.getThirdPoint(points[points.length - 2], headPnt, 0, headHeight, true);
    let neckEndPnt = PlotUtils.getThirdPoint(points[points.length - 2], headPnt, 0, neckHeight, true);
    return [
      PlotUtils.getThirdPoint(headPnt, neckEndPnt, Constants.HALF_PI, neckWidth, false),
      PlotUtils.getThirdPoint(headPnt, headEndPnt, Constants.HALF_PI, headWidth, false),
      headPnt,
      PlotUtils.getThirdPoint(headPnt, headEndPnt, Constants.HALF_PI, headWidth, true),
      PlotUtils.getThirdPoint(headPnt, neckEndPnt, Constants.HALF_PI, neckWidth, true)
    ];
  }

  getArrowBodyPoints(points, neckLeft, neckRight, tailWidthFactor) {
    let tailWidth = PlotUtils.getBaseLength(points) * tailWidthFactor;
    let widthDif = (tailWidth - PlotUtils.distance(neckLeft, neckRight)) / 2;
    let tempLen = 0,
      leftBodyPoints = [],
      rightBodyPoints = [];
    for (let i = 1; i < points.length - 1; i++) {
      let angle = PlotUtils.getAngleOfThreePoints(points[i - 1], points[i], points[i + 1]) / 2;
      tempLen += PlotUtils.distance(points[i - 1], points[i]);
      let w = (tailWidth / 2 - tempLen / PlotUtils.wholeDistance(points) * widthDif) / Math.sin(angle);
      leftBodyPoints.push(PlotUtils.getThirdPoint(points[i - 1], points[i], Math.PI - angle, w, true));
      rightBodyPoints.push(PlotUtils.getThirdPoint(points[i - 1], points[i], angle, w, false));
    }
    return leftBodyPoints.concat(rightBodyPoints);
  }
}

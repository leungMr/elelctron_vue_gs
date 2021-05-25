//双箭头 钳击符号
import * as PlotUtils from "../../PlotUtils/utils2d"
import * as Constants from "../../Constants"
import PlotTypes from "../../PlotTypes"
import Polygon from "../Polygon"

export default class DoubleArrow extends Polygon {

  constructor(viewer, baseInfo, properties) {
    super(viewer, baseInfo, properties);
    this.baseInfo.plotName = PlotTypes.DOUBLE_ARROW;
  }

  initCosts() {
    this.headHeightFactor = 0.25;
    this.headWidthFactor = 0.3;
    this.neckHeightFactor = 0.85;
    this.neckWidthFactor = 0.15;
    this.connPoint = null;
    this.tempPoint4 = null;
    this.fixPointCount = 4;
  }

  generate() {
    if (this.getPointCount() < 2) {
      return;
    }
    if (this.getPointCount() === 2) {
      this.generatePositions(this.points);
      return;
    }
    let pnt1 = this.points[0];
    let pnt2 = this.points[1];
    let pnt3 = this.points[2];
    if (this.getPointCount() === 3)
      this.tempPoint4 = this.getTempPoint4(pnt1, pnt2, pnt3);
    else
      this.tempPoint4 = this.points[3];
    if (this.getPointCount() === 3 || this.getPointCount() === 4)
      this.connPoint = PlotUtils.mid(pnt1, pnt2);
    else
      this.connPoint = this.points[4];
    let leftArrowPoints, rightArrowPoints;
    if (PlotUtils.isClockWise(pnt1, pnt2, pnt3)) {
      leftArrowPoints = this.getArrowPoints(pnt1, this.connPoint, this.tempPoint4, false);
      rightArrowPoints = this.getArrowPoints(this.connPoint, pnt2, pnt3, true);
    } else {
      leftArrowPoints = this.getArrowPoints(pnt2, this.connPoint, pnt3, false);
      rightArrowPoints = this.getArrowPoints(this.connPoint, pnt1, this.tempPoint4, true);
    }
    let t = (leftArrowPoints.length - 5) / 2;

    let llBodyPoints = leftArrowPoints.slice(0, t);
    let lArrowPoints = leftArrowPoints.slice(t, t + 5);
    let lrBodyPoints = leftArrowPoints.slice(t + 5, leftArrowPoints.length);

    let rlBodyPoints = rightArrowPoints.slice(0, t);
    let rArrowPoints = rightArrowPoints.slice(t, t + 5);
    let rrBodyPoints = rightArrowPoints.slice(t + 5, leftArrowPoints.length);

    rlBodyPoints = PlotUtils.getBezierPoints(rlBodyPoints);
    let bodyPoints = PlotUtils.getBezierPoints(rrBodyPoints.concat(llBodyPoints.slice(1)));
    lrBodyPoints = PlotUtils.getBezierPoints(lrBodyPoints);
    this.generatePositions(rlBodyPoints.concat(rArrowPoints, bodyPoints, lArrowPoints, lrBodyPoints));
  };

  getArrowPoints(pnt1, pnt2, pnt3, clockWise) {
    let midPnt = PlotUtils.mid(pnt1, pnt2);
    let len = PlotUtils.distance(midPnt, pnt3);
    let midPnt1 = PlotUtils.getThirdPoint(pnt3, midPnt, 0, len * 0.3, true);
    let midPnt2 = PlotUtils.getThirdPoint(pnt3, midPnt, 0, len * 0.5, true);
    midPnt1 = PlotUtils.getThirdPoint(midPnt, midPnt1, Constants.HALF_PI, len / 5, clockWise);
    midPnt2 = PlotUtils.getThirdPoint(midPnt, midPnt2, Constants.HALF_PI, len / 4, clockWise);

    let points = [midPnt, midPnt1, midPnt2, pnt3];
    // 计算箭头部分
    let arrowPnts = this.getArrowHeadPoints(points, this.headHeightFactor, this.headWidthFactor, this.neckHeightFactor, this.neckWidthFactor);
    let neckLeftPoint = arrowPnts[0];
    let neckRightPoint = arrowPnts[4];
    // 计算箭身部分
    let tailWidthFactor = PlotUtils.distance(pnt1, pnt2) / PlotUtils.getBaseLength(points) / 2;
    let bodyPnts = this.getArrowBodyPoints(points, neckLeftPoint, neckRightPoint, tailWidthFactor);
    let n = bodyPnts.length;
    let lPoints = bodyPnts.slice(0, n / 2);
    let rPoints = bodyPnts.slice(n / 2, n);
    lPoints.push(neckLeftPoint);
    rPoints.push(neckRightPoint);
    lPoints = lPoints.reverse();
    lPoints.push(pnt2);
    rPoints = rPoints.reverse();
    rPoints.push(pnt1);
    return lPoints.reverse().concat(arrowPnts, rPoints);
  };

  getArrowHeadPoints(points, tailLeft, tailRight) {
    let headHeight = PlotUtils.getBaseLength(points) * this.headHeightFactor;
    let headWidth = headHeight * this.headWidthFactor;
    let neckWidth = headHeight * this.neckWidthFactor;
    let neckHeight = headHeight * this.neckHeightFactor;
    let headEndPnt = PlotUtils.getThirdPoint(points[points.length - 2], points[points.length - 1], 0, headHeight, true);
    let neckEndPnt = PlotUtils.getThirdPoint(points[points.length - 2], points[points.length - 1], 0, neckHeight, true);
    return [
      PlotUtils.getThirdPoint(points[points.length - 1], neckEndPnt, Constants.HALF_PI, neckWidth, false),
      PlotUtils.getThirdPoint(points[points.length - 1], headEndPnt, Constants.HALF_PI, headWidth, false),
      points[points.length - 1],
      PlotUtils.getThirdPoint(points[points.length - 1], headEndPnt, Constants.HALF_PI, headWidth, true),
      PlotUtils.getThirdPoint(points[points.length - 1], neckEndPnt, Constants.HALF_PI, neckWidth, true)
    ];
  }

  getArrowBodyPoints(points, neckLeft, neckRight, tailWidthFactor) {
    let allLen = PlotUtils.wholeDistance(points);
    let len = PlotUtils.getBaseLength(points);
    let tailWidth = len * tailWidthFactor;
    let neckWidth = PlotUtils.distance(neckLeft, neckRight);
    let widthDif = (tailWidth - neckWidth) / 2;
    let tempLen = 0,
      leftBodyPnts = [],
      rightBodyPnts = [];
    for (let i = 1; i < points.length - 1; i++) {
      let angle = PlotUtils.getAngleOfThreePoints(points[i - 1], points[i], points[i + 1]) / 2;
      tempLen += PlotUtils.distance(points[i - 1], points[i]);
      let w = (tailWidth / 2 - tempLen / allLen * widthDif) / Math.sin(angle);
      let left = PlotUtils.getThirdPoint(points[i - 1], points[i], Math.PI - angle, w, true);
      let right = PlotUtils.getThirdPoint(points[i - 1], points[i], angle, w, false);
      leftBodyPnts.push(left);
      rightBodyPnts.push(right);
    }
    return leftBodyPnts.concat(rightBodyPnts);
  };

  // 计算对称点
  getTempPoint4(linePnt1, linePnt2, point) {
    let midPnt = PlotUtils.mid(linePnt1, linePnt2);
    let len = PlotUtils.distance(midPnt, point);
    let angle = PlotUtils.getAngleOfThreePoints(linePnt1, midPnt, point);
    let symPnt, distance1, distance2, mid;
    if (angle < Constants.HALF_PI) {
      distance1 = len * Math.sin(angle);
      distance2 = len * Math.cos(angle);
      mid = PlotUtils.getThirdPoint(linePnt1, midPnt, Constants.HALF_PI, distance1, false);
      symPnt = PlotUtils.getThirdPoint(midPnt, mid, Constants.HALF_PI, distance2, true);
    } else if (angle >= Constants.HALF_PI && angle < Math.PI) {
      distance1 = len * Math.sin(Math.PI - angle);
      distance2 = len * Math.cos(Math.PI - angle);
      mid = PlotUtils.getThirdPoint(linePnt1, midPnt, Constants.HALF_PI, distance1, false);
      symPnt = PlotUtils.getThirdPoint(midPnt, mid, Constants.HALF_PI, distance2, false);
    } else if (angle >= Math.PI && angle < Math.PI * 1.5) {
      distance1 = len * Math.sin(angle - Math.PI);
      distance2 = len * Math.cos(angle - Math.PI);
      mid = PlotUtils.getThirdPoint(linePnt1, midPnt, Constants.HALF_PI, distance1, true);
      symPnt = PlotUtils.getThirdPoint(midPnt, mid, Constants.HALF_PI, distance2, true);
    } else {
      distance1 = len * Math.sin(Math.PI * 2 - angle);
      distance2 = len * Math.cos(Math.PI * 2 - angle);
      mid = PlotUtils.getThirdPoint(linePnt1, midPnt, Constants.HALF_PI, distance1, true);
      symPnt = PlotUtils.getThirdPoint(midPnt, mid, Constants.HALF_PI, distance2, false);
    }
    return symPnt;
  }
}

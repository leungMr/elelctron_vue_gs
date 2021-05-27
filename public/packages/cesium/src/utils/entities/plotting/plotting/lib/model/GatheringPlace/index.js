// 集结地标绘类
import * as PlotUtils from "../../PlotUtils/utils2d"
import * as Constants from "../../Constants"
import PlotTypes from "../../PlotTypes"
import Polygon from "../Polygon"

export default class GatheringPlace extends Polygon {
  constructor(viewer, baseInfo, properties) {
    super(viewer, baseInfo, properties);
    this.baseInfo.plotName = PlotTypes.GATHERING_PLACE;
  }

  initCosts() {
    this.t = 0.4;
    this.fixPointCount = 3;
  }

  generate() {
    let points = this.getPoints();
    if (points.length < 2) {
      return;
    }
    if (this.getPointCount() === 2) {
      let mid = PlotUtils.mid(points[0], points[1]);
      points = [points[0], PlotUtils.getThirdPoint(points[0], mid, Constants.HALF_PI, PlotUtils.distance(points[0], mid) / 0.9, true), points[1]];
    }
    points.push(PlotUtils.mid(points[0], points[2]), points[0], points[1]);

    let normals = [];
    let pnt1, pnt2;
    for (let i = 0; i < points.length - 2; i++) {
      pnt1 = points[i];
      pnt2 = points[i + 1];
      normals = normals.concat(PlotUtils.getBisectorNormals(this.t, pnt1, pnt2, points[i + 2]));
    }
    normals = [normals[normals.length - 1]].concat(normals.slice(0, normals.length - 1));
    let pList = [];
    for (let i = 0; i < points.length - 2; i++) {
      pnt1 = points[i];
      pnt2 = points[i + 1];
      pList.push(pnt1);
      for (let t = 0; t <= Constants.FITTING_COUNT; t++) {
        pList.push(PlotUtils.getCubicValue(t / Constants.FITTING_COUNT, pnt1, normals[i * 2], normals[i * 2 + 1], pnt2));
      }
      pList.push(pnt2);
    }
    this.generatePositions(pList);
  }
}

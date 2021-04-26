import * as Constants from "../../Constants"
import PlotTypes from "../../PlotTypes"
import Polygon from "../Polygon"

export default class Circle extends Polygon {

  constructor(viewer, baseInfo, properties) {
    super(viewer, baseInfo, properties);
    this.baseInfo.plotName = PlotTypes.CIRCLE;
    this.fixPointCount = 2;
  }

  generate() {
    if (this.getPointCount() < 2) {
      return;
    }
    let center = this.points[0];
    let radius = this.distance(center, this.points[1]);
    this.generatePositions(this.generateCirclePoints(center, radius));
  }

  //计算两个点的距离
  distance(lngLat1, lngLat2) {
    let radLat1 = lngLat1[1] * Math.PI / 180.0;
    let radLat2 = lngLat2[1] * Math.PI / 180.0;
    let s = (2 * Math.asin(Math.sqrt(Math.pow(Math.sin((radLat1 - radLat2) / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin((lngLat1[0] * Math.PI / 180.0 - lngLat2[0] * Math.PI / 180.0) / 2), 2)))) * 6378.137;
    return Math.round(s * 10000) / 10
  }

  //获取一个圆的边缘坐标
  generateCirclePoints(center, radius) {
    let points = [];
    for (let i = 0; i < 360; i += 2) {
      points.push(this.getCirclePoint(center[0], center[1], i, radius))
    }
    return points;
  }

  getCirclePoint(lon, lat, angle, radius) {
    let dx = radius * Math.sin(angle * Math.PI / 180.0);
    let dy = radius * Math.cos(angle * Math.PI / 180.0);
    let ec = Constants.PRADIUS + (Constants.ERADIUS - Constants.PRADIUS) * (90.0 - lat) / 90.0;
    let ed = ec * Math.cos(lat * Math.PI / 180);
    let newLon = (dx / ed + lon * Math.PI / 180.0) * 180.0 / Math.PI;
    let newLat = (dy / ec + lat * Math.PI / 180.0) * 180.0 / Math.PI;
    return [newLon, newLat];
  }
}
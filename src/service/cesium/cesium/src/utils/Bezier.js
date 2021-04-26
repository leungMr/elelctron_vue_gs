// 贝塞尔曲线二维转三维  返回一个三维点数组
export function getLinkedPointList(e, t, i,pointNum) {
  const n = [];
  const f = Cesium.Cartesian3.clone(e);
  const p = Cesium.Cartesian3.clone(t);
  const m = Cesium.Cartesian3.distance(f, Cesium.Cartesian3.ZERO);
  const g = Cesium.Cartesian3.distance(p, Cesium.Cartesian3.ZERO);
  Cesium.Cartesian3.normalize(f, f);
  Cesium.Cartesian3.normalize(p, p);
  if (Cesium.Cartesian3.distance(f, p) === 0) {
    return n;
  }
  let v = Cesium.Cartesian3.angleBetween(f, p);
  n.push(e);
  for (let y = 1; y < pointNum - 1; y++) {
    const b = Math.sin((1 - (y / (pointNum - 1))) * v) / Math.sin(v);
    const C = Math.sin((y / (pointNum - 1)) * v) / Math.sin(v);
    const x = Cesium.Cartesian3.multiplyByScalar(f, b, new Cesium.Cartesian3());
    const P = Cesium.Cartesian3.multiplyByScalar(p, C, new Cesium.Cartesian3());
    let E = Cesium.Cartesian3.add(x, P, new Cesium.Cartesian3());
    const T = m * (1 - (y / (pointNum - 1))) + g * (y / (pointNum - 1)) + Math.sin((y / (pointNum - 1)) * Math.PI) * (i);
    n.push(Cesium.Cartesian3.multiplyByScalar(E, T, E));
  }
  n.push(t);
  return n;
}
// 参数： x1, y1, z1, x2, y2, z2 两点经纬度坐标和高度
export function getBezierArray(x1, y1, z1, x2, y2, z2) {
  let arr3d = getBSRPoints(x1, y1, z1, x2, y2, z2, ((z1 + z2) / 2) + (distance([x1, y1, x2, y2]) / 2))
  let arrAll = []
  for (let i in arr3d) {
    if (arr3d.hasOwnProperty(i)) {
      if (Number(i) === 0) {
        arrAll.push(x1)
        arrAll.push(y1)
        arrAll.push(z1)
      } else if (Number(i) === arr3d.length - 1) {
        arrAll.push(x2)
        arrAll.push(y2)
        arrAll.push(z2)
      } else {
        arrAll.push(arr3d[i][0])
        arrAll.push(arr3d[i][1])
        arrAll.push(arr3d[i][2])
      }
    }
  }
  return arrAll
}

function distance(positions) {
  let geodesic = new Cesium.EllipsoidGeodesic();
  geodesic.setEndPoints(Cesium.Cartographic.fromDegrees(positions[0], positions[1]), Cesium.Cartographic.fromDegrees(positions[2], positions[3]));
  return geodesic.surfaceDistance
}

function getBSRPoints(x1, y1, z1, x2, y2, z2, h) {
  let arr = getBSR([y1, z1], [(y2 + y1) / 2, h], [y2, z2])
  let arr3d = []
  for (let i in arr) {
    let x = (x2 - x1) * (arr[i][0] - y1) / (y2 - y1) + x1
    arr3d.push([x, arr[i][0], arr[i][1]])
  }
  return arr3d
}

// 生成贝塞尔曲线
function getBSR(point1, point2, point3) {
  return CreateBezierPoints([{x: point1[0], y: point1[1]}, {x: point2[0], y: point2[1]}, {
    x: point3[0],
    y: point3[1]
  }], 20);
}

// 贝赛尔曲线算法
// 参数：
// anchorpoints: [{ x: 116.30, y: 39.60 }, { x: 37.50, y: 40.25 }, { x: 39.51, y: 36.25 }]
function CreateBezierPoints(anchorpoints, pointsAmount) {
  let points = [];
  for (let i = 0; i < pointsAmount; i++) {
    let point = MultiPointBezier(anchorpoints, i / pointsAmount)
    points.push([point.x, point.y]);
  }
  return points;
}

function MultiPointBezier(points, t) {
  let len = points.length;
  let x = 0, y = 0;
  let e = function (start, end) {
    let cs = 1, bcs = 1;
    while (end > 0) {
      cs *= start;
      bcs *= end;
      start--;
      end--;
    }
    return (cs / bcs);
  };
  for (let i = 0; i < len; i++) {
    let point = points[i];
    x += point.x * Math.pow((1 - t), (len - 1 - i)) * Math.pow(t, i) * (e(len - 1, i));
    y += point.y * Math.pow((1 - t), (len - 1 - i)) * Math.pow(t, i) * (e(len - 1, i));
  }
  return {x: x, y: y};
}

import {LineFlowMaterialProperty} from './polylineLineFlowMaterial';
import {getLinkedPointList} from '../../Bezier'

const pointNum = 50;
const terrain = Cesium.createWorldTerrain();
const terrainLevel = 11;

export function baseLine(object, viewer) {
  line(0, object, viewer)
}

export function animationLine(object, viewer) {
  line(1, object, viewer)
}

export function deleteLine(object, viewer) {
  let obj = viewer.entities.getById(object);
  if (obj) {
    viewer.entities.remove(obj)
  }
}

function line(type, object, viewer) {
  const start = object.start;
  const to = object.to;
  const peakHeight = object.peakHeight;
  // if (start.h) {
  //   let promise = Cesium.sampleTerrain(terrain, terrainLevel, [Cesium.Cartographic.fromDegrees(start.x, start.y), Cesium.Cartographic.fromDegrees(to.x, to.y)]);
  //   Cesium.when(promise, function (updatedPositions) {
  //     createLine(type, object.id, Cesium.Cartesian3.fromDegrees(start.x, start.y, updatedPositions[0].height.toFixed(2)), Cesium.Cartesian3.fromDegrees(to.x, to.y, updatedPositions[1].height.toFixed(2)), peakHeight ? peakHeight : 10000, viewer)
  //   });
  // } else {
  createLine(type, object.id, Cesium.Cartesian3.fromDegrees(start.x, start.y, start.h ? start.h : 1), Cesium.Cartesian3.fromDegrees(to.x, to.y, to.h ? to.h : 1), peakHeight ? peakHeight : 10000, viewer)
  // }

}

function createLine(type, id, start, end, peakHeight, viewer) {
  if (type === 0) {
    return viewer.entities.add({
      id: id,
      name: start.name,
      polyline: {
        positions: getLinkedPointList(start, end, peakHeight, pointNum),
        width: 2,
        material: new Cesium.PolylineGlowMaterialProperty({
          color: Cesium.Color.ORANGE,
          taperPower: 10
        }),
      },
    });
  } else {
    return viewer.entities.add({
      id: id,
      name: start.name,
      polyline: {
        positions: getLinkedPointList(start, end, peakHeight, pointNum),
        width: 2,
        material: new LineFlowMaterialProperty(new Cesium.Color(1, 0.79, 0.15, 1), 2e3),
      },
    });
  }
}

export function reset(e) {
  let view=window.earth;
  view.scene.globe.enableLighting = false;
  view.camera.flyTo({
    destination:Cesium.Cartesian3.fromDegrees(Number(e.x), Number(e.y), Number(e.z)),
    duration:2,
    orientation: {
      heading: Cesium.Math.toRadians(0.0),
      pitch: Cesium.Math.toRadians(-60.0),//从上往下看为-90
      roll: 0
    }
  });
  view.scene.camera.setView({
    // 初始化相机经纬度
    destination: new Cesium.Cartesian3.fromDegrees(Number(e.x), Number(e.y), Number(e.z)),
    orientation: {
      heading: Cesium.Math.toRadians(0.0),
      pitch: Cesium.Math.toRadians(-60.0),//从上往下看为-90
      roll: 0
    }
  });
}

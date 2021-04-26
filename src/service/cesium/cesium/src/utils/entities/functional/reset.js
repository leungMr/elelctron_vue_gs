export function reset() {
  earth.scene.camera.setView({
    // 初始化相机经纬度
    destination: new Cesium.Cartesian3.fromDegrees(106.379390, 29.534726, 13000),
    orientation: {
      heading: Cesium.Math.toRadians(0.0),
      pitch: Cesium.Math.toRadians(-60.0),//从上往下看为-90
      roll: 0
    }
  });
}

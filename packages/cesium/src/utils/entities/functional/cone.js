export function cone(obj) {
  let view=window.earth;
  // 添加模型

  let planeModel = view.entities.add({
    name:"11",
    position:Cesium.Cartesian3.fromDegrees(106.351047,29.586362,800),
    cylinder:{
      length:500,
      topRadius: 0,
      bottomRadius: 100,
      rotation:Cesium.Math.toRadians(90),
      material:Cesium.Color.fromCssColorString("rgba(255,255,0,0.5)")
    }
  });
}

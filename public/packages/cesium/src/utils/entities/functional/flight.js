export function flight(obj) {
  let view=window.earth;
  view.scene.globe.enableLighting = false;

  view.camera.flyTo({
    destination:Cesium.Cartesian3.fromDegrees(106.379390,29.534726,13000),
    duration:2,
    orientation: {
      heading: Cesium.Math.toRadians(0.0),
      pitch: Cesium.Math.toRadians(-60.0),//从上往下看为-90
      roll: 0
    }
  })

  let data = [];
  data =obj.blackBox;
//开始时间
  let start = Cesium.JulianDate.fromDate(new Date());
// 结束时间
  let stop = Cesium.JulianDate.addSeconds(start, obj.stop, new Cesium.JulianDate());

// 设置始时钟始时间
  view.clock.startTime = start.clone();
// 设置时钟当前时间
  view.clock.currentTime = start.clone();
// 设置始终停止时间
  view.clock.stopTime  = stop.clone();
// 时间速率，数字越大时间过的越快
  view.clock.multiplier = obj.multiplier;
// 时间轴
//   view.timeline.zoomTo(start,stop);
// 循环执行,即为2，到达终止时间，重新从起点时间开始
  if (obj.clockRange) {
    view.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
  }
// view.camera.flyTo({
//     destination:Cesium.Cartesian3.fromDegrees(106.379390,29.534726,13000)
// })
//   for(let j=0; j<data.length; j++){
//    let arr= data[j].splice(0,1);
      let property = computeFlight(data);
      // 添加模型
      let planeModel = view.entities.add({
        // 和时间轴关联
        availability : new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
          start : start,
          stop : stop
        })]),
        id:'aircraft'+obj.id,
        position: property,
        // 根据所提供的速度计算模型的朝向
        orientation: new Cesium.VelocityOrientationProperty(property),
        // 模型数据
        model: {
          uri: obj.model.uri,
          color: Cesium.Color.fromCssColorString(obj.model.color?obj.model.color:""),
          minimumPixelSize:obj.model.minimumPixelSize?obj.model.minimumPixelSize:80,
          maximumScale:20000,
          scale:10,
        },
        path:{
          resolution:1,
          material:new Cesium.PolylineGlowMaterialProperty({
            glowPower:0.2,
            color:Cesium.Color.fromCssColorString(obj.path.color?obj.path.color:"rgba(0,0,0,0)"),
          }),
          width:Number(obj.path.width?obj.path.width:"5")
        }
      });
    planeModel.position.setInterpolationOptions({
      interpolationDegree:Number(obj.interpolationDegree?obj.interpolationDegree:"1"),
      interpolationAlgorithm:Cesium.LagrangePolynomialApproximation
    })
  // }
  let property2 = computeFlight2(data);
  let entity_ty = view.entities.add({
    availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
      start: start,
      stop: stop,
    })]),
    id:'air'+obj.id,
    position: property2,
    orientation: new Cesium.VelocityOrientationProperty(property2),
    cylinder: {
      HeightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      length: Number(obj.cylinder.width?obj.cylinder.width:"1000"),
      topRadius: 0,
      bottomRadius: Number(obj.cylinder.width?obj.cylinder.width:"1000") / 2,
      material: Cesium.Color.fromCssColorString(obj.cylinder.color?obj.cylinder.color:"rgba(0,0,0,0)"),
      outline: !0,
      numberOfVerticalLines: Number(obj.cylinder.numberOfVerticalLines?obj.cylinder.numberOfVerticalLines:"10"),
      outlineColor: Cesium.Color.fromCssColorString(obj.cylinder.lineColor?obj.cylinder.lineColor:"rgba(0,0,0,0)")
    },
  });
  entity_ty.position.setInterpolationOptions({
    interpolationDegree: Number(obj.interpolationDegree?obj.interpolationDegree:5),
    interpolationAlgorithm: Cesium.LagrangePolynomialApproximation
  });
  // entity_ty.clock.currentTime=view.clock.currentTime.toString();
  // view.trackedEntity=planeModel;
  /**
   * 计算飞行
   * @param source 数据坐标
   * @returns {SampledPositionProperty|*}
   */
  function computeFlight(source) {
    // 取样位置 相当于一个集合
    let property = new Cesium.SampledPositionProperty();
    for(let i=0; i<source.length; i++){
      let time = Cesium.JulianDate.addSeconds(start, source[i].time, new Cesium.JulianDate);
      let position = Cesium.Cartesian3.fromDegrees(source[i].longitude, source[i].dimension, source[i].height);
      // 添加位置，和时间对应
      property.addSample(time, position);
    }
    return property;
  }
  function computeFlight2(source) {
    let property = new Cesium.SampledPositionProperty();
    for (var i = 0; i < source.length; i++) {
      var time = Cesium.JulianDate.addSeconds(start, source[i].time, new Cesium.JulianDate);
      var position = Cesium.Cartesian3.fromDegrees(source[i].longitude, source[i].dimension, source[i].height / 2);
      // 添加位置，和时间对应
      property.addSample(time, position);
    }
    return property;
  }
}

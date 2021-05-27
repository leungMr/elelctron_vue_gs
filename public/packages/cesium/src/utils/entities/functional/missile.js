export function missile(obj) {
  let view = window.earth;
  view.scene.globe.enableLighting = false;
  let data = [];
  data = obj.blackBox;
//开始时间
  let start = Cesium.JulianDate.fromDate(new Date());
// 结束时间
  let stop = Cesium.JulianDate.addSeconds(start, obj.stop, new Cesium.JulianDate());
  let property = computeFlight(data);
  // 添加模型
  let planeModel = view.entities.add({
    // 和时间轴关联
    availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
      start: start,
      stop: stop
    })]),
    id: 'aircraft' + obj.id,
    position: property,
    // 根据所提供的速度计算模型的朝向
    orientation: new Cesium.VelocityOrientationProperty(property),
    // 模型数据
    model: {
      uri: obj.model.uri,
      color: Cesium.Color.fromCssColorString(obj.model.color ? obj.model.color : ""),
      minimumPixelSize: obj.model.minimumPixelSize ? obj.model.minimumPixelSize : 80,
      maximumScale: 2000,
      scale: 10,
    },
    path: {
      resolution: 1,
      material: new Cesium.PolylineGlowMaterialProperty({
        glowPower: 0.2,
        color: Cesium.Color.fromCssColorString(obj.path.color ? obj.path.color : "rgba(0,0,0,0)"),
      }),
      width: Number(obj.path.width ? obj.path.width : "5")
    }
  });
  planeModel.position.setInterpolationOptions({
    interpolationDegree: Number(obj.interpolationDegree ? obj.interpolationDegree : "1"),
    interpolationAlgorithm: Cesium.LagrangePolynomialApproximation
  })

  /**
   * 计算飞行
   * @param source 数据坐标
   * @returns {SampledPositionProperty|*}
   */
  function computeFlight(source) {
    // 取样位置 相当于一个集合
    let property = new Cesium.SampledPositionProperty();
    for (let i = 0; i < source.length; i++) {
      let time = Cesium.JulianDate.addSeconds(start, source[i].time, new Cesium.JulianDate);
      let position = Cesium.Cartesian3.fromDegrees(source[i].longitude, source[i].dimension, source[i].height);
      // 添加位置，和时间对应
      property.addSample(time, position);
    }
    return property;
  }
}

export function boom(e,val) {
  let view = window.earth;
  let viewModel = {
    rate: 5.0,
    gravity: 0.0,
    minimumLife: 1.0,
    maximumLife: 1.0,
    minimumSpeed: 5.0,
    maximumSpeed: 5.0,
    startScale: 0,
    endScale: 10,
    particleSize: 20.0,
    transX: 20.5,
    transY: 40.0,
    transZ: 10.0,
    heading: 0.0,
    pitch: 0.0,
    roll: 0.0,
    fly: false,
    spin: false,
    show: true
  };

  let entityPosition = new Cesium.Cartesian3();
  let entityOrientation = new Cesium.Quaternion();
  let rotationMatrix = new Cesium.Matrix3();
  let modelMatrix = new Cesium.Matrix4();

  function computeModelMatrix(entity, time) {
    let position = Cesium.Property.getValueOrUndefined(entity.position, time, entityPosition);
    if (!Cesium.defined(position)) {
      return undefined;
    }
    let orientation = Cesium.Property.getValueOrUndefined(entity.orientation, time, entityOrientation);
    if (!Cesium.defined(orientation)) {
      modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position, undefined, modelMatrix);
    } else {
      modelMatrix = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromQuaternion(orientation, rotationMatrix), position, modelMatrix);
    }
    return modelMatrix;
  }

  let emitterModelMatrix = new Cesium.Matrix4();
  let translation = new Cesium.Cartesian3();
  let rotation = new Cesium.Quaternion();
  let hpr = new Cesium.HeadingPitchRoll();
  let trs = new Cesium.TranslationRotationScale();

//计算偏移
  function computeEmitterModelMatrix() {
    hpr = Cesium.HeadingPitchRoll.fromDegrees(viewModel.heading, viewModel.pitch, viewModel.roll, hpr);
    trs.translation = Cesium.Cartesian3.fromElements(viewModel.transX, viewModel.transY, viewModel.transZ, translation);
    trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, rotation);
    return Cesium.Matrix4.fromTranslationRotationScale(trs, emitterModelMatrix);
  }
  let ll = new Cesium.Cartographic.fromDegrees(Number(e.y), Number(e.x));
  let height = earth.scene.globe.getHeight(ll);
  let staticPosition = Cesium.Cartesian3.fromDegrees(Number(e.y), Number(e.x), height);
  let entity = view.entities.add({
    position: staticPosition
  });
  let scene = view.scene;
  let particleSystem = scene.primitives.add(new Cesium.ParticleSystem({
    image: val,
    startColor: new Cesium.Color(1, 1, 1, 1),
    endColor: new Cesium.Color(0.8, 0.6, 0, 0.2),
    startScale: 1,
    endScale: 5,
    //设定粒子寿命可能持续时间的最小限值(以秒为单位)，在此限值之上将随机选择粒子的实际寿命。
    minimumParticleLife: 1,
    maximumParticleLife: 6,
    minimumSpeed: 10,
    maximumSpeed: 30,
    imageSize: new Cesium.Cartesian2(30, 30),
    emissionRate: 4,
    lifetime: 2,
    bursts: [
      new Cesium.ParticleBurst({
        time: 3.0,
        minimum: 4,
        maximum: 6
      })
    ],
    //cesium内置的发射器，圆形发射器，因此参数是一个半径值
    //还有锥形发射器，new Cesium.ConeEmitter(Cesium.Math.toRadians(45.0))
    //长方形发射器，new Cesium.BoxEmitter(new Cesium.Cartesian3(1.0, 1.0, 1.0))
    //半球发射器，new Cesium.SphereEmitter(0.5)
    emitter: new Cesium.ConeEmitter(Cesium.Math.toRadians(45.0)),
    modelMatrix: computeModelMatrix(entity, Cesium.JulianDate.now()),
    emitterModelMatrix: computeEmitterModelMatrix()
  }));
  setTimeout(() => {
    view.scene.primitives.remove(entity);
    view.scene.primitives.remove(particleSystem)
  }, 3000)
}

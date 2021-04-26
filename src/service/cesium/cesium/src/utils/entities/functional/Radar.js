//扩散扫描
export function showCircleScan() {
  let handler = new Cesium.ScreenSpaceEventHandler(earth.scene.canvas);
  handler.setInputAction(function (movement) {
    let  position = earth.camera.pickEllipsoid(movement.position, earth.scene.globe.ellipsoid);
    let arr=Cartesian3_to_WGS84(position)
    showCircleScans(arr);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  handler.setInputAction(function (movement) {
    handler.destroy();//关闭事件句柄
    handler = null;
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}
//雷达扫描
export function showRadarScan() {
  let handler = new Cesium.ScreenSpaceEventHandler(earth.scene.canvas);
  handler.setInputAction(function (movement) {
    let  position = earth.camera.pickEllipsoid(movement.position, earth.scene.globe.ellipsoid);
    let arr=Cartesian3_to_WGS84(position)
    showRadarScans(arr);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  handler.setInputAction(function (movement) {
    handler.destroy();//关闭事件句柄
    handler = null;
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}

// 圆扩散
function showCircleScans(arr) {
  let cartographicCenter = new Cesium.Cartographic(Cesium.Math.toRadians(Number(arr.lng)), Cesium.Math.toRadians(Number(arr.lat)), Number(arr.alt));
  let scanColor = new Cesium.Color(1.0, 1.0, 1.0, 0);
  addCircleScanPostStage(earth, cartographicCenter, 3000, scanColor, 3000);
}

// 雷达扫描
function showRadarScans(arr) {
  let cartographicCenter = new Cesium.Cartographic(Cesium.Math.toRadians(Number(arr.lng)), Cesium.Math.toRadians(Number(arr.lat)), Number(arr.alt));
  let scanColor = new Cesium.Color(1.0, 0.0, 0.0, 1);
  let asd=addRadarScanPostStage(earth, cartographicCenter, 3000, scanColor, 3000);
  // setTimeout(()=>{
  //   // 清除
  //   earth.scene.postProcessStages.remove(asd);
  // },5000)
}

/*
  添加扩散效果扫描线
  viewer
  cartographicCenter 扫描中心
  radius  半径 米
  scanColor 扫描颜色
  duration 持续时间 毫秒
*/
function addCircleScanPostStage(viewer, cartographicCenter, maxRadius, scanColor, duration) {
  let _Cartesian3Center = Cesium.Cartographic.toCartesian(cartographicCenter);
  let _Cartesian4Center = new Cesium.Cartesian4(_Cartesian3Center.x, _Cartesian3Center.y, _Cartesian3Center.z, 1);

  let _CartograhpicCenter1 = new Cesium.Cartographic(cartographicCenter.longitude, cartographicCenter.latitude, cartographicCenter.height + 500);
  let _Cartesian3Center1 = Cesium.Cartographic.toCartesian(_CartograhpicCenter1);
  let _Cartesian4Center1 = new Cesium.Cartesian4(_Cartesian3Center1.x, _Cartesian3Center1.y, _Cartesian3Center1.z, 1);

  let _time = (new Date()).getTime();

  let _scratchCartesian4Center = new Cesium.Cartesian4();
  let _scratchCartesian4Center1 = new Cesium.Cartesian4();
  let _scratchCartesian3Normal = new Cesium.Cartesian3();


  let ScanPostStage = new Cesium.PostProcessStage({
    fragmentShader: getScanSegmentShader(),
    uniforms: {
      u_scanCenterEC: function () {
        let temp = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
        return temp;
      },
      u_scanPlaneNormalEC: function () {
        let temp = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
        let temp1 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center1, _scratchCartesian4Center1);

        _scratchCartesian3Normal.x = temp1.x - temp.x;
        _scratchCartesian3Normal.y = temp1.y - temp.y;
        _scratchCartesian3Normal.z = temp1.z - temp.z;

        Cesium.Cartesian3.normalize(_scratchCartesian3Normal, _scratchCartesian3Normal);

        return _scratchCartesian3Normal;
      },
      u_radius: function () {
        return maxRadius * (((new Date()).getTime() - _time) % duration) / duration;
      },
      u_scanColor: scanColor
    }
  });

  viewer.scene.postProcessStages.add(ScanPostStage);
  return ScanPostStage;
}

/*
  添加雷达扫描线
  viewer
  cartographicCenter 扫描中心
  radius  半径 米
  scanColor 扫描颜色
  duration 持续时间 毫秒
*/
function addRadarScanPostStage(viewer, cartographicCenter, radius, scanColor, duration) {
  let _Cartesian3Center = Cesium.Cartographic.toCartesian(cartographicCenter);
  let _Cartesian4Center = new Cesium.Cartesian4(_Cartesian3Center.x, _Cartesian3Center.y, _Cartesian3Center.z, 1);

  let _CartographicCenter1 = new Cesium.Cartographic(cartographicCenter.longitude, cartographicCenter.latitude, cartographicCenter.height + 500);
  let _Cartesian3Center1 = Cesium.Cartographic.toCartesian(_CartographicCenter1);
  let _Cartesian4Center1 = new Cesium.Cartesian4(_Cartesian3Center1.x, _Cartesian3Center1.y, _Cartesian3Center1.z, 1);

  let _CartographicCenter2 = new Cesium.Cartographic(cartographicCenter.longitude + Cesium.Math.toRadians(0.001), cartographicCenter.latitude, cartographicCenter.height);
  let _Cartesian3Center2 = Cesium.Cartographic.toCartesian(_CartographicCenter2);
  let _Cartesian4Center2 = new Cesium.Cartesian4(_Cartesian3Center2.x, _Cartesian3Center2.y, _Cartesian3Center2.z, 1);
  let _RotateQ = new Cesium.Quaternion();
  let _RotateM = new Cesium.Matrix3();

  let _time = (new Date()).getTime();

  let _scratchCartesian4Center = new Cesium.Cartesian4();
  let _scratchCartesian4Center1 = new Cesium.Cartesian4();
  let _scratchCartesian4Center2 = new Cesium.Cartesian4();
  let _scratchCartesian3Normal = new Cesium.Cartesian3();
  let _scratchCartesian3Normal1 = new Cesium.Cartesian3();

  let ScanPostStage = new Cesium.PostProcessStage({
    fragmentShader: getRadarScanShader(),
    uniforms: {
      u_scanCenterEC: function () {
        return Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
      },
      u_scanPlaneNormalEC: function () {
        let temp = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
        let temp1 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center1, _scratchCartesian4Center1);
        _scratchCartesian3Normal.x = temp1.x - temp.x;
        _scratchCartesian3Normal.y = temp1.y - temp.y;
        _scratchCartesian3Normal.z = temp1.z - temp.z;

        Cesium.Cartesian3.normalize(_scratchCartesian3Normal, _scratchCartesian3Normal);
        return _scratchCartesian3Normal;
      },
      u_radius: radius,
      u_scanLineNormalEC: function () {
        let temp = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
        let temp1 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center1, _scratchCartesian4Center1);
        let temp2 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center2, _scratchCartesian4Center2);

        _scratchCartesian3Normal.x = temp1.x - temp.x;
        _scratchCartesian3Normal.y = temp1.y - temp.y;
        _scratchCartesian3Normal.z = temp1.z - temp.z;

        Cesium.Cartesian3.normalize(_scratchCartesian3Normal, _scratchCartesian3Normal);

        _scratchCartesian3Normal1.x = temp2.x - temp.x;
        _scratchCartesian3Normal1.y = temp2.y - temp.y;
        _scratchCartesian3Normal1.z = temp2.z - temp.z;

        let tempTime = (((new Date()).getTime() - _time) % duration) / duration;
        Cesium.Quaternion.fromAxisAngle(_scratchCartesian3Normal, tempTime * Cesium.Math.PI * 2, _RotateQ);
        Cesium.Matrix3.fromQuaternion(_RotateQ, _RotateM);
        Cesium.Matrix3.multiplyByVector(_RotateM, _scratchCartesian3Normal1, _scratchCartesian3Normal1);
        Cesium.Cartesian3.normalize(_scratchCartesian3Normal1, _scratchCartesian3Normal1);
        return _scratchCartesian3Normal1;
      },
      u_scanColor: scanColor
    }
  });
  viewer.scene.postProcessStages.add(ScanPostStage);

  return ScanPostStage;
}

//扩散效果Shader
function getScanSegmentShader() {
  let scanSegmentShader = "\n\
                    uniform sampler2D colorTexture;\n\
                    uniform sampler2D depthTexture;\n\
                    varying vec2 v_textureCoordinates;\n\
                    uniform vec4 u_scanCenterEC;\n\
                    uniform vec3 u_scanPlaneNormalEC;\n\
                    uniform float u_radius;\n\
                    uniform vec4 u_scanColor;\n\
                    \n\
                    vec4 toEye(in vec2 uv,in float depth)\n\
                    {\n\
                                vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));\n\
                                vec4 posIncamera = czm_inverseProjection * vec4(xy,depth,1.0);\n\
                                posIncamera = posIncamera/posIncamera.w;\n\
                                return posIncamera;\n\
                    }\n\
                    \n\
                    vec3 pointProjectOnPlane(in vec3 planeNormal,in vec3 planeOrigin,in vec3 point)\n\
                    {\n\
                                vec3 v01 = point - planeOrigin;\n\
                                float d = dot(planeNormal,v01);\n\
                                return (point-planeNormal * d);\n\
                    }\n\
                    float getDepth(in vec4 depth)\n\
                    {\n\
                                float z_window = czm_unpackDepth(depth);\n\
                                z_window = czm_reverseLogDepth(z_window);\n\
                                float n_range = czm_depthRange.near;\n\
                                float f_range = czm_depthRange.far;\n\
                                return (2.0 * z_window - n_range - f_range)/(f_range-n_range);\n\
                    } \n\
                    void main()\n\
                    {\n\
                                gl_FragColor = texture2D(colorTexture,v_textureCoordinates);\n\
                                float depth = getDepth(texture2D(depthTexture,v_textureCoordinates));\n\
                                vec4 viewPos = toEye(v_textureCoordinates,depth);\n\
                                vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz,u_scanCenterEC.xyz,viewPos.xyz);\n\
                                float dis = length(prjOnPlane.xyz - u_scanCenterEC.xyz);\n\
                                if(dis<u_radius)\n\
                                {\n\
                                    float f = 1.0-abs(u_radius - dis )/ u_radius;\n\
                                    f = pow(f,4.0);\n\
                                    gl_FragColor = mix(gl_FragColor,u_scanColor,f);\n\
                                }\n\
                    } \n\ ";
  return scanSegmentShader;
}
//雷达扫描线效果Shader
function getRadarScanShader() {
  let scanSegmentShader =
    "uniform sampler2D colorTexture;\n" +
    "uniform sampler2D depthTexture;\n" +
    "varying vec2 v_textureCoordinates;\n" +
    "uniform vec4 u_scanCenterEC;\n" +
    "uniform vec3 u_scanPlaneNormalEC;\n" +
    "uniform vec3 u_scanLineNormalEC;\n" +
    "uniform float u_radius;\n" +
    "uniform vec4 u_scanColor;\n" +

    "vec4 toEye(in vec2 uv, in float depth)\n" +
    " {\n" +
    " vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));\n" +
    " vec4 posInCamera =czm_inverseProjection * vec4(xy, depth, 1.0);\n" +
    " posInCamera =posInCamera / posInCamera.w;\n" +
    " return posInCamera;\n" +
    " }\n" +

    "bool isPointOnLineRight(in vec3 ptOnLine, in vec3 lineNormal, in vec3 testPt)\n" +
    "{\n" +
    "vec3 v01 = testPt - ptOnLine;\n" +
    "normalize(v01);\n" +
    "vec3 temp = cross(v01, lineNormal);\n" +
    "float d = dot(temp, u_scanPlaneNormalEC);\n" +
    "return d > 0.5;\n" +
    "}\n" +

    "vec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point)\n" +
    "{\n" +
    "vec3 v01 = point -planeOrigin;\n" +
    "float d = dot(planeNormal, v01) ;\n" +
    "return (point - planeNormal * d);\n" +
    "}\n" +

    "float distancePointToLine(in vec3 ptOnLine, in vec3 lineNormal, in vec3 testPt)\n" +
    "{\n" +
    "vec3 tempPt = pointProjectOnPlane(lineNormal, ptOnLine, testPt);\n" +
    "return length(tempPt - ptOnLine);\n" +
    "}\n" +

    "float getDepth(in vec4 depth)\n" +
    "{\n" +
    "float z_window = czm_unpackDepth(depth);\n" +
    "z_window = czm_reverseLogDepth(z_window);\n" +
    "float n_range = czm_depthRange.near;\n" +
    "float f_range = czm_depthRange.far;\n" +
    "return (2.0 * z_window - n_range - f_range) / (f_range - n_range);\n" +
    "}\n" +

    "void main()\n" +
    "{\n" +
    "gl_FragColor = texture2D(colorTexture, v_textureCoordinates);\n" +
    "float depth = getDepth( texture2D(depthTexture, v_textureCoordinates));\n" +
    "vec4 viewPos = toEye(v_textureCoordinates, depth);\n" +
    "vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz, u_scanCenterEC.xyz, viewPos.xyz);\n" +
    "float dis = length(prjOnPlane.xyz - u_scanCenterEC.xyz);\n" +
    "float twou_radius = u_radius * 2.0;\n" +
    "if(dis < u_radius)\n" +
    "{\n" +
    "float f0 = 1.0 -abs(u_radius - dis) / u_radius;\n" +
    "f0 = pow(f0, 64.0);\n" +
    "vec3 lineEndPt = vec3(u_scanCenterEC.xyz) + u_scanLineNormalEC * u_radius;\n" +
    "float f = 0.0;\n" +
    "if(isPointOnLineRight(u_scanCenterEC.xyz, u_scanLineNormalEC.xyz, prjOnPlane.xyz))\n" +
    "{\n" +
    "float dis1= length(prjOnPlane.xyz - lineEndPt);\n" +
    "f = abs(twou_radius -dis1) / twou_radius;\n" +
    "f = pow(f, 3.0);\n" +
    "}\n" +
    "gl_FragColor = mix(gl_FragColor, u_scanColor, f + f0);\n" +
    "}\n" +
    "}\n";
  return scanSegmentShader;
}
//笛卡尔坐标系转WGS84坐标系
function Cartesian3_to_WGS84(point) {
  var cartesian33 = new Cesium.Cartesian3(point.x, point.y, point.z);
  var cartographic = Cesium.Cartographic.fromCartesian(cartesian33);
  var lat = Cesium.Math.toDegrees(cartographic.latitude);
  var lng = Cesium.Math.toDegrees(cartographic.longitude);
  var alt = cartographic.height;
  return {lat: lat, lng: lng, alt: alt};
}

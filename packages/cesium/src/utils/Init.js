import {CesiumZh} from './CesiumZh'

let vm = {
  imagery: [],
  terrains: [],
};
function Init(id,ViewModel,infoCallBack,loadingComplete,choiceMap,xyz,Mode) {
  if (xyz===undefined) {
      xyz.x="";
      xyz.y="";
      xyz.z="";
  }
  this.viewer = {};
  this.mapBaseData = {
    lng: 0,
    lat: 0,
    height: 0,
    cameraHeight: 0
  };
  vm.imagery=[];
  vm.terrains=[];
  for (let v of ViewModel) {
    switch (v.type) {
      case 0:
        vm.imagery.push(new Cesium.ProviderViewModel({
          name: v.name,
          tooltip: v.tooltip,
          iconUrl: v.iconUrl,
          creationFunction: function () {
            choiceMap(v.name)
            return new Cesium.UrlTemplateImageryProvider({
              url: v.url
            });
          }
        }))
        break;
      case 1:
        vm.terrains.push(new Cesium.ProviderViewModel({
          name: v.name,
          tooltip: v.tooltip,
          iconUrl: v.iconUrl,
          creationFunction: function () {
            choiceMap(v.name)
            return new Cesium.CesiumTerrainProvider({
              url: v.url,
              requestVertexNormals: true
            });
          }
        }))
        break;
    }
  }
  this.viewer = new Cesium.Viewer(id, {
    animation: false, // 是否显示动画控件
    selectionIndicator:false, //关闭实体点击框
    shouldAnimate: true,
    homeButton: false, // 是否显示Home按钮
    fullscreenButton: false, // 是否显示全屏按钮
    geocoder: false, // 是否显示地名查找控件
    timeline: false, // 是否显示时间线控件
    sceneModePicker: false, // 是否显示投影方式控件
    navigationHelpButton: true, // 是否显示帮助信息控件
    infoBox: false, // 是否显示点击要素之后显示的信息
    requestRenderMode: true, // 启用请求渲染模式
    sceneMode:Number(Mode), // 初始场景模式 1 2D模式 2 2D循环模式 3 3D模式  Cesium.SceneMode
    fullscreenElement: document.body, // 全屏时渲染的HTML元素 暂时没发现用处
    baseLayerPicker: true,
    imageryProviderViewModels: vm.imagery,
    selectedImageryProviderViewModel: vm.imagery[0],
    terrainProviderViewModels:vm.terrains,
    selectedTerrainProviderViewModel:vm.terrains[0],
    scene3DOnly: true,//如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
  });
  Cesium.knockout.track(vm);
  new CesiumZh();
  this.viewer.scene.globe.enableLighting = false;
  this.viewer.scene.globe.depthTestAgainstTerrain = true;
  this.viewer.scene.camera.setView({
    // 初始化相机经纬度
    destination: new Cesium.Cartesian3.fromDegrees(Number(xyz.x?xyz.x:106.379390), Number(xyz.y?xyz.y:29.534726), Number(xyz.z?xyz.z:13000)),
    orientation: {
      heading: Cesium.Math.toRadians(0.0),
      pitch: Cesium.Math.toRadians(-60.0),//从上往下看为-90
      roll: 0
    }
  });
  this.viewer.scene.debugShowFramesPerSecond = false; //显示帧率
  this.viewer.scene.screenSpaceCameraController.minimumZoomDistance = 1;//相机的高度的最小值
  // this.viewer.scene.screenSpaceCameraController.maximumZoomDistance = 50000;//相机的高度的最大值/
  this.viewer.scene.screenSpaceCameraController._minimumZoomRate = 50; // 设置相机缩小时的速率
  this.viewer.scene.screenSpaceCameraController._maximumZoomRate = 5906376272000;    //设置相机放大时的速率
  this.viewer.scene.screenSpaceCameraController.zoomEventTypes = [Cesium.CameraEventType.WHEEL, Cesium.CameraEventType.PINCH];
  this.viewer.scene.screenSpaceCameraController.tiltEventTypes = [Cesium.CameraEventType.PINCH, Cesium.CameraEventType.RIGHT_DRAG];
  // 去除版权信息
  this.viewer._cesiumWidget._creditContainer.style.display = 'none';
  //取消双击事件
  this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
  let handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
  const that = this;
  handler.setInputAction(function (evt) {
    let ray = that.viewer.camera.getPickRay(evt.endPosition);
    let cartesian = that.viewer.scene.globe.pick(ray, that.viewer.scene);
    if (cartesian) {
      let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      that.mapBaseData.lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6);
      that.mapBaseData.lng = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6);
      that.mapBaseData.height = cartographic.height.toFixed(2);
      that.mapBaseData.cameraHeight = that.viewer.camera.positionCartographic.height.toFixed(2);
      infoCallBack(that.mapBaseData);
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  let helper=new Cesium.EventHelper();
  helper.add(that.viewer.scene.globe.tileLoadProgressEvent,function (event) {
    if (event===0) {
      loadingComplete();
    }
  });
  window.earth = this.viewer
}
export {Init}

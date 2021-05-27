// 军事标绘编辑类

import {point3dsToPoint2ds} from "../PlotUtils/utils3d"
import {cartesian3ToPoint3D} from "../PlotBase/PlotBaseUtils"
import PlotTypes from "../PlotTypes"
import * as turf from "@turf/turf"

export default class MilitaryPlotEditor {
  constructor(viewer, militaryPlotLayer) {
    this.viewer = viewer;
    this.militaryPlotLayer = militaryPlotLayer; //只能从指定的图层中获取编辑对象 如果拾取的对象不在该图层 不进行编辑 这样不用处理绘制和编辑器的关系
    this.initEventHandler();
    this.onIsDisabledEdit();
  }

  //鼠标事件
  initEventHandler() {
    this.eventHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    this.PlotEditEndEvent = new Cesium.Event(); //编辑结束事件
  }
  onIsDisabledEdit(isDisabledEdit){
    this.isDisabledEdit = isDisabledEdit === undefined ? false : isDisabledEdit;
  }
  //激活编辑
  activate() {
    this.deactivate();
    //鼠标左键点击事件 鼠标左键点击拾取需要编辑的对象
    this.initLeftClickEventHandler();
  }

  //禁用编辑
  deactivate() {
    this.eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this.clear();
  }

  //清空编辑节点
  clear() {
    this.clearEditVertex();
  }

  //左键点击事件
  initLeftClickEventHandler() {
    this.eventHandler.setInputAction(e => {
      let object = this.viewer.scene.pick(e.position);
      if (!object) {
        this.handleEditMilitaryPlot();
        return; // 没有拾取到对象 直接返回 不做任何操作
      }
      if (this.isDisabledEdit){ // 编辑处理
        // 拾取到对象 判断拾取到的对象类型
        if (!object.id || object.id.plotType !== "MilitaryPlot") {
          this.handleEditMilitaryPlot();
          return;
        }

        //重复点击同一个对象
        if (this.militaryPlot && this.militaryPlot.plotCode === object.id.plotCode) return;
        //拾取到新的GeoPlot对象
        this.handleEditMilitaryPlot(); //处理上一个编辑对象
        this.handlePickMilitaryPlot(object.id);
      } else { // 选择处理
        console.log(object);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  //处理编辑对象
  handleEditMilitaryPlot() {
    this.clear();
    let militaryPlot = this.militaryPlot;
    if (!militaryPlot) return;
    this.militaryPlot = undefined;
    militaryPlot.openEditMode(false);
    if (!this.isEdited) return; //没有任何编辑 直接返回
    //触发编辑事件 militaryPlot  当节点被移动或者新增节点才表示被编辑过
    this.PlotEditEndEvent.raiseEvent(militaryPlot);
    this.isEdited = false;
    this.isEditing = false;
  }

  //处理拾取到的对象
  handlePickMilitaryPlot(pickId) {
    this.militaryPlot = this.militaryPlotLayer.getByPlotCode(pickId.plotCode);
    if (!this.militaryPlot) return; //图层里面没有该对象 说明是在绘制的时候触发该事件
    this.isEditing = false;
    this.isEdited = false;
    this.militaryPlot.openEditMode(true);

    this.editPositions = this.plotPointsToPositions();
    this.EditMoveCenterPositoin = this.getMilitaryPlotCenterPosition();

    this.clear();
    this.createEditVertex();
    this.registerEvents();
  }

  //注册事件监听
  registerEvents() {
    //鼠标左键按下事件 当有对象被选中时 如果拾取到编辑辅助要素 表示开始改变对象的位置
    this.initLeftDownEventHandler();
    //鼠标移动事件 鼠标移动 如果有编辑对象 表示改变编辑对象的位置
    this.initMouseMoveEventHandler();
    //鼠标左键抬起事件 当有编辑对象时
    this.initLeftUpEventHandler();
  }

  //取消事件监听
  unRegisterEvents() {
    this.eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
    this.eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP);
    this.eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    // this.eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  //场景鼠标左键按下事件
  initLeftDownEventHandler() {
    this.eventHandler.setInputAction((e) => {
      let id = this.viewer.scene.pick(e.position);
      if (!id) {
        return;
      }
      // 拾取到对象 判断拾取到的对象类型
      if (!id.id || !id.id.type) return;
      //拾取到具有type 属性的entity对象
      if (id.id.type == "MilitaryPlotEditVertex" || id.id.type == "MilitaryPlotEditMoveVertex") {
        this.isEditing = true;
        this.viewer.scene.screenSpaceCameraController.enableRotate = false; //禁用场景的旋转移动功能 保留缩放功能
        //改变鼠标状态
        this.viewer.enableCursorStyle = false;
        this.viewer._element.style.cursor = '';
        document.body.style.cursor = "move";
        this.editVertext = id.id;
        this.editVertext.show = false;
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
  }

  //场景鼠标左键抬起事件
  initLeftUpEventHandler() {
    this.eventHandler.setInputAction(((e) => {
      if (!this.isEditing) return;
      this.viewer.enableCursorStyle = true;
      document.body.style.cursor = "default";
      this.viewer.scene.screenSpaceCameraController.enableRotate = true;
      this.editVertext.show = true;
      this.isEditing = false;
    }), Cesium.ScreenSpaceEventType.LEFT_UP);
  }

  //场景鼠标移动事件
  initMouseMoveEventHandler() {
    this.eventHandler.setInputAction(((e) => {
      //先拾取位置 如果没有拾取到 直接返回  因为场景拾取位置有时会发生错误 拾取不到位置
      let pickPosition = this.viewer.scene.pickPosition(e.endPosition);
      if (!pickPosition) {
        pickPosition = this.viewer.scene.camera.pickEllipsoid(e.endPosition, this.viewer.scene.globe.ellipsoid);
      }
      if (!pickPosition) return;
      //判断是否有正在移动的对象
      if (!this.isEditing) return;
      // this.militaryPlot.updatePosition(pickPosition); //更新位置  因为传递过来的是数组对象 直接更新 不用在调用更新方法
      // 判断是整体平移还是节点平移
      if (this.editVertext.type == "MilitaryPlotEditMoveVertex") {
        let startPosition = this.EditMoveCenterPositoin;
        if (!startPosition) return;
        this.moveEntityByOffset(startPosition, pickPosition);
      } else {
        this.editPositions[this.editVertext.vertexIndex] = pickPosition;
        this.militaryPlot.setPoints(point3dsToPoint2ds(this.editPositions));
      }
      this.isEdited = true;
      this.EditMoveCenterPositoin = this.getMilitaryPlotCenterPosition();
    }), Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }

  //获取编辑对象的中心点
  getMilitaryPlotCenterPosition() {
    //如果是圆 或者点 返回第一个点作为移动点
    switch (this.militaryPlot.baseInfo.plotName) {
      case PlotTypes.CIRCLE:
      case PlotTypes.MARKER:
        return this.editPositions[0];
    }

    //构建turf.js  lineString
    let geo = turf.lineString(this.militaryPlot.getPoints());
    let bbox = turf.bbox(geo);
    let bboxPolygon = turf.bboxPolygon(bbox);
    let pointOnFeature = turf.center(bboxPolygon);
    let lonLat = pointOnFeature.geometry.coordinates;
    return Cesium.Cartesian3.fromDegrees(lonLat[0], lonLat[1], this.militaryPlot.getHeight());
  }

  //根据偏移量移动实体
  moveEntityByOffset(startPosition, endPosition) {
    let startPoint3d = cartesian3ToPoint3D(startPosition);
    let endPoint3d = cartesian3ToPoint3D(endPosition);
    let offsetX = endPoint3d.x - startPoint3d.x;
    let offsetY = endPoint3d.y - startPoint3d.y;

    //设置偏移量
    let element, point3d;
    for (let i = 0; i < this.editPositions.length; i++) {
      element = cartesian3ToPoint3D(this.editPositions[i]);
      element.x += offsetX;
      element.y += offsetY;
      this.editPositions[i] = Cesium.Cartesian3.fromDegrees(element.x, element.y, element.z)
    }
    this.militaryPlot.setPoints(point3dsToPoint2ds(this.editPositions));
  }

  plotPointsToPositions() {
    let points = this.militaryPlot.getPoints();
    let height = this.militaryPlot.getHeight();

    let degreesArrayHeights = [];
    for (let i = 0; i < points.length; i++) {
      const element = points[i];
      degreesArrayHeights.push(element[0]);
      degreesArrayHeights.push(element[1]);
      degreesArrayHeights.push(height);
    }

    return Cesium.Cartesian3.fromDegreesArrayHeights(degreesArrayHeights);
  }

  //创建编辑节点对象
  createEditVertex() {
    this.vertexEntities = [];
    let positions = this.plotPointsToPositions();

    //对圆进行特殊处理
    if (this.militaryPlot.baseInfo.plotName == PlotTypes.CIRCLE) {
      this.createCircleEditVertex();
      this.createEditMoveCenterEntity();
      return;
    }
    positions.forEach((p, index) => {
      const entity = this.viewer.entities.add({
        position: new Cesium.CallbackProperty(e => {
          return this.editPositions[index];
        }, false),
        type: "MilitaryPlotEditVertex",
        vertexIndex: index, //节点索引
        point: {
          color: Cesium.Color.DARKBLUE.withAlpha(0.4),
          pixelSize: 10,
          outlineColor: Cesium.Color.YELLOW.withAlpha(0.4),
          outlineWidth: 3,
          disableDepthTestDistance: 2000,
        },
      })
      this.vertexEntities.push(entity);
    });

    if (this.editPositions.length == 1) { //只有一个节点表示点类型 不需要创建整体移动节点
      return;
    }
    this.createEditMoveCenterEntity();
  }

  //创建编辑圆的节点对象
  createCircleEditVertex() {
    const entity = this.viewer.entities.add({
      position: new Cesium.CallbackProperty(e => {
        return this.editPositions[1];
      }, false),
      type: "MilitaryPlotEditVertex",
      vertexIndex: 1, //节点索引
      point: {
        color: Cesium.Color.DARKBLUE.withAlpha(0.4),
        pixelSize: 10,
        outlineColor: Cesium.Color.YELLOW.withAlpha(0.4),
        outlineWidth: 3,
        disableDepthTestDistance: 2000,
      },
    })
    this.vertexEntities.push(entity);
  }

  //创建整体移动的entity对象
  createEditMoveCenterEntity() {
    this.EditMoveCenterEntity = this.viewer.entities.add({
      position: new Cesium.CallbackProperty(e => {
        return this.EditMoveCenterPositoin;
      }, false),
      type: "MilitaryPlotEditMoveVertex",
      point: {
        color: Cesium.Color.RED.withAlpha(0.4),
        pixelSize: 10,
        outlineColor: Cesium.Color.WHITE.withAlpha(0.3),
        outlineWidth: 3,
        disableDepthTestDistance: 2000,
      },
    })
  }

  //清空编辑节点
  clearEditVertex() {
    if (this.vertexEntities) {
      this.vertexEntities.forEach(item => {
        this.viewer.entities.remove(item);
      })
    }
    this.vertexEntities = [];
    this.viewer.entities.remove(this.EditMoveCenterEntity);
  }
}

import PlotDrawTip from "../PlotBase/PlotDrawTip"
import MousePoint from "../PlotBase/MousePoint"
import PlotFactory from '../PlotFactory';

import {point3dToPoint2d} from '../PlotUtils/utils3d';
import {ZERO_TOLERANCE} from "../Constants"
import {distance} from "../PlotUtils/utils2d"
import PlottingTypes from "../PlotTypes";
import uuid from "uuid-umd";

export default class PlotDraw {
  constructor(viewer) {
    this.viewer = viewer;
    this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    this.initEvents();
  }

  //激活
  activate(plotType,fillColor) {
    this.plotType = plotType;
    this.clear();
    this.points = [];
    this.plotDrawTip = new PlotDrawTip(this.viewer);
    this.MousePoint = new MousePoint(this.viewer);
    this.registerEvents(); //注册鼠标事件
    this.fillColor = fillColor;
    //设置鼠标状态
    this.viewer.enableCursorStyle = false;
    this.viewer._element.style.cursor = 'default';
    this.initMouseTip();
    this.PlotDrawStartEvent.raiseEvent(); //触发开始绘制事件
  }

  initEvents() {
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    this.PlotDrawStartEvent = new Cesium.Event(); //开始绘制事件
    this.PlotDrawEndEvent = new Cesium.Event(); //结束绘制事件
  }

  //注册鼠标事件
  registerEvents() {
    this.leftClickEvent();
    this.rightClickEvent();
    this.mouseMoveEvent();
  }

  leftClickEvent() {
    //单击鼠标左键画点
    this.handler.setInputAction(e => {
      this.viewer._element.style.cursor = 'default'; //由于鼠标移动时 Cesium会默认将鼠标样式修改为手柄 所以移动时手动设置回来
      let position = this.viewer.scene.pickPosition(e.position);
      if (!position) {
        position = this.viewer.scene.camera.pickEllipsoid(e.position, this.viewer.scene.globe.ellipsoid);
      }
      if (!position) return;
      const point = point3dToPoint2d(position);
      let c = Cesium.Cartographic.fromCartesian(position);
      if (this.points.length === 0) { //绘制一个点后 才创建标绘对象 解决点类型标绘必须初始化时设置点
        this.points.push(point);
        this.generatePlot(this.points, c.height);
      } else {
        //如果两个点距离太小会报错（点击同一个点时报错
        if (distance(point, this.points[this.points.length - 1]) < ZERO_TOLERANCE) return;
        this.points.push(point);
        this.plot.setPoints(this.points);
        this.plot.continueClick();
      }
      this.setMouseTipContent();
      if (this.plot.fixPointCount === this.points.length) {
        this.drawEnd();
        this.deactivate();
      }

    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  rightClickEvent() {
    //右键的时候 两种情况 一是取消操作（一个点都没有的情况下 是取消当前工具）
    //有点的时候（没有限制点数）是结束绘制
    this.handler.setInputAction(e => {
      if (this.points.length === 0) { //右键结束时 如果一个点都么有 此时没有构建标绘对象 即取消操作
        this.deactivate();
        return;
      }
      if (this.plot.fixPointCount) { //如果标绘对象有限定点数 判断当前点是否满足限定点
        if (this.points.length === this.plot.fixPointCount) {
          this.plot.setPoints(this.points);
          this.drawEnd();
          this.deactivate();
        } else { //点数达不到限定点数 取消操作
          this.deactivate();
          this.clear();
        }
      } else { //如果有点 并且没有限制点数 判断是否满足最少点数 结束绘制
        if (this.points.length >= this.plot.minPointCount) {
          this.plot.setPoints(this.points);
          this.drawEnd();
          this.deactivate();
        } else { //当前点数不满足最少点数 取消操作
          this.deactivate();
          this.clear();
        }

      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  //鼠标移动事件
  mouseMoveEvent() {
    this.handler.setInputAction(e => {
      let position = this.viewer.scene.pickPosition(e.endPosition);
      if (!position) {
        position = this.viewer.scene.camera.pickEllipsoid(e.endPosition, this.viewer.scene.globe.ellipsoid);
      }
      if (!position) return;

      this.plotDrawTip.updatePosition(position);
      this.MousePoint.updatePosition(position);
      if (!this.plot) return;

      let point = point3dToPoint2d(position);
      if (distance(point, this.points[this.points.length - 1]) < ZERO_TOLERANCE) return;
      const ps = this.points.concat([point]);
      this.plot.setPoints(ps);
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }

  initMouseTip() {
    const plotName = this.getPlotNam();
    const rightClickCancel = "按下鼠标右键取消绘制";
    const leftClickPickPoint = "按下鼠标左键确定第一个点的位置";

    switch (this.plotType) {
      case PlottingTypes.POINT_MARKER:  //只要1个点
        this.plotDrawTip.setContent(["当前绘制类型：" + plotName + "，需要1个点", "按下鼠标左键确定位置", rightClickCancel])
        break;
      case PlottingTypes.POLYLINE: //最少需要2个点
      case PlottingTypes.SQUAD_COMBAT:
      case PlottingTypes.TAILED_SQUAD_COMBAT:
        this.plotDrawTip.setContent(["当前绘制类型：" + plotName + "，最少需要2个点", leftClickPickPoint, rightClickCancel])
        break;
      case PlottingTypes.ELLIPSE: //只要2个点
      case PlottingTypes.CIRCLE:
      case PlottingTypes.RECTANGLE:
      case PlottingTypes.FINE_ARROW:
      case PlottingTypes.ASSAULT_DIRECTION:
        this.plotDrawTip.setContent(["当前绘制类型：" + plotName + "，需要2个点", leftClickPickPoint, rightClickCancel])
        break;
      case PlottingTypes.POLYGON: //最少需要3个点
      case PlottingTypes.ATTACK_ARROW:
      case PlottingTypes.TAILED_ATTACK_ARROW:
      case PlottingTypes.CLOSED_CURVE:
        this.plotDrawTip.setContent(["当前绘制类型：" + plotName + "，最少需要3个点", leftClickPickPoint, rightClickCancel])
        break;
      case PlottingTypes.GATHERING_PLACE: //只要3个点
      case PlottingTypes.SECTOR:
      case PlottingTypes.TRIANGLE_FLAG:
      case PlottingTypes.RECTANGLE_FLAG:
      case PlottingTypes.WAVE_FLAG:
        this.plotDrawTip.setContent(["当前绘制类型：" + plotName + "，需要3个点", leftClickPickPoint, rightClickCancel])
        break;
      case PlottingTypes.DOUBLE_ARROW:
        this.plotDrawTip.setContent(["当前绘制类型：" + plotName + "，需要4个点", leftClickPickPoint, rightClickCancel])
        break;
    }
  }

  setMouseTipContent() {
    const plotName = this.getPlotNam();
    switch (this.plotType) {
      case PlottingTypes.POLYLINE: //最少需要2个点
      case PlottingTypes.SQUAD_COMBAT:
      case PlottingTypes.TAILED_SQUAD_COMBAT:
        this.plotDrawTip.setContent(["当前绘制类型：" + plotName + "，最少需要2个点",
          "已有" + this.points.length + "个点，" + "按下鼠标左键确定第" + (this.points.length + 1) + "个点", ,
          this.points.length < 2 ? "按下鼠标右键取消绘制" : "按下鼠标右键结束绘制"
        ])
        break;
      case PlottingTypes.ELLIPSE: //需要2个点
      case PlottingTypes.CIRCLE:
      case PlottingTypes.RECTANGLE:
      case PlottingTypes.FINE_ARROW:
      case PlottingTypes.ASSAULT_DIRECTION:
        this.plotDrawTip.setContent(["当前绘制类型：" + plotName + "，需要2个点",
          "已有" + this.points.length + "个点，" + "按下鼠标左键确定第" + (this.points.length + 1) + "个点", ,
          "按下鼠标右键取消绘制"
        ])
        break;
      case PlottingTypes.POLYGON: //最少需要3个点
      case PlottingTypes.ATTACK_ARROW:
      case PlottingTypes.TAILED_ATTACK_ARROW:
      case PlottingTypes.CLOSED_CURVE:
        this.plotDrawTip.setContent(["当前绘制类型：" + plotName + "，最少需要3个点",
          "已有" + this.points.length + "个点，" + "按下鼠标左键确定第" + (this.points.length + 1) + "个点", ,
          this.points.length < 3 ? "按下鼠标右键取消绘制" : "按下鼠标右键结束绘制"
        ])
        break;
      case PlottingTypes.GATHERING_PLACE: //需要3个点
      case PlottingTypes.SECTOR:
      case PlottingTypes.TRIANGLE_FLAG:
      case PlottingTypes.RECTANGLE_FLAG:
      case PlottingTypes.WAVE_FLAG:
        this.plotDrawTip.setContent(["当前绘制类型：" + plotName + "，需要3个点",
          "已有" + this.points.length + "个点，" + "按下鼠标左键确定第" + (this.points.length + 1) + "个点", ,
          "按下鼠标右键取消绘制"
        ])
        break;
      case PlottingTypes.DOUBLE_ARROW:
        this.plotDrawTip.setContent(["当前绘制类型：" + plotName + "，需要4个点",
          "已有" + this.points.length + "个点，" + "按下鼠标左键确定第" + (this.points.length + 1) + "个点", ,
          "按下鼠标右键取消绘制"
        ])
        break;
    }
  }

  getPlotNam() {
    switch (this.plotType) {
      case PlottingTypes.POINT_MARKER:
        return "点";
      case PlottingTypes.POLYLINE:
        return "线";
      case PlottingTypes.POLYGON:
        return "面";
      case PlottingTypes.ELLIPSE:
        return "椭圆";
      case PlottingTypes.CIRCLE:
        return "正圆";
      case PlottingTypes.RECTANGLE:
        return "矩形";
      case PlottingTypes.CLOSED_CURVE:
        return "曲线面";
      case PlottingTypes.SECTOR:
        return "扇形";
      case PlottingTypes.FINE_ARROW:
        return "细单直箭头";
      case PlottingTypes.ASSAULT_DIRECTION:
        return "粗单直箭头";
      case PlottingTypes.ATTACK_ARROW:
        return "进攻方向";
      case PlottingTypes.TAILED_ATTACK_ARROW:
        return "进攻方向（尾）";
      case PlottingTypes.GATHERING_PLACE:
        return "集结地";
      case PlottingTypes.SQUAD_COMBAT:
        return "分队战斗行动";
      case PlottingTypes.TAILED_SQUAD_COMBAT:
        return "分队战斗行动（尾）";
      case PlottingTypes.DOUBLE_ARROW:
        return "钳击";
      case PlottingTypes.RECTANGLE_FLAG:
        return "矩形旗";
      case PlottingTypes.TRIANGLE_FLAG:
        return "三角旗";
      case PlottingTypes.WAVE_FLAG:
        return "波浪旗";
    }
  }

  //禁用
  deactivate() {
    this.unRegisterEvents();
    this.plotType = undefined;
    this.plotDrawTip.remove();
    this.MousePoint.remove();
    this.plotDrawTip = undefined;
    this.viewer._element.style.cursor = 'pointer';
    this.viewer.enableCursorStyle = true;
  }

  //清空绘制
  clear() {
    if (this.plot) {
      this.plot.remove();
      this.plot = undefined;
    }
  }

  //添加第一个点后 构造一个标绘实体
  generatePlot(points, height) {
    this.plot = PlotFactory.createPlot(this.viewer, this.plotType, {
      points,
      height
    }, {fillColor: this.fillColor});
    //设置编号
    this.plot.setPlotCode(uuid.v4());
    this.plot.openEditMode(true);
  }

  //解除鼠标事件
  unRegisterEvents() {
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
  }

  //绘制结束 触发结束事件
  drawEnd() {
    //设置鼠标状态
    this.plot.openEditMode(false);
    this.PlotDrawEndEvent.raiseEvent(this.plot, this.plotType);
  }
}

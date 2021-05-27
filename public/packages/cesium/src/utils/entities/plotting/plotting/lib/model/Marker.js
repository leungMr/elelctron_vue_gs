import uuid from "uuid-umd";
import {getCartesian3FromPX, MovePrompt} from '../drawUtil'

function Marker(e) {
  //用于区分多个相同箭头时
  this.objId = uuid.v4();
  this.viewer = e.viewer;
  this.isDisabledPop = e.isDisabledPop;
  // 新增点击
  this.handler = new Cesium.ScreenSpaceEventHandler(e.viewer.scene.canvas);
  this.popPrompt = null;
  //编辑点击
  this.modifyHandler = null;
  this.arrowEntity = null;
  this.ledPoint = null;
}

Marker.prototype = {
  start: function () {
    let that = this;
    if (that.isDisabledPop) {
      this.popPrompt = new MovePrompt(that.viewer, {
        content: "单击左键进行绘制<br />单击右键退出绘制"
      });
    }
    that.handler.setInputAction(function (evt) {
      let cartesian = getCartesian3FromPX(evt.endPosition, that.viewer);
      if (!cartesian) return;
      if (that.ledPoint){
        that.ledPoint.position.setValue(cartesian);
      }else{
        that.creatLedPoint(cartesian)
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    that.handler.setInputAction(function (evt) {
      let cartesian = getCartesian3FromPX(evt.position, that.viewer);
      if (!cartesian) return;
      that.arrowEntity = that.creatDraw(cartesian);
      that.arrowEntity.objId = that.objId;
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  },
  creatLedPoint:function(cartesian){
    this.ledPoint = this.viewer.entities.add({
      position: cartesian,
      point: {
        color: Cesium.Color.LIGHTGREEN,
        pixelSize: 10,
        outlineColor: Cesium.Color.RED,
        outlineWidth: 3,
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      }
    });
  },
  creatDraw: function (cartesian) {
    return this.viewer.entities.add({
      name: "点",
      position: cartesian,
      point: {
        color: Cesium.Color.RED,
        pixelSize: 5,
        outlineColor: Cesium.Color.YELLOW,
        outlineWidth: 1,
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      }
    });
  },
}

export {Marker};

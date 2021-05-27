import uuid from "uuid-umd";
import {getCartesian3FromPX} from '../drawUtil'

function Polyline(e) {
  //用于区分多个相同箭头时
  this.objId = uuid.v4();
  this.viewer = e.viewer;
  // 新增点击
  this.handler = new Cesium.ScreenSpaceEventHandler(e.viewer.scene.canvas);
  //编辑点击
  this.modifyHandler = null;
  this.arrowEntity = null;
}

Polyline.prototype = {
  start: function () {
    let that = this;
    that.handler.setInputAction(function (evt) {
      let cartesian = getCartesian3FromPX(evt.position, that.viewer);
      if (!cartesian) return;
      that.arrowEntity = that.creatPoint(cartesian);
      that.arrowEntity.objId = that.objId;
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  },
  creatPoint: function (cartesian) {
    let point = this.viewer.entities.add({
      name: "点",
      position: cartesian,
      point: {
        color: Cesium.Color.RED,
        pixelSize: 10,
        outlineColor: Cesium.Color.YELLOW,
        outlineWidth: 3,
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      }
    });
    return point;
  },
}

export {Polyline};

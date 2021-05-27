import './lib/dataSource'
function MilitaryPlotting(viewer) {
  this.viewer = viewer;
  this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
}

MilitaryPlotting.prototype = {
  draw: function (type) {
    switch (type) {
      case plottingType.MARKER:

        break;
      case plottingType.POLYLINE:

        break;
      case plottingType.CURVE:

        break;
      case plottingType.FREEHAND_LINE:

        break;
      case plottingType.POLYGON:

        break;
      case plottingType.FREEHAND_POLYGON:

        break;
      case plottingType.CIRCLE:

        break;
      case plottingType.ELLIPSE:

        break;
      case plottingType.RECTANGLE:

        break;
      case plottingType.ARC:

        break;
      case plottingType.CLOSED_CURVE:

        break;
      case plottingType.LUNE:

        break;
      case plottingType.SECTOR:

        break;
      case plottingType.GATHERING_PLACE:

        break;
      case plottingType.STRAIGHT_ARROW:

        break;
      case plottingType.ASSAULT_DIRECTION:

        break;
      case plottingType.ATTACK_ARROW:

        break;
      case plottingType.TAILED_ATTACK_ARROW:

        break;
      case plottingType.SQUAD_COMBAT:

        break;
      case plottingType.TAILED_SQUAD_COMBAT:

        break;
      case plottingType.FINE_ARROW:

        break;
      case plottingType.DOUBLE_ARROW:

        break;
      default:
        break;
    }
  }
}
export {MilitaryPlotting}

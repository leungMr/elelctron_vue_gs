import PlottingTypes from './PlotTypes'

import PointMarker from './model/PointMarker'
import Circle from './model/Circle'
import Ellipse from './model/Ellipse'
import Rectangle from './model/Rectangle'
import Sector from './model/Sector'
import ClosedCurve from './model/ClosedCurve'
import GatheringPlace from './model/GatheringPlace'
import DoubleArrow from './model/DoubleArrow'
import FineArrow from './model/FineArrow'
import TailedSquadCombat from './model/TailedSquadCombat'
import SquadCombat from './model/SquadCombat'
import TailedAttackArrow from './model/TailedAttackArrow'
import AttackArrow from './model/AttackArrow'
import AssaultDirection from './model/AssaultDirection'
import RectangleFlag from './model/RectangleFlag'
import TriangleFlag from './model/TriangleFlag'
import WaveFlag from './model/WaveFlag'

let PlotFactory = {
  createPlot(viewer, plotType, baseInfo, properties) {
    switch (plotType) {
      case PlottingTypes.POINT_MARKER:
        return new PointMarker(viewer, baseInfo, properties);
      case PlottingTypes.POLYLINE:
        break;
      case PlottingTypes.CURVE:

        break;
      case PlottingTypes.FREEHAND_LINE:

        break;
      case PlottingTypes.POLYGON:

        break;
      case PlottingTypes.FREEHAND_POLYGON:

        break;
      case PlottingTypes.CIRCLE:
        return new Circle(viewer, baseInfo, properties);
      case PlottingTypes.ELLIPSE:
        return new Ellipse(viewer, baseInfo, properties);
      case PlottingTypes.RECTANGLE:
        return new Rectangle(viewer, baseInfo, properties);
      case PlottingTypes.ARC:

        break;
      case PlottingTypes.CLOSED_CURVE:
        return new ClosedCurve(viewer, baseInfo, properties);
      case PlottingTypes.LUNE:

        break;
      case PlottingTypes.SECTOR:
        return new Sector(viewer, baseInfo, properties);
      case PlottingTypes.GATHERING_PLACE:
        return new GatheringPlace(viewer, baseInfo, properties);
      case PlottingTypes.ASSAULT_DIRECTION:
        return new AssaultDirection(viewer, baseInfo, properties);
      case PlottingTypes.ATTACK_ARROW:
        return new AttackArrow(viewer, baseInfo, properties);
      case PlottingTypes.TAILED_ATTACK_ARROW:
        return new TailedAttackArrow(viewer, baseInfo, properties);
      case PlottingTypes.SQUAD_COMBAT:
        return new SquadCombat(viewer, baseInfo, properties);
      case PlottingTypes.TAILED_SQUAD_COMBAT:
        return new TailedSquadCombat(viewer, baseInfo, properties);
      case PlottingTypes.FINE_ARROW:
        return new FineArrow(viewer, baseInfo, properties);
      case PlottingTypes.DOUBLE_ARROW:
        return new DoubleArrow(viewer, baseInfo, properties);
      case PlottingTypes.RECTANGLE_FLAG:
        return new RectangleFlag(viewer, baseInfo, properties);
      case PlottingTypes.TRIANGLE_FLAG:
        return new TriangleFlag(viewer, baseInfo, properties);
      case PlottingTypes.WAVE_FLAG:
        return new WaveFlag(viewer, baseInfo, properties);
      default:
        break;
    }
  }
}

export default PlotFactory;

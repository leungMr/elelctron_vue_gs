import LayerBase from "../Base"
import PlotFactory from "../../PlotFactory"

export default class MilitaryPlotLayer extends LayerBase {
  constructor(viewer) {
    super(viewer);
    this.isClamp = false;
  }

  setPlotIsClamToGround(isClamp) {
    this.isClamp = isClamp;
    this.plots.forEach(item => {
      item.setClampToGround(this.isClamp);
    })
  }

  //绘制的时候 通过该方法添加
  addPlot(plot) { //绘制结束返回的是一个GeoPlot对象 通过该对象的参数构造一个新的对象 不能直接使用该对象
    let newPlot = PlotFactory.createPlot(this.viewer, plot.baseInfo.plotName, plot.baseInfo, plot.properties);
    this.plots.push(newPlot);
    return newPlot;
  }
}

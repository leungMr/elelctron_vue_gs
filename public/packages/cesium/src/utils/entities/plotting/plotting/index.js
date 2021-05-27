import PlotDraw from './lib/PlotDraw';
import PlotEdit from './lib/PlotEdit';
import MilitaryPlotLayer from "./lib/PlotLayer/MilitaryPlot"


function MilitaryPlotting(isDisabledPop,fillColor) {
  this.viewer = earth;
  this.fillColor = fillColor?fillColor:"rgba(255,0,0,0.6)";
  this.isDisabledPop = isDisabledPop === undefined ? false : isDisabledPop;
  this.plotDraw = new PlotDraw(this.viewer);
  this.militaryPlotLayer = new MilitaryPlotLayer(this.viewer);
  this.plotDraw.PlotDrawEndEvent.addEventListener((drawPlot, plotType) => {
    drawPlot.remove();
    this.plotEditor.activate(); //激活编辑
    let plot = this.militaryPlotLayer.addPlot(drawPlot);
  });
  //激活绘制的时候禁用编辑
  this.plotDraw.PlotDrawStartEvent.addEventListener(e => {
    this.plotEditor.deactivate(); //禁用编辑
  });
  this.plotEditor = new PlotEdit(this.viewer, this.militaryPlotLayer);
  this.plotEditor.PlotEditEndEvent.addEventListener(editPlot => {
  });
  this.plotEditor.activate();
}

MilitaryPlotting.prototype = {
  /* 控制标绘编辑是否开启 */
  controlDrawEdit:function(isDisabledEdit){
    this.plotEditor.onIsDisabledEdit(isDisabledEdit)
  },
  /* 开始标绘 */
  draw:function(plotType) {
    // Cesium.Color.BLUE.withAlpha(0.8)
    this.plotDraw.activate(plotType,Cesium.Color.fromCssColorString(this.fillColor));
  }
}
export {MilitaryPlotting}

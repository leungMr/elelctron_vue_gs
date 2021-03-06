// 所有图层的基类
export default class LayerBase {
  constructor(viewer) {
    this.viewer = viewer;
    this.plots = [];
  }

  //从服务器上查询下来的数据通过该方法初始化
  initPlots(data) {
    this.clear(); //清空所有
  }

  //绘制的时候 通过该方法添加
  addPlot(plot) { //绘制结束返回的是一个GeoPlot对象 通过该对象的参数构造一个新的对象 不能直接使用该对象

  }

  //每个标会对象必须有plotCode这个属性作为唯一标识
  getByPlotCode(plotCode) {
    for (let i = 0; i < this.plots.length; i++) {
      if (this.plots[i].plotCode === plotCode)
        return this.plots[i];
    }
  }

  removeAll() {
    this.clear();
  }

  clear() {
    this.plots.forEach(item => {
      item.remove();
    })
    this.plots = [];
  }
}

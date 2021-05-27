export function heatMap(canvas,ns) {
  let view=window.earth;
  view.entities.add({
    name: 'heatmap',
    rectangle: {
      coordinates: Cesium.Rectangle.fromDegrees(Number(ns.lonMin),Number(ns.latMin),Number(ns.lonMax),Number(ns.latMax)),
      material: new Cesium.ImageMaterialProperty({
        image: canvas[0],
        transparent: true
      })
    }
  });
}

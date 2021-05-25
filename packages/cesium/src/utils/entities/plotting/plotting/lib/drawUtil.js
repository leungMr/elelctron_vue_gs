export const getCartesian3FromPX = (px, viewer) => {
  let picks = viewer.scene.drillPick(px);
  // viewer.render();
  let cartesian;
  let isOn3dTiles = true;
  for (let i = 0; i < picks.length; i++) {
    if ((picks[i] && picks[i].primitive) || picks[i] instanceof Cesium.Cesium3DTileFeature) { //模型上拾取
      isOn3dTiles = true;
    }
  }
  if (isOn3dTiles) {
    cartesian = viewer.scene.pickPosition(px);
  } else {
    let ray = viewer.camera.getPickRay(px);
    if (!ray) return null;
    cartesian = viewer.scene.globe.pick(ray, viewer.scene);
  }
  return cartesian;
}

export const MovePrompt = function (viewer, opt) {
  if (!opt) opt = {};
  let randomId = Number((new Date()).getTime());
  this.id = randomId;
  this.style = opt.style;
  this.viewer = viewer;
  if (!this.viewer) return;
  this.scene = this.viewer.scene;
  this.camera = this.viewer.camera;
  this.mapContainer = this.viewer.container.id;
  if (!this.mapContainer) return;

  this.trackPopUpId = "trackPopUp" + randomId;
  this.promptContentId = "promptContent" + randomId;
  this.promptDivId = "promptDiv" + randomId;
  this.trackPopUpContentId = "trackPopUpContent" + randomId;

  let infoDiv;
  let max_width = 300;
  let max_height = 500;
  infoDiv = window.document.createElement("div");
  infoDiv.id = this.trackPopUpId;
  infoDiv.className = "trackPopUp";

  this.content = opt.content || ""; //提示框内容
  infoDiv.innerHTML = '<div id="' + this.trackPopUpContentId + '" class="cesium-popup" style="position:fixed;top:0;left:0;background: rgba(12, 12, 12, 0.53);' +
    '    color: yellow;' +
    '    font-size: 13px;' +
    '    padding: 5px;">' +
    '<div class="cesium-prompt-content-wrapper" id="' + this.promptDivId + '">' +
    '<div id="trackPopUpLink" class="cesium-popup-content" style="max-width: ' + max_width + 'px;max-height: ' + max_height + 'px">' +
    '<span class="promptContent" id="' + this.promptContentId + '">' + this.content + '</span>' +
    '</div>' +
    '</div>' +
    '</div>';

  window.document.getElementById(this.mapContainer).appendChild(infoDiv);
  window.document.getElementById(this.trackPopUpId).style.display = "block";

  this.offset = opt.offset || {x: 20, y: 20};

  this.trackPopUpContent = window.document.getElementById(this.trackPopUpContentId);

  this.promptDiv = window.document.getElementById(this.promptDivId);
  this.promptContent = window.document.getElementById(this.promptContentId);
  this.show = (opt.show === undefined ? true : opt.show);
  let that = this;
  // handler.setInputAction((movement) => {
  //   that.trackPopUpContent.style.left = movement.endPosition.x + (that.offset.x || 0) + "px";
  //   that.trackPopUpContent.style.top = movement.endPosition.y + (that.offset.y || 0) + "px";
  // }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  document.removeEventListener("mousemove", mousemove, false);
  document.addEventListener("mousemove", mousemove, false);
  function mousemove(event) {
    that.trackPopUpContent.style.left = event.clientX + (that.offset.x || 0) + "px";
    that.trackPopUpContent.style.top = event.clientY + (that.offset.y || 0) + "px";
  }
}

<template>
  <div class="plot-draw-icon-container">
    <img :src="iconUrl" class="plot-draw-icon" />
  </div>
</template>
<script>
export default {
  name: "PlotDrawIcon",
  props: {
    iconUrl: {
      type: String
    }
  }
};
</script>

<style lang="css" scoped>
.plot-draw-icon-container {
  position: absolute;
  background: rgba(0, 0, 0, 0.637);
  border-radius: 5px;
  padding: 2px;
  color: white;
  pointer-events: none;
}

.plot-draw-icon-container::before {
  position: absolute;
  content: "";
  top: 100%;
  left: calc(50% - 10px);
  border: 10px solid transparent;
  border-top: 10px solid rgba(0, 0, 0, 0.637);
}

.plot-draw-icon {
  height: 64px;
  width: 64px;
}
</style>
<template>
  <div>
    <div class="main-container"></div>
    <ShapeDividerWarper className="divider-warper">
      <ShapeDivider
        v-for="(item, index) in shapeDividers"
        :class="item.className"
        :placement="item.placement"
        :height="item.height"
        :width="item.width"
        :color="item.color"
        :key="index"
      ></ShapeDivider>
    </ShapeDividerWarper>
    <section class="bottom-background"></section>
  </div>
</template>

<script setup lang="ts">
import ShapeDivider from "@components/ShapeDivider.vue";
import ShapeDividerWarper from "@components/ShapeDividerWarper.vue";

const shapeDividers = [
  {
    className: "divider-1-top",
    placement: "top",
    height: "50px",
    width: "100%",
    color: "#01af7e",
  },
  {
    className: "divider-2-top",
    placement: "top",
    height: "100px",
    width: "190%",
    color: "#4a90e2",
  },
  {
    className: "divider-2-bottom",
    placement: "bottom",
    height: "100px",
    width: "120%",
    color: "#4a90e2",
  },
  {
    className: "divider-3-top",
    placement: "top",
    height: "100px",
    width: "100%",
    color: "#0176c3",
  },
];
</script>

<style scoped>
.main-container {
  height: calc(100vh - 350px);
}

.divider-warper {
  height: 200px;
}

.divider-1-top,
.divider-2-top,
.divider-2-bottom,
.divider-3-top {
  position: absolute;
}

.divider-1-top {
  bottom: 70px;
}

.divider-2-top {
  bottom: 69px;
}
.divider-2-bottom {
  bottom: -30px;
}
.divider-3-top {
  bottom: 0px;
}

.bottom-background {
  height: 150px;
  background-color: #0176c3;
  margin-top: -1px;
}
</style>

<template>
  <view class="container">
    <view
      class="custom-shape-divider"
      v-for="(item, index) in shapeDividers"
      :class="item.className"
      :key="index"
    >
      <svg
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,
        168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,
        18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          class="shape-fill"
        />
      </svg>
    </view>
  </view>
</template>

<script setup lang="ts">
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
.container {
  position: relative;
  overflow: hidden;
  height: 130px;
  width: 100%;
}

.custom-shape-divider {
  width: 100%;
  overflow: hidden;
  line-height: 0;
}

.custom-shape-divider svg {
  position: relative;
  display: block;
}

.divider-warper {
  height: 130px;
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

.divider-1-top {
  transform: rotate(180deg);
}

.divider-1-top svg {
  width: calc(100% + 1.3px);
  height: 50px;
}

.divider-1-top .shape-fill {
  fill: #01af7e;
}

.divider-2-top {
  bottom: 68px;
}

.divider-2-top {
  transform: rotate(180deg);
}

.divider-2-top svg {
  width: calc(190% + 1.3px);
  height: 100px;
}

.divider-2-top .shape-fill {
  fill: #4a90e2;
}

.divider-2-bottom {
  bottom: -30px;
}

.divider-2-bottom {
  transform: rotate(0);
}

.divider-2-bottom svg {
  width: calc(120% + 1.3px);
  height: 100px;
}

.divider-2-bottom .shape-fill {
  fill: #4a90e2;
}

.divider-3-top {
  bottom: 0px;
}

.divider-3-top {
  transform: rotate(180deg);
}

.divider-3-top svg {
  width: calc(100% + 1.3px);
  height: 100px;
}

.divider-3-top .shape-fill {
  fill: #0176c3;
}
</style>

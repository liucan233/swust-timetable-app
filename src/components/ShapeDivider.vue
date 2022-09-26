<!--
 * @Author: LuoWei
 * @Date: 2022-09-25 21:12:56
 * @LastEditors: Luo Wei
 * @LastEditTime: 2022-09-26 13:32:48
 * @Description: 矢量分割线组件
-->
<template>
  <div class="custom-shape-divider" :class="props.className">
    <svg
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
    >
      <path
        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
        class="shape-fill"
      ></path>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
/**
 * @description: 组件必传placement和height
 * @placement top：直面在下,波浪面在上; bottom: 直面在上,波浪面在下
 * @height 图像高度
 * @width 图像波浪的密集程度(请使用百分比),默认100%
 * @color 图像填充颜色
 * @zIndex 层级
 * @return {*}
 * @author: LuoWei
 */
const props = defineProps<{
  placement: "top" | "bottom";
  height: string;
  width?: string;
  color?: string;
  zIndex?: number;
  className?: string;
  [key: string]: unknown;
}>();
const rotate = computed(() =>
  props.placement === "top" ? "rotate(180deg)" : "rotate(0deg)"
);
const color = computed(() => props.color || "#4a90e2");
const width = computed(() => props.width || "100%");
</script>

<style scoped>
.custom-shape-divider {
  width: 100%;
  overflow: hidden;
  line-height: 0;
  transform: v-bind(rotate);
}

.custom-shape-divider svg {
  position: relative;
  display: block;
  width: calc(v-bind(width) + 1.3px);
  height: v-bind(props.height);
}

.custom-shape-divider .shape-fill {
  fill: v-bind(color);
}
</style>

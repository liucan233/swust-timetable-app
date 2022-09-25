<template>
  <scroll-view :class="'wrap1'">这是首页（登录页）</scroll-view>
</template>
<script lang="ts" setup>
/**
 * 课表组件，分为单列视图和三列、周视图
 * 主要实现思路是一个scroll-view里面嵌套：
 *  1. 一个横向（左右）滚动的日期轴；
 *  2. 一个竖直（上下）滚动的小时刻度轴；
 *  3. 用户手指移动时判断运动方向（水平or竖直），事件穿透给对应滚动内容
 */
// import { shallowRef } from "vue";

// const {} = defineProps<{
//   className: string;
// }>();

/**同一平面显示的日期数 */
// const $columns = shallowRef<UniApp.SelectorQuery | null>(null);

// onMounted(() => {});
// onUpdated(() => {});
</script>

<style scoped>
.wrap1 {
  width: 100%;
  height: 100%;
}
.hour-line {
}
</style>

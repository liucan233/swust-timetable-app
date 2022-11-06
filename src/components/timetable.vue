<template>
  <view class="container">
    <swiper
      class="table-swiper"
      :indicator-dots="false"
      @change="handleWeekChange"
      :current="props.weekNum - 1"
    >
      <swiper-item v-for="(c, index) in props.course.slice(1)" :key="index">
        <WeekTable
          :course="c ?? emptyCourseWeek"
          :day-num="props.calendarArr[index + 1]"
          :day-name="dayArr"
          :course-height="rowHeight"
        />
      </swiper-item>
    </swiper>
  </view>
</template>
<script lang="ts" setup>
/**
 * 课表组件，分为单列视图和三列、周视图
 * 主要实现思路是一个scroll-view里面嵌套：
 *  1. 一个横向（左右）滚动的日期轴；
 *  2. 一个竖直（上下）滚动的小时刻度轴；
 *  3. 用户手指移动时判断运动方向（水平or竖直），事件穿透给对应滚动内容
 */
import { IDayInfo } from "@utils/common";
import WeekTable from "./WeekTable.vue";
import { TOrganizedCourse, TWeekCourse } from "@utils/timetable";

const props = defineProps<{
  className: string;
  course: TOrganizedCourse;
  weekNum: number;
  calendarArr: IDayInfo[][];
}>();

const emit = defineEmits<{
  (e: "weekChange", current: number): any;
}>();

const emptyCourseWeek = new Array(7) as TWeekCourse;

/**每讲课显示的默认高度 */
const rowHeight = 130;
/**一周有的星期数中文 */
const dayArr = ["一", "二", "三", "四", "五", "六", "日"];

const handleWeekChange = (e: {
  detail: {
    current: number;
    currentItemId: string;
    source: string;
  };
}) => {
  const curWeekNum = e.detail.current + 1;
  emit("weekChange", curWeekNum);
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  height: v-bind("6*rowHeight+70+'px'");
}
.table-swiper {
  width: 100%;
  height: 100%;
  flex: 0 0 auto;
  white-space: nowrap;
  overscroll-behavior: auto;
}
.table-swiper[data-active="false"] {
  pointer-events: none;
}
</style>

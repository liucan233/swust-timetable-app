<template>
  <view class="container">
    <swiper
      class="table-swiper"
      :indicator-dots="false"
      @change="handleWeekChange"
      :current="props.weekNum"
    >
      <swiper-item v-for="(c, index) in props.course.slice(1)" :key="index">
        <WeekTable
          :course="c ?? emptyCourseWeek"
          :day-num="dayInfoArr[index + 1]"
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
import { shallowRef } from "vue";
import { getDaysInfo, IDayInfo } from "@utils/common";
import WeekTable from "./WeekTable.vue";
import { TOrganizedCourse, TWeekCourse } from "@utils/timetable";
import { computed, onUpdated } from "vue";

const props = defineProps<{
  className: string;
  startTime: Date;
  endTime: Date;
  course: TOrganizedCourse;
  weekNum: number;
}>();

const emit = defineEmits<{
  (e: "weekChange", current: number): any;
}>();

const emptyCourseWeek = new Array(7) as TWeekCourse;

/**每讲课显示的默认高度 */
const rowHeight = 100;
/**一周有的星期数中文 */
const dayArr = ["一", "二", "三", "四", "五", "六", "日"];

onUpdated(() => {
  // 输出学期信息
  if (props.course.length) {
    const begin = props.startTime.toLocaleDateString(),
      over = props.endTime.toLocaleDateString();
    console.log("本学期上课时间约为：" + begin + " - " + over);
  }
});

const dayInfoArr = computed<IDayInfo[][]>(() => {
  if (!props.course.length) {
    return [];
  }
  const dayArr = getDaysInfo(props.startTime, props.endTime),
    result: IDayInfo[][] = [];
  let dayStart = 0,
    dayEnd = 7;
  for (let i = 0; i < props.course.length; i++) {
    result.push(dayArr.slice(dayStart, dayEnd));
    dayStart = dayEnd;
    dayEnd += 7;
  }
  return result;
});

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
  height: 100%;
}
.table-swiper {
  width: 100%;
  height: 100%;
  flex: 0 0 auto;
  white-space: nowrap;
  overscroll-behavior: contain;
}
</style>

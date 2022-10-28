<template>
  <scroll-view class="scroll-container" scroll-y>
    <view class="container">
      <view class="section-wrap">
        <text class="table-time">10月</text>
        <text v-for="(_, index) in sectionTextArr" key="index" class="section-time">
          第 {{ index + 1 }} 讲
        </text>
      </view>
      <swiper class="table-swiper" :indicator-dots="false">
        <swiper-item v-for="c in props.course">
          <WeekTable :course="c??emptyCourseWeek"></WeekTable>
        </swiper-item>
      </swiper>
    </view>
  </scroll-view>
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
import { getDaysInfo} from "@/utils/common";
import WeekTable from "./WeekTable.vue";
import { TOrganizedCourse, TWeekCourse} from '@/utils/timetable'

const props = defineProps<{
  className: string;
  startTime: Date;
  endTime: Date;
  course: TOrganizedCourse
}>();

const emptyCourseWeek=new Array(7) as TWeekCourse

const sectionTextArr = new Array(6).fill(null);

/**同一平面显示的日期数 */
// const $columns = shallowRef<UniApp.SelectorQuery | null>(null);

// onMounted(() => {});
// onUpdated(() => {});

const schoolDays = getDaysInfo(props.startTime, props.endTime);
</script>

<style scoped>
.scroll-container {
  width: 100%;
  height: 100%;
}
.container {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
}
.section-wrap {
  width: 20px;
  text-align: center;
  flex: 0 0 auto;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  height: 100%;
}
.table-swiper {
  width: calc(100% - 40px);
  height: 100%;
  flex: 0 0 auto;
  touch-action: pan-x;
  white-space: nowrap;
  overscroll-behavior: contain;
}
.table-time{
	height: 60px;
	flex: 0 0 60px;
}
.section-time{
	height: 100px;
	vertical-align: middle;
}
</style>

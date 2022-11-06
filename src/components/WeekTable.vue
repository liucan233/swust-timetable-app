<template>
  <view class="swiper-item">
    <view class="table-header">
      <view class="table-time">
        <text>{{ props.dayNum[0]?.month || -1 }}</text>
        <text>月</text>
      </view>
      <view class="table-date">
        <view v-for="(d, index) in dayNum" :key="d.day" class="table-date-item">
          <text class="day-name">周{{ props.dayName[index] }}</text>
          <text class="day-num">{{ d.day }}</text>
        </view>
      </view>
    </view>
    <view class="week-container">
      <view class="section-time">
        <text
          v-for="(_, index) in sectionTextArr"
          :key="index"
          class="time-name"
        >
          第 {{ index + 1 }} 讲
        </text>
      </view>
      <view
        v-for="(_, dayIndex) in props.dayName"
        :key="dayIndex"
        class="day-wrap"
      >
        <view
          v-for="(c, index2) in props.course[dayIndex + 1]?.conflict ?? []"
          class="conflict-item"
          :style="getPosition(c.begin, c.over)"
          :key="index2"
        >
          <view
            :style="getConflictStyle(c)"
            data-conflict="true"
            :data-begin="c.begin"
            :data-over="c.over"
          />
        </view>
        <view
          v-for="(c, index2) in props.course[dayIndex + 1]?.list ?? []"
          class="course-item"
          :style="getPosition(c.begin, c.over)"
          :key="index2"
          :data-begin="c.begin"
          :data-over="c.over"
        >
          <text>@{{ c.place }}</text>
          <text>{{ c.name }}</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import { CSSProperties } from "vue";
import { TWeekCourse } from "@utils/timetable";
import { IDayInfo } from "@utils/common";
import type { IConflictCourse } from "@utils/timetable";

interface IProps {
  course: TWeekCourse;
  dayNum: IDayInfo[];
  dayName: string[];
  courseHeight: number;
}
const props = defineProps<IProps>();

/**每天有6讲12节课 */
const sectionTextArr = new Array(6).fill(null);

const rowHeight = 130,
  gapHeight = 6;

// onMounted(() => {});

const getPosition = (s: number, e: number): CSSProperties => {
  return {
    top: (s >> 1) * rowHeight + "px",
    height: ((e - s + 1) * rowHeight) / 2 - gapHeight + "px",
  };
};

const getConflictStyle = (c: IConflictCourse) => {
  const size = (c.over - c.begin + 1) * rowHeight;
  return {
    height: size + "px",
    width: size + "px",
  };
};
</script>

<style scoped>
.swiper-item {
  width: 100%;
}
.table-header {
  width: calc(100% - 5px);
  text-align: center;
  display: flex;
  justify-content: space-between;
}
.table-time {
  width: 40px;
  flex: 0 0 40px;
  padding: 0 10px;
  box-sizing: border-box;
}
.table-date {
  flex: 1 1 auto;
  display: flex;
  justify-content: space-between;
}
.table-date-item {
  flex: 1 1 100px;
}
.week-container {
  width: calc(100% - 5px);
  height: v-bind("rowHeight*6+'px'");
  display: flex;
  justify-content: space-between;
}
.section-time {
  padding: 0 10px;
  height: 100%;
  flex: 0 0 40px;
  box-sizing: border-box;
}
.time-name {
  display: block;
  height: v-bind("rowHeight+'px'");
  line-height: v-bind("Math.floor(rowHeight/3)+'px'");
}
.day-wrap {
  flex: 1 1 auto;
  width: 50px;
  height: 100%;
  position: relative;
  text-align: center;
}
.day-name,
.day-num {
  width: 100%;
  height: 25px;
  display: block;
  /* text-align: center; */
}
.course-item {
  width: 95%;
  position: absolute;
  left: 0;
  border: 1px solid;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  line-height: 1.5;
  font-size: 15px;
  box-sizing: border-box;
  z-index: 2;
}
.course-item > text {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  vertical-align: baseline;
}
.course-item > text:nth-child(2){
  -webkit-line-clamp: 2;
}
.conflict-item {
  width: 95%;
  position: absolute;
  left: 0;
  border-radius: 4px;
  z-index: 1;
  box-sizing: border-box;
  overflow: hidden;
}
.conflict-item > view {
  background-image: linear-gradient(
    rgba(110, 195, 252, 0.5) 50%,
    rgba(0, 0, 0, 0) 50%
  );
  background-size: 100% 10px;
  background-repeat: repeat;
  transform: translate(-40%, -40%) rotateZ(-45deg);
  transform-origin: center;
}
</style>

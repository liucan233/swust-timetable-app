<template>
  <view class="swiper-item">
    <!-- 课表周视图上的星期x和日期 -->
    <view class="table-header">
      <!-- <view class="current-month"/> -->
      <view class="table-time">
        <text>{{ props.dayNum[0]?.month || -1 }}</text>
        <text>月</text>
      </view>
      <view class="table-date">
        <view v-for="(d, index) in dayNum" :key="d.day" class="table-date-item">
          <text class="day-name">周{{ props.dayName[index] }}</text>
          <text class="day-num" :data-active="dateIsToday(d)">{{ d.day }}</text>
        </view>
      </view>
    </view>
    <!-- 课表周视图滚动的课表内容 -->
    <scroll-view class="scroll-container" scroll-y>
      <view class="week-container">
        <!-- 左侧第x讲 -->
        <view class="section-time">
          <text
            v-for="(_, index) in sectionTextArr"
            :key="index"
            class="time-name"
          >
            第 {{ index + 1 }} 讲
          </text>
        </view>
        <!-- 每讲课之间的分割线 -->
        <view
          v-for="(_, index) in sectionTextArr"
          :key="index"
          :style="getSeparatorStyle(index)"
          class="course-separator"
        />
        <!-- 从星期一到星期天的课程，dayName是[周期一, ..., 星期天] -->
        <view
          v-for="(_, dayIndex) in props.dayName"
          :key="dayIndex"
          class="day-wrap"
        >
          <!-- 冲突课程的提示 -->
          <!-- <view
            v-for="(c, index2) in props.course[dayIndex + 1]?.conflict ?? []"
            class="conflict-item"
            :style="getPosition(c)"
            :key="index2"
          >
            <view
              :style="getConflictStyle(c)"
              data-conflict="true"
              :data-begin="c.begin"
              :data-over="c.over"
            />
          </view> -->
          <!-- 当天的课程 -->
          <view
            v-for="(c, index2) in props.course[dayIndex + 1]?.list ?? []"
            class="course-item"
            :style="getPosition(c)"
            :key="index2"
            :data-begin="c.begin"
            :data-over="c.over"
          >
            <text class="course-place">@{{ c.place }}</text>
            <text class="course-name">{{ c.name }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>
<script lang="ts" setup>
import { CSSProperties } from "vue";
import { IAppCourse, TWeekCourse } from "@utils/timetable";
import { IDayInfo } from "@utils/common";
import type { IConflictCourse } from "@utils/timetable";

interface IProps {
  course: TWeekCourse;
  dayNum: IDayInfo[];
  todayInfo: IDayInfo;
  dayName: string[];
  courseHeight: number;
}
const props = defineProps<IProps>();

/**每天有6讲12节课 */
const sectionTextArr = new Array(6).fill(null);

const rowHeight = 130,
  gapHeight = 6;

const getPosition = (c: IAppCourse): CSSProperties => {
  const s = c.begin,
    e = c.over;
  return {
    top: (s >> 1) * rowHeight + 3 + "px",
    height: ((e - s + 1) * rowHeight) / 2 - gapHeight + "px",
    backgroundColor: `${c.color}80`,
    color: c.color,
    "--place-line": (e - s + 1) * 2,
    "--name-line": e - s + 1,
  };
};

const getConflictStyle = (c: IConflictCourse) => {
  const size = (c.over - c.begin + 1) * rowHeight;
  return {
    height: size + "px",
    width: size + "px",
  };
};
const getSeparatorStyle = (index: number): CSSProperties => {
  return {
    top: index * props.courseHeight + "px",
    borderWidth: index ? undefined : "1px 0",
  };
};
const dateIsToday = (d: IDayInfo) => {
  return (
    d.day === props.todayInfo.day &&
    d.month === props.todayInfo.month &&
    d.year === props.todayInfo.year
  );
};
</script>

<style scoped>
.swiper-item {
  width: 100%;
  height: 100%;
}
.table-header {
  position: relative;
  padding: 5px 0;
  width: 100%;
  text-align: center;
  display: flex;
  height: 50px;
  color: #303f46;
  /* background-color: #E6F4FC; */
  justify-content: space-between;
  /* box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.05); */
}
/* .current-month{
  position: absolute;
  width: calc((100% - 25px) / 7 * 3 + 25px);
  height: 50px;
  background-color: #E6F4F9;
  border-radius: 6px;
  z-index: -1;
} */
.table-time {
  flex: 0 0 25px;
  padding-right: 5px;
  box-sizing: border-box;
  line-height: 24px;
  font-weight: bold;
}
.table-time > text {
  display: block;
}
.table-date {
  flex: 1 1 auto;
  display: flex;
  justify-content: space-between;
}
.table-date-item {
  flex: 1 1 100px;
}
.scroll-container {
  padding-top: 5px;
  height: calc(100% - 58px);
  box-sizing: border-box;
}
.week-container {
  position: relative;
  width: 100%;
  height: v-bind("rowHeight*6+5+'px'");
  display: flex;
  justify-content: space-between;
}
.section-time {
  padding-right: 5px;
  height: 100%;
  flex: 0 0 25px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  color: #303f46;
}
.time-name {
  display: block;
  line-height: 1.5;
}
.day-wrap {
  /* margin: 0 2px; */
  flex: 1 1 auto;
  width: 50px;
  height: 100%;
  position: relative;
  text-align: center;
  box-sizing: border-box;
}
.day-name,
.day-num {
  width: 100%;
  height: 25px;
  display: block;
  line-height: 25px;
  /* text-align: center; */
}
.day-num[data-active="true"] {
  position: relative;
  /* color: #737373; */
}
.day-num[data-active="true"]::after {
  position: absolute;
  content: "";
  width: 25px;
  height: 25px;
  background-color: #5ac8fa66;
  left: 50%;
  top: 50%;
  border-radius: 50%;
  transform: translate(-49%, -51%);
}
.course-item {
  width: 95%;
  position: absolute;
  left: 0;
  /* border: 1px solid; */
  border-radius: 4px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  line-height: 1.5;
  box-sizing: border-box;
  z-index: 2;
}
.course-place {
  display: -webkit-box;
  overflow: hidden;
  font-size: 12px;
  -webkit-line-clamp: var(--place-line);
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  /* font-weight: bold; */
  filter: brightness(0.75);
}
.course-name {
  font-size: 12px;
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: var(--name-line);
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  filter: brightness(0.88);
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
.course-separator {
  position: absolute;
  right: 0;
  width: calc(100% - 40px);
  height: v-bind("rowHeight+'px'");
}
.course-separator {
  border-style: dashed;
  border-color: #c5cbd0;
  border-width: 0 0 1px;
}
</style>

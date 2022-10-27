<template>
  <view class="table-header">
    <text class="table-time">大三下 第 {{ currentWeek }} 周</text>
    <text class="table-time">2022年 10月</text>
    <button class="table-add">添加课程</button>
  </view>
  <view class="table-preview"> </view>
  <view class="table-main">
    <Timetable
      class-name="timetable"
      :start-time="dayOne"
      :end-time="dayLast"
	  :week-course="weekCourse"
    />
  </view>
</template>

<script setup lang="ts">
import Timetable from "@components/timetable.vue";
import { getDateFromWeek } from "@/utils/common";
import { flatCourse, fixCourseArr, covertToWeek } from "@/utils/timetable";

const currentWeek = 6;
const course = [
  {
    code: "MY190017",
    name: "形势与政策7(四年制）",
    teacher: "林绍森",
    place: ["东2112", "东xxxx", "东yyy",'x','x','x'],
    week: ["1-3", "1-3", "1-3","1-3", "1-3", "1-3"],
    section: ["1-2", "9-10", "3-4",'5-6','7-8','11-12'],
	day:['2','2','2','2','2','2']
  },
  {
    code: "zzzz",
    name: "形势",
    teacher: "林绍森",
    place: ["东2112", "东xxxx", "东yyy"],
    week: ["5-8", "1", "10-20"],
    section: ["7-8", "1-4", "3-4"],
	day: ['1','1','1']
  },
];
const flattedCourse = flatCourse(course);
const correctCourse = fixCourseArr(flattedCourse, currentWeek);
const weekCourse = covertToWeek(correctCourse);
const dayOne = getDateFromWeek(2),
  dayLast = getDateFromWeek(weekCourse.length);
</script>

<style scoped>
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-time {
  font-size: 20px;
}

.table-add {
  border: none;
  outline: none;
  margin: 0;
}

.table-preview {
  height: 100px;
  width: 100%;
}

.table-add::after {
  content: none;
}

.table-main {
  width: 100%;
  height: calc(100vh - 150px);
}

.timetable {
  height: 70vh;
  width: 100%;
}
</style>

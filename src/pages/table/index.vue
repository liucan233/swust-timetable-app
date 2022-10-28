<template>
  <view class="table-header">
    <text class="table-time">第 {{ $termInfo.weekNum }} 周</text>
    <text class="table-time">{{ $termInfo.termName }}</text>
    <button class="table-add">添加课程</button>
  </view>
  <scroll-view class="table-preview" scroll-x>
    <CoursePreview v-for="week in $courseData" />
  </scroll-view>
  <view class="table-main">
    <Timetable
      class-name="timetable"
      :start-time="$termInfo.beginTime"
      :end-time="$termInfo.overTime"
      :course="$courseData"
    />
  </view>
</template>

<script setup lang="ts">
import Timetable from "@components/timetable.vue";
import CoursePreview from "@components/CoursePreview.vue";
import { getDateFromWeek } from "@/utils/common";
import { putCourseInOrder, TOrganizedCourse } from "@/utils/timetable";
import { onMounted, ref, shallowRef } from "vue";
import {
  getLabTimetable,
  getCommonTimetable,
  ICommonCourse,
  getTermInfo,
} from "@/api/timetable";

const $termInfo = ref({
  weekNum: 1,
  termName: "",
  beginTime: new Date("2022/9/1"),
  overTime: new Date("2023/1/1"),
});

const $courseData = shallowRef<TOrganizedCourse>([]);

const handleUpdateCourse = () => {
  const labCookie = "development";
  const commonCookie = labCookie;

  Promise.all([
    getLabTimetable(labCookie),
    getCommonTimetable(commonCookie),
    getTermInfo(commonCookie),
  ]).then(arr => {
    let courseArr: ICommonCourse[] = [];

    if (arr[0]) {
      courseArr = arr[0].data.courses;
    }
    if (arr[1]) {
      courseArr = arr[1].data.courses.concat(courseArr);
    }

    if (arr[2]) {
      const curWeekNum = Number(arr[2].data.weeks);
      $termInfo.value.weekNum = curWeekNum;
      $termInfo.value.termName = arr[2].data.time;
      $termInfo.value.beginTime = getDateFromWeek(curWeekNum);
      $termInfo.value.overTime = getDateFromWeek(courseArr.length - curWeekNum);
    }

    $courseData.value = putCourseInOrder(courseArr, $termInfo.value.weekNum);

    console.log($courseData);
  });
};

onMounted(() => {
  handleUpdateCourse();
});
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
  width: 100%;
  white-space: nowrap;
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

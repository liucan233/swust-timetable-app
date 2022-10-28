<template>
  <view class="week-container">
    <view v-for="text,index in dayArr" class="day-wrap">
      <text  class="day-name">周{{ text }}</text>
      <view v-for="c in props.course[index]?.list??[]" class="course-item" :style="getPosition(c.begin,c.over)">
        <text>
            {{c.name}}
        </text>
         </view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import { computed, CSSProperties, onMounted, shallowRef, watch } from "vue";
import {TWeekCourse } from '@/utils/timetable'

interface IProps {
  course: TWeekCourse;
}
const props = defineProps<IProps>();

console.log(props.course)



let rowHeight = 100,base=60,
  dayArr = ["一", "二", "三", "四", "五", "六", "日"];

onMounted(() => {});

const getPosition=(s:number,e:number):CSSProperties=>{
    return {
        top: base+rowHeight/2*(s-1)+'px',
        height: `calc(${e-s} * 8.33%)`
    }
}
</script>

<style scoped>
.week-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
}
.day-wrap {
  flex: 1 1 auto;
  width: 50px;
  height: 100%;
  position: relative;
  text-align: center;
}
.day-name{
    width: 100%;
    text-align: center;
}
.course-item{
    width: 100%;
    position: absolute;
    left: 0;
    border: 1px solid;
}
.day-course{
    width: 100%;
}
</style>

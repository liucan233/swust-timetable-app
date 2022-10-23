<template>
  <view class="week-container">
    <view v-for="text,index in dayArr" class="day-wrap">
      <text  class="day-name">周{{ text }}</text>
      <view v-for="c in dayCourse[index+1]" class="course-item" :style="getPosition(c.begin,c.over)">
        <text>
            {{c.name}}
        </text>
         </view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import { computed, CSSProperties, onMounted, shallowRef, watch } from "vue";

interface IAppCourse {
  code: string;
  name: string;
  teacher: string;
  place: string;
  week: number;
  begin: number;
  over: number;
  task: string;
  day: number;
}
interface IProps {
  course: IAppCourse[];
}
const props = defineProps<IProps>();
const dayCourse = computed(() => {
  const arr: IAppCourse[][] = new Array(7).fill(0).map(() => []);
  props.course.forEach(c => {
    if (arr[c.day]) {
      arr[c.day].push(c);
    } else {
      arr[c.day] = [c];
    }
  });
  return arr;
});
console.log(dayCourse.value);
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

<template>
  <view class="content">
    {{ commonTimetable }}
    <br />
    {{ labTimetable }}
    <Timetable class-name="timetable" />
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import Timetable from "@components/TimeTable.vue";
import { getLabTimetableData, getCommonTimetableData } from "@api";

const commonTimetable = ref("");
const labTimetable = ref("");

onMounted(async () => {
  const { data: commonTimetableData } = await (
    await getCommonTimetableData()
  ).promise.then(response => response.data);
  const { data: labTimetableData } = await (
    await getLabTimetableData()
  ).promise.then(response => response.data);
  commonTimetable.value = JSON.stringify(commonTimetableData);
  labTimetable.value = JSON.stringify(labTimetableData);
});
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.timetable {
  height: 70vh;
}
</style>

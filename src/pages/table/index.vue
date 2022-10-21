<template>
  <view class="content">
    <text>
      {{ commonTimetable }}
      <br />
      {{ labTimetable }}
    </text>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { TimetableData } from "@enums/storage";
import { getLabTimetableData, getCommonTimetableData } from "@api";

const commonTimetable = ref("");
const labTimetable = ref("");

onMounted(async () => {
  const commonTimetableCache = uni.getStorageSync(
    TimetableData.COMMON_TIMETABLE
  );
  const labTimetableCache = uni.getStorageSync(TimetableData.LAB_TIMETABLE);
  if (commonTimetableCache && labTimetableCache) {
    // 有缓存时读取缓存
    commonTimetable.value = commonTimetableCache;
    labTimetable.value = labTimetableCache;
  } else {
    const { data: commonTimetableData } = await (
      await getCommonTimetableData()
    ).promise.then(response => response.data);
    const { data: labTimetableData } = await (
      await getLabTimetableData()
    ).promise.then(response => response.data);
    commonTimetable.value = commonTimetableData as unknown as string;
    labTimetable.value = labTimetableData as unknown as string;
    uni.setStorageSync(TimetableData.COMMON_TIMETABLE, commonTimetableData);
    uni.setStorageSync(TimetableData.LAB_TIMETABLE, labTimetableData);
  }
});
</script>

<style scoped>
.content {
  padding: 1rem;
}
</style>

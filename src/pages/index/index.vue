<template>
  <view class="content">
    <Timetable class-name="timetable" />
  </view>
</template>

<script setup lang="ts">
import Timetable from "@components/Timetable.vue";
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

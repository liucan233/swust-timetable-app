<template>
  <view class="content">
    <Timetable class-name="timetable"/>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Timetable from "@components/timetable";


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

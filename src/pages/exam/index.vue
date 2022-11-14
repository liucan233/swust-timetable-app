<template>
  <view v-if="examList?.length === 0">empty</view>
  <uni-card
    v-for="(item, index) in examList"
    :key="index"
    :is-shadow="true"
    :title="`${item.name}(${getExamType(item.type)})`"
    :extra="`${item.date}-第${item.week}周`"
    :class="{ out: isOutOfDate(item.date, item.time) }"
    mode="title"
    note="Tips"
  >
    <view class="flex justify-between">
      <view class="h">
        <p>地点: {{ item.place }}</p>
        <p class="my-2">时间: {{ item.day }} - {{ item.time }}</p>
        <p>座位号: {{ item.seat }}</p>
      </view>
      <view class="counter">{{ getTimeFromNow(item.date, item.time) }}</view>
    </view>
  </uni-card>
</template>

<script setup lang="ts">
import { getExamInfo } from "@api/personal";
import { cacheExamList, credentials, TExamList } from "@utils/storage";
import dayjs from "@lib/dayjs";
import { getExamType } from "@enums/exam";
import { onMounted, shallowRef } from "vue";

const examList = shallowRef<TExamList[]>();

const getTimeFromNow = (date: string, time: string): string => {
  const match = /^[0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}$/;
  if (match.test(time)) {
    time = time.match(/[0-9]{2}:[0-9]{2}/)?.toString() || "";
    return dayjs(`${date} ${time}:00`, "YYYY/MM/DD HH:mm:ss").fromNow();
  }
  return "Error";
};

const isOutOfDate = (date: string, time: string): boolean => {
  const match = /^[0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}$/;
  if (match.test(time)) {
    time = time.match(/[0-9]{2}:[0-9]{2}/)?.toString() || "";
    return dayjs(`${date} ${time}:00`, "YYYY/MM/DD HH:mm:ss").isBefore(
      dayjs(new Date())
    );
  }
  return false;
};

onMounted(() => {
  cacheExamList
    .getExamList()
    .then(response => {
      examList.value = response;
    })
    .finally(async () => {
      const casCookie = await credentials.getCasCookie();
      getExamInfo(casCookie).then(response => {
        examList.value = response?.data.list;
        if (response?.data.list) {
          cacheExamList.setExamList(response?.data.list);
        }
      });
    });
});
</script>

<style scoped>
.counter {
  align-self: center;
  line-height: 1.1rem;
  font-size: 1rem;
}

.out {
  opacity: 0.5;
}
</style>

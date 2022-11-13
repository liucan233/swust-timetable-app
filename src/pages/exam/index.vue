<template>
  <!-- thumbnail="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/460d46d0-4fcc-11eb-8ff1-d5dcf8779628.png" -->
  <uni-card
    v-for="(item, index) in examList"
    :key="index"
    :title="item.name"
    :is-shadow="true"
    :extra="`${item.date}&nbsp;&nbsp;&nbsp;&nbsp; 第${item.week}周`"
    :class="{ out: isOutOfDate(item.date, item.time.split('-')[0]) }"
    mode="title"
    note="Tips"
  >
    <view class="flex justify-between">
      <view class="h">
        <p>地点: {{ item.place }}</p>
        <p class="my-2">时间: {{ item.day }} - {{ item.time }}</p>
        <p>座位号: {{ item.seat }}</p>
      </view>
      <view class="counter">{{
        getTimeFromNow(item.date, item.time.split("-")[0])
      }}</view>
    </view>
  </uni-card>
</template>

<script setup lang="ts">
import { getExamInfo } from "@src/api/personal";
import { cacheExamList, credentials, TExamList } from "@src/utils/storage";
import dayjs from "@lib/dayjs";
import { onMounted, shallowRef } from "vue";

const examList = shallowRef<TExamList[]>();

const getTimeFromNow = (date: string, time: string): string => {
  return dayjs(`${date} ${time}:00`, "YYYY/MM/DD HH:mm:ss").fromNow();
};

const isOutOfDate = (date: string, time: string): boolean => {
  return dayjs(`${date} ${time}:00`, "YYYY/MM/DD HH:mm:ss").isBefore(
    dayjs(new Date())
  );
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

<template>
  <Loading v-if="$examList === null" />
  <view v-if="$examList && $examList.length < 1" class="empty-exam">
    <image :src="emptyImg" class="empty-img" />
    <text class="empty-text"
      >还没有考试，为了避免错过考试，建议去教务处网站查看确认一下。</text
    >
  </view>
  <uni-card
    v-for="(item, index) in $examList"
    :key="index"
    :title="item.raw.name"
    :is-shadow="true"
    :extra="`${item.raw.date}&nbsp;&nbsp;&nbsp;&nbsp; 第${item.raw.week}周`"
    :class="{ out: item.hasPassed }"
    mode="title"
    note="Tips"
  >
    <view class="flex justify-between">
      <view class="h">
        <p>地点: {{ item.raw.place }}</p>
        <p class="my-2">时间: {{ item.raw.day }} {{ item.raw.time }}</p>
        <p>座位号: {{ item.raw.seat }}</p>
      </view>
      <view class="counter">{{ item.description }}</view>
    </view>
  </uni-card>
</template>

<script setup lang="ts">
import { getExamInfo } from "@src/api/personal";
import { examInfo, credentials, TExamItem as TExam } from "@src/utils/storage";
import dayjs from "@lib/dayjs";
import { onMounted, shallowRef } from "vue";
import Loading from "@src/components/Loading.vue";
import emptyImg from "@static/image/finished.png";

type TExamItem = {
  hasPassed: boolean;
  description: string;
  raw: TExam;
  dayjsInstance: dayjs.Dayjs;
};

const $examList = shallowRef<TExamItem[] | null>(null);
const updateExamList = (arr: TExam[]) => {
  const now = dayjs();
  const result = arr.map(e => {
    const [beginTime = "10:00"] = e.time.split("-");
    const examDate = dayjs(e.date + beginTime);
    const hasPassed = now.isAfter(examDate);
    return {
      hasPassed,
      dayjsInstance: examDate,
      description: examDate.from(now, true) + (hasPassed ? "前" : "后"),
      raw: e,
    };
  });
  result.sort((a, b) => (a.dayjsInstance.isBefore(b.dayjsInstance) ? 1 : -1));
  $examList.value = result;
};

onMounted(() => {
  /**是否已经从服务器获取到了数据 */
  let updatedFromRemoteFlag = false;
  // 从教务处获取考试列表
  credentials
    .getCasCookie()
    .then(casCookie => {
      return getExamInfo(casCookie);
    })
    .then(res => {
      if (!res) {
        return;
      }
      updatedFromRemoteFlag = true;
      updateExamList(res.data.list);
    });
  // 从本地获取考试列表
  examInfo.getExamList().then(res => {
    if (!updatedFromRemoteFlag) {
      updateExamList(res);
    }
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
.empty-exam {
  position: absolute;
  top: 20vh;
  left: calc(50% - 75px);
  width: 150px;
}
.empty-img {
  width: 150px;
  height: 150px;
  display: block;
}
.empty-text {
  text-align: center;
  font-size: 17px;
  width: 100%;
  display: block;
  color: #1296db;
}
</style>

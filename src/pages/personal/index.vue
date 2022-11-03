<template>
  <view class="flex flex-col container">
    <view
      class="flex flex-col justify-center items-center mb-4 radius-4 avatar-warper"
    >
      <image :src="avatar" class="mb-4 shadow avatar" />
      <text class="mb-4 text-base text-white font-semibold"
        >学号: 5120205917</text
      >
    </view>
    <view
      class="grid justify-center justify-items-center mb-4 radius-4 shadow tool-bar"
    >
      <ToolItem v-for="(item, index) in tools" :key="index" :data="item" />
    </view>
    <view class="card mb-4 shadow radius-4">
      <view
        class="flex flex-col justify-center items-center radius-4 shadow card1"
      >
        <image :src="groupChat" class="card-image" />
        <text class="text-gray-500 text-center">维护QQ群</text>
      </view>
      <view
        class="flex flex-col justify-center items-center radius-4 shadow card2"
        ><image :src="coffee" class="card-image" /><text
          class="text-gray-500 text-center"
          >Buy a Coffee</text
        ></view
      >
    </view>
    <button type="button" class="logout" @click="logout">退出登录</button>
  </view>
</template>

<script setup lang="ts">
import ToolItem from "@components/ToolItem.vue";
import { LOGIN } from "@enums/pages";
import { TTool } from "@src/types/tool";

import avatar from "@static/image/illustration.png";
import score from "@static/image/学分查询.png";
import exam from "@static/image/考试.png";
import mark from "@static/image/我的成绩.png";
import groupChat from "@static/image/维护.png";
import coffee from "@static/image/咖啡.png";

const tools: TTool[] = [
  {
    imageURL: score,
    title: "我的学分",
    to: "",
  },
  {
    imageURL: exam,
    title: "我的考试",
    to: "",
  },
  {
    imageURL: mark,
    title: "我的成绩",
    to: "",
  },
];

const { windowHeight } = uni.getWindowInfo();

const logout = () => {
  uni.navigateTo({ url: LOGIN });
};
</script>

<style scoped>
.container {
  min-height: v-bind(windowHeight);
  padding: 1rem;
  box-sizing: border-box;
  background-image: linear-gradient(0deg, #fff 30%, #2298f8);
}

.avatar-warper {
  margin-top: 4rem;
}

.avatar {
  width: 5rem;
  height: 5rem;
  border-radius: 100%;
  background-color: #fff;
  opacity: 1;
}

.tool-bar {
  grid-template-columns: repeat(3, 1fr);
  grid-row-gap: 1rem;
  grid-column-gap: 1rem;
  padding: 1rem;
  background-color: #fff;
}

.card {
  display: flex;
  justify-content: space-between;
  min-height: 200px;
  padding: 0.5rem;
  background-color: #fff;
}

.card1,
.card2 {
  width: 49%;
}

.card-image {
  width: 5rem;
  height: 5rem;
}

.logout {
  height: 40px;
  width: 100%;
  line-height: 40px;
  background-color: rgb(255, 113, 113);
  color: #fff;
}
</style>

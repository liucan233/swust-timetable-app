<template>
  <view class="flex container">
    <view class="flex mb-4 radius-4 avatar1">
      <image :src="Avatar" class="mb-4 shadow avatar" />
      <text class="mb-4">5120205917</text>
    </view>
    <view class="mb-4 radius-4 shadow tool-bar">
      <ToolItem v-for="(_, index) in Array(9)" :key="index"></ToolItem>
    </view>
    <view class="card mb-4 shadow radius-4">
      <view class="card1 radius-4">QQ Group</view>
      <view class="card2 radius-4">Buy A Coffee</view>
    </view>
    <button type="button" class="logout">退出登录</button>
  </view>
</template>

<script setup lang="ts">
import ToolItem from "@components/ToolItem.vue";
import Avatar from "@static/image/illustration.png";
</script>

<style scoped>
.container {
  flex-direction: column;
  min-height: calc(100vh - 50px);
  padding: 1rem;
  box-sizing: border-box;
  background-image: linear-gradient(0deg, #fff 50%, #64b3f4);
}

.avatar1 {
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 100%;
  background-color: #fff;
  opacity: 1;
}

.tool-bar {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  align-items: center;
  grid-row-gap: 1rem;
  grid-column-gap: 1rem;
  height: 300px;
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
  height: 200px;
  background-color: beige;
}

.logout {
  height: 40px;
  width: 100%;
  line-height: 40px;
  background-color: rgb(255, 113, 113);
  color: #fff;
}
</style>

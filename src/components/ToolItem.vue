<template>
  <view class="flex flex-col items-center warper" @click="handleClick">
    <image class="image" :src="data.imageURL" />
    <text class="text-xs text-gray-500 text-center">{{ data.title }}</text>
  </view>
</template>

<script setup lang="ts">
import { TTool } from "@src/types/tool";

const props = defineProps<{ data: TTool }>();

const handleClick = () => {
  uni.navigateTo({ url: props.data.to });
};
</script>

<style scoped>
.image {
  width: 2rem;
  height: 2rem;
}
</style>

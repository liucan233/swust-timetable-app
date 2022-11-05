<template>
  <view></view>
</template>

<script setup lang="ts">
import { onBeforeMount } from "vue";
import { TABLE } from "@enums/pages";

onBeforeMount(() => {
  uni.switchTab({ url: TABLE });
});
</script>

<style scoped></style>

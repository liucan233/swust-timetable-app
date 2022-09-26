<template>
  <div class="container" :class="{ [className]: className }">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  className?: string;
}>();
const className = props.className || "";
</script>

<style scoped>
.container {
  position: relative;
  overflow: hidden;
  width: 100%;
  min-height: 100px;
}
</style>

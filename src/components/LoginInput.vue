<template>
  <view class="container">
    <view class="placeholder">{{ placeholder }}</view>
    <input
      @input="$emit('update:modelValue', ($event as any).detail?.value)"
      :value="modelValue"
      class="input"
      :type="type || 'text'"
    />
    <view class="linear-gradient" />
  </view>
</template>

<script setup lang="ts">
defineProps<{
  type?: string;
  placeholder: string;
  modelValue?: string;
}>();
defineEmits(["update:modelValue"]);
</script>

<style scoped>
.container {
  display: flow-root;
  width: 85%;
  margin: 5px 0;
}

.placeholder {
  font-size: 1rem;
  color: rgba(61, 56, 56, 0.521);
}
.input {
  box-sizing: border-box;
  margin: 0;
  font-variant: tabular-nums;
  text-overflow: ellipsis;
  touch-action: manipulation;
  list-style: none;
  position: relative;
  display: inline-block;
  width: 100%;
  min-width: 0;
  margin-top: 5px;
  padding: 4px 11px;
  color: #206ed4;
  font-size: 1.15rem;
  font-weight: 600;
  line-height: 1rem;
  background-color: #fff;
  background-image: none;
  border-radius: 2px;
  transition: all 0.3s;
}

.linear-gradient {
  width: 100%;
  height: 3px;
  background-image: linear-gradient(to top, #48c6ef 0%, #6f86d6 100%);
  border-radius: 10px;
}
</style>

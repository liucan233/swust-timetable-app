<template>
  <view
    class="container"
    :class="{ shake: disabled, [props?.className as string]: props?.className }"
  >
    <text class="placeholder">{{ placeholder }}</text>
    <input class="input" :type="type" :auto-blur="true" v-model="text" />
    <text class="warning-text">{{ warningText }}</text>
  </view>
</template>

<script setup lang="ts">
import { shallowRef, computed, ref } from "vue";

/**输入框的类型，占位文字和默认值等*/
const props = defineProps<{
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
}>();

const {
  type = "text",
  placeholder = "",
  defaultValue = "",
} = computed(() => {
  return props;
}).value;

/**用户输入的文本 */
const text = shallowRef(defaultValue);
const disabled = ref(false);
const warningText = ref("");

/**
 * 输入框下方红字警告
 * @param text 警告文本
 */
const warning = (text: string) => {
  disabled.value = true;
  warningText.value = text;
};

/**
 * 清除警告
 */
const clearWarning = () => {
  disabled.value = false;
  warningText.value = "";
};

/**
 * 获取输入框内容
 */
const getInputText = () => {
  return text.value;
};

defineExpose({
  warning,
  clearWarning,
  getInputText,
});
</script>

<style scoped>
.placeholder {
  font-size: 0.8rem;
  color: rgba(61, 56, 56, 0.521);
}

.input {
  display: block;
  width: 100%;
  height: 2.5rem;
  margin-top: 0.5rem;
  padding-left: 0.5rem;
  box-sizing: border-box;
  font-variant: tabular-nums;
  text-overflow: ellipsis;
  touch-action: manipulation;
  list-style: none;
  position: relative;
  color: #142431;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #e4dede;
}

.warning-text {
  display: block;
  min-height: 0.5rem;
  font-size: 0.6rem;
  color: rgba(61, 56, 56, 0.521);
}

.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}

.shake > input {
  border: 1px solid red;
}

.shake > .warning-text {
  color: red;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>

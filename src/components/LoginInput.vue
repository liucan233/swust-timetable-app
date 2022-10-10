<template>
  <view
    class="container"
    :class="{ shake: disabled, [props?.className as string]: true }"
  >
    <text class="placeholder">{{ inputPlaceholder }}</text>
    <input class="input" :type="type" v-model="text" />
    <view class="linear-gradient" />
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
const inputPlaceholder = shallowRef(placeholder);
const disabled = ref(false);

const lintWarning = (newPlaceholder: string) => {
  disabled.value = true;
  inputPlaceholder.value = newPlaceholder;
};

const clearLintWarning = () => {
  disabled.value = false;
  inputPlaceholder.value = placeholder;
};

const getInputText = () => {
  return text.value;
};

/**
 * @lintWarning lint警告，传入警告字符
 * @clearLintWarning 清除lint警告
 * @getInputText 获取input内容
 */
defineExpose({
  lintWarning,
  clearLintWarning,
  getInputText,
});
</script>

<style scoped>
.container {
  display: flow-root;
  width: 85%;
  margin: 0.4rem 0;
}

.placeholder {
  font-size: 0.8rem;
  color: rgba(61, 56, 56, 0.521);
}
.input {
  box-sizing: border-box;
  width: 100%;
  height: 2rem;
  min-width: 0;
  margin: 0;
  padding: 0;
  font-variant: tabular-nums;
  text-overflow: ellipsis;
  touch-action: manipulation;
  list-style: none;
  position: relative;
  display: inline-block;
  padding: 0.3rem 0rem;
  color: #142431;
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
  height: 2px;
  background-image: linear-gradient(to top, #afafaf 0%, #c4c4c4 100%);
  border-radius: 10px;
}

.input:hover ~ .linear-gradient {
  background-image: linear-gradient(60deg, #76b632 0%, #64b3f4 100%);
}

.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}

.shake > text {
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

<template>
  <view class="container" :class="props?.className">
    <text class="placeholder">{{ placeholder }}</text>
    <label>
      <input class="input" :type="type" v-model="text" />
      <view class="linear-gradient" />
    </label>
  </view>
</template>

<script setup lang="ts">
import { shallowRef, computed } from "vue";

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

const clearInputText = () => {
  text.value = "";
};
const getInputText = () => {
  return text.value;
};

defineExpose({
  clearInputText,
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
</style>

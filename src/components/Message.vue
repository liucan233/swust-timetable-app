<template>
  <view>
    <view>
      <!-- 提示信息弹窗 -->
      <uni-popup ref="messageRef" type="message">
        <uni-popup-message
          :type="messageType"
          :message="messageText"
          :duration="2000"
        ></uni-popup-message>
      </uni-popup>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const messageRef = ref<any>(null);
const messageType = ref("");
const messageText = ref("");

function messageToggle(type: string, text: string) {
  messageType.value = type;
  messageText.value = text;
  messageRef.value?.open();
}

const success = (text: string) => {
  console.log(1);

  messageToggle("success", text);
};
const error = (text: string) => {
  messageToggle("error", text);
};
const info = (text: string) => {
  messageToggle("info", text);
};
const warning = (text: string) => {
  messageToggle("warning", text);
};

defineExpose({
  success,
  error,
  info,
  warning,
});
</script>

<style scoped></style>

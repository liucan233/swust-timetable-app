<template>
  <view class="toast-container">
    <view
      v-for="(showed, index) in $showedArr"
      :key="showed.key"
      class="showed-item"
      :data-removing="showed.removing"
      :style="getShowedStyle(showed, index)"
    >
      <text class="title">{{ showed.detail.title }}</text>
      <text class="content">{{ showed.detail.content }}</text>
      <image class="icon" :src="showed.style.iconSrc" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onShow } from "@dcloudio/uni-app";
import {
  IDetail,
  setHandleInfo,
  setHandleError,
  setHandleSuccess,
} from "@lib/toast";
import { ref } from "vue";
import infoImg from "@static/image/toast/info.png";
import errorImg from "@static/image/toast/error.png";
import successImg from "@static/image/toast/success.png";

type TShowedItem = {
  removing: boolean;
  detail: IDetail;
  key: number;
  style: {
    backgroundColor: string;
    titleColor: string;
    contentColor: string;
    iconSrc: string;
  };
};

const $showedArr = ref<TShowedItem[]>([]);

/**多少毫秒后开始消失 */
const showDuration = 2500;
/**消失动画时间 */
const animationDuration = 300;

/**当前正在移除队头 */
let removingFlag = false;
/**开始了新一轮移除 */
let nextTaskStarted = false;

/**样式map */
const styleMap = new Map<string, TShowedItem["style"]>();

styleMap.set("info", {
  backgroundColor: "#0D64D0",
  titleColor: "#DEFEFE",
  contentColor: "#B5EBF7",
  iconSrc: infoImg,
});
styleMap.set("error", {
  backgroundColor: "#BF2C20",
  titleColor: "#F8FFFD",
  contentColor: "#DDFEFE",
  iconSrc: errorImg,
});
styleMap.set("success", {
  backgroundColor: "#51AB3F",
  titleColor: "#D1FDCE",
  contentColor: "#B3FDB4",
  iconSrc: successImg,
});

const getShowedStyle = (s: TShowedItem, i: number) => {
  return {
    top: i * 65 + "px",
    backgroundColor: s.style.backgroundColor,
    "--titleColor": s.style.titleColor,
    "--contentColor": s.style.contentColor,
  };
};

const handleShift = () => {
  if ($showedArr.value.length > 0) {
    $showedArr.value[0].removing = true;
    setTimeout(() => {
      $showedArr.value.shift();
      if ($showedArr.value.length < 1) {
        removingFlag = false;
      } else {
        setTimeout(() => {
          if (nextTaskStarted === false) {
            handleShift();
          } else {
            nextTaskStarted = false;
          }
        }, animationDuration + 600);
      }
    }, animationDuration);
  }
};

const handleShow = (detail: IDetail, type: string) => {
  if (removingFlag === false) {
    removingFlag = true;
    if ($showedArr.value.length > 0) {
      nextTaskStarted = true;
    }
    setTimeout(handleShift, showDuration);
  }
  $showedArr.value.push({
    detail,
    removing: false,
    key: Date.now(), // 有个bug，同一毫秒内触发会导致key相同
    style: styleMap.get(type) as TShowedItem["style"],
  });
};

onShow(() => {
  setHandleInfo((detail: IDetail) => {
    handleShow(detail, "info");
  });
  setHandleError((detail: IDetail) => {
    handleShow(detail, "error");
  });
  setHandleSuccess((detail: IDetail) => {
    handleShow(detail, "success");
  });
});
</script>

<style>
.toast-container {
  position: fixed;
  width: calc(100vw - 12vh);
  height: 50px;
  left: 50%;
  transform: translateX(-50%);
  top: 8vh;
  max-width: 400px;
  pointer-events: v-bind("$showedArr.length?'auto':'none'");
}
.showed-item {
  position: absolute;
  width: 100%;
  height: 50px;
  left: 0;
  background-color: aquamarine;
  border-radius: 6px;
  transition: all v-bind("animationDuration+'ms'") ease-out;
}
.showed-item[data-removing="true"] {
  opacity: 0.2;
}
.icon {
  height: 20px;
  width: 20px;
  position: absolute;
  left: 15px;
  top: 15px;
}
.title {
  position: absolute;
  width: calc(100% - 55px);
  right: 10px;
  color: var(--titleColor);
  top: 5px;
  font-size: 17px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.content {
  position: absolute;
  width: calc(100% - 55px);
  right: 10px;
  color: var(--contentColor);
  top: 25px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 16px;
}
</style>

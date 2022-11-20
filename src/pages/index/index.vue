<template>
  <view></view>
</template>

<script setup lang="ts">
import { onBeforeMount } from "vue";
import { TABLE, LOGIN } from "@enums/pages";
import {
  credentials,
  valueIsFalsy,
  appCommon,
  clearStorage,
  showGetStorageErrModal,
} from "@utils/storage";
import { getTickets } from "@src/api/timetable";

onBeforeMount(() => {
  appCommon.getIsFirstLaunch().then(
    () => {
      // 不是第一次启动，进行cas cookie有效性判断
      credentials.getCasCookie().then(
        casCookie => {
          // 验证cookie是否还有效
          getTickets(casCookie, ["http://202.115.175.175/swust/"])
            .then(res => {
              if (res) {
                credentials.setLabCookie("");
                uni.switchTab({ url: TABLE });
              } else {
                // cas cookie过期了
                uni.showModal({
                  title: "需要重新登录",
                  content:
                    "本App储存的学校身份认证信息已经过期，" +
                    "App无法再从学校服务获取最新数据，是否重新登录？",
                  confirmText: "重新登录",
                  success: res => {
                    if (res.confirm) {
                      uni.redirectTo({ url: LOGIN });
                    } else {
                      uni.switchTab({ url: TABLE });
                    }
                  },
                });
              }
            })
            .catch(() => {
              // cas cookie不存在
              // uni.redirectTo({ url: LOGIN });
            });
        },
        err => {
          // 读取cas cookie失败
          if (valueIsFalsy(err)) {
            // 不存在cas cookie
            uni.redirectTo({ url: LOGIN });
          } else {
            showGetStorageErrModal();
          }
        }
      );
    },
    () => {
      // 首次启动跳转登录，初始化储存
      clearStorage();
      uni.redirectTo({ url: LOGIN });
    }
  );
});
</script>

<style scoped></style>

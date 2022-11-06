<template>
  <view></view>
</template>

<script setup lang="ts">
import { onBeforeMount } from "vue";
import { TABLE, LOGIN } from "@enums/pages";
import { credentials, valueIsFalsy } from "@utils/storage";
import { showErrModal, showUnknownErrModal } from "@src/utils/common";

onBeforeMount(() => {
  credentials
    .getCasCookie()
    .then(() => {
      uni.redirectTo({ url: TABLE });
    })
    .catch(err => {
      uni.redirectTo({ url: LOGIN });
      if (!valueIsFalsy(err)) {
        if (err instanceof Error) {
          showErrModal("App启动时遇到问题", err.message);
        } else {
          showUnknownErrModal();
        }
      }
    });
});
</script>

<style scoped></style>

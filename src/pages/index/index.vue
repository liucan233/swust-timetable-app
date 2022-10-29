<template>
  <div></div>
</template>

<script setup lang="ts">
import { onBeforeMount } from "vue";
import { getCookieSync } from "@utils/cookie";
import { LOGIN, TABLE } from "@enums/pages";
import { Cookie } from "@enums/storage";

onBeforeMount(() => {
  const cookie = getCookieSync(Cookie.CAS_COOKIE);
  if (cookie) {
    uni.switchTab({ url: TABLE });
  } else {
    uni.redirectTo({ url: LOGIN });
  }
});
</script>

<style scoped></style>

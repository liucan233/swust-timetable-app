<template>
  <image :src="loadingGif" class="loading" />
</template>
<script lang="ts" setup>
import loadingGif from "@static/image/loading.gif";
</script>
<style scoped>
.loading {
  position: fixed;
  top: calc(50vh - 100px);
  width: 100px;
  height: 100px;
  left: calc(50% - 50px);
}
</style>

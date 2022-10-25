<template>
  <view class="content">
    <Timetable class-name="timetable" />
  </view>
</template>

<script setup lang="ts">
import { Network } from "@/lib/network";
import Timetable from "@components/Timetable.vue";

const network = new Network({
});

network.onReq=(c)=>{
  console.log(c)
  return c
}

network.onRes=u=>{
  console.log(u)
  if(u.statusCode<200||u.statusCode>399){
    throw new Error('2333')
  }
  return u.data
}

network.onErr=u=>{
  console.log(u)
}

network.get<{ a: 1 }>("/swust/loginCas").then(
  res => {
    console.log(res);
  },
);
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.timetable {
  height: 70vh;
}
</style>

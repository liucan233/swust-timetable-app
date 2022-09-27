<template>
  <view>
    <view class="main-container">
      <view class="logo-warper">
        <view class="logo">LOGO</view>
      </view>
      <view class="input-box">
        <LoginInput
          v-model="username"
          type="text"
          placeholder="一站式服务大厅账号"
        />
        <LoginInput v-model="password" type="password" placeholder="密码" />
      </view>
      <view @click="handleClick" class="login-button">
        <svg
          t="1664197977206"
          class="icon"
          style="transform: rotate(180deg)"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="1061"
          data-spm-anchor-id="a313x.7781069.0.i1"
        >
          <path
            d="M215.04 512l290.261333 290.282667a10.666667 10.666667 0 0 0 15.082667 0l30.186667-30.165334a10.666667 10.666667 0 0 0 0-15.104L337.536 544H650.666667a10.666667 10.666667 0 0 0 10.666666-10.666667v-42.666666a10.666667 10.666667 0 0 0-10.666666-10.666667H337.536l213.034667-213.013333a10.666667 10.666667 0 0 0 0-15.104l-30.186667-30.165334a10.666667 10.666667 0 0 0-15.082667 0L215.04 512zM725.333333 490.666667a10.666667 10.666667 0 0 1 10.666667-10.666667h64a10.666667 10.666667 0 0 1 10.666667 10.666667v42.666666a10.666667 10.666667 0 0 1-10.666667 10.666667h-64a10.666667 10.666667 0 0 1-10.666667-10.666667v-42.666666z"
            fill="#fff"
            p-id="1062"
          ></path>
        </svg>
      </view>
    </view>
    <view class="background">
      <ShapeDividerWarper className="divider-warper">
        <ShapeDivider
          v-for="(item, index) in shapeDividers"
          :class="item.className"
          :placement="item.placement"
          :height="item.height"
          :width="item.width"
          :color="item.color"
          :key="index"
        />
      </ShapeDividerWarper>
      <view class="bottom-background"> </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ShapeDivider from "@components/ShapeDivider";
import ShapeDividerWarper from "@components/ShapeDividerWarper";
import LoginInput from "@components/LoginInput.vue";
import { login } from "@/api";

const shapeDividers = [
  {
    className: "divider-1-top",
    placement: "top",
    height: "50px",
    width: "100%",
    color: "#01af7e",
  },
  {
    className: "divider-2-top",
    placement: "top",
    height: "100px",
    width: "190%",
    color: "#4a90e2",
  },
  {
    className: "divider-2-bottom",
    placement: "bottom",
    height: "100px",
    width: "120%",
    color: "#4a90e2",
  },
  {
    className: "divider-3-top",
    placement: "top",
    height: "100px",
    width: "100%",
    color: "#0176c3",
  },
];

const username = ref<string>("");
const password = ref<string>("");
const handleClick = async () => {
  try {
    await login(username.value, password.value);
    // eslint-disable-next-line no-undef
    uni.redirectTo({ url: "/pages/table/table" });
  } catch (error) {
    console.error(error);
  }
};
</script>

<style scoped>
.main-container {
  height: 70vh;
}

.logo-warper {
  position: relative;
  height: 60%;
}

.logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-image: linear-gradient(to top, #48c6ef 0%, #6f86d6 100%);
  height: 5rem;
  width: 5rem;
  text-align: center;
  color: #fff;
  font-weight: bold;
  line-height: 5rem;
  border-radius: 100%;
}

.input-box {
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  justify-items: center;
  align-items: center;
}

.login-button {
  background-image: linear-gradient(to top, #48c6ef 0%, #6f86d6 100%);
  margin: 10px auto;
  padding: 10px;
  border-radius: 100%;
}

.login-button,
.icon {
  height: 2rem;
  width: 2rem;
}

.background {
  height: 30%;
}

.divider-warper {
  height: 130px;
}

.divider-1-top,
.divider-2-top,
.divider-2-bottom,
.divider-3-top {
  position: absolute;
}

.divider-1-top {
  bottom: 70px;
}

.divider-2-top {
  bottom: 68px;
}
.divider-2-bottom {
  bottom: -30px;
}
.divider-3-top {
  bottom: 0px;
}

.bottom-background {
  height: calc(30vh - 130px);
  background-color: #0176c3;
  margin-top: -1px;
}
</style>

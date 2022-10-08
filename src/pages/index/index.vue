<template>
  <view>
    <view class="main-container">
      <view class="greeting-text1">同学你好</view>
      <view class="greeting-text2">欢迎使用有课么APP</view>
      <LoginInput placeholder="一站式服务大厅账号" ref="usernameRef" />
      <LoginInput type="password" placeholder="密码" ref="passwordRef" />
      <!-- <button @click="handleClear">清除</button> -->
      <view @click="handleClick" class="login-button">Login</view>
    </view>
    <view class="background">
      <ShapeDivider />
      <view class="bottom-background"></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, shallowRef } from "vue";
import ShapeDivider from "@components/ShapeDivider";
import LoginInput from "@components/LoginInput";
import { login } from "@/api";

/**组件ref属性哒类型，T为组件类型 */
type TLoginInputRef = InstanceType<typeof LoginInput> | null;

const usernameRef = shallowRef<TLoginInputRef>(null);

const passwordRef = ref<TLoginInputRef>(null);

const getUserForm = () => {
  return {
    username: usernameRef.value?.getInputText(),
    password: passwordRef.value?.getInputText(),
  };
};

// const clearUsername = () => {
//   usernameRef.value?.clearInputText();
// };

// const clearPassword = () => {
//   passwordRef.value?.clearInputText();
// };

// const handleClear = () => {
//   // console.log(usernameRef.value);
//   // console.log(getUserForm());
//   clearUsername();
//   clearPassword();
// };

const handleClick = async () => {
  const { username, password } = getUserForm();
  if (!(username && password)) {
    uni.showToast({
      icon: "error",
      title: "请正确填写信息",
    });
    return;
  }
  try {
    uni.showLoading({
      title: "loading",
    });
    login(username, password);
    uni.hideLoading();
    uni.redirectTo({ url: "/pages/table/table" });
  } catch (error) {
    console.error(error);
  }
};
</script>

<style scoped>
.main-container {
  display: flex;
  height: 80vh;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  justify-items: center;
  align-items: center;
}

.background {
  height: 20vh;
  overflow: hidden;
}

.greeting-text1,
.greeting-text2 {
  width: 85%;
  height: 3rem;
  line-height: 3rem;
  color: #142431;
  font-weight: bold;
}

.greeting-text1 {
  font-size: 1.2rem;
}

.greeting-text2 {
  font-size: 1.8rem;
  margin-bottom: 2rem;
}

.login-button {
  width: 80%;
  height: 1.2rem;
  background-image: linear-gradient(60deg, #76b632 0%, #64b3f4 100%);
  margin: 1.5rem auto 0;
  padding: 0.6rem;
  border-radius: 5px;
  color: rgb(241, 234, 234);
  font-weight: bold;
  line-height: 1.2rem;
  text-align: center;
}

.bottom-background {
  height: calc(30vh - 130px);
  background-color: #0176c3;
  margin-top: -1px;
}
</style>

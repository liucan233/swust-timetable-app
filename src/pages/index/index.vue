<template>
  <view>
    <view class="main-container">
      <view class="greeting-text2 slide-top2">{{ Text.title }}</view>
      <LoginInput
        defaultValue="5120205917"
        :placeholder="Text.username.default"
        ref="usernameRef"
      />
      <LoginInput
        defaultValue="123456789"
        type="password"
        :placeholder="Text.password.default"
        ref="passwordRef"
      />
      <view class="verify-warper">
        <LoginInput
          defaultValue="1234"
          className="verify-input"
          :placeholder="Text.code.default"
          ref="verifyRef"
        />
        <view class="verify-img-warper">
          <image :src="imageURL" alt="点击刷新" />
        </view>
      </view>
      <view @click="handleClick" class="login-button">登录</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, shallowRef } from "vue";
import LoginInput from "@components/LoginInput";
import { login } from "@/api";
import { TABLE } from "@/enums/pages";

/**组件ref属性哒类型，T为组件类型 */
type TLoginInputRef = InstanceType<typeof LoginInput> | null;

const usernameRef = shallowRef<TLoginInputRef>(null);
const passwordRef = ref<TLoginInputRef>(null);
const verifyRef = ref<TLoginInputRef>(null);
const imageURL = ref<string>("http://cas.swust.edu.cn/authserver/captcha");
const Text = {
  title: "欢迎使用有课么",
  username: {
    default: "一站式服务大厅账号",
    warning: "请输入正确的账号",
  },
  password: {
    default: "一站式服务大厅密码",
    warning: "请输入正确的密码",
  },
  code: {
    default: "验证码",
    warning: "请输入正确的验证码",
  },
};

const getUserForm = () => {
  return {
    username: usernameRef.value?.getInputText(),
    password: passwordRef.value?.getInputText(),
    code: verifyRef.value?.getInputText(),
  };
};

const formLint = () => {
  const { username = "", password = "", code = "" } = getUserForm();
  const usernameRegExp = /.{10}/;
  const passwordRegExp = /.+/;
  const codeRegExp = /.{4}/;
  let flag = true;
  if (!usernameRegExp.test(username)) {
    usernameRef.value?.lintWarning(Text.username.warning);
    flag = false;
  } else {
    usernameRef.value?.clearLintWarning();
  }
  if (!passwordRegExp.test(password)) {
    passwordRef.value?.lintWarning(Text.password.warning);
    flag = false;
  } else {
    passwordRef.value?.clearLintWarning();
  }
  if (!codeRegExp.test(code)) {
    verifyRef.value?.lintWarning(Text.code.warning);
    flag = false;
  } else {
    verifyRef.value?.clearLintWarning();
  }
  return flag;
};

const handleClick = async () => {
  const { username = "", password = "", code = "" } = getUserForm();
  if (!formLint()) {
    uni.showToast({
      icon: "error",
      title: "请正确填写信息",
    });
    return;
  }
  uni.showLoading({
    title: "登陆中",
  });
  login(username, password, code)
    .promise.then(() => {
      uni.switchTab({ url: TABLE });
    })
    .catch(err => {
      uni.showToast({
        icon: "error",
        title: err.message,
      });
    })
    .finally(() => {
      uni.hideLoading();
    });
};
</script>

<style scoped>
.main-container {
  display: flex;
  height: 100vh;
  width: 100%;
  padding: 40% 0 0;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
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
  font-size: 1.1rem;
}

.greeting-text2 {
  font-size: 2.4rem;
  margin-bottom: 3rem;
}

.verify-warper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 85%;
}

.verify-input,
.verify-img-warper {
  width: 50%;
}

.verify-img-warper {
  position: relative;
  height: 100%;
}

.verify-img-warper > image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 70%;
  width: 70%;
}

.login-button {
  font-size: 1rem;
  width: 80%;
  height: 1.2rem;
  background-image: linear-gradient(60deg, #76b632 0%, #64b3f4 100%);
  margin: 1.5rem auto 0;
  padding: 0.6rem;
  border-radius: 5px;
  color: #fff;
  font-weight: bold;
  line-height: 1.2rem;
  text-align: center;
}

.bottom-background {
  height: calc(30vh - 130px);
  background-color: #0176c3;
  margin-top: -1px;
}

.slide-top1 {
  animation: slide-top 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

.slide-top2 {
  animation: slide-top 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

@keyframes slide-top {
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0px);
    opacity: 1;
  }
}
</style>

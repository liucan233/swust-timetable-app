<template>
  <view class="main-container slide-top">
    <view class="greeting-text">{{ Text.title }}</view>
    <LoginInput
      defaultValue="5120205917"
      :placeholder="Text.username.default"
      className="login-input"
      ref="usernameRef"
    />
    <LoginInput
      defaultValue="123456789"
      type="password"
      :placeholder="Text.password.default"
      className="login-input"
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
  const usernameRegExp = /^.{10}$/;
  const passwordRegExp = /^.+$/;
  const codeRegExp = /^.{4}$/;
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
  background-image: url("../../static/image/illustration.png");
  background-repeat: no-repeat;
  background-position: 0rem 32rem;
  background-size: 100%;
}

.greeting-text {
  width: 90%;
  height: 3rem;
  color: transparent;
  font-size: 1.8rem;
  font-weight: bold;
  line-height: 3rem;
  background-image: linear-gradient(60deg, #76b632 0%, #64b3f4 100%);
  background-clip: text;
}

.greeting-text {
}

.login-input {
  width: 90%;
  margin: 0.4rem 0 0;
}

.verify-warper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90%;
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
  transform: translate(-50%, -25%);
  height: 50%;
  width: 50%;
}

.login-button {
  font-size: 1rem;
  width: 85%;
  height: 1.5rem;
  background-image: linear-gradient(60deg, #76b632 0%, #64b3f4 100%);
  margin-top: 0.5rem;
  padding: 0.6rem;
  border-radius: 5px;
  color: #fff;
  font-weight: bold;
  line-height: 1.5rem;
  text-align: center;
}

.slide-top {
  animation: slide-top 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
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

<template>
  <view>
    <view class="main-container slide-top">
      <view class="greeting-text">{{ text.title }}</view>
      <LoginInput
        :placeholder="text.username.default"
        className="login-input"
        ref="usernameRef"
      />
      <LoginInput
        type="password"
        :placeholder="text.password.default"
        className="login-input"
        ref="passwordRef"
      />
      <view class="verify-warper">
        <LoginInput
          className="verify-input"
          :placeholder="text.code.default"
          ref="verifyRef"
        />
        <view class="verify-img-warper">
          <image
            :src="imageURL"
            alt="点击刷新"
            @click="refreshCookieAndCaptchaUrl"
          />
        </view>
      </view>
      <view @click="handleClick" class="login-button">登录</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, shallowRef } from "vue";

import LoginInput from "@components/LoginInput";

import { TABLE } from "@enums/pages";
import { Cookie } from "@enums/storage";
import { getCookieSync, setCookieSync } from "@utils/cookie";
import { getCookieAndCaptchaUrl, login } from "@api";

/**组件ref属性的类型，T为组件类型 */
type TLoginInputRef = InstanceType<typeof LoginInput> | null;

const usernameRef = shallowRef<TLoginInputRef>(null);
const passwordRef = shallowRef<TLoginInputRef>(null);
const verifyRef = shallowRef<TLoginInputRef>(null);
const imageURL = shallowRef<string>("");
const text = {
  title: "欢迎使用有课么",
  username: {
    default: "一站式服务大厅账号",
    lintWarningText: "请输入十位学号",
    errorText: "用户名或密码错误",
  },
  password: {
    default: "一站式服务大厅密码",
    lintWarningText: "",
    errorText: "用户名或密码错误",
  },
  code: {
    default: "验证码",
    lintWarningText: "请输入四位验证码",
    errorText: "验证码错误",
  },
};

onBeforeMount(() => {
  const cookie = getCookieSync(Cookie.CAS_COOKIE);
  if (cookie) {
    uni.switchTab({ url: TABLE });
  }
});

onMounted(() => {
  refreshCookieAndCaptchaUrl();
});

/** 刷新cookie和重新获取验证码 */
const refreshCookieAndCaptchaUrl = () => {
  /** 获取cookie和验证码 */
  getCookieAndCaptchaUrl().promise.then(response => {
    imageURL.value = response.data.data.captcha;
    setCookieSync(Cookie.LOGIN_COOKIE, response.data.data.cookie);
  });
};

/** 获取用户输入 */
const getUserInput = () => {
  return {
    username: usernameRef.value?.getInputText(),
    password: passwordRef.value?.getInputText(),
    code: verifyRef.value?.getInputText(),
  };
};

/** 表单检测 */
const formLint = () => {
  const { username = "", password = "", code = "" } = getUserInput();
  const usernameRegExp = /^.{10}$/;
  const passwordRegExp = /^.+$/;
  const codeRegExp = /^.{4}$/;
  let flag = true;
  if (!usernameRegExp.test(username)) {
    usernameRef.value?.warning(text.username.lintWarningText);
    flag = false;
  } else {
    usernameRef.value?.clearWarning();
  }
  if (!passwordRegExp.test(password)) {
    passwordRef.value?.warning(text.password.lintWarningText);
    flag = false;
  } else {
    passwordRef.value?.clearWarning();
  }
  if (!codeRegExp.test(code)) {
    verifyRef.value?.warning(text.code.lintWarningText);
    flag = false;
  } else {
    verifyRef.value?.clearWarning();
  }
  return flag;
};

const handleClick = async () => {
  const { username = "", password = "", code = "" } = getUserInput();
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
  try {
    const {
      data: { cookie },
      code: statusCode,
      msg,
    } = await login(username, password, code).promise.then(
      response => response.data
    );
    uni.hideLoading();
    if (statusCode === 200) {
      setCookieSync(Cookie.CAS_COOKIE, cookie);
      uni.switchTab({ url: TABLE });
    } else {
      if (statusCode === 401) {
        // 返回的msg有两种，"验证码错误" "用户名或密码错误"
        if (msg.length === 8) {
          usernameRef.value?.warning(text.username.errorText);
          passwordRef.value?.warning(text.password.errorText);
        } else if (msg.length === 5) {
          verifyRef.value?.warning(text.password.errorText);
        }
      }
      /** 登录失败需要重新获取cookie和验证码 */
      refreshCookieAndCaptchaUrl();
      throw Error(msg);
    }
  } catch (error) {
    uni.hideLoading();
    uni.showToast({
      icon: "error",
      title: `${error}`,
    });
  }
};
</script>

<style scoped>
.main-container {
  display: flex;
  height: 100vh;
  width: 100%;
  max-width: 30rem;
  padding: 0 0 10%;
  margin: 0 auto;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url("../../static/image/swust.png");
  background-repeat: no-repeat;
  background-position: 0rem 35rem;
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

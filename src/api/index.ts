import { BACKEND_PREFIX } from "@src/config";
import { Network } from "@lib/network";

/**
 * 带有拦截器的网络请求实例
 * 请求出错时（请求失败、http状态码不正确和业务状态码不正确）会以null兑现Promise
 */
export const network = new Network({
  url: BACKEND_PREFIX,
  timeout: 10000,
});

/**
 * 无拦截器的网络请求实例
 * 请求出错时（http 404和网络连接失败等）会以null兑现Promise
 * 业务代码状态码不正确不会以null兑现，而是会以后端实际相应的数据对象，即使状态码不正确
 */
export const manualNetwork = new Network({
  url: BACKEND_PREFIX,
  timeout: 10000,
});

network.onErr = err => {
  let msg = "网络错误，请检查网络";
  if (err instanceof Error && err.message) {
    msg += "。错误：" + err.message + "。";
  } else if (err && typeof (err as any).errMsg === "string") {
    msg += "。错误：" + (err as any).errMsg + "。";
  }
  uni.showToast({
    title: msg,
    duration: 1500,
    icon: "error",
  });
};

network.onRes = res => {
  const { statusCode } = res;
  if (statusCode < 200 || (statusCode > 299 && statusCode !== 304)) {
    throw new Error("HTTP状态码为" + statusCode);
  }
  if (res.data && (res.data as any).code !== 200) {
    throw new Error("业务状态码为" + (res.data as any).code);
  }
  return res.data;
};

import { BACKEND_PREFIX } from "@src/config";
import { Network } from "@lib/network";

export type TBaseRes<T> = {
  code: number;
  msg: string;
  data: T;
};

export const network = new Network({
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

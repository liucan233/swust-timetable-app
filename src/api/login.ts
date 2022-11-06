import { TBaseRes } from ".";
import { TGetCookieAndCaptchaUrlDto, TLoginDto } from "@src/types/login";
import { Network } from "@src/lib/network";
import { BACKEND_PREFIX } from "@src/config";

const network = new Network({ url: BACKEND_PREFIX, timeout: 10000 });

network.onRes = res => {
  const { statusCode } = res;
  if (statusCode < 200 || (statusCode > 299 && statusCode !== 304)) {
    throw new Error("HTTP状态码为" + statusCode);
  }
  if (res.data && (res.data as any).code !== 200) {
    throw new Error((res.data as any).msg);
  }
  return res.data;
};

/**
 * 获取当前cookie和验证码
 * @returns
 */
export function getCookieAndCaptchaUrl() {
  return network.get<TBaseRes<TGetCookieAndCaptchaUrlDto>>(
    "/api/swust/loginCas"
  );
}

/**
 *  登录
 * @param user
 * @param passwd
 * @param captcha
 * @param cookie
 * @returns 一站式服务大厅cookie(CAS_COOKIE)
 */
export function login(
  user: string,
  passwd: string,
  captcha: string,
  cookie: string
) {
  return network.post<TBaseRes<TLoginDto>>("/api/swust/loginCas", {
    user,
    passwd,
    captcha,
    cookie,
  });
}

import { TGetCookieAndCaptchaUrlDto, TLoginDto } from "@src/types/login";
import { manualNetwork } from ".";

/**
 * 获取当前cookie和验证码
 * @returns
 */
export function getCookieAndCaptchaUrl() {
  return manualNetwork.get<TBaseRes<TGetCookieAndCaptchaUrlDto>>(
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
  return manualNetwork.post<TBaseRes<TLoginDto>>("/api/swust/loginCas", {
    user,
    passwd,
    captcha,
    cookie,
  });
}

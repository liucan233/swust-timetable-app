import { Cookie } from "@enums/storage";
import { getCookieSync } from "@utils/cookie";
import { network } from "@/lib/network";

/**
 * 获取当前cookie和验证码
 * @returns
 */
export function getCookieAndCaptchaUrl() {
  return network<IBaseResponse<TGetCookieAndCaptchaUrlDto>>({
    url: "https://swust.hanyue.xyz/api/swust/loginCas",
  });
}

/**
 *  登录
 * @param username '
 * @param password
 * @param code
 * @returns 一站式服务大厅cookie(CAS_COOKIE)
 */
export function login(username: string, password: string, code: string) {
  const cookie = getCookieSync(Cookie.LOGIN_COOKIE);
  return network<IBaseResponse<TLoginDto>>({
    url: "https://swust.hanyue.xyz/api/swust/loginCas",
    method: "POST",
    data: {
      user: username,
      passwd: password,
      captcha: code,
      cookie,
    },
  });
}

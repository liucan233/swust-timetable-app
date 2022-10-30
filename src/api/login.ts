import { Cookie } from "@enums/storage";
import { TGetCookieAndCaptchaUrlDto, TLoginDto } from "@src/types/login";
import { getCookieSync } from "@utils/cookie";
import { network } from ".";

// const network = new Network();

/**
 * 获取当前cookie和验证码
 * @returns
 */
export function getCookieAndCaptchaUrl() {
  return network.get<IBaseResponse<TGetCookieAndCaptchaUrlDto>>(
    "https://swust.hanyue.xyz/api/swust/loginCas"
  );
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
  return network.post<IBaseResponse<TLoginDto>>(
    "https://swust.hanyue.xyz/api/swust/loginCas",
    {
      user: username,
      passwd: password,
      captcha: code,
      cookie,
    }
  );
}

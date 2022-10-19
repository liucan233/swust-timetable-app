import { getCookieSync } from "@/utils/cookie";
import { network } from "@/lib/network";

export function getCookieAndCaptchaUrlTest() {
  return network<BaseResponse<{ cookie: string; captcha: string }>>({
    url: "https://swust.hanyue.xyz/api/swust/loginCas",
  });
}

export function loginTest(username: string, password: string, code: string) {
  const cookie = getCookieSync();
  return network<BaseResponse<{ cookie: string }>>({
    url: "https://swust.hanyue.xyz/api/swust/loginCas",
    method: "POST",
    data: encodeURI(
      `user=${username}&cookie=${cookie.replaceAll(
        "=",
        "%3D"
      )}&passwd=${password}&captcha=${code}`
    ),
    header: {
      "content-type": "x-www-form-urlencoded",
    },
  });
}

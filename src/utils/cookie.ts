import { CAS_COOKIE } from "@/enums/storage";

/**
 * 同步读取Storage中cookie值
 * @returns cookie
 */
export function getCookieSync(): string {
  return uni.getStorageSync(CAS_COOKIE);
}

/**
 * 同步修改Storage中cookie值
 * @returns cookie
 */
export function setCookieSync(cookie: string) {
  return uni.setStorageSync(CAS_COOKIE, cookie);
}

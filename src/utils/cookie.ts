/**
 * 同步读取Storage中cookie值
 * @returns cookie
 */
export function getCookieSync(cookieType: string): string {
  return uni.getStorageSync(cookieType);
}

/**
 * 同步修改Storage中cookie值
 * @returns cookie
 */
export function setCookieSync(cookieType: string, value: string) {
  return uni.setStorageSync(cookieType, value);
}

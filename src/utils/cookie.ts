export function getCookieSync(): string {
  return uni.getStorageSync("cookie");
}

export function setCookieSync(cookie: string) {
  return uni.setStorageSync("cookie", cookie);
}

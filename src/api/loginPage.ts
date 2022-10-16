export function login(username: string, password: string) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: "http://127.0.0.1:4523/mock/1672514/user/login",
      method: "POST",
      data: { username, password },
      success: value => {
        resolve(value.data);
      },
      fail: err => {
        reject(err);
      },
    });
  });
}

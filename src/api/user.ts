import { network } from "@/lib/network";

export function login(username: string, password: string, code: string) {
  return network<BaseResponse<null>>({
    url: "http://127.0.0.1:4523/mock/1672514/user/login",
    method: "POST",
    data: { username, password, code },
  });
}

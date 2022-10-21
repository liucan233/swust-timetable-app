import { getCookieSync } from "@utils/cookie";
import qs from "@utils/qs";
import { Cookie } from "@enums/storage";
import { network } from "@/lib/network";

/**
 * 获取教务处课表
 * @returns 教务处课表数组
 */
export async function getCommonTimetableData() {
  const cookie = getCookieSync(Cookie.CAS_COOKIE);
  const {
    data: {
      tickets: [ticket],
    },
  } = await network<IBaseResponse<{ tickets: [string] }>>({
    url: "https://swust.hanyue.xyz/api/swust/ticket",
    method: "POST",
    data: { cookie, targets: ["http://202.115.175.175/swust/"] },
  }).promise.then(response => response.data);

  const {
    data: { cookie: subCookie },
  } = await network<IBaseResponse<{ cookie: string }>>({
    url: `https://swust.hanyue.xyz/api/timetable/cookie?${qs.parse({
      ticket,
    })}`,
    method: "GET",
  }).promise.then(response => response.data);

  return network<IBaseResponse<TGetCommonTimetableDataDto>>({
    url: `https://swust.hanyue.xyz/api/timetable/commonTimeTable?${qs.parse({
      cookie: subCookie,
    })}`,
    method: "GET",
  });
}

/**
 * 获取实验课课表
 * @returns 实践综合管理系统课表数组
 */
export async function getLabTimetableData() {
  const cookie = getCookieSync(Cookie.CAS_COOKIE);
  const {
    data: {
      tickets: [ticket],
    },
  } = await network<IBaseResponse<{ tickets: [string] }>>({
    url: "https://swust.hanyue.xyz/api/swust/ticket",
    method: "POST",
    data: { cookie, targets: ["http://202.115.175.175/swust/"] },
  }).promise.then(response => response.data);

  const {
    data: { cookie: subCookie },
  } = await network<IBaseResponse<{ cookie: string }>>({
    url: `https://swust.hanyue.xyz/api/timetable/cookie?${qs.parse({
      ticket,
    })}`,
    method: "GET",
  }).promise.then(response => response.data);

  return network<IBaseResponse<TGetLabTimetableDataDto>>({
    url: `https://swust.hanyue.xyz/api/timetable/labTimeTable?${qs.parse({
      cookie: subCookie,
    })}`,
    method: "GET",
  });
}

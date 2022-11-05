import dayjs from "@src/lib/dayjs";

export interface IDayInfo {
  year: number;
  month: number;
  day: number;
}
/**获取时间区间内的日期详情 */
export const getDaysInfo = (start: Date, end: Date) => {
  const result: IDayInfo[] = [],
    curDate = new Date(start),
    days = (end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000);

  for (let i = 0; i <= days; i++) {
    const dayInfo = {
      year: curDate.getFullYear(),
      month: curDate.getMonth() + 1,
      day: curDate.getDate(),
    };
    result.push(dayInfo);
    curDate.setDate(dayInfo.day + 1);
  }

  return result;
};

export const getDateFromWeek = (currentWeek: number): Date => {
  return new Date(dayjs().startOf("week").add(currentWeek, "week").valueOf());
};

/**向用户弹窗未知错误 */
export const showUnknownErrModal = () => {
  uni.showModal({
    title: "发生未知错误",
    showCancel: false,
    content:
      "发生未知错误，请向开发者反馈，设备ID为：" + uni.getDeviceInfo().deviceId,
  });
};

/**向用户弹窗错误 */
export const showErrModal = (title: string, msg: string) => {
  uni.showModal({
    title,
    showCancel: false,
    content:
      msg +
      "，" +
      "请重试向开发者反馈，设备ID为：" +
      uni.getDeviceInfo().deviceId,
  });
};

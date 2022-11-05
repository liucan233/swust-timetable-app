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

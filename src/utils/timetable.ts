import { ICommonCourse } from "@api/timetable";

/**本APP使用的课程类型 */
export interface IAppCourse {
  code: string;
  name: string;
  teacher: string;
  place: string;
  week: number;
  begin: number;
  over: number;
  task: string;
  day: number;
}

/**解析被-分隔的两个数字 */
const parseNumbers = (s: string): number[] | null => {
  const result = s.match(/\d+/g);
  if (result?.length === 2) {
    return result.map(n => Number(n));
  }
  return null;
};

/**压平后端返回的课表数据 */
export const flatCourse = (arr: ICommonCourse[]) => {
  const res: IAppCourse[] = [];
  for (let i = 0; i < arr.length; i++) {
    const c = arr[i];
    for (let j = 0; j < c.week.length; j++) {
      const w = c.week[j],
        p = c.place[j],
        s = c.section[j],
        d = Number(c.day[j]),
        t = c.tasks ? c.tasks[j] : "",
        parsedSection = parseNumbers(s);
      if (parsedSection?.length !== 2) {
        console.warn("解析课程节次出错:");
        console.warn(c);
        continue;
      }
      if (Number.isNaN(d)) {
        console.warn("解析课程上课时间出错:");
        console.warn(c);
        continue;
      }
      if (w.includes("-")) {
        const parsedWeek = parseNumbers(w);
        if (parsedWeek?.length === 2) {
          let [start, end] = parsedWeek;
          while (start <= end) {
            res.push({
              code: c.code,
              name: c.name,
              teacher: c.teacher,
              place: p,
              week: start,
              begin: parsedSection[0],
              over: parsedSection[1],
              task: t,
              day: d,
            });
            start++;
          }
        } else {
          console.warn("解析课程周次出错:");
          console.warn(c);
        }
      } else {
        res.push({
          code: c.code,
          name: c.name,
          teacher: c.teacher,
          place: p,
          week: Number(w),
          begin: parsedSection[0],
          over: parsedSection[1],
          task: t,
          day: d,
        });
      }
    }
  }
  return res;
};

/**验证并修复课表数据类型 */
export const fixCourseArr = (arr: IAppCourse[], currentWeek: number) => {
  const ans: IAppCourse[] = [],
    set = new Set<string>();
  for (const c of arr) {
    let fatalErrOccurred = false,
      name = c.name;
    if (typeof c.name !== "string") {
      c.name = "课程名类型不正确";
    }
    if (typeof c.over !== "number") {
      c.over = 10;
      fatalErrOccurred = true;
    }
    if (typeof c.place !== "string") {
      c.place = "上课地点类型不正确";
      fatalErrOccurred = true;
    }
    if (typeof c.teacher !== "string") {
      c.teacher = "教师名字类型不正确";
    }

    if (typeof c.begin !== "number") {
      c.begin = 9;
      fatalErrOccurred = true;
    }
    if (typeof c.code !== "string") {
      c.code = "课程号类型不正确";
    }
    if (typeof c.week !== "number") {
      c.week = currentWeek;
      fatalErrOccurred = true;
    }
    if (fatalErrOccurred) {
      if (!set.has(name)) {
        ans.push(c);
        console.warn("课程存在致命数据类型错误:");
        console.warn(c);
      }
      set.add(name);
    } else {
      ans.push(c);
    }
  }
  return ans;
};

/**将课程表拆分为周 */
export const covertToWeek = (arr: IAppCourse[]): IAppCourse[][] => {
  let maxWeekNum=-1;
  for(const course of arr){
    if(maxWeekNum<course.week){
      maxWeekNum=course.week;
    }
  }
  const ans: IAppCourse[][] = new Array(maxWeekNum+1).fill(null).map(()=>[]);
  
  for(const course of arr){
    console.log(course.week-1)
    ans[course.week-1].push(course)
  }

  return ans;
};

/**一天的课程 */
type TDayCourse = {
  /**一天的所以课程 */
  list: IAppCourse[];
  /**冲突的课程 */
  conflict: [
    IAppCourse[] | null | undefined,
    IAppCourse[] | null | undefined,
    IAppCourse[] | null | undefined,
    IAppCourse[] | null | undefined,
    IAppCourse[] | null | undefined,
    IAppCourse[] | null | undefined
  ];
};

/**一周七天的课程 */
type TWeekCourse = [
  TDayCourse | null | undefined,
  TDayCourse | null | undefined,
  TDayCourse | null | undefined,
  TDayCourse | null | undefined,
  TDayCourse | null | undefined,
  TDayCourse | null | undefined,
  TDayCourse | null | undefined
];

/**一个学期的课表，一维是周课表，
 * 二维是天课表，包含冲突情况和当天的所有课
 */
type TOrganizedCourse = Array<TWeekCourse>;

/**使用桶排序将课程按天放到数组内，参数arr[i]表示第i+1周的所有课程 */
export const organizeCourse = (arr: IAppCourse[][]): TOrganizedCourse => {
  const result: TOrganizedCourse = [];
  for (const disorderWeek of arr) {
    const orderedWeek: TWeekCourse = [] as any;
    if (!disorderWeek || disorderWeek.length < 1) {
      result.push(orderedWeek);
      continue;
    }
    for (let j = 0; j < disorderWeek.length; j++) {
      const curCourse = disorderWeek[j];
      const curDayNum = curCourse.day;

      //如果该周当天的课程为空
      if (!orderedWeek[curDayNum]) {
        orderedWeek[curDayNum] = {
          conflict: [] as any,
          list: [],
        };
      }

      const curDayCourse = orderedWeek[curDayNum] as TDayCourse;

      //将当前课程加到本周对应的那一天
      curDayCourse.list.push(curCourse);

      //更新该天课程的冲突情况
      for (let k = curCourse.begin; k <= curCourse.over; k++) {
        if (curDayCourse.conflict[k]) {
          curDayCourse.conflict[k]?.push(curCourse);
        } else {
          curDayCourse.conflict[k] = [curCourse];
        }
      }
    }
    result.push(orderedWeek);
  }
  return result;
};

/**整理将服务端返回的课程 */
export const putCourseInOrder=(arr:ICommonCourse[],currentWeek:number)=>{
  const flattedCourse=flatCourse(arr);
  const correctCourse = fixCourseArr(flattedCourse, currentWeek);
  const weekCourse = covertToWeek(correctCourse);
  return organizeCourse(weekCourse)
}

import { ICommonCourse } from "@api/timetable";
import { timetable } from "./storage";

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
  color: string;
}

/**解析被-分隔的两个数字 */
const parseNumbers = (s: string): number[] | null => {
  const result = s.match(/\d+/g);
  if (result?.length === 2) {
    return [Number(result[0]), Number(result[1])];
  }
  return null;
};

/**压平后端返回的课表数据，若周为1-3，则会生成3个IAppCourse */
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
              color: "",
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
          color: "",
        });
      }
    }
  }
  return res;
};

/**冲突的课程 */
export interface IConflictCourse {
  begin: number;
  over: number;
  /**[begin, over]区间内冲突的课程，例如1-2 3-4 1-4，则list仅包含1-4 */
  list: IAppCourse[];
}

/**分析一天内课程冲突情况，返回[不冲突课程，冲突课程] */
const getDayCourseConflict = (
  arr: IAppCourse[]
): [IAppCourse[], IConflictCourse[]] => {
  if (arr.length < 2) {
    return [arr, []];
  }
  /**按上课时间排序的课表 */
  const orderedCourse = Array.from(arr);
  // 将一天内到课程按开始时间早和结束时间早在前排序
  orderedCourse.sort((a, b) => {
    if (a.begin !== b.begin) {
      return a.begin < b.begin ? -1 : 1;
    }
    return a.over < b.over ? -1 : 1;
  });
  /**当天有冲突的课表 */
  const conflictArr: IAppCourse[] = [];
  let curBegin = orderedCourse[0].begin,
    curOver = orderedCourse[0].over;

  /**不存在冲突的课程列表 */
  const normalArr: IAppCourse[] = [orderedCourse[0]];
  // 找出当天存在冲突的课程
  for (let i = 1; i < orderedCourse.length; i++) {
    const { begin, over } = orderedCourse[i];
    if (begin < curOver) {
      conflictArr.push(orderedCourse[i]);
    } else {
      curBegin = begin;
      curOver = over;
      normalArr.push(orderedCourse[i]);
    }
  }

  // 如果不冲突，则返回空
  if (conflictArr.length < 1) {
    return [arr, []];
  }
  curBegin = conflictArr[0].begin;
  curOver = conflictArr[0].over;

  /**某个时间段内冲突的课程集合 */
  let tmp: IConflictCourse = {
    begin: curBegin,
    over: curOver,
    list: [conflictArr[0]],
  };

  const result: IConflictCourse[] = [tmp];

  // 若冲突课程为1-2 3-4 1-4，则合并为1-4节课有1个课程冲突
  for (let i = 1; i < conflictArr.length; i++) {
    const { begin, over } = conflictArr[i];
    if (begin < curOver) {
      if (curOver < over) {
        curOver = over;
        tmp.over = over;
      }
      tmp.list.push(conflictArr[i]);
    } else {
      curBegin = begin;
      curOver = over;
      result.push(tmp);
      tmp = {
        begin: curBegin,
        over: curOver,
        list: [conflictArr[i]],
      };
    }
  }
  return [normalArr, result];
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

/**将课程表拆分为周，返回数据data[i]表示第i周的课程 */
export const covertToWeek = (arr: IAppCourse[]): IAppCourse[][] => {
  let maxWeekNum = -1;
  for (const course of arr) {
    if (maxWeekNum < course.week) {
      maxWeekNum = course.week;
    }
  }
  const ans: IAppCourse[][] = new Array(maxWeekNum + 1)
    .fill(null)
    .map(() => []);

  for (const course of arr) {
    ans[course.week - 1].push(course);
  }

  return ans;
};

/**一天的课程 */
export type TDayCourse = {
  /**一天内不冲突的课程 */
  list: IAppCourse[];
  /**冲突的课程 */
  conflict: IConflictCourse[];
};

/**一周七天的课程 */
export type TWeekCourse = [
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
export type TOrganizedCourse = Array<TWeekCourse | null | undefined>;

/**使用桶排序将课程按天放到数组内，参数arr[i]表示第i+1周的所有课程 */
export const organizeCourse = (arr: IAppCourse[][]): TOrganizedCourse => {
  const result: TOrganizedCourse = new Array(arr.length);
  for (const disorderWeek of arr) {
    const orderedWeek: TWeekCourse = [] as any;
    if (!disorderWeek || disorderWeek.length < 1) {
      continue;
    }

    // 使用桶排序思路将一周的课放到对应的day上
    for (let j = 0; j < disorderWeek.length; j++) {
      const curCourse = disorderWeek[j];
      const curDayNum = curCourse.day;

      //如果该周当天的课程为空则放置一个空的
      if (!orderedWeek[curDayNum]) {
        orderedWeek[curDayNum] = {
          conflict: [],
          list: [],
        };
      }

      //将当前课程加到本周对应的那一天
      (orderedWeek[curDayNum] as TDayCourse).list.push(curCourse);
    }
    // 计算该周每天的课程的冲突情况
    for (const dayCourse of orderedWeek) {
      if (dayCourse) {
        [dayCourse.list, dayCourse.conflict] = getDayCourseConflict(
          dayCourse.list
        );
      }
    }
    result[disorderWeek[0].week] = orderedWeek;
  }
  return result;
};

/**获得课程的唯一key，不同课程不一样 */
const getUniqueKey = (c: IAppCourse) => {
  if (c.code) {
    return c.code + c.week + c.day + c.begin;
  }
  return `${c.week}:${c.day}:${c.teacher}:${c.begin}:${c.over}`;
};

/**去除相同的课程 */
const filterDuplication = (arr: IAppCourse[]) => {
  const set = new Set<string>(),
    result: IAppCourse[] = [];
  for (const c of arr) {
    c.name = c.name.trim();
    c.teacher = c.teacher.trim();
    c.place = c.place.trim();
    const unique = getUniqueKey(c);
    if (set.has(unique)) {
      console.warn("存在相同课程：", c);
      continue;
    } else {
      set.add(unique);
      result.push(c);
    }
  }
  return result;
};

/**给课程添加背景颜色 */
const giveBackgroundColor = (arr: IAppCourse[]): IAppCourse[] => {
  const colorArr = [
    "#ff461f",
    "#70f3ff",
    "#a88462",
    "#ff2d51",
    "#44cef6",
    "#896c39",
    "#f36838",
    "#3eede7",
    "#827100",
    "#1685a9",
    "#177cb0",
    "#ffb3a7",
    "#4b5cc4",
    "#a1afc9",
    "#c93756",
    "#ffc773",
    "#16a951",
    "#426666",
    "#21a675",
    "#425066",
    "#8d4bbb",
    "#815463",
    "#ff4c00",
    "#eedeb0",
    "#d3b17d",
    "#bacac6",
    "#a78e44",
    "#6b6882",
    "#ae7000",
    "#a98175",
    "#cb3a56",
    "#4c8dae",
    "#b0a4e3",
    "#7fecad",
    "#b35c44",
    "#c32136",
    "#549688",
    "#789262",
    "#bf242a",
    "#afdd22",
  ];
  let curIndex = 0;
  const map = new Map<string, string>();
  for (let c of arr) {
    const unique = c.code + c.name + c.teacher,
      color = map.get(unique);
    if (color) {
      c.color = colorArr[curIndex];
    } else {
      c.color = colorArr[curIndex++];
      map.set(unique, c.color);
      if (curIndex >= colorArr.length) {
        curIndex = 0;
        console.info("课程数量超出已提供的颜色数量");
      }
    }
  }
  return arr;
};

/**整理从服务端拿到的课程 */
export const putCourseInOrder = (arr: ICommonCourse[], currentWeek: number) => {
  const flattedCourse = flatCourse(arr);
  const correctCourse = fixCourseArr(flattedCourse, currentWeek);
  const noDuplication = filterDuplication(correctCourse);
  const colorGivenCourse = giveBackgroundColor(noDuplication);
  const weekCourse = covertToWeek(colorGivenCourse);
  return organizeCourse(weekCourse);
};

/**从本地储存获取学期时间，计算当前周数 */
export const getTermInfoFromLocal = () => {
  return timetable.getTermInfo().then(v => {
    if (v.begin >= v.over) {
      throw new Error("学期开始时间应该小于学期结束时间");
    }
    const begin = new Date(v.begin),
      over = new Date(v.over);
    return {
      begin,
      over,
      termName: v.termName,
      curWeek: Math.floor((Date.now() - v.begin) / 1000 / 60 / 60 / 24 / 7),
    };
  });
};

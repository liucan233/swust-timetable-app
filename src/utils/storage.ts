import { ICommonCourse } from "@src/api/timetable";

/**读取uni storage方法promise化 */
const getStorage = (key: string | number) => {
  return new Promise((resolve, reject) => {
    uni.getStorage({
      key: String(key),
      success: (res: any) => {
        if (res.data) {
          resolve(res.data);
        } else {
          reject(new TypeError("本地储存中该值为假值"));
        }
      },
      fail: reject,
    });
  });
};

/**设置uni storage方法promise化 */
const setStorage = (key: string | number, data: unknown) => {
  return new Promise((resolve, reject) => {
    uni.setStorage({
      data,
      key: String(key),
      success: resolve,
      fail: reject,
    });
  });
};

export const valueIsFalsy = (err: unknown) => {
  if (!err) {
    return false;
  }
  if (
    (err as any).message === "本地储存中该值为假值" ||
    /not found/.test((err as any).errMsg ?? "")
  ) {
    return true;
  }
  return false;
};

export const showGetStorageErrModal = () => {
  uni.showModal({
    title: "读取数据失败",
    showCancel: false,
    content:
      "从设备储存中读取由本App写入的数据时发生错误，请确保本App有储存权限或者反馈此问题。",
  });
};

export const showSetStorageErrModal = () => {
  uni.showModal({
    title: "写入数据失败",
    showCancel: false,
    content:
      "向设备写入本App运行时产生的一些数据时发生错误，请确保本App有储存权限或者反馈此问题。",
  });
};

/**用于储存的key，新增只能在末尾加，否则key出错 */
enum Key {
  CAS_COOKIE,
  RAW_TIMETABLE,
  LAB_COOKIE,
  JW_COOKIE,
  TERM_INFO,
  SWUST_ACCOUNT,
  EXAM_LIST,
  FIRST_LAUNCH,
}

/**登陆凭证相关 */
let casCookie: string | undefined;
/**设置http://cas.swust.edu.cn/authserver/login登陆成功的cookie */
const setCasCookie = (cookie: string): Promise<unknown> => {
  casCookie = cookie;
  return setStorage(Key.CAS_COOKIE, cookie);
};

/**读取http://cas.swust.edu.cn/authserver/login登陆的cookie */
const getCasCookie = (): Promise<string> => {
  if (casCookie) {
    return Promise.resolve(casCookie);
  }
  return getStorage(Key.CAS_COOKIE).then(res => {
    casCookie = res as string;
    return casCookie;
  });
};

let labCookie: string | undefined;
/**设置实验选课系统登陆成功的cookie */
const setLabCookie = (cookie: string): Promise<unknown> => {
  labCookie = cookie;
  return setStorage(Key.LAB_COOKIE, cookie);
};

/**读取实验选课系统登陆的cookie */
const getLabCookie = (): Promise<string> => {
  if (labCookie) {
    return Promise.resolve(labCookie);
  }
  return getStorage(Key.LAB_COOKIE).then(res => {
    labCookie = res as string;
    return labCookie;
  });
};

// let jwCookie: string | undefined;
/**设置教务系统系统登陆成功的cookie */
// const setJwCookie = (cookie: string): Promise<unknown> => {
//   jwCookie = cookie;
//   return setStorage(Key.JW_COOKIE, cookie);
// };

/**读取教务系统登陆的cookie */
// const getJwCookie = (): Promise<string> => {
//   if (jwCookie) {
//     return Promise.resolve(jwCookie);
//   }
//   return getStorage(Key.JW_COOKIE).then(res => {
//     jwCookie = res as string;
//     return jwCookie;
//   });
// };

/**课表相关 */
let rawTimetable: ICommonCourse[] | null = null;
/**储存服务端返回的课表 */
const setTimetable = (arr: ICommonCourse[]): Promise<unknown> => {
  rawTimetable = arr;
  return setStorage(Key.RAW_TIMETABLE, arr);
};

/**读取储存中的课表 */
const getTimetable = (): Promise<ICommonCourse[]> => {
  if (rawTimetable) {
    return Promise.resolve(rawTimetable);
  }
  return getStorage(Key.RAW_TIMETABLE).then(res => {
    rawTimetable = res as ICommonCourse[];
    return rawTimetable;
  });
};

type TTermInfo = { begin: number; over: number; termName: string };
let termInfo: TTermInfo | null = null;
/**储存服务端返回的课表 */
const setTermInfo = (info: TTermInfo): Promise<unknown> => {
  termInfo = info;
  return setStorage(Key.TERM_INFO, info);
};

/**读取储存中的课表 */
const getTermInfo = (): Promise<TTermInfo> => {
  if (termInfo) {
    return Promise.resolve(termInfo);
  }
  return getStorage(Key.TERM_INFO).then(res => {
    termInfo = res as TTermInfo;
    return termInfo;
  });
};

export type TSwustAccount = {
  user: string;
  password: string;
};

const setSwustAccount = (account: TSwustAccount) => {
  return setStorage(Key.SWUST_ACCOUNT, account);
};

const getSwustAccount = (): Promise<TSwustAccount> => {
  return getStorage(Key.SWUST_ACCOUNT) as Promise<TSwustAccount>;
};
/**判断是否是首次启动 */
const getIsFirstLaunch = () => {
  return getStorage(Key.FIRST_LAUNCH);
};

export type TExamItem = {
  /**考试名 */
  name: string;
  // 考试周数
  week: string;
  // 考试天数 第一周五讲
  day: string;
  // 考试日期
  date: string;
  // 考试时间
  time: string;
  // 考试地点
  place: string;
  // 考试座位号
  seat: string;
  // 类型吧 不是很清楚
  type: number;
};
/**存储存储的考试信息 */
const setExamList = (examList: TExamItem[]) => {
  return setStorage(Key.EXAM_LIST, examList);
};
/**获取存储的考试信息 */
const getExamList = (): Promise<TExamItem[]> => {
  return getStorage(Key.EXAM_LIST) as Promise<TExamItem[]>;
};

/**首次启动标志设为false */
const setNoFirstLaunch = () => {
  return setStorage(Key.FIRST_LAUNCH, "no");
};

export const credentials = {
  setCasCookie,
  setLabCookie,
  getCasCookie,
  getLabCookie,
};

export const timetable = {
  setTermInfo,
  setTimetable,
  getTermInfo,
  getTimetable,
};

export const account = {
  setSwustAccount,
  getSwustAccount,
};
export const appCommon = {
  getIsFirstLaunch,
  setNoFirstLaunch,
};

export const examInfo = {
  setExamList,
  getExamList,
};
export const clearStorage = () => {
  setCasCookie("");
  setLabCookie("");
  setNoFirstLaunch();
  setSwustAccount({ user: "", password: "" });
};

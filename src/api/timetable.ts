import { network } from ".";

/**抓取课程API返回类型 */
export interface ICommonCourse {
  code: string;
  name: string;
  teacher: string;
  place: string[];
  week: string[];
  section: string[];
  day: string[];
  tasks?: string[];
}

/**获取指定学期的实验课课表 */
export const getLabTimetable = (cookie: string) =>
  network.get<TBaseRes<{ courses: ICommonCourse[] }>>(
    "/api/timetable/labTimeTable?cookie=" + encodeURIComponent(cookie)
  );
/**获取指定学期的教务处课表 */
export const getCommonTimetable = (cookie: string) =>
  network.get<TBaseRes<{ courses: ICommonCourse[] }>>(
    "/api/timetable/commonTimeTable?cookie=" + encodeURIComponent(cookie)
  );

/**获取当前学期的周数等 */
export const getTermInfo = (cookie: string) =>
  network.get<TBaseRes<{ time: string; term: string; weeks: string }>>(
    "/api/timetable/time?cookie=" + encodeURIComponent(cookie)
  );

/**获取指定系统的ticket */
export const getTickets = (casCookie: string, targets: string[]) =>
  network.post<
    TBaseRes<{
      tickets: string[];
    }>
  >("/api/swust/ticket", { cookie: casCookie, targets });

/**使用ticket获取指定系统的cookie */
export const getTargetCookie = (ticket: string) =>
  network.get<TBaseRes<{ cookie: string }>>(
    "/api/timetable/cookie?ticket=" + encodeURIComponent(ticket)
  );

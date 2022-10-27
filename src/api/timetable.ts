import {BACKEND_PREFIX} from '../config'

/**抓取课程API返回类型 */
export interface ICommonCourse {
    code: string;
    name: string;
    teacher: string;
    place: string[];
    week: string[];
    section: string[];
    day:string[]
    tasks?: string[];
  }

/**获取指定学期的课表 */
export const getTimetable=()=>{
	
}

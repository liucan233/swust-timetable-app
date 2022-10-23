interface ICommonCourse {
  code: string;
  name: string;
  teacher: string;
  place: string[];
  week: string[];
  section: string[];
  day:string[]
  tasks?: string[];
}

interface IAppCourse {
  code: string;
  name: string;
  teacher: string;
  place: string;
  week: number;
  begin: number;
  over: number;
  task: string;
  day:number
}

/**解析被-分隔的两个数字 */
const parseNumbers = (s: string): number[] | null => {
  const result = s.match(/\d+/g);
  if (result?.length === 2) {
    return result.map(n => Number(n));
  }
  return null;
};

/**后端返回的课表数据flat */
export const flatCourse = (arr: ICommonCourse[]) => {
  const res: IAppCourse[] = [];
  for (let i = 0; i < arr.length; i++) {
    const c = arr[i];
    for (let j = 0; j < c.week.length; j++) {
      const w = c.week[j],
        p = c.place[j],
        s = c.section[j],
        d=Number(c.day[j]),
        t = c.tasks ? c.tasks[j] : "",
        parsedSection = parseNumbers(s);
      if (parsedSection?.length !== 2) {
        console.warn("解析课程节次出错:");
        console.warn(c);
        continue;
      }
      if(Number.isNaN(d)){
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
              day: d
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
          day:d
        });
      }
    }
  }
  return res;
};

/**验证课表数据类型 */
export const fixCourseArr = (arr: IAppCourse[],currentWeek:number) => {
    const ans:IAppCourse[]=[],
    set=new Set<string>()
  for (const c of arr) {
    let fatalErrOccurred=false,name=c.name;
    if (typeof c.name !== "string") {
        c.name='课程名类型不正确'
    }
    if (typeof c.over !== "number") {
        c.over=10
        fatalErrOccurred=true;
    }
    if (typeof c.place !== "string") {
        c.place='上课地点类型不正确'
        fatalErrOccurred=true;
    }
    if (typeof c.teacher !== "string") {
        c.teacher='教师名字类型不正确'
    }

    if (typeof c.begin !== "number") {
        c.begin=9
        fatalErrOccurred=true;
    }
    if (typeof c.code !== "string") {
        c.code='课程号类型不正确'
    }
    if (typeof c.week !== "number") {
        c.week=currentWeek;
        fatalErrOccurred=true;
    }
    if(fatalErrOccurred){
        if(!set.has(name)){
            ans.push(c);
            console.warn('课程存在致命数据类型错误:')
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
    const ans:IAppCourse[][]=[]
    arr.sort((a,b)=>a.week<=b.week?-1:1);
    for(let i=0;i<arr.length;i++){
        let curWeekArr:IAppCourse[]=[arr[i]],week=arr[i].week;
        for(let j=i+1;j<arr.length;j++){
            if(arr[j].week===week){
                curWeekArr.push(arr[j]);
            } else {
                i=j-1;
                break;
            }
            i=j;
        }
        ans.push(curWeekArr)
    }
    return ans
};

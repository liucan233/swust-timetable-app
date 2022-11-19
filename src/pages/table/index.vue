<template>
  <view class="table-header">
    <text class="table-time">{{ $termInfo.termName }}</text>
    <text class="table-time"
      >第 {{ $termInfo.viewWeekNum }} / {{ $termInfo.weekNum }} 周</text
    >
    <button class="table-add">添加课程</button>
  </view>
  <view class="table-main">
    <Timetable
      class-name="timetable"
      :course="$courseData"
      :week-num="getAndCorrectCurWeek()"
      :calendar-arr="dayInfoArr"
      @week-change="handleWeekChange"
    />
    <image
      :src="refreshImg"
      class="refresh-btn"
      @click="handleRefresh"
      :data-refreshing="$refreshing"
    />
  </view>
  <Toast />
</template>

<script setup lang="ts">
/**
 * 课表页面，主要实现思路如下：
 * 1. 组件挂载完成先加载本地储存中的课表和学期信息；
 * 2. 显示下拉刷新，此时从本地储存读取实验系统cookie从服务器获取课表和学期；
 * 3. 实验系统cookie读取失败尝试用CAS cookie获取实验系统cookie；
 * 4. 若CAS cookie不存在则表示用户未登录，重定向到登陆页面。
 */
import Timetable from "@src/components/MainTimetable.vue";
import {
  getDateFromWeek,
  showUnknownErrModal,
  showErrModal,
  IDayInfo,
  getDaysInfo,
} from "@utils/common";
import { onMounted, ref, shallowRef, computed } from "vue";
import {
  getTermInfoFromLocal,
  putCourseInOrder,
  TOrganizedCourse,
} from "@utils/timetable";
import { credentials, timetable, valueIsFalsy } from "@utils/storage";
import {
  getLabTimetable,
  getCommonTimetable,
  ICommonCourse,
  getTermInfo,
  getTargetCookie,
  getTickets,
  ITermInfo,
} from "@api/timetable";
import Toast from "@src/components/Toast.vue";
import refreshImg from "@static/image/refresh.png";
import { info, success } from "@src/lib/toast";

/**学期信息 */
const $termInfo = ref({
  weekNum: 3,
  termName: "2022-2023",
  beginTime: new Date("2022/9/1"),
  overTime: new Date("2022/10/1"),
  viewWeekNum: 1,
});

/**一个学期的课程 */
const $courseData = shallowRef<TOrganizedCourse>([null, null, null]);

/**是否正在刷新课表 */
const $refreshing = shallowRef(false);

/**课表表头的日历信息 */
const dayInfoArr = computed<IDayInfo[][]>(() => {
  if (!$courseData.value.length) {
    return [];
  }
  const dayArr = getDaysInfo(
      $termInfo.value.beginTime,
      $termInfo.value.overTime
    ),
    result: IDayInfo[][] = [];
  let dayStart = 0,
    dayEnd = 7;
  for (let i = 0; i < $courseData.value.length; i++) {
    result.push(dayArr.slice(dayStart, dayEnd));
    dayStart = dayEnd;
    dayEnd += 7;
  }
  console.log(dayArr);
  return result;
});

/**重定向到登陆页面 */
const redirectToLogin = () => {
  uni.redirectTo({
    url: "/pages/login/index",
  });
};

/**获取实验课和教务系统的课表更新组件并写入本地储存 */
const updateCourse = async (labCookie: string, termInfo: ITermInfo) => {
  const [labCourse, jwCourse] = await Promise.all([
    getLabTimetable(labCookie),
    getCommonTimetable(labCookie),
  ]);
  let courseArr: ICommonCourse[] = [];
  let errMessage = "";

  if (labCourse) {
    courseArr = labCourse.data.courses;
  } else {
    errMessage = "从学校系统获取实验课发生错误";
  }
  if (jwCourse) {
    courseArr = jwCourse.data.courses.concat(courseArr);
  } else if (errMessage) {
    errMessage += "从学校系统获取教务处课程和实验课发生错误";
  } else {
    errMessage = "从学校系统获取教务处课程发生错误";
  }

  if (errMessage) {
    showErrModal("刷新课表失败", errMessage);
    const localTimetable = await timetable.getTimetable();
    courseArr = courseArr.concat(localTimetable);
  } else {
    // 新课表写入本地储存
    timetable.setTimetable(courseArr);
  }
  // 整理当前课表
  const curWeekNum = Number(termInfo.weeks) || 1;
  $courseData.value = putCourseInOrder(courseArr, curWeekNum);

  // 更新周数信息
  $termInfo.value.overTime = getDateFromWeek(
    curWeekNum - $courseData.value.length
  );
  $termInfo.value.beginTime = getDateFromWeek(curWeekNum);
  $termInfo.value.weekNum = $courseData.value.length - 1;
  $termInfo.value.viewWeekNum = curWeekNum;

  // 将学期信息写入储存
  timetable.setTermInfo({
    begin: $termInfo.value.beginTime.valueOf(),
    over: $termInfo.value.overTime.valueOf(),
    termName: $termInfo.value.termName,
  });
};

/**更新学期和当前周数 */
const updateTerm = async (labCookie: string) => {
  const termInfo = await getTermInfo(labCookie);
  if (termInfo) {
    return termInfo;
  } else {
    throw new Error("从学校系统获取学期信息失败");
  }
};

const handleWeekChange = (w: number) => {
  $termInfo.value.viewWeekNum = w;
};

const getAndCorrectCurWeek = () => {
  if ($termInfo.value.viewWeekNum >= $termInfo.value.weekNum) {
    uni.showModal({
      title: `当前是第${$termInfo.value.viewWeekNum}周`,
      content: `本学期${$courseData.value.length}周起你就没课咯。`,
      showCancel: false,
    });
    $termInfo.value.viewWeekNum = $termInfo.value.weekNum;
  }
  return $termInfo.value.viewWeekNum;
};

/**读取CAS系统cookie */
const readCASCookie = async (): Promise<string> => {
  let cookie = "";
  try {
    cookie = await credentials.getCasCookie();
  } catch (error) {
    // 如果不是假值捕但获到错误，说明发生了未知错误
    if (valueIsFalsy(error)) {
      // 空值说明未登录
      throw new Error("未登录，请先登录");
    } else {
      // 如果不是假值捕但获到错误，说明发生了未知错误
      showUnknownErrModal();
      throw new Error("获取CAS页面cookie失败");
    }
  }
  return cookie;
};

/**使用cas页面cookie拿ticket再获取实验系统cookie，结果存入本地储存 */
const updateLabCookie = async () => {
  const casCookie = await readCASCookie();
  let labTicket = "",
    labCookie = "";
  const ticketResult = await getTickets(casCookie, [
    "http://202.115.175.175/swust/",
  ]);
  if (ticketResult && ticketResult.data.tickets.length === 1) {
    labTicket = ticketResult.data.tickets[0];
  } else {
    throw new Error("从学校系统获取实验系统ticket失败");
  }
  const cookieResult = await getTargetCookie(labTicket);
  if (cookieResult) {
    labCookie = cookieResult.data.cookie;
  } else {
    throw new Error("使用ticket获取实验系统cookie失败");
  }
  credentials.setLabCookie(labCookie);
  return labCookie;
};

/**读取实验系统cookie */
const readLabCookie = async (): Promise<string> => {
  let cookie = "";
  try {
    cookie = await credentials.getLabCookie();
  } catch (error) {
    if (valueIsFalsy(error)) {
      // 空值，需要拿到ticket获取下
      cookie = await updateLabCookie();
    } else {
      // 如果不是假值捕但获到错误，说明发生了未知错误
      throw new Error("从本地储存获取实验系统cookie失败");
    }
  }
  return cookie;
};

/**从服务器更新课表和学期数据 */
const updateTimetableFromServer = async () => {
  let labCookie = "";
  // 尝试获取实验系统cookie
  try {
    labCookie = await readLabCookie();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "未登录，请先登录") {
        return redirectToLogin();
      } else {
        showErrModal("访问学校实验系统出错", error.message);
      }
    } else {
      showUnknownErrModal();
    }
    throw error;
  }

  // 尝试获取学期信息和课程信息
  try {
    const termInfo = await updateTerm(labCookie);
    await updateCourse(labCookie, termInfo.data);
  } catch (error) {
    if (error instanceof Error) {
      showErrModal("从学校系统获取课程出错", error.message);
    } else {
      showUnknownErrModal();
    }
    throw error;
  }
};

/**从本地储存获取初始化课表 */
const updateTimetableFromLocal = async () => {
  const termInfo = await getTermInfoFromLocal();
  const courseArr = await timetable.getTimetable();
  $courseData.value = putCourseInOrder(courseArr, $termInfo.value.weekNum);
  $termInfo.value.beginTime = termInfo.begin;
  $termInfo.value.overTime = termInfo.over;
  $termInfo.value.weekNum = $courseData.value.length - 1;
  $termInfo.value.viewWeekNum = termInfo.curWeek;
  $termInfo.value.termName = termInfo.termName;
};

const handleRefresh = () => {
  if ($refreshing.value === false) {
    $refreshing.value = true;
    info({
      title: "正在刷新课表",
      content: "正在从教务处和实验系统获取最新课表",
    });
    updateTimetableFromServer()
      .then(() => {
        success({
          title: "更新课表成功",
          content: "已从教务处和实验系统获取最新课表",
        });
      })
      .finally(() => {
        $refreshing.value = false;
      });
  }
};

onMounted(() => {
  updateTimetableFromLocal().catch(handleRefresh);
});
</script>

<style scoped>
.table-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: var(--status-bar-height) 16px 10px;
  font-size: 18px;
  touch-action: none;
}

.table-time {
  font-size: 18px;
}

.table-add {
  border: none;
  outline: none;
  margin: 0;
  line-height: 1;
  padding: 0;
  background: none;
}
.table-add::after {
  display: none;
  content: none;
}
/*  #ifndef  APP-PLUS  */
.table-main {
  width: 100%;
  position: relative;
  box-sizing: border-box;
  height: calc(100vh - 45px - var(--status-bar-height) - var(--tab-bar-height));
}
/*  #endif  */

/*  #ifdef  APP-PLUS  */
.table-main {
  position: relative;
  width: 100%;
  padding: 0 6px;
  box-sizing: border-box;
  height: calc(100vh - 45px - var(--status-bar-height));
}
/*  #endif  */
.refresh-btn {
  position: absolute;
  right: 30px;
  bottom: 20px;
  width: 42px;
  height: 42px;
  animation: refreshing 1.2s linear infinite;
  animation-play-state: paused;
}
@keyframes refreshing {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
.refresh-btn[data-refreshing="true"] {
  animation-play-state: running;
}
</style>

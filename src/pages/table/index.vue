<template>
  <view class="table-header">
    <text class="table-time">{{ $termInfo.termName }}</text>
    <text class="table-time"
      >第 {{ $termInfo.viewWeekNum }} / {{ $courseData.length - 1 }} 周</text
    >
    <button class="table-add">添加课程</button>
  </view>
  <scroll-view class="table-preview" scroll-x>
    <CoursePreview v-for="(week, index) in $courseData" :key="index" />
  </scroll-view>
  <view class="table-main">
    <Timetable
      class-name="timetable"
      :start-time="$termInfo.beginTime"
      :end-time="$termInfo.overTime"
      :course="$courseData"
      :week-num="$termInfo.weekNum"
      @week-change="handleWeekChange"
    />
  </view>
</template>

<script setup lang="ts">
/**
 * 课表页面，主要实现思路如下：
 * 1. 组件挂载完成先加载本地储存中的课表和学期信息；
 * 2. 显示下拉刷新，此时从本地储存读取实验系统cookie从服务器获取课表和学期；
 * 3. 实验系统cookie读取失败尝试用CAS cookie获取实验系统cookie；
 * 4. 若CAS cookie不存在则表示用户未登录，重定向到登陆页面。
 */
import Timetable from "@src/components/Timetable.vue";
import CoursePreview from "@components/CoursePreview.vue";
import {
  getDateFromWeek,
  showUnknownErrModal,
  showErrModal,
} from "@utils/common";
import { onMounted, ref, shallowRef, watch } from "vue";
import { onPullDownRefresh } from "@dcloudio/uni-app";
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
} from "@api/timetable";

/**学期信息 */
const $termInfo = ref({
  weekNum: 1,
  termName: "",
  beginTime: new Date("2022/9/1"),
  overTime: new Date("2023/1/1"),
  viewWeekNum: 0,
});

/**一个学期的课程 */
const $courseData = shallowRef<TOrganizedCourse>([]);

/**重定向到登陆页面 */
const redirectToLogin = () => {
  uni.redirectTo({
    url: "/pages/login/index",
  });
};

/**获取实验课和教务系统的课表更新组件并写入本地储存 */
const updateCourse = async (labCookie: string) => {
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
  }

  // 将课表写入本地储存
  timetable.setTimetable(courseArr);

  // 更新课表和当前周数
  const curWeekNum = $termInfo.value.weekNum;
  $courseData.value = putCourseInOrder(courseArr, $termInfo.value.weekNum);
  $termInfo.value.beginTime = getDateFromWeek(-curWeekNum);
  $termInfo.value.overTime = getDateFromWeek(
    $courseData.value.length - curWeekNum
  );

  // 将学期信息写入本地储存
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
    const curWeekNum = Number(termInfo.data.weeks);
    $termInfo.value.weekNum = curWeekNum;
    $termInfo.value.viewWeekNum = curWeekNum;
    $termInfo.value.termName = termInfo.data.time;
  } else {
    throw new Error("从学校系统获取学期信息失败");
  }
};

const handleWeekChange = (w: number) => {
  $termInfo.value.viewWeekNum = w;
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
      showUnknownErrModal();
      throw new Error("从学校系统获取实验系统cookie失败");
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
        redirectToLogin();
        return;
      } else {
        showErrModal("尝试登陆实验系统出错", error.message);
      }
    } else {
      showUnknownErrModal();
    }
  }

  // 尝试获取学期信息和课程信息
  try {
    await updateTerm(labCookie);
    await updateCourse(labCookie);
  } catch (error) {
    if (error instanceof Error) {
      showErrModal("从学校系统获取课程出错", error.message);
    } else {
      showUnknownErrModal();
    }
  }
};

/**从本地储存获取初始化课表 */
const updateTimetableFromLocal = async () => {
  const termInfo = await getTermInfoFromLocal();
  const courseArr = await timetable.getTimetable();
  $termInfo.value.beginTime = termInfo.begin;
  $termInfo.value.overTime = termInfo.over;
  $termInfo.value.weekNum = termInfo.curWeek;
  $termInfo.value.viewWeekNum = termInfo.curWeek;
  $termInfo.value.termName = termInfo.termName;
  $courseData.value = putCourseInOrder(courseArr, $termInfo.value.weekNum);
};

onMounted(() => {
  updateTimetableFromLocal().finally(() => {
    uni.startPullDownRefresh({});
  });
});


onPullDownRefresh(() => {
  updateTimetableFromServer().finally(() => {
    uni.stopPullDownRefresh();
  });
});
</script>

<style scoped>
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-time {
  font-size: 20px;
}

.table-add {
  border: none;
  outline: none;
  margin: 0;
}

.table-preview {
  width: 100%;
  white-space: nowrap;
  touch-action: pan-x;
}

.table-add::after {
  content: none;
}

.table-main {
  width: 100%;
  height: calc(100vh - 170px);
}
</style>

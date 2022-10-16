<template>
  <scroll-view :class="'wrap'" scroll-x>
		<view class="scroll-table">
			<view class="data-list">
				<view v-for="date in schoolDays" class="date-item">
					<view><text>{{date.day}}</text></view>
				</view>
			</view>
			<view class="course-list-wrap">
				<scroll-view class="course-list" scroll-y>
					<view v-for="(course,index) in schoolDays" class="course-item" :key="index">
						<text>课程</text>
					</view>
				</scroll-view>
			</view>
		</view>
	</scroll-view>
</template>
<script lang="ts" setup>
/**
 * 课表组件，分为单列视图和三列、周视图
 * 主要实现思路是一个scroll-view里面嵌套：
 *  1. 一个横向（左右）滚动的日期轴；
 *  2. 一个竖直（上下）滚动的小时刻度轴；
 *  3. 用户手指移动时判断运动方向（水平or竖直），事件穿透给对应滚动内容
 */
// import { shallowRef } from "vue";
import {getDaysInfo} from '@/utils/common'

const props = defineProps<{
  className: string;
  startTime: Date
  endTime: Date
}>();

/**同一平面显示的日期数 */
// const $columns = shallowRef<UniApp.SelectorQuery | null>(null);

// onMounted(() => {});
// onUpdated(() => {});

const schoolDays=getDaysInfo(props.startTime,props.endTime);
</script>

<style scoped>
.wrap {
  width: calc(100% - 40px);
  height: 100%;
	touch-action: pan-x;
	white-space: nowrap;
	overscroll-behavior: contain;
}
.hour-line {
}
.date-list,.course-list{
	white-space: nowrap;
}
.date-item,.course-item{
	display: inline-block;
	width: 80px;
}
.course-list{
	width: 100%;
	height: 100%;
}
.course-list-wrap{
	display: block;
	height: 30vh;
	width: v-bind("schoolDays.length*80+'px'");
}
.course-item{
	width: 80px;
	height: 50vh;
	background-color: antiquewhite;
}
</style>

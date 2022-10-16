<template>
	<view class="table-header">
		<text class="table-time">大三下 第 3 周</text>
		<text class="table-time">2022年 10月</text>
		<button class="table-add">添加课程</button>
	</view>
	<view class="table-preview">

	</view>
	<view class="table-main">
		<Timetable class-name="timetable" :start-time="new Date('2019/9/1')" :end-time="new Date('2020/6/1')" />
	</view>
</template>

<script setup lang="ts">
	import Timetable from "@components/Timetable";
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
		height: 100px;
		width: 100%;
	}

	.table-add::after {
		content: none;
	}
	
	.table-main{
		width: 100%;
		height: 70vh;
	}

	.timetable {
		height: 70vh;
		width: 100%;
	}
</style>

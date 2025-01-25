<template>
	<view class="container content">
		<view class="header">
			<u-search placeholder="请输入关键词，如名称，打卡内容等" v-model="keyword" :inputStyle="inputStyle"></u-search>
		</view>
		<view class="select">
			<uni-data-select
				v-model="value"
				:localdata="range"
				@change="change"
				:clear="false"
				emptyTips="暂无数据"
				placeholder="任务选择"
			></uni-data-select>
		<uni-data-select
				v-model="value"
				:localdata="range2"
				@change="change"
				:clear="false"
				emptyTips="暂无数据"
				placeholder="任务选择"
			></uni-data-select>
		</view>
		<u-list width="90vw">
      <u-list-item v-for="(item, index) in list" :key="index">
        <post class="item"></post>
      </u-list-item>
    </u-list>
	</view>
</template>

<script>
import post from '../../component/square/post.vue'
	export default {
		components:{
			post
		},
		data() {
			return {
				value: 1,
				range: [
					{ value: 0, text: "篮球" },
					{ value: 1, text: "足球" },
					{ value: 2, text: "游泳" },
      ],
			range2: [
					{ value: 0, text: "升序" },
					{ value: 1, text: "降序" },
      ],
				bgImg:"/static/square/checkIn2.png",
				inputStyle:{
					width: "500rpx",
				},
				keyword:"",
				list:[
						{
							title:"我是自律博主",
							content:"这是一个自律帖子",
							user:"王源",
							number:111
						},
						{
							title:"我是自律博主",
							content:"这是一个自律帖子",
							user:"王源",
							number:111
						},
						{
							title:"我是自律博主",
							content:"这是一个自律帖子",
							user:"王源",
							number:111
						},
						{
							title:"我是自律博主",
							content:"这是一个自律帖子",
							user:"王源",
							number:111
						},
						{
							title:"我是自律博主",
							content:"这是一个自律帖子",
							user:"王源",
							number:111
						},
						{
							title:"我是自律博主",
							content:"这是一个自律帖子",
							user:"王源",
							number:111
						},
					]
				}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		background-color: #fffffff5;

		.header{
			margin-top:20rpx;
		}

		.select{
			width:100vw;
			margin-top:40rpx;
			display: flex;
			flex-direction: row;
			justify-content: space-around;
			align-items: center;

			/deep/.uni-select{
				width: 40vw;
				border-radius: 50rpx;

				.uni-select__input-text {
					color: #000;
					text-align: center;
					font-size: 36rpx;
					font-weight: 500;
				}
			}
		}

		.check-img{
			width: 200rpx;
			height: 200rpx;
			position:absolute;
			right:10rpx;
			bottom: 20rpx;
			background-color: inherit;
		}
	}
	.item{
		min-height: 300rpx;
	}
</style>
<template>
	<view class="container content">
		<view>
			<u-search placeholder="请输入关键词，如名称，打卡内容等" v-model="keyword" :inputStyle="inputStyle"></u-search>
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
				bgImg:"/static/square/checkIn2.png",
				inputStyle:{
					width: "500rpx"
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
		justify-content: center;
		background-color: #fffffff5;

		
		.header{
			font-size: 40rpx;
			font-size: "宋体";
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
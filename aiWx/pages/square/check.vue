<template>
	<view class="container content">
    <text class="header" selectable="false">打卡</text>
		<image :src="bgImg" class="check-img" @tap="navigaTo"></image>
	</view>
</template>

<script>
import waterfall from '../../component/square/waterfall.vue';
	export default {
		components:{
			waterfall
		},
		data() {
			return {
				bgImg:"/static/square/checkIn2.png",
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
		background-color: #fff1d0a1;

		
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

</style>
<template>
	<view class="list">
		<uni-list>
			<uni-list-item  title="个人信息" clickable link @click="handleUserInfo" class="item"></uni-list-item>
			<uni-list-item  title="记录与收藏" clickable link @click="handleRecord" class="item"></uni-list-item>
			<uni-list-item  title="我的贴子" clickable link @click="handlePost" class="item"></uni-list-item>
			<uni-list-item  title="建议与反馈" clickable link @click="handleSuggestion" class="item"></uni-list-item>
			<uni-list-item  title="清除缓存" clickable  @click="handleClean" class="item"></uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {
			handleUserInfo(){
				console.log("点击个人信息");
				
			},
			handleRecord(){
				console.log("点击记录与收藏");
				
			},
			handlePost(){
				console.log('点击我的帖子');
				
			},
			handleSuggestion(){
				console.log('点击建议与反馈');
				
			},
			handleClean(){
				console.log('点击清除缓存');
				
			}

		}
	}
</script>

<style lang="scss" scoped>
.list{
	width: 80vw;
	margin:20rpx 50rpx 0 70rpx ;
	
	.item:not(:last-child){
		font-size:40rpx;
		font-weight: 900;
	}
	.item:last-child{
		font-size: 20rpx;
		font-weight: 400;
	}
}
</style>

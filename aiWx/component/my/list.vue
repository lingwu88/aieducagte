<template>
	<view class="list">
		<uni-list>
			<uni-list-item v-for="(item,index) in list"  :title="item.title" :key="index" clickable link @click="handleTo(item)" class="item"></uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[
					{
						title:"个人信息",
						url:"/pages/personal/info"
					},
					{
						title:"我的帖子",
						url:"/pages/personal/index"
					},
					{
						title:"记录与收藏",
						url:"/pages/personal/index"
					},
					{
						title:"建议与反馈",
						url:"/pages/personal/index"
					},
					{
						title:"清除缓存",
						url:"/pages/personal/index"
					}
				]
			}
		},
		onLoad() {

		},
		methods: {
			handleTo(item){
				console.log(`点击${item.title}`);
				if(item.url === "/pages/personal/index"){
					uni.showToast({
						title:"暂未开放此功能",
						icon:none
					})
				}
				uni.navigateTo({
					url:item.url
				})
			},

		}
	}
</script>

<style lang="scss" scoped>
.list{
	width: 80vw;
	margin:20rpx 50rpx 0 70rpx ;
	height: 700rpx;
	
	.item:not(:last-child){
		font-size:50rpx;
		font-weight: 900;
		// height: 100%;
		height: 150rpx;
		padding:auto 0;
	}
	.item:last-child{
		font-size: 20rpx;
		font-weight: 400;
	}
	.item{
			/deep/.uni-list-item {
			height: 100%;
		}
		/deep/.item--uni-list-item{
			height: 100%;
		}
	}

}

</style>

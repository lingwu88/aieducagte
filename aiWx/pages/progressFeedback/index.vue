<template>
	<view class="container content">
    <view class="item" v-for="(item,index) in list" :key="index">
				<image :src="item.img" alt="无法加载出图片" class="item-img" @click="navigateTo(item)"></image>
				<text class="item-description">{{item.description}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
					list:[
						{
							description: "学习进度",
							img: this.$request.baseUrl+"/classroom/learnResource/book.png",
							url: "/pages/progressFeedback/learningProgress"
						},
						{
							description: "学习情况",
							img: this.$request.baseUrl+"/classroom/learnResource/book.png",
							url: "/pages/progressFeedback/learningSituation"
						}
					]
				}
		},
		onLoad() {

		},
		methods: {
			navigateTo(item) {
      if (item.url) {  // 添加条件避免空URL报错
        uni.navigateTo({
          url: item.url
        });
      }
    }
		}
	}
</script>

<style lang="scss" scoped>
.content{
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
	min-height:100vh ;
	width: 100vw;
	.item {
		 width: 45vw;
		 max-height: 400rpx;
		 display: flex;
		 flex-direction: column;
		 align-items: center;
		 justify-content: center;

		 .item-img {
			 width: 350rpx;
		 }
		 .item-description {
			 font-size: 50rpx;
			 color: #333;
			 text-align: center;
		 }
	 }
}
</style>
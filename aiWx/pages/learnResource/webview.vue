<!-- version:1.0.0.1 -->
<template>
	<view class="webview-container">
		<web-view :src="url" class="webview"></web-view>
	</view>
</template>

<script>
	export default {
		onBackPress() {
			console.log('监听到返回事件');
			uni.navigateBack({
				delta: 1
			});
			// return true; // 拦截默认返回
		},
		data() {
			return {
				url: ''
			};
		},
		onLoad(options) {
			console.log('webview onLoad, options:', options);
			this.url = decodeURIComponent(options.url);
			console.log('f当前页面栈:', getCurrentPages());
		},
		onUnload() {
			console.log('webview onUnload_f, 当前页面栈:', getCurrentPages());
		},
		methods: {
			goBack() {
				console.log('f尝试返回, 当前页面栈:', getCurrentPages());
				uni.navigateBack({
					delta: 1
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.webview-container {
		height: 100vh;
		position: relative;
	}

	.webview {
		width: 100%;
		height: 100%;
	}

	.back-btn {
		position: fixed;
		bottom: 20rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 200rpx;
		background-color: #007aff;
		color: #fff;
		font-size: 32rpx;
		padding: 20rpx;
		border-radius: 10rpx;
		z-index: 999999;
		/* 确保在web-view之上 */
	}
</style>
<!-- version:1.0.0.1 -->
<template>
	<view class="webview-container">
		<web-view :src="url" class="webview" @error="handleWebviewError" @load="handleWebviewLoad"></web-view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			url: '',
			pageLoaded: false,
			pageError: false
		};
	},
	//传入函数
	onLoad(options) {
		console.log('webview onLoad, options:', options);
		this.url = decodeURIComponent(options.url);
		console.log('当前页面栈:', getCurrentPages());
		this.envTest();
	},

	onUnload() {
		console.log('webview onUnload, 当前页面栈:', getCurrentPages());
	},

	methods: {
		goBack() {
			console.log('尝试返回, 当前页面栈:', getCurrentPages());
			uni.navigateBack({
				delta: 1
			});
		},
		envTest() {
			setTimeout(() => {
				const eventChannel = this.getOpenerEventChannel();
				if (this.pageError) {
					this.returnStatus('Error');
				} else if (!this.pageLoaded) {
					this.returnStatus('Timeout');
				}
			}, 3000); // 3秒超时
		},
		returnStatus(status) {
			const eventChannel = this.getOpenerEventChannel();
			const pages = getCurrentPages();
			const currentPage = pages[pages.length - 1]; // 当前页面
			if (currentPage.options.url) {
				this.goBack();
				eventChannel.emit('returnData', { status: status });
			}
		},
		handleWebviewError(event) {
			this.pageError = true;
			const errMsg = event.detail.errMsg || '未知错误';
			let toastMsg = '页面加载失败，请检查网络或联系开发者';

			// 根据错误类型自定义提示（可选扩展）
			if (errMsg.includes('network')) {
				toastMsg = '网络连接失败，请检查网络设置';
			} else if (errMsg.includes('url')) {
				toastMsg = 'URL 无效，请联系开发者维护';
			}
		},
		handleWebviewLoad(event) {
			this.pageLoaded = true;
			console.log('web-view 加载成功:', event.detail);
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

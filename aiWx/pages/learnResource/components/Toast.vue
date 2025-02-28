<!-- 当前版本1.0.0.2 -->
<template>
	<view class="toast-container">
		<view
			v-for="toast in toastQueue"
			:key="toast.id"
			class="toast"
			:style="{
				top: toast.top + 'px',
				left: toast.left + 'px',
				opacity: toast.opacity
			}"
		>
			{{ toast.message }}
		</view>
	</view>
</template>

<script>
let toastId = 0;

export default {
	data() {
		return {
			toastQueue: [],
			systemInfo: uni.getSystemInfoSync() // 缓存系统信息
		};
	},
	methods: {
		show(message, heightPercent = 0.5, direction = 'up') {
			const newToast = {
				id: toastId++,
				message,
				...this.calcPosition(heightPercent),
				opacity: 1,
				direction: this.validateDirection(direction)
			};

			this.toastQueue.push(newToast);

			setTimeout(() => {
				this.animateDismiss(newToast);
				setTimeout(() => {
					this.toastQueue = this.toastQueue.filter((t) => t.id !== newToast.id);
				}, 500);
			}, 2000);
		},
		calcPosition(heightPercent) {
			const { windowHeight, windowWidth } = this.systemInfo;
			const toastHeight = 25;
			return {
				top: Math.max(windowHeight * (1 - heightPercent) - toastHeight / 2, 50),
				left: windowWidth / 2
			};
		},
		validateDirection(dir) {
			return ['left', 'right', 'up', 'down'].includes(dir) ? dir : 'up';
		},
		animateDismiss(toast) {
			const { windowWidth, windowHeight } = this.systemInfo;
			switch (toast.direction) {
				case 'left':
					toast.left = -windowWidth;
					break;
				case 'right':
					toast.left = windowWidth * 2;
					break;
				case 'up':
					toast.top -= 150;
					break;
				case 'down':
					toast.top = windowHeight + 150;
					break;
			}
			toast.opacity = 0;
		}
	}
};
</script>

<style lang="scss" scoped>
.toast-container {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	z-index: 9999;
	pointer-events: none;
}
.toast {
	position: absolute;
	transform: translateX(-50%);
	background-color: rgba(0, 0, 0, 0.8);
	color: #fff;
	padding: 20rpx 40rpx;
	border-radius: 10rpx;
	font-size: 28rpx;
	transition: all 0.5s ease;
	max-width: 80%;
	text-align: center;
}
.toast + .toast {
	margin-top: 120rpx; // 优化为 rpx 单位
}
</style>

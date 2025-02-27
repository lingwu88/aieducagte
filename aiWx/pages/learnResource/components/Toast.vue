<template>
	<!-- 根元素保持单一 -->
	<view class="toast-container">
		<!-- 在容器内部使用v-for -->
		<view v-for="toast in toastQueue" :key="toast.id" class="toast" :style="{ 
        top: toast.top + 'px', 
        left: toast.left + 'px', 
        opacity: toast.opacity 
      }">
			{{ toast.message }}
		</view>
	</view>
</template>

<script>
	let toastId = 0

	export default {
		data() {
			return {
				toastQueue: []
			}
		},
		methods: {
			show(message, heightPercent = 0.5, direction = 'up') {
				const systemInfo = uni.getSystemInfoSync()
				const newToast = {
					id: toastId++,
					message,
					...this.calcPosition(systemInfo, heightPercent),
					opacity: 1,
					direction: this.validateDirection(direction),
					timer: null
				}

				this.toastQueue.push(newToast)

				newToast.timer = setTimeout(() => {
					this.animateDismiss(newToast, systemInfo)
					setTimeout(() => {
						this.toastQueue = this.toastQueue.filter(t => t.id !== newToast.id)
					}, 500)
				}, 2000)
			},

			/* 位置计算方法 */
			calcPosition(sysInfo, heightPercent) {
				const screenHeight = sysInfo.windowHeight
				const screenWidth = sysInfo.windowWidth
				const toastHeight = 25

				return {
					top: Math.max(screenHeight * (1 - heightPercent) - toastHeight / 2, 50),
					left: screenWidth / 2
				}
			},

			validateDirection(dir) {
				return ['left', 'right', 'up', 'down'].includes(dir) ? dir : 'up'
			},

			animateDismiss(toast, sysInfo) {
				const {
					windowWidth,
					windowHeight
				} = sysInfo
				switch (toast.direction) {
					case 'left':
						toast.left = -windowWidth
						break
					case 'right':
						toast.left = windowWidth * 2
						break
					case 'up':
						toast.top -= 150
						break
					case 'down':
						toast.top = windowHeight + 150
						break
				}
				toast.opacity = 0
			}
		}
	}
</script>

<style lang="scss" scoped>
	.toast-container {
		/* 容器样式 */
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 9999;
		pointer-events: none;
	}

	.toast {
		/* 保持原有样式 */
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

		/* 队列间距 */
		&+.toast {
			margin-top: 60px;
		}
	}
</style>
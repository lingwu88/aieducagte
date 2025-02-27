<template>
	<view v-if="visible" class="toast" :style="{ top: top + 'px', left: left + 'px', opacity: opacity }">
		{{ message }}
	</view>
</template>

<script>
	export default {
		data() {
			return {
				visible: false,
				message: '',
				top: 50, // 初始顶部位置，单位为 px
				left: 0, // 初始左边位置，改为 px，动态计算
				opacity: 1 // 初始透明度
			};
		},
		methods: {
			show(message, heightPercent = 0.5, direction = 'up') {
				const systemInfo = uni.getSystemInfoSync();
				const screenHeight = systemInfo.windowHeight; // 获取屏幕高度（单位：px）
				const screenWidth = systemInfo.windowWidth; // 获取屏幕宽度（单位：px）
				const toastHeight = 25; // 假设 Toast 高度为 25px（根据样式调整）

				// 验证 direction 参数
				const validDirections = ['left', 'right', 'up', 'down'];
				const finalDirection = typeof direction === 'string' && validDirections.includes(direction.trim()) ?
					direction.trim() : 'up';

				// 计算初始位置
				const initialTop = screenHeight * (1 - heightPercent) - toastHeight / 2;
				const initialLeft = screenWidth / 2; // 屏幕宽度一半，确保居中

				this.message = message;
				this.top = initialTop > 0 ? initialTop : 50; // 确保不超出顶部
				this.left = initialLeft; // 初始居中
				this.opacity = 1; // 重置透明度
				this.visible = true;

				setTimeout(() => {
					// 根据方向设置结束位置
					switch (finalDirection) {
						case 'left':
							this.left = -screenWidth; // 移出屏幕左侧
							break;
						case 'right':
							this.left = screenWidth * 2; // 移出屏幕右侧
							break;
						case 'up':
							this.top = initialTop - 150; // 向上移动 150px
							break;
						case 'down':
							this.top = screenHeight + 150; // 向下移出屏幕
							break;
					}
					this.opacity = 0; // 渐变为完全透明
					setTimeout(() => {
						this.visible = false; // 动画结束后隐藏
						this.opacity = 1; // 重置透明度
						this.top = initialTop > 0 ? initialTop : 50; // 重置顶部位置
						this.left = initialLeft; // 重置左边位置为居中
					}, 500); // 动画持续时间
				}, 2000); // 2秒后开始消失动画
			}
		}
	};
</script>

<style lang="scss" scoped>
	.toast {
		position: fixed;
		transform: translateX(-50%);
		background-color: rgba(0, 0, 0, 0.8);
		color: #fff;
		padding: 20rpx 40rpx;
		border-radius: 10rpx;
		font-size: 28rpx;
		z-index: 9999;
		transition: all 0.5s ease;
		/* 同时过渡 top, left 和 opacity */
		max-width: 80%;
		text-align: center;
		pointer-events: none;
	}
</style>
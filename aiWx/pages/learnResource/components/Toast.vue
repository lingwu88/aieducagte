<!-- 当前版本1.0.0.3 -->
<!--/**    帮助文档_fg
*
* @param {string} context - Toast 的显示内容，必须为字符串。可以不指定参数名直接传入。
* @param {number} [args.heightPercent=0.5] - Toast 的垂直位置百分比（0 到 1），表示距顶部的高度比例，默认 0.5（居中）。
* @param {string} [args.direction='up'] - Toast 消失时的动画方向，可选值为 'left'、'right'、'up'、'down'，默认 'up'。
* @param {number} [args.StayTime=1300] - Toast 的停留时间（毫秒），默认 1300ms，动画渐隐固定为 500ms。
*
* @returns {void} - 无返回值。
*
* @throws {Error} 如果 context 不是字符串，抛出 "Toast context must be a string"。
* @throws {Error} 如果 args 中的参数不是对象或为空，抛出 "Parameter at position X must be an object with a named key"。
* @throws {Error} 如果 args 中的参数对象包含多个键，抛出 "Parameter at position X must contain exactly one named key"。
* @throws {Error} 如果 args 中指定了未知参数名，抛出 "Unknown parameter 'X' provided"。
*
* @example
* // 基本用法，默认参数
* this.$refs.toast.show('数据请求成功');
*
* @example
* // 指定高度和方向
* this.$refs.toast.show('数据请求成功', {heightPercent: 0.8}, {direction: 'down'});
*
* @example
* // 指定停留时间
* this.$refs.toast.show('数据请求成功', {StayTime: 2000});
*
* @example
* // 组合使用
* this.$refs.toast.show('测试消息', {heightPercent: 0.6}, {direction: 'left'}, {StayTime: 3000});
*/-->
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
		show(context, ...args) {
			// 校验第一个参数 context
			if (typeof context !== 'string') {
				throw new Error('Toast context must be a string');
			}

			// 默认参数
			const defaultParams = {
				heightPercent: 0.5,
				direction: 'up',
				StayTime: 1300
			};

			// 解析传入的参数
			const params = {};
			args.forEach((arg, index) => {
				if (typeof arg !== 'object' || arg === null) {
					throw new Error(`Parameter at position ${index + 1} must be an object with a named key`);
				}
				const keys = Object.keys(arg);
				if (keys.length !== 1) {
					throw new Error(`Parameter at position ${index + 1} must contain exactly one named key`);
				}
				const key = keys[0];
				if (!(key in defaultParams)) {
					throw new Error(`Unknown parameter "${key}" provided`);
				}
				params[key] = arg[key];
			});

			// 合并默认参数和用户传入参数
			const mergedParams = { ...defaultParams, ...params };

			// 创建新 Toast
			const newToast = {
				id: toastId++,
				message: context,
				...this.calcPosition(mergedParams.heightPercent),
				opacity: 1,
				direction: this.validateDirection(mergedParams.direction)
			};

			this.toastQueue.push(newToast);

			// 设置停留时间和动画
			setTimeout(() => {
				this.animateDismiss(newToast);
				setTimeout(() => {
					this.toastQueue = this.toastQueue.filter((t) => t.id !== newToast.id);
				}, 500); // 渐隐动画时间固定为 500ms
			}, mergedParams.StayTime); // 使用指定的停留时间
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

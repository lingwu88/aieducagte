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
			:id="`toast-${toast.id}`"
			class="toast"
			:style="{
				top: toast.top + 'px',
				left: toast.left + 'px',
				opacity: toast.opacity
			}"
		>
			<!-- 使用 text 标签来确保换行有效 -->
			<text class="toast-message">{{ toast.message }}</text>
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
			if (typeof context !== 'string') {
				throw new Error('Toast context must be a string');
			}

			// 默认参数
			const defaultParams = {
				heightPercent: 0.5,
				direction: 'up',
				StayTime: 1300
			};

			// 解析参数
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

			// 合并参数
			const mergedParams = { ...defaultParams, ...params };

			// 创建新的 toast，初始 opacity 设为 0（隐藏），待位置调整后再显示
			const newToast = {
				id: toastId++,
				message: context,
				...this.calcPosition(mergedParams.heightPercent),
				opacity: 0,
				direction: this.validateDirection(mergedParams.direction)
			};

			this.toastQueue.push(newToast);

			// 等待 DOM 更新后，获取 toast 的位置，并根据需要调整
			this.$nextTick(() => {
				uni.createSelectorQuery()
					.in(this)
					.select(`#toast-${newToast.id}`)
					.boundingClientRect((rect) => {
						if (rect) {
							const { windowWidth, windowHeight } = this.systemInfo;
							// 计算 rpx 转 px 的比例（750rpx 为设计稿宽度）
							const conversion = windowWidth / 750;
							const bottomMargin = 30 * conversion;
							const topMargin = 20 * conversion;
							let adjustedTop = newToast.top;
							// 若底部超出屏幕，则上移，使底边距离屏幕底部 30rpx
							if (rect.bottom > windowHeight) {
								adjustedTop = newToast.top - (rect.bottom - (windowHeight - bottomMargin));
							}
							// 若顶部超出屏幕，则下移，使顶边距离屏幕上方 20rpx
							if (rect.top < 0) {
								adjustedTop = newToast.top + (0 - rect.top) + topMargin;
							}
							newToast.top = adjustedTop;
						}
						// 调整完毕后显示 toast
						newToast.opacity = 1;
						// 设置停留时间与消失动画
						setTimeout(() => {
							this.animateDismiss(newToast);
							setTimeout(() => {
								this.toastQueue = this.toastQueue.filter((t) => t.id !== newToast.id);
							}, 600); // 固定 500ms 渐隐动画
						}, mergedParams.StayTime);
					})
					.exec();
			});
		},
		calcPosition(heightPercent) {
			const { windowHeight, windowWidth } = this.systemInfo;
			// 初步计算 toast 的 top 位置，后续根据实际尺寸调整
			const defaultToastHeight = 25;
			return {
				top: Math.max(windowHeight * (1 - heightPercent) - defaultToastHeight / 2, 50),
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
	z-index: 9999999999999;
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
	max-width: 100%;
	text-align: center;
	/* 确保文本换行、不会撑宽容器 */
	white-space: pre-wrap;
	word-break: break-word;
	overflow-wrap: break-word;
}
.toast + .toast {
	margin-top: 120rpx;
}
.toast-message {
	display: block;
	white-space: pre-wrap;
	word-break: break-word;
	overflow-wrap: break-word;
}
</style>

<template>
	<view class="content-preference">
		<!-- 顶部标题区域 -->
		<view class="header">
			<view class="title-container">
				<text class="title">内容偏好</text>
				<text class="subtitle">了解您喜欢的学习内容类型</text>
			</view>
		</view>

		<!-- 内容区域 -->
		<scroll-view class="content-scroll" scroll-y>
			<!-- 加载动画 -->
			<view v-if="isLoading" class="loading-container">
				<view class="loading-animation">
					<view class="loading-circle" v-for="(item, index) in 4" :key="index" :style="{ animationDelay: index * 0.15 + 's' }"></view>
				</view>
				<text class="loading-text">AI正在为您生成偏好分析中...</text>
			</view>

			<!-- 报告内容 -->
			<view v-else class="report-container">
				<!-- 主标题 -->
				<view class="report-header">
					<text class="report-title">{{ reportData.title }}</text>
					<view class="report-date">
						<text>生成日期: {{ formattedDate }}</text>
					</view>
				</view>

				<!-- 分析内容区域 -->
				<view class="report-content">
					<!-- 动态渲染小节 -->
					<view v-for="(section, index) in reportData.sections" :key="index" class="section">
						<view class="section-header" :style="section.style">
							<view class="header-left-border" :style="section.borderStyle"></view>
							<text class="section-title">{{ section.title }}</text>
						</view>
						<view class="section-content">
							<view v-for="(point, pIndex) in section.points" :key="pIndex" class="point">
								<view class="point-bullet"></view>
								<text class="point-text">{{ point }}</text>
							</view>
						</view>
					</view>

					<!-- 总结 -->
					<view v-if="reportData.summary" class="summary-section">
						<view class="summary-header">
							<text class="summary-title">总结</text>
						</view>
						<view class="summary-content">
							<text class="summary-text">{{ reportData.summary }}</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			isLoading: true,
			formattedDate: this.getCurrentDate(),
			reportData: {
				title: '',
				sections: [],
				summary: ''
			}
		};
	},
	onLoad() {
		this.fetchPreferenceData();
	},
	methods: {
		getCurrentDate() {
			const now = new Date();
			const year = now.getFullYear();
			const month = String(now.getMonth() + 1).padStart(2, '0');
			const day = String(now.getDate()).padStart(2, '0');
			return `${year}-${month}-${day}`;
		},

		fetchPreferenceData() {
			this.isLoading = true;
			wx.login({
				success: (loginRes) => {
					const code = loginRes.code; // 获取用户 code 令牌
					if (code) {
						console.log('获取登录 code 成功:', code);

						// 第二步：使用 code 作为 userid 保存对话
						wx.request({
							url: 'http://120.24.243.227:13100/api/conversation/analyze',
							method: 'POST',
							data: { userCode: code, type: 'contentPreference' },
							header: { 'content-type': 'application/json' },
							success: (res) => {
								if (res.statusCode === 200 && res.data.success) {
									console.log('后端返回数据:', res.data);
									if (Object.keys(res.data.data).length === 0) {
										wx.showToast({
											title: "用户的数据信息过少不支持生成内容", // 提示内容
											icon: 'none', // 不显示图标（纯文字）
											duration: 2000 // 2秒后自动关闭
										});
										this.useFallbackData();
										return;
									}
									const markdownText = typeof res.data.data === 'string' ? res.data.data : String(res.data.data || '');
									this.reportData = this.parseMarkdown(markdownText);
								} else {
									wx.showToast({
										title: res.data.message, // 提示内容
										icon: 'none', // 不显示图标（纯文字）
										duration: 2000 // 2秒后自动关闭
									});
									console.error('服务器返回错误', res);
									this.useFallbackData();
								}
							},
							fail: (err) => {
								console.error('请求失败', err);
								this.useFallbackData();
							},
							complete: () => {
								setTimeout(() => (this.isLoading = false), 800);
							}
						});
					} else {
						console.log('未获取到 code');
						reject(new Error('登录失败，未获取到 code')); // 未返回 code
					}
				},
				fail: (err) => {
					console.log('wx.login 调用失败:', err);
					reject(err); // 获取 code 失败时抛出错误
				}
			});
		},

		useFallbackData() {
			const mockData = {
				result: '### 内容偏好分析报告\n\n1. **学习领域偏好**  \n   您的学习领域涵盖了多个学科，包括土木工程、计算机科学、人工智能、数据结构与算法等。从您的核心兴趣"数据结构与算法"和"人工智能"可以看出，您对计算机科学相关的知识有强烈的偏好，尤其是在逻辑性强、技术含量高的领域。\n\n2. **核心兴趣分析**  \n   您的核心兴趣集中在"数据结构与算法"和"人工智能"。您曾深入探讨过这些主题，说明您对编程逻辑、算法优化以及AI模型的构建和应用非常感兴趣。\n\n### 总结  \n综合来看，您的学习偏好集中在技术深度较高的领域，尤其是数据结构与算法及人工智能。'
			};
			this.reportData = this.parseMarkdown(mockData.result);
		},

		parseMarkdown(markdownText) {
			const sections = [];
			const sectionColors = [
				{ bg: 'rgba(91, 106, 240, 0.1)', border: '#5b6af0', borderEnd: '#7b89ff' },
				{ bg: 'rgba(255, 107, 107, 0.1)', border: '#ff6b6b', borderEnd: '#ff9f9f' },
				{ bg: 'rgba(78, 205, 196, 0.1)', border: '#4ecdc4', borderEnd: '#7ee8df' },
				{ bg: 'rgba(255, 209, 102, 0.1)', border: '#ffd166', borderEnd: '#ffe59d' },
				{ bg: 'rgba(108, 92, 231, 0.1)', border: '#6c5ce7', borderEnd: '#a29bfe' }
			];

			// 确保输入是字符串
			const text = typeof markdownText === 'string' ? markdownText : String(markdownText || '');
			if (!text) {
				console.error('markdownText 为空或无效');
				return { title: '内容偏好分析报告', sections: [], summary: '' };
			}

			// 移除主标题并提取主要内容
			const contentWithoutHeader = text.replace(/^###\s+.*?\n\n/, '').trim();

			// 分割总结部分
			const summarySplit = contentWithoutHeader.split(/(?:###\s+总结|\*\*\s*总结\s*\*\*)/);
			const mainContent = summarySplit[0].trim();
			const summary = summarySplit.length > 1 ? summarySplit[1].trim() : '';

			// 通用小节正则表达式：支持 #### 和 numbered bold titles
			const sectionRegex = /(?:####\s+(.*?)\n|(\d+\.\s+\*\*(.*?)\*\*))\s*([\s\S]*?)(?=(?:####|\d+\.\s+\*\*|###|---|$))/g;
			let match;
			let index = 0;

			while ((match = sectionRegex.exec(mainContent)) !== null) {
				// 标题可能是 #### 格式 (match[1]) 或 numbered bold 格式 (match[3])
				const sectionTitle = (match[1] || match[3]).trim();
				const sectionContent = match[4].trim();

				// 提取要点
				const points = [];
				const pointRegex = /-\s+(.*?)(?=(?:-\s+|$|\n\n))/g; // 改进 bullet point 提取
				let pointMatch;
				let hasPoints = false;

				while ((pointMatch = pointRegex.exec(sectionContent)) !== null) {
					points.push(pointMatch[1].trim());
					hasPoints = true;
				}

				// 如果没有 bullet points，将整个内容作为单个 point
				if (!hasPoints && sectionContent) {
					points.push(sectionContent);
				}

				// 应用样式
				const color = sectionColors[index % sectionColors.length];
				const style = `background: linear-gradient(to right, ${color.bg}, rgba(255, 255, 255, 0.05));`;
				const borderStyle = `background: linear-gradient(to bottom, ${color.border}, ${color.borderEnd});`;

				sections.push({
					title: sectionTitle,
					points: points,
					style: style,
					borderStyle: borderStyle
				});

				index++;
			}

			// 如果没有匹配到任何小节，将整个内容作为单个 section 处理
			if (sections.length === 0 && mainContent) {
				const color = sectionColors[0];
				sections.push({
					title: '分析内容',
					points: [mainContent],
					style: `background: linear-gradient(to right, ${color.bg}, rgba(255, 255, 255, 0.05));`,
					borderStyle: `background: linear-gradient(to bottom, ${color.border}, ${color.borderEnd});`
				});
			}

			return {
				title: '内容偏好分析报告',
				sections,
				summary
			};
		}
	}
};
</script>
<style lang="scss" scoped>
.content-preference {
	min-height: 100vh;
	background-color: #f8f9fd;
	display: flex;
	flex-direction: column;
}

.header {
	background: linear-gradient(to right, #5b6af0, #7b89ff);
	padding: 60rpx 30rpx 40rpx;
	color: #fff;
	position: relative;
	box-shadow: 0 4rpx 20rpx rgba(91, 106, 240, 0.3);
	display: flex;
	align-items: center;
}

.title-container {
	display: flex;
	flex-direction: column;
}

.title {
	font-size: 40rpx;
	font-weight: bold;
	margin-bottom: 10rpx;
}

.subtitle {
	font-size: 26rpx;
	opacity: 0.85;
}

.content-scroll {
	flex: 1;
	padding: 0;
	box-sizing: border-box;
	width: 100%;
}

/* 加载动画样式 */
.loading-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 80rpx 30rpx;
	height: 400rpx;
}

.loading-animation {
	display: flex;
	justify-content: center;
	margin-bottom: 30rpx;
}

.loading-circle {
	width: 20rpx;
	height: 20rpx;
	background: #5b6af0;
	border-radius: 50%;
	margin: 0 10rpx;
	animation: loading-bounce 1.4s infinite ease-in-out both;
}

@keyframes loading-bounce {
	0%,
	80%,
	100% {
		transform: scale(0.6);
		opacity: 0.6;
	}
	40% {
		transform: scale(1);
		opacity: 1;
	}
}

.loading-text {
	font-size: 28rpx;
	color: #666;
	text-align: center;
	font-weight: 500;
}

.report-container {
	padding: 20rpx;
	background-color: #fff;
	border-radius: 20rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
	margin: 20rpx;
	box-sizing: border-box;
	width: auto;
}

.report-header {
	padding: 30rpx;
	border-bottom: 1rpx solid #f0f0f0;
	position: relative;
}

.report-header:after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 30rpx;
	right: 30rpx;
	height: 2rpx;
	background: linear-gradient(to right, #5b6af0, #7b89ff, transparent);
}

.report-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 16rpx;
	position: relative;
	display: inline-block;
}

.report-title:after {
	content: '';
	position: absolute;
	bottom: -8rpx;
	left: 0;
	width: 60rpx;
	height: 4rpx;
	background: linear-gradient(to right, #5b6af0, #7b89ff);
	border-radius: 2rpx;
}

.report-date {
	font-size: 24rpx;
	color: #999;
}

.report-content {
	padding: 20rpx;
}

.section {
	margin-bottom: 40rpx;
	border-radius: 16rpx;
	overflow: hidden;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.03);
	background-color: #fff;
}

.section-header {
	display: flex;
	align-items: center;
	padding: 24rpx 20rpx;
	position: relative;
	border-radius: 12rpx 12rpx 0 0;
}

.header-left-border {
	width: 8rpx;
	height: 36rpx;
	border-radius: 4rpx;
	margin-right: 16rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.section-content {
	padding: 24rpx 30rpx;
	background-color: #fff;
	border-radius: 0 0 12rpx 12rpx;
}

.point {
	display: flex;
	margin-bottom: 24rpx;
	position: relative;
}

.point-bullet {
	width: 12rpx;
	height: 12rpx;
	border-radius: 50%;
	background-color: #5b6af0;
	margin-top: 14rpx;
	margin-right: 16rpx;
	flex-shrink: 0;
	box-shadow: 0 0 6rpx rgba(91, 106, 240, 0.4);
}

.point-text {
	font-size: 28rpx;
	color: #555;
	line-height: 1.6;
	word-wrap: break-word;
	word-break: break-all;
	flex: 1;
}

.summary-section {
	margin-top: 30rpx;
	padding: 30rpx;
	background: linear-gradient(to right, rgba(91, 106, 240, 0.1), rgba(123, 137, 255, 0.1));
	border-radius: 16rpx;
}

.summary-header {
	margin-bottom: 20rpx;
}

.summary-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #5b6af0;
}

.summary-text {
	font-size: 28rpx;
	color: #555;
	line-height: 1.6;
}
</style>

<template>
	<view class="strengths-weaknesses">
		<!-- 头部区域 -->
		<view class="header">
			<text class="title">您的学习优势与劣势</text>
			<text class="subtitle">了解您的学习特点，优化学习策略。</text>
		</view>

		<!-- 加载提示 -->
		<view v-if="loading" class="loading">
			<view class="loading-spinner"></view>
			<text>正在为您加载分析结果...</text>
		</view>

		<!-- 内容区域 -->
		<view class="content" v-else>
			<!-- 优势部分 -->
			<view class="section" v-if="strengths.length > 0">
				<text class="section-title">优势</text>
				<view v-for="(item, index) in strengths" :key="index" class="card" @tap="toggleAccordion(index, 'strengths')">
					<view class="card-header">
						<text class="card-title">{{ item.title }}</text>
						<text class="card-icon">{{ item.expanded ? '▲' : '▼' }}</text>
					</view>
					<view class="card-content" v-if="item.expanded">
						<text class="card-description">{{ item.description }}</text>
						<view class="suggestions" v-if="item.suggestions.length > 0">
							<text class="suggestion-title">建议：</text>
							<text v-for="(suggestion, sIndex) in item.suggestions" :key="sIndex" class="suggestion-item">
								{{ suggestion }}
							</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 劣势部分 -->
			<view class="section" v-if="weaknesses.length > 0">
				<text class="section-title">劣势</text>
				<view v-for="(item, index) in weaknesses" :key="index" class="card" @tap="toggleAccordion(index, 'weaknesses')">
					<view class="card-header">
						<text class="card-title">{{ item.title }}</text>
						<text class="card-icon">{{ item.expanded ? '▲' : '▼' }}</text>
					</view>
					<view class="card-content" v-if="item.expanded">
						<text class="card-description">{{ item.description }}</text>
						<view class="suggestions" v-if="item.suggestions.length > 0">
							<text class="suggestion-title">建议：</text>
							<text v-for="(suggestion, sIndex) in item.suggestions" :key="sIndex" class="suggestion-item">
								{{ suggestion }}
							</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部区域 -->
		<view class="footer">
			<text class="footer-text">© 2025 学习助手 | 当前日期：{{ currentDate }}</text>
		</view>
	</view>
</template>

<script>
import pageTime from '../../mixins/pageTime';
export default {
	mixins: [pageTime],
	mounted() {
		this.setType(2);
	},
	data() {
		return {
			strengths: [],
			weaknesses: [],
			currentDate: '',
			loading: true
		};
	},
	onLoad() {
		const date = new Date();
		this.currentDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
		this.fetchStrengthsWeaknessesData();
	},
	methods: {
		fetchStrengthsWeaknessesData() {
			wx.request({
				url: 'https://fugui.mynatapp.cc/api/get-conversations/analyze',
				method: 'POST',
				data: {
					userid: 'user_12345',
					type: 'strengthsWeaknesses'
				},
				header: {
					'content-type': 'application/json'
				},
				success: (res) => {
					if (res.statusCode === 200 && res.data.success) {
						console.log('后端返回数据:', res.data);
						const text = typeof res.data.data === 'string' ? res.data.data : String(res.data.data || '');
						this.parseStrengthsWeaknesses(text);
					} else {
						wx.showToast({
							title: res.data.message, // 提示内容
							icon: 'none', // 不显示图标（纯文字）
							duration: 2000 // 2秒后自动关闭
						});
						console.error('服务器返回错误', res);
						this.loadFallbackData();
					}
				},
				fail: (err) => {
					console.error('请求失败', err);
					this.loadFallbackData();
				},
				complete: () => {
					setTimeout(() => {
						this.loading = false;
					}, 800);
				}
			});
		},

		parseStrengthsWeaknesses(text) {
			let strengths = [];
			let weaknesses = [];

			console.log('原始数据:', text);

			// 假设数据可能为完整 Markdown 或纯文本片段，尝试两种解析方式
			if (text.includes('#')) {
				// Markdown 格式解析
				const lines = text.split('\n');
				let minHashCount = Infinity;
				const headings = [];

				// 扫描标题
				lines.forEach((line) => {
					const match = line.match(/^(#+)\s+(.+)$/);
					if (match) {
						const hashCount = match[1].length;
						const title = match[2].trim();
						minHashCount = Math.min(minHashCount, hashCount);
						headings.push({ hashCount, title, line });
					}
				});

				console.log('检测到的标题:', headings);

				const topLevelHeading = headings.find((h) => h.hashCount === minHashCount);
				if (!topLevelHeading) {
					console.error('未找到顶层标题');
				}

				const strengthsHeading = headings.find((h) => h.hashCount > minHashCount && /优点/.test(h.title));
				const weaknessesHeading = headings.find((h) => h.hashCount > minHashCount && /缺点/.test(h.title));
				const summaryHeading = headings.find((h) => h.hashCount === minHashCount && /总结/.test(h.title));

				if (strengthsHeading && weaknessesHeading) {
					const strengthsStart = text.indexOf(strengthsHeading.line) + strengthsHeading.line.length;
					const weaknessesStart = text.indexOf(weaknessesHeading.line);
					const summaryStart = summaryHeading ? text.indexOf(summaryHeading.line) : text.length;

					const strengthsText = text.substring(strengthsStart, weaknessesStart).trim();
					const weaknessesText = text.substring(weaknessesStart + weaknessesHeading.line.length, summaryStart).trim();

					console.log('优点文本:', strengthsText);
					console.log('缺点文本:', weaknessesText);

					const itemRegex = /(\d+)\.\s+\*\*(.*?)\*\*：?\s*([\s\S]*?)(?=\n\n\d+\.|$)/g;
					let match;

					// 解析优点
					while ((match = itemRegex.exec(strengthsText)) !== null) {
						const title = match[2].trim();
						const description = match[3].trim();
						strengths.push({
							title,
							description,
							suggestions: [],
							expanded: false
						});
					}

					// 解析缺点
					while ((match = itemRegex.exec(weaknessesText)) !== null) {
						const title = match[2].trim();
						const description = match[3].trim();
						weaknesses.push({
							title,
							description,
							suggestions: [],
							expanded: false
						});
					}
				}
			}

			// 如果 Markdown 解析失败，尝试纯文本片段解析
			if (strengths.length === 0 && weaknesses.length === 0) {
				console.log('尝试纯文本解析...');
				const sections = text.split('缺点文本:');
				const strengthsText = sections[0].includes('优点文本:') ? sections[0].replace('优点文本:', '').trim() : text;
				const weaknessesText = sections.length > 1 ? sections[1].trim() : '';

				console.log('纯文本 - 优点:', strengthsText);
				console.log('纯文本 - 缺点:', weaknessesText);

				const itemRegex = /(\d+)\.\s+\*\*(.*?)\*\*：?\s*([\s\S]*?)(?=\n\n\d+\.|$)/g;
				let match;

				// 解析优点
				while ((match = itemRegex.exec(strengthsText)) !== null) {
					const title = match[2].trim();
					const description = match[3].trim();
					strengths.push({
						title,
						description,
						suggestions: [],
						expanded: false
					});
				}

				// 解析缺点
				while ((match = itemRegex.exec(weaknessesText)) !== null) {
					const title = match[2].trim();
					const description = match[3].trim();
					weaknesses.push({
						title,
						description,
						suggestions: [],
						expanded: false
					});
				}
			}

			console.log('解析后的优点:', strengths);
			console.log('解析后的缺点:', weaknesses);

			this.strengths = strengths;
			this.weaknesses = weaknesses;

			if (strengths.length === 0 && weaknesses.length === 0) {
				console.error('未解析到任何优点或缺点数据');
				this.loadFallbackData();
			}
		},

		loadFallbackData() {
			this.strengths = [
				{
					title: '跨学科学习能力强',
					description: '您在土木工程和计算机科学领域都有涉猎。',
					suggestions: [],
					expanded: false
				}
			];
			this.weaknesses = [
				{
					title: '实践项目经验不足',
					description: '缺乏具体项目经验。',
					suggestions: [],
					expanded: false
				}
			];
		},

		toggleAccordion(index, type) {
			const items = type === 'strengths' ? this.strengths : this.weaknesses;
			items[index].expanded = !items[index].expanded;
			this.$forceUpdate();
		}
	}
};
</script>

<style lang="scss" scoped>
.strengths-weaknesses {
	padding: 20rpx;
	font-family: 'PingFang SC', sans-serif;
	background-color: #f7f8fa;
	min-height: 100vh;
}

.header {
	margin-bottom: 40rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.title {
	font-size: 42rpx;
	font-weight: bold;
	color: #4c6ef5;
}
.subtitle {
	font-size: 28rpx;
	color: #666666;
	margin-top: 10rpx;
}

.loading {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 300rpx;
}
.loading-spinner {
	width: 60rpx;
	height: 60rpx;
	border: 6rpx solid rgba(76, 110, 245, 0.1);
	border-left-color: #4c6ef5;
	border-radius: 50%;
	animation: spin 1s linear infinite;
	margin-bottom: 20rpx;
}
@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}
.loading text {
	font-size: 28rpx;
	color: #666;
}

.content {
	display: flex;
	flex-direction: column;
	gap: 40rpx;
}

.section {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}
.section-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
}

.card {
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.05);
	transition: all 0.3s ease;
}
.card:hover {
	transform: scale(1.02);
	box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.1);
}
.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.card-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}
.card-icon {
	font-size: 28rpx;
	color: #666;
}
.card-content {
	margin-top: 20rpx;
	animation: slideIn 0.3s ease-in-out;
}
.card-description {
	font-size: 28rpx;
	color: #666;
	line-height: 1.6;
}
.suggestions {
	margin-top: 20rpx;
}
.suggestion-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #4c6ef5;
}
.suggestion-item {
	font-size: 28rpx;
	color: #333;
	line-height: 1.6;
	margin-top: 10rpx;
	display: block;
}

.footer {
	margin-top: 40rpx;
	text-align: center;
}
.footer-text {
	font-size: 24rpx;
	color: #999;
}

@keyframes slideIn {
	from {
		opacity: 0;
		transform: translateY(20rpx);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>

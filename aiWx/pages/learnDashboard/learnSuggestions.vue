<template>
	<view class="learn-suggestions">
		<!-- 顶部标题区域 -->
		<view class="header">
			<view class="title">学习建议</view>
			<view class="subtitle">根据您的学习情况定制的专属建议</view>
		</view>

		<!-- 内容区域 -->
		<view class="content-container">
			<scroll-view scroll-y class="content-scroll">
				<view class="markdown-content">
					<view v-if="loading" class="loading">
						<view class="loading-spinner"></view>
						<text>加载中...</text>
					</view>
					<block v-else>
						<view
							v-for="(item, index) in parsedSuggestions"
							:key="index"
							class="suggestion-item"
							:class="{ 'animate-in': !loading }"
							:style="{ 'animation-delay': index * 0.1 + 's' }"
						>
							<view class="suggestion-number">{{ item.number }}</view>
							<view class="suggestion-content">
								<view class="suggestion-title">{{ item.title }}</view>
								<view class="suggestion-text" v-html="item.content"></view>
							</view>
						</view>
					</block>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			suggestions: '',
			parsedSuggestions: [],
			loading: true
		};
	},

	onLoad() {
		this.fetchSuggestions();
	},

	methods: {
		fetchSuggestions() {
			const keywordsArray = [
				'土木工程',
				'计算机科学',
				'人工智能',
				'数据结构与算法 贪心算法',
				'目前土木工程专业的就业前景如何？',
				'数据结构与算法 动态规划',
				'材料力学',
				'数据结构与算法 回溯算法',
				'人工智能 广度优先搜索算法',
				'深圳大学计算系研究生的往年分数线如何？面试难吗？',
				'RAG',
				'Agent Memory',
				'工程制图',
				'房屋建筑学 楼梯',
				'我是广东工业大学大一的土木工程专业的学生，现在有点犹豫要不要投身人工智能领域创业，请给我分析一下'
			];

			// 模拟数据（实际应删除此部分，依赖真实 API）
			const mockResponse = {
				result: '1. **考研方向建议**：  \n   您的目标院校是深圳大学，且当前专业为土木工程。建议优先巩固「材料力学」和「房屋建筑学」等核心课程，同时针对性复习目标院校的考研大纲内容。此外，可结合「工程制图」的实际案例提升解题能力，确保专业课分数优势。\n\n2. **转行人工智能路径**：  \n   您对「数据结构与算法」和「人工智能」有浓厚兴趣，这为核心转型提供了良好基础。建议从以下方向入手：  \n   - 深入学习「数据结构与算法」，掌握常见算法（如动态规划、图算法）并实践LeetCode或牛客网题目。'
			};
			this.suggestions = mockResponse.result;

			wx.request({
				url: 'https://fugui.mynatapp.cc/ai/analyze',
				method: 'POST',
				data: {
					inputArray: keywordsArray,
					type: 'learnSuggestions'
				},
				header: {
					'content-type': 'application/json'
				},
				success: (res) => {
					if (res.statusCode === 200 && res.data.success) {
						console.log('后端返回数据:', res.data);
						if (Object.keys(res.data.data).length === 0) {
							return;
						}
						const markdownText = typeof res.data.data === 'string' ? res.data.data : String(res.data.data || '');
						this.suggestions = markdownText;
					} else {
						console.error('服务器返回错误', res);
					}
					this.parseSuggestions();
				},
				fail: (err) => {
					console.error('请求失败', err);
					this.parseSuggestions();
				},
				complete: () => {
					setTimeout(() => {
						this.loading = false;
					}, 800);
				}
			});
		},

		parseSuggestions() {
			let text = this.suggestions.trim();

			// 检测是否是格式 2（报告形式）
			if (text.indexOf('### ') === 0 && text.indexOf('### 总结') !== -1) {
				// 提取建议部分
				const startIndex = text.indexOf('#### 1. ');
				const endIndex = text.indexOf('### 总结');
				if (startIndex !== -1 && endIndex !== -1) {
					text = text.substring(startIndex, endIndex).trim();
				}
			}

			// 选择正则表达式
			let regex = /(\d+)\.\s+\*\*(.*?)\*\*：([\s\S]*?)(?=\n\n\d+\.|$)/g; // 格式 1
			if (text.indexOf('#### ') === 0) {
				regex = /####\s+(\d+)\.\s+\*\*(.*?)\*\*([\s\S]*?)(?=\n\n####\s+\d+\.|$)/g; // 格式 2
			}

			let match;
			const suggestions = [];

			while ((match = regex.exec(text)) !== null) {
				const number = match[1];
				const title = match[2];
				let content = match[3].trim();

				// 格式化 Markdown
				content = this.formatMarkdown(content);

				suggestions.push({
					number,
					title,
					content
				});
			}

			this.parsedSuggestions = suggestions;
		},

		formatMarkdown(text) {
			return (
				text
					.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
					.replace(/\*(.*?)\*/g, '<em>$1</em>')
					.replace(/「(.*?)」/g, '<span class="highlight">$1</span>')
					.replace(/^\s*-\s+(.*?)$/gm, '<li>$1</li>')
					.replace(/<li>.*?<\/li>(\n<li>.*?<\/li>)*/g, (match) => {
						return '<ul class="suggestion-list">' + match + '</ul>';
					})
					.replace(/\n\n/g, '</p><p>')
					.replace(/^(?!<p>|<ul>)(.+)/, '<p>$1</p>')
					.replace(/<\/p><p><\/ul>/g, '</ul>')
					.replace(/<p><ul/g, '<ul')
			);
		}
	}
};
</script>

<style lang="scss">
.learn-suggestions {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	background-color: #f8f9fd;

	.header {
		background: linear-gradient(135deg, #5b6af0, #7b89ff);
		padding: 40rpx 30rpx;
		color: #fff;
		border-radius: 0 0 30rpx 30rpx;
		box-shadow: 0 4rpx 12rpx rgba(91, 106, 240, 0.2);
		position: relative;
		overflow: hidden;

		&:after {
			content: '';
			position: absolute;
			right: -20rpx;
			bottom: -20rpx;
			width: 200rpx;
			height: 200rpx;
			background: rgba(255, 255, 255, 0.1);
			border-radius: 50%;
		}

		&:before {
			content: '';
			position: absolute;
			left: -30rpx;
			top: -30rpx;
			width: 160rpx;
			height: 160rpx;
			background: rgba(255, 255, 255, 0.1);
			border-radius: 50%;
		}

		.title {
			font-size: 44rpx;
			font-weight: bold;
			margin-bottom: 10rpx;
			position: relative;
			z-index: 2;
		}

		.subtitle {
			font-size: 28rpx;
			opacity: 0.9;
			position: relative;
			z-index: 2;
		}
	}

	.content-container {
		flex: 1;
		margin: 30rpx;
		background-color: #fff;
		border-radius: 20rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
		overflow: hidden;

		.content-scroll {
			height: calc(100vh - 240rpx);
		}

		.markdown-content {
			padding: 30rpx;

			.loading {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				height: 300rpx;

				.loading-spinner {
					width: 60rpx;
					height: 60rpx;
					border: 6rpx solid rgba(91, 106, 240, 0.1);
					border-left-color: #5b6af0;
					border-radius: 50%;
					animation: spin 1s linear infinite;
					margin-bottom: 20rpx;
				}

				@keyframes spin {
					to {
						transform: rotate(360deg);
					}
				}
			}

			.suggestion-item {
				display: flex;
				margin-bottom: 40rpx;
				background-color: #fff;
				border-radius: 16rpx;
				padding: 24rpx;
				box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
				position: relative;
				opacity: 0;
				transform: translateY(20rpx);

				&:before {
					content: '';
					position: absolute;
					left: 0;
					top: 0;
					bottom: 0;
					width: 6rpx;
					background: linear-gradient(to bottom, #5b6af0, #7b89ff);
					border-radius: 0;
				}

				&.animate-in {
					animation: fadeInUp 0.5s forwards;
				}

				@keyframes fadeInUp {
					from {
						opacity: 0;
						transform: translateY(20rpx);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				.suggestion-number {
					font-size: 40rpx;
					font-weight: bold;
					color: #5b6af0;
					margin-right: 20rpx;
					min-width: 40rpx;
					text-align: center;
				}

				.suggestion-content {
					flex: 1;

					.suggestion-title {
						font-size: 32rpx;
						font-weight: bold;
						margin-bottom: 16rpx;
						color: #333;
					}

					.suggestion-text {
						p {
							font-size: 30rpx;
							line-height: 1.6;
							color: #666;
							margin: 16rpx 0;
						}

						strong {
							color: #5b6af0;
							font-weight: 600;
						}

						em {
							font-style: italic;
							color: #666;
						}

						.highlight {
							color: #7b89ff;
							font-weight: 500;
							background-color: rgba(123, 137, 255, 0.08);
							padding: 0 6rpx;
							border-radius: 6rpx;
						}

						.suggestion-list {
							margin: 20rpx 0 20rpx 10rpx;
							padding: 0;

							li {
								position: relative;
								list-style: none;
								padding-left: 30rpx;
								margin-bottom: 16rpx;
								font-size: 28rpx;
								line-height: 1.5;
								color: #666;

								&:before {
									content: '';
									position: absolute;
									left: 0;
									top: 14rpx;
									width: 12rpx;
									height: 12rpx;
									background-color: #7b89ff;
									border-radius: 50%;
								}
							}
						}
					}
				}
			}
		}
	}
}
</style>

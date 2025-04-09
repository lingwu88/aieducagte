<template>
	<view class="dashboard-container">
		<!-- 顶部标题区域 -->
		<view class="header">
			<view class="title-container">
				<text class="title">学习分析</text>
				<text class="subtitle">基于您的使用智趣学坊的学习数据</text>
			</view>

			<!-- 添加装饰元素 -->
			<view class="header-decoration">
				<view class="decoration-dot"></view>
				<view class="decoration-dot"></view>
				<view class="decoration-dot"></view>
			</view>
		</view>

		<!-- 高频词云卡片 -->
		<view class="card word-cloud-card">
			<view class="card-header">
				<text class="card-title">您的高频学习关键词</text>
			</view>
			<view class="word-cloud-container">
				<view class="keywords-grid">
					<view
						v-for="(item, index) in wordCloudData"
						:key="index"
						class="keyword-item"
						:style="{
							fontSize: item.fontSize + 'rpx',
							color: item.color,
							background: item.bgColor,
							opacity: 0.7 + item.weight / 200
						}"
						@tap="showKeywordDetail(item)"
					>
						{{ item.word }}
					</view>
				</view>
			</view>
		</view>

		<!-- 功能导航区域 -->
		<view class="nav-section">
			<view class="nav-title">
				<text>深入了解您的学习情况</text>
			</view>

			<view class="nav-cards">
				<!-- 内容偏好 -->
				<view class="nav-card" @tap="navigateTo('contentPreference')">
					<view class="card-icon" style="background: linear-gradient(135deg, #5b6af0, #7b89ff)">
						<text class="icon">📊</text>
					</view>
					<view class="card-info">
						<text class="card-name">内容偏好</text>
						<text class="card-desc">了解您喜欢的学习内容类型</text>
					</view>
					<view class="arrow">
						<text class="arrow-icon">→</text>
					</view>
				</view>

				<!-- 学习建议 -->
				<view class="nav-card" @tap="navigateTo('learnSuggestions')">
					<view class="card-icon" style="background: linear-gradient(135deg, #4ecdc4, #7ee8df)">
						<text class="icon">💡</text>
					</view>
					<view class="card-info">
						<text class="card-name">学习建议</text>
						<text class="card-desc">获取个性化学习提升方案</text>
					</view>
					<view class="arrow">
						<text class="arrow-icon">→</text>
					</view>
				</view>

				<!-- 优缺点分析 -->
				<view class="nav-card" @tap="navigateTo('strengthsWeaknesses')">
					<view class="card-icon" style="background: linear-gradient(135deg, #ff6b6b, #ff9f9f)">
						<text class="icon">💪</text>
					</view>
					<view class="card-info">
						<text class="card-name">优缺点分析</text>
						<text class="card-desc">发现您的学习强项与弱点</text>
					</view>
					<view class="arrow">
						<text class="arrow-icon">→</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 关键词详情弹窗 -->
		<view class="keyword-modal" v-if="showModal">
			<view class="modal-content">
				<view class="modal-header">
					<text class="modal-title">关键词详情</text>
					<view class="close-btn" @tap="closeModal">×</view>
				</view>
				<view class="modal-body">
					<view class="keyword-detail-header">
						<view class="keyword-tag" :style="{ background: selectedKeyword.bgColor, color: selectedKeyword.color }">
							{{ selectedKeyword.word }}
						</view>
						<text class="keyword-weight">重要度: {{ selectedKeyword.weight }}%</text>
					</view>
					<view class="keyword-detail-content">
						<text class="detail-title">相关内容:</text>
						<text class="detail-text">{{ selectedKeyword.description || '您在聊天中多次提到此关键词，表明这是您学习中的重要概念。' }}</text>
					</view>
					<view class="keyword-detail-suggestion">
						<text class="suggestion-title">学习建议:</text>
						<text class="suggestion-text">{{ selectedKeyword.suggestion || '建议您可以进一步深入学习此概念，探索更多相关知识点。' }}</text>
					</view>
				</view>
			</view>
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
			// 词云数据
			wordCloudData: [],
			showModal: false,
			selectedKeyword: {}
		};
	},

	onReady() {
		wx.login({
			success: (loginRes) => {
				const code = loginRes.code;
				console.log(code);
				// 2. 发送 code 到开发者服务器（设置超时时间为 5000ms）
				wx.request({
					url: 'https://your-server.com/api/login',
					method: 'POST',
					data: { code },
					timeout: 5000, // 关键点：设置超时时间（单位：毫秒）
					success: (res) => {
						if (res.data.token) {
							wx.setStorageSync('token', res.data.token);
							console.log('登录成功，Token 已存储');
						}
					},
					fail: (err) => {
						if (err.errMsg.includes('timeout')) {
							console.error('请求超时，请检查网络或重试');
						} else {
							console.error('请求服务器失败:', err);
						}
					}
				});
			},
			fail: (err) => {
				console.error('获取 code 失败:', err);
			}
		});

		this.generateWordCloudData();
	},

	methods: {
		// 页面导航
		navigateTo(page) {
			uni.navigateTo({
				url: `/pages/learnDashboard/${page}`
			});
		},

		// 生成词云数据
		generateWordCloudData(Keywords = undefined) {
			// 模拟数据 - 实际项目中应从API获取
			const keywords = Keywords
				? Keywords
				: [
						{ word: '编程', weight: 100, description: '您经常讨论编程相关话题，这是您学习中的核心领域。', suggestion: '建议深入学习算法和数据结构，提升编程能力。' },
						{
							word: '算法',
							weight: 85,
							description: '算法是您频繁提及的概念，表明您对计算机科学基础很感兴趣。',
							suggestion: '可以尝试刷题平台如LeetCode来提升算法能力。'
						},
						{ word: '数据结构', weight: 70 },
						{
							word: 'Python',
							weight: 65,
							description: 'Python是您常用的编程语言，您对它有较高的兴趣。',
							suggestion: '建议学习Python高级特性和流行框架如Django或Flask。'
						},
						{ word: '机器学习', weight: 60 },
						{ word: '深度学习', weight: 55 },
						{ word: '数据分析', weight: 50, description: '数据分析是您感兴趣的应用领域。', suggestion: '可以学习Pandas、NumPy等数据分析库，提升数据处理能力。' },
						{ word: '人工智能', weight: 45 },
						{ word: '前端开发', weight: 40 },
						{ word: '后端开发', weight: 35 },
						{ word: '数据库', weight: 30 },
						{ word: '网络安全', weight: 25 },
						{ word: 'JavaScript', weight: 20 },
						{ word: 'Java', weight: 18 },
						{ word: 'C++', weight: 15 },
						{ word: '云计算', weight: 12 },
						{ word: '区块链', weight: 10 },
						{ word: '微服务', weight: 8 }
				  ];

			// 颜色方案
			const colorSchemes = [
				{ color: '#ffffff', bgColor: '#5b6af0' },
				{ color: '#ffffff', bgColor: '#7b89ff' },
				{ color: '#ffffff', bgColor: '#ff6b6b' },
				{ color: '#ffffff', bgColor: '#ff9f9f' },
				{ color: '#ffffff', bgColor: '#4ecdc4' },
				{ color: '#ffffff', bgColor: '#7ee8df' },
				{ color: '#333333', bgColor: '#ffd166' },
				{ color: '#333333', bgColor: '#ffe59d' },
				{ color: '#ffffff', bgColor: '#6c5ce7' },
				{ color: '#ffffff', bgColor: '#a29bfe' }
			];

			// 处理数据，添加字体大小和颜色
			this.wordCloudData = keywords.map((item, index) => {
				// 根据权重计算字体大小 (24-40rpx)
				const fontSize = 24 + (item.weight / 100) * 16;

				// 循环使用颜色方案
				const colorIndex = index % colorSchemes.length;

				return {
					...item,
					fontSize,
					color: colorSchemes[colorIndex].color,
					bgColor: colorSchemes[colorIndex].bgColor
				};
			});
		},

		// 显示关键词详情
		showKeywordDetail(keyword) {
			this.selectedKeyword = keyword;
			this.showModal = true;
		},

		// 关闭弹窗
		closeModal() {
			this.showModal = false;
		},

		// 获取真实聊天记录高频词（实际项目中应从API获取）
		fetchWordCloudData() {
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

			// 使用 wx.request 发起请求
			wx.request({
				url: 'https://fugui.mynatapp.cc/ai', // 请替换为你的实际后端地址
				method: 'POST',
				data: keywordsArray,
				header: {
					'content-type': 'application/json' // 小程序中 header 写法
				},
				success: (res) => {
					if (res.statusCode === 200 && res.data.success) {
						// 处理返回的数据
						const keywords = res.data.data.map((item, index) => ({
							word: item,
							weight: Math.floor(Math.random() * 10) + 1,
							description: `关键词${index + 1}`,
							suggestion: `建议${index + 1}`
						}));

						// 调用生成词云的方法
						this.generateWordCloudData(keywords);
					} else {
						console.error('服务器返回错误', res);
						this.generateWordCloudData(); // 使用默认数据
					}
				},
				fail: (err) => {
					console.error('请求失败', err);
					this.generateWordCloudData(); // 使用默认数据
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.dashboard-container {
	min-height: 100vh;
	background-color: #f8f9fd;
	padding-bottom: 40rpx;
}

.header {
	background: linear-gradient(to right, #5b6af0, #7b89ff);
	padding: 60rpx 30rpx 40rpx;
	color: #fff;
	position: relative;
	box-shadow: 0 4rpx 20rpx rgba(91, 106, 240, 0.3);
	overflow: hidden;
}

.title-container {
	display: flex;
	flex-direction: column;
	position: relative;
	z-index: 2;
}

.title {
	font-size: 44rpx;
	font-weight: bold;
	margin-bottom: 10rpx;
	letter-spacing: 2rpx;
}

.subtitle {
	font-size: 26rpx;
	opacity: 0.85;
	letter-spacing: 1rpx;
}

/* 装饰元素 */
.header-decoration {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	overflow: hidden;
	z-index: 1;
}

.decoration-dot {
	position: absolute;
	background: rgba(255, 255, 255, 0.1);
	border-radius: 50%;
}

.decoration-dot:nth-child(1) {
	width: 200rpx;
	height: 200rpx;
	top: -100rpx;
	right: -50rpx;
}

.decoration-dot:nth-child(2) {
	width: 150rpx;
	height: 150rpx;
	bottom: -50rpx;
	left: 100rpx;
}

.decoration-dot:nth-child(3) {
	width: 100rpx;
	height: 100rpx;
	top: 30rpx;
	left: 60%;
	opacity: 0.15;
}

.card {
	background-color: #fff;
	border-radius: 20rpx;
	margin: 30rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.card-header {
	margin-bottom: 20rpx;
}

.card-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.word-cloud-container {
	min-height: 400rpx;
	width: 100%;
	position: relative;
	padding: 10rpx 0;
}

.keywords-grid {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	gap: 20rpx;
	padding: 20rpx 0;
}

.keyword-item {
	padding: 10rpx 20rpx;
	border-radius: 10rpx;
	text-align: center;
	transition: all 0.3s ease;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
	transform: rotate(calc(var(--random) * 10deg));
}

.keyword-item:active {
	transform: scale(1.05);
	opacity: 1 !important;
}

.nav-section {
	padding: 0 30rpx;
}

.nav-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 30rpx;
	padding: 0 10rpx;
}

.nav-cards {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.nav-card {
	background-color: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	display: flex;
	align-items: center;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
	transition: transform 0.2s ease;
}

.nav-card:active {
	transform: scale(0.98);
}

.card-icon {
	width: 80rpx;
	height: 80rpx;
	border-radius: 20rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-right: 20rpx;
}

.icon {
	font-size: 40rpx;
}

.card-info {
	flex: 1;
}

.card-name {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 16rpx;
	display: block;
}

.card-desc {
	font-size: 24rpx;
	color: #666;
	display: block;
}

.arrow {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	justify-content: center;
	align-items: center;
}

.arrow-icon {
	font-size: 36rpx;
	color: #999;
}

/* 关键词详情弹窗 */
.keyword-modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 999;
}

.modal-content {
	width: 80%;
	background-color: #fff;
	border-radius: 20rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 30rpx rgba(0, 0, 0, 0.2);
}

.modal-header {
	padding: 30rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1rpx solid #eee;
}

.modal-title {
	font-size: 34rpx;
	font-weight: bold;
	color: #333;
}

.close-btn {
	font-size: 40rpx;
	color: #999;
	width: 60rpx;
	height: 60rpx;
	display: flex;
	justify-content: center;
	align-items: center;
}

.modal-body {
	padding: 30rpx;
}

.keyword-detail-header {
	display: flex;
	align-items: center;
	margin-bottom: 30rpx;
}

.keyword-tag {
	padding: 10rpx 20rpx;
	border-radius: 10rpx;
	font-size: 32rpx;
	font-weight: bold;
	margin-right: 20rpx;
}

.keyword-weight {
	font-size: 28rpx;
	color: #666;
}

.keyword-detail-content,
.keyword-detail-suggestion {
	margin-bottom: 30rpx;
}

.detail-title,
.suggestion-title {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
	display: block;
}

.detail-text,
.suggestion-text {
	font-size: 28rpx;
	color: #666;
	line-height: 1.5;
}
</style>

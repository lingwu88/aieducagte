<template>
	<view class="container" @tap="handleContainerTap">
		<toast ref="toast"></toast>
		<scroll-view scroll-x class="categories-scroll">
			<view class="categories">
				<view v-for="(category, index) in categories" :key="index" class="category" :class="{ active: currentCategory === category }" @click="changeCategory(category)">
					{{ category }}
				</view>
			</view>
		</scroll-view>
		<view class="load-container">
			<scroll-view
				scroll-y
				class="resource-list"
				@touchstart="handleTouchStart"
				@touchmove="handleTouchMove"
				@touchend="handleTouchEnd"
				:style="{ height: 'calc(100vh - 170rpx)', transform: 'translateY(' + listOffset + 'rpx)' }"
			>
				<view class="list-content">
					<block v-for="item in resources" :key="item.id">
						<view v-if="item.url" class="resource-item" @tap="navigateTo(item.url)">
							<image :src="item.img || defaultImg" class="item-img"></image>
							<view class="item-content">
								<text class="item-title" :class="{ ellipsis: item.title.length > maxTitleLength }">
									{{ item.title || '无标题' }}
								</text>
								<text class="item-desc" :class="{ 'ellipsis-two': item.preview && item.preview.length > maxPreviewLength }">
									{{ item.preview || '无描述' }}
								</text>
							</view>
							<view class="item-more" @tap.stop="toggleMenu(item.id)">
								<text class="more-icon">⋮</text>
							</view>
						</view>
						<view v-if="item.showMenu" class="menu-buttons">
							<view class="menu-btn" @tap.stop="toggleFavorite(item)">
								<image
									:src="
										item.isFavorited
											? '/static/classroom/learnResource/ResourceLibrary/icon/star-filled.ico'
											: '/static/classroom/learnResource/ResourceLibrary/icon/star.ico'
									"
									class="btn-icon"
								></image>
								<text>{{ item.isFavorited ? '已收藏' : '未收藏' }}</text>
							</view>
							<view class="menu-btn" @tap.stop="downloadFile(item)">
								<image src="/static/classroom/learnResource/ResourceLibrary/icon/download.ico" class="btn-icon"></image>
								<text>下载</text>
							</view>
							<view class="menu-btn" open-type="share" @tap.stop="handleShareButton(item)">
								<button open-type="share" class="share-btn" :data-item="item" @tap.stop="handleShareButton(item)">
									<image src="/static/classroom/learnResource/ResourceLibrary/icon/Forward.ico" class="btn-icon"></image>
									<text>分享</text>
								</button>
							</view>
						</view>
					</block>

					<view class="bottom-spacer"></view>
					<!-- 固定底部空白 -->
				</view>
			</scroll-view>
			<view class="load-hint" :style="{ height: loadingHeight + 'rpx', opacity: loadingHeight / 150 }">
				<text v-if="isLoadingMore">加载中</text>
				<text v-else-if="loadingHeight < 150">上滑加载更多</text>
				<text v-else>松手加载</text>
			</view>
		</view>
	</view>
</template>

<script>
import Toast from '@/pages/learnResource/components/Toast.vue';

export default {
	components: { Toast },
	data() {
		return {
			categories: ['全部'],
			currentCategory: '全部',
			allResources: [],
			resources: [],
			pageSize: 20,
			page: 1,
			loading: false,
			defaultImg: '/static/classroom/learnResource/ResourceLibrary/Pic/Doc_unfounded.png',
			maxTitleLength: 17,
			maxPreviewLength: 40,
			// 加载更多相关
			loadingHeight: 0, // 底部提示高度
			listOffset: 0, // 列表整体向上位移
			startY: 0, // 触摸起始 Y 坐标
			isTouching: false, // 是否正在触摸
			scrollTop: 0, // 当前滚动位置
			scrollHeight: 0, // 列表内容高度
			windowHeight: uni.getSystemInfoSync().windowHeight, // 屏幕高度
			isLoadingMore: false // 新增：标记是否正在加载更多
		};
	},
	onLoad() {
		this.loadData();
	},
	methods: {
		/**==============================================页面管理模块===========================================**/
		changeCategory(category) {
			this.currentCategory = category;
			this.page = 1;
			this.resources = [];
			this.loadResources();
		},
		toggleMenu(id) {
			this.resources = this.resources.map((item) => ({
				...item,
				showMenu: item.id === id ? !item.showMenu : false
			}));
		},
		navigateTo(url) {
			uni.navigateTo({ url: `/pages/learnResource/webview?url=${encodeURIComponent(url)}` });
		},
		handleContainerTap(e) {
			const query = wx.createSelectorQuery();
			query
				.selectAll('.menu-buttons')
				.boundingClientRect((rects) => {
					const touchX = e.detail.x;
					const touchY = e.detail.y;
					const isOutside = rects.every((rect) => touchX < rect.left || touchX > rect.right || touchY < rect.top || touchY > rect.bottom);
					if (isOutside) {
						this.resources = this.resources.map((item) => ({ ...item, showMenu: false }));
					}
				})
				.exec();
		},
		/**================================================加载页面数据模块====================================**/
		loadData() {
			this.loadRemoteJson()
				.then((data) => {
					this.processJsonData(data);
					this.showToast('数据请求成功', { heightPercent: 0.15 }, { direction: 'down' }, { StayTime: 2000 });
				})
				.catch((err) => {
					console.log('[error] 远程JSON加载失败，使用静态数据:', err);
					this.showToast('数据请求失败，现在用的是静态数据', { heightPercent: 0.15 }, { direction: 'down' }, { StayTime: 2000 });
					this.loadStaticData();
				});
		},
		loadRemoteJson() {
			return new Promise((resolve, reject) => {
				const jsonUrl = 'https://fugui.mynatapp.cc/fg/DocLibSource.json'; //需要更改的接口
				uni.request({
					url: jsonUrl,
					method: 'GET',
					timeout: 5000,
					success: (res) => {
						if (res.data && res.data.doc) resolve(res.data.doc);
						else reject(new Error('数据格式错误'));
					},
					fail: (err) => reject(err)
				});
			});
		},
		loadStaticData() {
			const staticData = [
				{
					id: 1,
					title: '机器学习框架：scikit-learn',
					preview: '深入了解scikit-learn，这个强大的Python库简化了数据挖掘和数据分析。了解其核心算法和工具如何加速机器学习模型的开发与评估过程。',
					img: '',
					url: 'https://github.com/datawhalechina/machine-learning-toy-code',
					category: '人工智能'
				},
				{
					id: 2,
					title: '稳定扩散是如何运作的',
					preview: '探索稳定扩散模型背后的机制，学习它如何生成逼真的数据点，广泛应用于图像、文本等领域，实现创新的数据增强和模拟解决方案。',
					img: '',
					url: 'https://waytoagi.feishu.cn/wiki/TNIRw7qsViYNVgkPaazcuaVfndc?table=tblolGx2mprs1EQz&view=vewgCZH6XZ',
					category: '人工智能'
				},
				{
					id: 3,
					title: '世界地理概览',
					preview: '快速游览世界地理，涵盖自然地貌、气候类型及人文特色。这份概览提供了对地球多样性的深刻理解，从高峰到深海，一览无余。',
					img: '',
					url: 'https://www.acfun.cn/v/ac22306887',
					category: '人文地理'
				},
				{
					id: 4,
					title: 'HWebBuilder',
					preview: '适合初学者的复刻项目，让你3天内迅速内化前端三件套',
					img: '',
					url: 'https://fugui.mynatapp.cc/main',
					category: '网站建设'
				}
			];
			this.processJsonData({ 人工智能: staticData.slice(0, 2), 人文地理: staticData.slice(2, 3), 网站建设: staticData.slice(3) });
		},
		processJsonData(jsonData) {
			const allItems = [];
			for (const category in jsonData) {
				jsonData[category].forEach((item) => allItems.push({ ...item, category }));
			}
			this.allResources = allItems.map((item) => ({
				id: item.id,
				title: item.title,
				preview: item.preview,
				img: this.isValidUrl(item.img) ? item.img : this.defaultImg,
				url: this.isValidUrl(item.url) ? item.url : null,
				category: item.category,
				showMenu: false,
				isFavorited: false
			}));
			const categoriesSet = new Set(['全部']);
			allItems.forEach((item) => categoriesSet.add(item.category));
			this.categories = Array.from(categoriesSet);
			this.loadResources();
		},
		isValidUrl(str) {
			if (!str) return false;
			const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i;
			return urlPattern.test(str);
		},
		loadResources() {
			this.loading = true;
			let filteredData = this.allResources.filter((item) => item.url);
			if (this.currentCategory !== '全部') {
				filteredData = filteredData.filter((item) => item.category === this.currentCategory);
			}
			const data = filteredData.slice(0, this.pageSize * this.page);
			this.resources = data;
			this.loading = false;
		},
		/**==============================================滑动加载数据模块========================================**/
		handleTouchStart(e) {
			if (this.loading) return;
			const touch = e.touches[0];
			this.startY = touch.clientY;
			this.isTouching = true;
		},
		handleTouchMove(e) {
			if (!this.isTouching || this.loading) return;
			const touch = e.touches[0];
			const deltaY = this.startY - touch.clientY; // 正值表示上滑
			//const maxScrollTop = this.scrollHeight - this.windowHeight;

			// 判断是否到达底部
			this.getScrollInfo().then(({ scrollTop, scrollHeight }) => {
				const isAtBottom = scrollTop + this.windowHeight >= scrollHeight - 10; // 底部容差 10px
				if (deltaY > 0 && isAtBottom) {
					const offset = Math.min(deltaY * 0.5, 200); // 阻尼效果，最大 300rpx
					this.loadingHeight = offset; // 只调整 load-hint 的高度
					this.listOffset = -offset; // 列表向上移动
				}
			});
		},

		handleTouchEnd(e) {
			if (!this.isTouching || this.loading) return;
			this.isTouching = false;

			if (this.loadingHeight >= 100) {
				// 超出阈值触发加载
				this.loadingHeight = 83;
				this.listOffset = -83;
				this.isLoadingMore = true; // 进入加载状态
				this.loadMore();
			} else {
				// 未达阈值，回弹
				this.loadingHeight = 0;
				this.listOffset = 0;
			}
		},

		getScrollInfo() {
			return new Promise((resolve) => {
				const query = wx.createSelectorQuery();
				query.select('.resource-list').scrollOffset();
				query.select('.list-content').boundingClientRect();
				query.exec((res) => {
					this.scrollTop = res[0].scrollTop;
					this.scrollHeight = res[1].height;
					resolve({ scrollTop: this.scrollTop, scrollHeight: this.scrollHeight });
				});
			});
		},
		loadMore() {
			if (this.loading) return;
			this.loading = true;
			let filteredData = this.allResources.filter((item) => item.url);
			if (this.currentCategory !== '全部') {
				filteredData = filteredData.filter((item) => item.category === this.currentCategory);
			}
			const start = this.page * this.pageSize;
			const moreData = filteredData.slice(start, start + this.pageSize);
			if (moreData.length === 0) {
				setTimeout(() => {
					this.showToast('已经加载完所有资料了哦~', { heightPercent: 0.6 }, { direction: 'up' }, { StayTime: 700 });
					this.loading = false;
					this.isLoadingMore = false; // 复位加载状态
					this.loadingHeight = 0;
					this.listOffset = 0;
					return;
				}, 800); // 与复位动画一致
			} else {
				this.resources = this.resources.concat(moreData);
				this.page++;
				this.loading = false;
				setTimeout(() => {
					this.isLoadingMore = false; // 加载完成，复位状态
					this.loadingHeight = 0;
					this.listOffset = 0;
					this.showToast('新内容已更新！', { heightPercent: 0.6 }, { direction: 'up' }, { StayTime: 700 });
				}, 1500); // 与复位动画一致
			}
		},
		/**===============================================弹窗模块======================================**/
		showToast(context, ...args) {
			this.$refs.toast.show(context, ...args);
		},
		/**==============================================收藏模块=========================================**/
		toggleFavorite(item) {
			this.resources = this.resources.map((res) => {
				if (res.id === item.id) return { ...res, isFavorited: !res.isFavorited };
				return res;
			});
		},
		/**===========================================下载模块===============================================**/
		downloadFile(item) {
			if (!item.url || !this.isValidUrl(item.url)) {
				this.showToast('无效的下载链接', { heightPercent: 0.6 }, { direction: 'up' }, { StayTime: 2000 });
				return;
			}
			uni.downloadFile({
				url: item.url,
				success: (res) => {
					if (res.statusCode === 200) {
						uni.saveFile({
							tempFilePath: res.tempFilePath,
							success: () => {
								this.showToast(`文件下载成功，已保存到本地${res.tempFilePath}`, { heightPercent: 0.15 }, { direction: 'down' }, { StayTime: 2000 });
							},
							fail: (err) => {
								this.showToast('文件保存失败: ' + err.errMsg, { heightPercent: 0.15 }, { direction: 'down' }, { StayTime: 2000 });
							}
						});
					} else {
						this.showToast('下载失败，状态码: ' + res.statusCode, { heightPercent: 0.15 }, { direction: 'down' }, { StayTime: 2000 });
					}
				},
				fail: (err) => {
					this.showToast('下载失败: ' + err.errMsg, { heightPercent: 0.15 }, { direction: 'down' }, { StayTime: 2000 });
				}
			});
		},
		/**===================================================分享转发模块===========================================**/
		handleShareButton(item) {
			console.log('123');
			this.currentShareData = {
				title: item.title || '学习资源分享',
				path: '/pages/learnResource/DocLib',
				imageUrl: item.img || this.defaultImg
			};
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {
				const shareData = this.currentShareData || {
					title: '学习社区 - 资料库',
					path: '/pages/learnResource/DocLib',
					imageUrl: this.defaultImg
				};
				this.currentShareData = null; // 清空临时数据
				return shareData;
			}
			return {
				title: '学习社区 - 资料库',
				path: '/pages/learnResource/DocLib',
				imageUrl: this.defaultImg
			};
		}
		/**=============================================其他模块======================================**/
	}
};
</script>

<style lang="scss" scoped>
.container {
	height: 100vh;
	background-color: #f5f7fa;
	position: relative;
}

.categories-scroll {
	width: 100%;
	white-space: nowrap;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
	background-color: #fff;
	position: sticky;
	top: 0;
	z-index: 10;
}

.categories {
	display: inline-flex;
	padding: 24rpx 0;
	background-color: #fff;
}

.category {
	width: 180rpx;
	font-size: 30rpx;
	color: #666;
	text-align: center;
	padding: 12rpx 0;
	position: relative;
	transition: all 0.3s ease;
}

.category.active {
	color: #4a89dc;
	font-weight: 600;
}

.category.active::after {
	content: '';
	position: absolute;
	bottom: -4rpx;
	left: 50%;
	transform: translateX(-50%);
	width: 40%;
	height: 6rpx;
	background: linear-gradient(90deg, #4a89dc, #5ca8ff);
	border-radius: 6rpx;
	transition: all 0.3s ease;
}

.resource-list {
	position: relative;
	z-index: 2;
	overflow-y: scroll;
	-webkit-overflow-scrolling: touch;
	overscroll-behavior: auto;
	padding: 10rpx 0;
}

.list-content {
	position: relative;
}

.bottom-spacer {
	height: 60rpx;
}

.load-hint {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	background: linear-gradient(180deg, rgba(245, 247, 250, 0.8), rgba(220, 230, 245, 0.9));
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	font-size: 28rpx;
	color: #5a6c8d;
	transition: all 0.3s ease;
	z-index: 1;
	backdrop-filter: blur(5px);
	border-top: 1px solid rgba(200, 215, 235, 0.5);
}

.load-container {
	position: relative;
}

.resource-item {
	display: flex;
	align-items: center;
	padding: 24rpx;
	background-color: #fff;
	margin: 20rpx 24rpx;
	border-radius: 16rpx;
	width: calc(100% - 48rpx);
	box-sizing: border-box;
	height: auto;
	min-height: 150rpx;
	box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.06);
	transition: all 0.3s ease;
	border: 1px solid rgba(230, 235, 245, 0.8);
}

.resource-item:active {
	transform: scale(0.98);
	box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.04);
}

.item-img {
	width: 110rpx;
	height: 110rpx;
	margin-right: 24rpx;
	border-radius: 12rpx;
	object-fit: cover;
	box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
}

.item-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	padding: 4rpx 0;
}

.item-title {
	font-size: 32rpx;
	color: #2c3e50;
	line-height: 44rpx;
	max-width: 500rpx;
	display: block;
	font-weight: 600;
}

.item-title.ellipsis {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.item-desc {
	font-size: 26rpx;
	color: #7f8c9d;
	line-height: 36rpx;
	max-width: 500rpx;
	display: block;
	margin-top: 12rpx;
}

.item-desc.ellipsis-two {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
}

.item-more {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #f5f7fa;
	border-radius: 50%;
	margin-left: 10rpx;
	transition: all 0.2s ease;
}

.item-more:active {
	background-color: #e6ebf5;
}

.more-icon {
	font-size: 36rpx;
	color: #5a6c8d;
}

.menu-buttons {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding: 0 24rpx 16rpx 80rpx;
	background-color: transparent;
	z-index: 100;
	gap: 20rpx;
	animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
	from {
		opacity: 0;
		transform: translateY(-10rpx);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.menu-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	flex: 1;
	padding: 12rpx 16rpx;
	margin: 0 8rpx;
	background-color: #f5f7fa;
	border-radius: 12rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	transition: all 0.2s ease;
}

.menu-btn:active {
	transform: scale(0.95);
	background-color: #e6ebf5;
}

.share-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	flex: 1;
	padding: 0;
	margin: 0;
	background-color: transparent;
	border: none;
	font-size: 28rpx;
	color: #5a6c8d;
	line-height: 1;
	width: 100%;
	height: 100%;
}

.share-btn::after {
	border: none;
}

.btn-icon {
	width: 40rpx;
	height: 40rpx;
	margin-right: 10rpx;
}

.menu-btn text {
	font-size: 28rpx;
	color: #5a6c8d;
}

.loading,
.empty {
	text-align: center;
	font-size: 28rpx;
	color: #7f8c9d;
	padding: 30rpx;
}
</style>

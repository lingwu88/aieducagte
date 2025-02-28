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
				:style="{ height: 'calc(100vh - 100rpx)', transform: 'translateY(' + listOffset + 'rpx)' }"
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
								<text>{{ item.isFavorited ? '已收藏' : '收藏' }}</text>
							</view>
							<view class="menu-btn" @tap.stop="downloadFile(item)">
								<image src="/static/classroom/learnResource/ResourceLibrary/icon/download.ico" class="btn-icon"></image>
								<text>下载</text>
							</view>
							<view class="menu-btn" @tap.stop="shareResource(item)">
								<image src="/static/classroom/learnResource/ResourceLibrary/icon/Forward.ico" class="btn-icon"></image>
								<text>分享转发</text>
							</view>
						</view>
					</block>
					<view v-if="loading" class="loading">加载中...</view>
					<view v-if="!resources.length && !loading" class="empty">暂无数据</view>
					<view class="bottom-spacer"></view>
					<!-- 新增底部占位 -->
				</view>
			</scroll-view>
			<view class="load-hint" :style="{ height: loadingHeight + 'rpx', opacity: loadingHeight / 150 }">
				<text v-if="loadingHeight < 150">上滑加载更多</text>
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
			maxTitleLength: 20,
			maxPreviewLength: 40,
			// 加载更多相关
			loadingHeight: 0, // 底部提示高度
			listOffset: 0, // 列表整体向上位移
			startY: 0, // 触摸起始 Y 坐标
			isTouching: false, // 是否正在触摸
			scrollTop: 0, // 当前滚动位置
			scrollHeight: 0, // 列表内容高度
			windowHeight: uni.getSystemInfoSync().windowHeight // 屏幕高度
		};
	},
	onLoad() {
		this.loadData();
	},
	methods: {
		// ... 其他方法（loadData, loadRemoteJson, processJsonData 等保持不变） ...

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
			const maxScrollTop = this.scrollHeight - this.windowHeight;

			// 判断是否到达底部
			this.getScrollInfo().then(({ scrollTop, scrollHeight }) => {
				const isAtBottom = scrollTop + this.windowHeight >= scrollHeight - 10; // 底部容差 10px
				if (deltaY > 0 && isAtBottom) {
					const offset = Math.min(deltaY * 0.5, 300); // 阻尼效果，最大 300rpx
					this.loadingHeight = offset; // 只调整 load-hint 的高度
					this.listOffset = -offset; // 列表向上移动
				}
			});
		},

		handleTouchEnd(e) {
			if (!this.isTouching || this.loading) return;
			this.isTouching = false;

			if (this.loadingHeight >= 150) {
				// 超出阈值触发加载
				this.loadingHeight = 150;
				this.listOffset = -150;
				this.loadMore();
				setTimeout(() => {
					this.loadingHeight = 0;
					this.listOffset = 0;
				}, 800); // 复位时间调整为 0.8秒
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
				this.showToast('已经加载完所有资料了哦~', 0.6);
				this.loading = false;
				return;
			}
			this.resources = this.resources.concat(moreData);
			this.page++;
			this.loading = false;
		},

		loadData() {
			this.loadRemoteJson()
				.then((data) => {
					this.processJsonData(data);
					this.showToast('数据请求成功', 0.15, 'down');
				})
				.catch((err) => {
					console.error('远程JSON加载失败，使用静态数据:', err);
					this.showToast('数据请求失败，现在用的是静态数据', 0.15, 'down');
					this.loadStaticData();
				});
		},
		loadRemoteJson() {
			return new Promise((resolve, reject) => {
				const jsonUrl = 'https://fugui.mynatapp.cc/fg/source.json';
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
					preview: '学习AI的基本概念',
					img: '/static/classroom/learnResource/ResourceLibrary/Pic/res1.jpg',
					url: 'https://github.com/datawhalechina/machine-learning-toy-code',
					category: '人工智能'
				},
				{
					id: 2,
					title: '稳定扩散是如何运作的',
					preview: '深度学习基础',
					img: '/static/classroom/learnResource/ResourceLibrary/Pic/res2.jpg',
					url: 'https://waytoagi.feishu.cn/wiki/TNIRw7qsViYNVgkPaazcuaVfndc?table=tblolGx2mprs1EQz&view=vewgCZH6XZ',
					category: '人工智能'
				},
				{ id: 3, title: '世界地理概览', preview: '了解全球地理', img: 'https://via.placeholder.com/100', url: 'https://example.com/geo', category: '人文地理' }
			];
			this.processJsonData({ 人工智能: staticData.slice(0, 2), 人文地理: staticData.slice(2) });
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
		toggleFavorite(item) {
			this.resources = this.resources.map((res) => {
				if (res.id === item.id) return { ...res, isFavorited: !res.isFavorited };
				return res;
			});
		},
		navigateTo(url) {
			uni.navigateTo({ url: `/pages/learnResource/webview?url=${encodeURIComponent(url)}` });
		},
		showToast(message, heightPercent = 0.5, ...args) {
			this.$refs.toast.show(message, heightPercent, ...args);
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
		}
	}
};
</script>

<style lang="scss" scoped>
.container {
	height: 100vh;
	background-color: #fafafa;
}
.categories-scroll {
	width: 100%;
	white-space: nowrap;
	box-shadow: 0 7rpx 9rpx rgba(0, 0, 0, 0.15);
}
.categories {
	display: inline-flex;
	padding: 20rpx 0;
	background-color: #fefefe;
}
.category {
	width: 180rpx;
	font-size: 32rpx;
	color: #666;
	text-align: center;
	padding: 10rpx 0;
}
.category.active {
	color: #007aff;
	border-bottom: 4rpx solid #007aff;
}
.resource-list {
	position: relative;
	z-index: 2;
	overflow-y: scroll;
	-webkit-overflow-scrolling: touch;
	overscroll-behavior: auto;
}

.list-content {
	position: relative;
}

.bottom-spacer {
	height: 150rpx; /* 固定底部空白高度 */
}

.load-hint {
	position: fixed; /* 改为 fixed，固定在屏幕底边 */
	bottom: 0; /* 下沿贴底 */
	left: 0;
	width: 100%;
	background-color: #f0f0f0;
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	font-size: 28rpx;
	color: #666;
	transition: opacity 0.2s ease; /* 只过渡透明度 */
	z-index: 1;
}

.resource-item {
	display: flex;
	align-items: center;
	padding: 20rpx;
	background-color: #fff;
	margin: 15rpx 20rpx 20rpx 20rpx;
	border-radius: 10rpx;
	width: 675rpx;
	height: 135rpx;
	box-shadow: 0 7rpx 9rpx rgba(0, 0, 0, 0.17);
}
.item-img {
	width: 100rpx;
	height: 100rpx;
	margin-right: 20rpx;
}
.item-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}
.item-title {
	font-size: 32rpx;
	color: #333;
	line-height: 40rpx;
	max-width: 500rpx;
	display: block;
}
.item-title.ellipsis {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.item-desc {
	font-size: 24rpx;
	color: #999;
	line-height: 30rpx;
	max-width: 500rpx;
	display: block;
	margin-top: 10rpx;
}
.item-desc.ellipsis-two {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
}
.item-more {
	width: 40rpx;
	height: 55rpx;
	display: flex;
	align-items: flex-end;
	justify-content: center;
	background-color: #f0f0f0;
	border-radius: 8rpx;
	padding-bottom: 0rpx;
	margin-top: auto;
}
.more-icon {
	font-size: 40rpx;
	color: #666;
	text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}
.menu-buttons {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding: 0 20rpx 10rpx 60rpx;
	background-color: transparent;
	z-index: 10000;
	gap: 20rpx; // 添加按钮间距
}
.menu-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	flex: 1;
	padding: 10rpx;
	margin: 0 10rpx;
	background-color: #fff;
	border-radius: 8rpx;
	box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.15);
	z-index: 10001;
}
.btn-icon {
	width: 40rpx;
	height: 40rpx;
	margin-right: 10rpx;
	z-index: 10001;
}
.menu-btn text {
	font-size: 28rpx;
	color: #333;
}
.loading,
.empty {
	text-align: center;
	font-size: 28rpx;
	color: #999;
	padding: 20rpx;
}
</style>

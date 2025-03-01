<template>
	<view class="container" @touchstart="handleTouchStart">
		<!-- 提示组件 -->
		<toast ref="toast"></toast>
		<!-- 分类导航，支持滑动 -->
		<scroll-view scroll-x class="categories-scroll">
			<view class="categories">
				<view v-for="(category, index) in categories" :key="index" class="category"
					:class="{ active: currentCategory === category }" @click="changeCategory(category)">
					{{ category }}
				</view>
			</view>
		</scroll-view>
		<!-- 资料列表 -->
		<scroll-view scroll-y class="resource-list" @scrolltolower="loadMore">
			<block v-for="item in resources" :key="item.id">
				<view v-if="item.url" class="resource-item" @click="navigateTo(item.url)">
					<image :src="item.img || defaultImg" class="item-img"></image>
					<view class="item-content">
						<text class="item-title"
							:class="{ ellipsis: item.title.length > maxTitleLength }">{{ item.title || '无标题' }}</text>
						<text class="item-desc"
							:class="{ 'ellipsis-two': item.preview && item.preview.length > maxPreviewLength }">{{ item.preview || '无描述' }}</text>
					</view>
					<view class="item-more" @click.stop="toggleMenu(item.id)">
						<text class="more-icon">⋮</text>
					</view>
				</view>
				<view v-if="item.showMenu" class="menu-buttons" @touchstart.stop>
					<view class="menu-btn" @tap="toggleFavorite(item)">
						<image
							:src="item.isFavorited ? '/static/classroom/learnResource/ResourceLibrary/icon/star-filled.ico' : '/static/classroom/learnResource/ResourceLibrary/icon/star.ico'"
							class="btn-icon"></image>
						<text>{{ item.isFavorited ? '已收藏' : '收藏' }}</text>
					</view>
					<view class="menu-btn">
						<image src="/static/classroom/learnResource/ResourceLibrary/icon/download.ico" class="btn-icon">
						</image>
						<text>下载</text>
					</view>
					<view class="menu-btn">
						<image src="/static/classroom/learnResource/ResourceLibrary/icon/Forward.ico" class="btn-icon">
						</image>
						<text>分享转发</text>
					</view>
				</view>
			</block>
			<view v-if="loading" class="loading">加载中...</view>
			<view v-if="!resources.length && !loading" class="empty">暂无数据</view>
		</scroll-view>
	</view>
</template>

<script>
	import Toast from '@/pages/learnResource/components/Toast.vue'; // 引入提示组件

	export default {
		components: {
			Toast
		},
		data() {
			return {
				categories: ['全部'], // 默认包含“全部”，动态添加其他分类
				currentCategory: '全部',
				allResources: [], // 存储所有资源数据
				resources: [], // 当前显示的资源列表
				pageSize: 20,
				page: 1,
				loading: false,
				defaultImg: '/static/classroom/learnResource/ResourceLibrary/Pic/Doc_unfounded.png', // 默认图片
				maxTitleLength: 20, // 标题最大字符数（约一行）
				maxPreviewLength: 40 // 描述最大字符数（约两行）
			};
		},
		onLoad() {
			this.loadData();
		},
		methods: {
			loadData() {
				this.loadRemoteJson()
					.then(data => {
						this.processJsonData(data);
						this.showToast('数据请求成功'); // 网络请求成功时弹出提示
					})
					.catch(err => {
						console.error('远程JSON加载失败，使用静态数据:', err);
						this.showToast('数据请求失败，现在用的是静态数据'); // 网络请求失败时弹出提示
						this.loadStaticData(); // 请求失败时加载静态数据
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
							if (res.data && res.data.doc) {
								resolve(res.data.doc);
							} else {
								reject(new Error('数据格式错误'));
							}
						},
						fail: (err) => {
							reject(err);
						}
					});
				});
			},
			loadStaticData() {
				const staticData = [{
						id: 1,
						title: 'AI基础教程',
						preview: '学习AI的基本概念',
						img: '/static/classroom/learnResource/res1.jpg',
						url: 'https://mp.weixin.qq.com/s/MlGBDFaSr6qPq2sk-cI4FA',
						category: '人工智能'
					},
					{
						id: 2,
						title: '深度学习入门',
						preview: '深度学习基础',
						img: '/static/classroom/learnResource/res2.jpg',
						url: 'https://www.datawhale.cn/learn/content/30/1833',
						category: '人工智能'
					},
					{
						id: 3,
						title: '世界地理概览',
						preview: '了解全球地理',
						img: 'https://via.placeholder.com/100',
						url: 'https://example.com/geo',
						category: '人文地理'
					}
				];
				this.processJsonData({
					'人工智能': staticData.slice(0, 2),
					'人文地理': staticData.slice(2)
				});
			},
			processJsonData(jsonData) {
				const allItems = [];
				for (const category in jsonData) {
					jsonData[category].forEach(item => {
						allItems.push({
							...item,
							category
						});
					});
				}
				this.allResources = allItems.map(item => ({
					id: item.id,
					title: item.title,
					preview: item.preview,
					img: this.isValidUrl(item.img) ? item.img : this.defaultImg,
					url: this.isValidUrl(item.url) ? item.url : null,
					category: item.category,
					showMenu: false
				}));

				const categoriesSet = new Set(['全部']);
				allItems.forEach(item => categoriesSet.add(item.category));
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
				let filteredData = this.allResources.filter(item => item.url);
				if (this.currentCategory !== '全部') {
					filteredData = filteredData.filter(item => item.category === this.currentCategory);
				}
				const data = filteredData.slice(0, this.pageSize * this.page);
				this.resources = data;
				this.loading = false;

				filteredData.forEach(item => {
					if (!this.isValidUrl(item.url)) {
						this.showToast('url导向错误，联系开发者维护');
					}
				});
			},
			loadMore() {
				if (this.loading) return;
				this.loading = true;
				setTimeout(() => {
					let filteredData = this.allResources.filter(item => item.url);
					if (this.currentCategory !== '全部') {
						filteredData = filteredData.filter(item => item.category === this.currentCategory);
					}
					const start = this.page * this.pageSize;
					const moreData = filteredData.slice(start, start + this.pageSize);
					this.resources = this.resources.concat(moreData);
					this.page++;
					this.loading = false;
				}, 1000);
			},
			changeCategory(category) {
				this.currentCategory = category;
				this.page = 1;
				this.resources = [];
				this.loadResources();
			},
			toggleMenu(id) {
				this.resources = this.resources.map(item => ({
					...item,
					showMenu: item.id === id ? !item.showMenu : false
				}));
			},
			toggleFavorite(item) {
				this.resources = this.resources.map(res => {
					if (res.id === item.id) {
						return {
							...res,
							isFavorited: !res.isFavorited
						}; // 切换收藏状态
					}
					return res;
				});
				console.log(`${item.isFavorited ? '取消收藏' : '收藏'}: ${item.title}`);
			},
			handleTouchStart(e) {
				const touch = e.touches[0];
				const menus = this.resources.filter(item => item.showMenu);
				if (menus.length === 0) return;

				const query = wx.createSelectorQuery();
				let isOutside = true;
				menus.forEach(item => {
					query.select(`#menu-${item.id}`).boundingClientRect(rect => {
						if (
							touch.clientX >= rect.left &&
							touch.clientX <= rect.right &&
							touch.clientY >= rect.top &&
							touch.clientY <= rect.bottom
						) {
							isOutside = false;
						}
					});
				});
				query.selectAll('.resource-item').boundingClientRect(items => {
					items.forEach(rect => {
						if (
							touch.clientX >= rect.left &&
							touch.clientX <= rect.right &&
							touch.clientY >= rect.top &&
							touch.clientY <= rect.bottom
						) {
							isOutside = false;
						}
					});
				}).exec(() => {
					if (isOutside) {
						this.resources = this.resources.map(item => ({
							...item,
							showMenu: false
						}));
					}
				});
			},
			navigateTo(url) {
				if (this.isValidUrl(url)) {
					uni.navigateTo({
						url: `/pages/learnResource/webview?url=${encodeURIComponent(url)}`
					});
				} else {
					this.showToast('url导向错误，联系开发者维护');
				}
			},
			showToast(message) {
				this.$refs.toast.show(message);
			}
		}
	};
</script>
<style lang="scss" scoped>
	.container {
		height: 100vh;
		background-color: #f5f5f5;
	}

	.categories-scroll {
		width: 100%;
		white-space: nowrap;
	}

	.categories {
		display: inline-flex;
		padding: 20rpx 0;
		background-color: #fff;
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
		height: calc(100vh - 100rpx);
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
		overflow: hidden;
	}

	.item-title {
		font-size: 32rpx;
		color: #333;
		line-height: 40rpx;
		max-width: 500rpx;
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
		box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
	}

	.btn-icon {
		width: 40rpx;
		height: 40rpx;
		margin-right: 10rpx;
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
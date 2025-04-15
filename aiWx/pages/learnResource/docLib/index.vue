<template>
	<view class="container" @tap="handleContainerTap">
		<toast ref="toast"></toast>
		<!-- 添加固定顶部区域容器 -->
		<view class="fixed-header">
			<scroll-view scroll-x class="categories-scroll">
				<view class="categories">
					<view v-for="(category, index) in categories" :key="index" class="category" :class="{ active: currentCategory === category }" @click="changeCategory(category)">
						{{ category }}
					</view>
				</view>
			</scroll-view>
			<!-- 搜索框 -->
			<view class="search-container">
				<input type="text" class="search-input" placeholder-class="placeholder" placeholder="-" v-model="searchQuery" @input="filterResources" />
			</view>
		</view>
		<view class="load-container">
			<scroll-view
				scroll-y
				class="resource-list"
				@touchstart="handleTouchStart"
				@touchmove="handleTouchMove"
				@touchend="handleTouchEnd"
				:style="{ height: 'calc(100vh - 250rpx)', transform: 'translateY(' + listOffset + 'rpx)' }"
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
											? 'http://120.26.132.46:8091/classroom/learnResource/ResourceLibrary/icon/star-filled.ico'
											: 'http://120.26.132.46:8091/classroom/learnResource/ResourceLibrary/icon/star.ico'
									"
									class="btn-icon"
								></image>
								<text>{{ item.isFavorited ? '已收藏' : '未收藏' }}</text>
							</view>
							<view class="menu-btn" @tap.stop="downloadFile(item)">
								<image src="http://120.26.132.46:8091/classroom/learnResource/ResourceLibrary/icon/download.ico" class="btn-icon"></image>
								<text>下载</text>
							</view>
							<view class="menu-btn" open-type="share" @tap.stop="handleShareButton(item)">
								<button open-type="share" class="share-btn" :data-item="item" @tap.stop="handleShareButton(item)">
									<image src="http://120.26.132.46:8091/classroom/learnResource/ResourceLibrary/icon/Forward.ico" class="btn-icon"></image>
									<text>分享</text>
								</button>
							</view>
						</view>
					</block>
					<view class="bottom-spacer"></view>
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
import pageTime from '../../../mixins/pageTime';
import Toast from '../components/Toast.vue';
import StaticData from '../docLib/src/data/staticData.vue';
import regularMatch from '../docLib/src/utils/regularMatch.vue';

export default {
	mixins: [pageTime],
	components: { Toast },
	data() {
		return {
			DEBUG: true,
			categories: ['全部'],
			currentCategory: '全部',
			allResources: [],
			resources: [],
			pageSize: 20,
			page: 1,
			loading: false,
			defaultImg: 'http://120.26.132.46:8091/classroom/learnResource/ResourceLibrary/Pic/Doc_unfounded.png',
			maxTitleLength: 17,
			maxPreviewLength: 40,
			loadingHeight: 0,
			listOffset: 0,
			startY: 0,
			isTouching: false,
			scrollTop: 0,
			scrollHeight: 0,
			windowHeight: uni.getSystemInfoSync().windowHeight,
			isLoadingMore: false,
			// Added for search
			searchQuery: '',
			filteredResources: []
		};
	},
	onLoad() {
		console.log(regularMatch.methods.isValidUrl('https://fugui.mynatapp.cc/fg/DocLibSource.json'));

		this.loadData();
	},
	mounted() {
		this.checkUserId();
		this.setType(2);
	},
	methods: {
		showToast(context, ...args) {
			this.$refs.toast.show(context, ...args);
		},
		/* 加载数据过程 */
		loadData() {
			this.loadServerRes()
				.then((data_Res_Server_Handled) => {
					/* 处理返回的数据 */
					this.processJsonData(data_Res_Server_Handled.res_Server_Unhandled.data.data);
					this.showToast('数据请求成功', { heightPercent: 0.15 }, { direction: 'down' }, { StayTime: 2000 });
				})
				.catch((err_Res_Server_Handled) => {
					/* 统一的错误处理 */
					let errorMessage = '';
					switch (err_Res_Server_Handled.code) {
						case 1001:
						case 1002:
						case 1003:
						case 1004:
							errorMessage = `网络请求失败: ${err_Res_Server_Handled.message}`;
							break;
						case 2001:
						case 2002:
						case 2003:
						case 2004:
							errorMessage = `服务器错误: ${err_Res_Server_Handled.message}`;
							break;
						case 3001:
						case 3002:
							errorMessage = `未知错误: ${err_Res_Server_Handled.message}`;
							break;
						default:
							errorMessage = `未预料的错误: ${err_Res_Server_Handled.message}`;
					}
					this.showToast(errorMessage, { heightPercent: 0.15 }, { direction: 'down' }, { StayTime: 2000 });
					this.loadStaticData(); // 加载备用数据
				});
		},

		loadServerRes() {
			return new Promise((resolve, reject) => {
				let res_Server_Handled = {
					type: 'raw',
					targetUrl: 'http://120.24.243.227:13100/api/learning-resources/doc-lib-resource',
					code: 0,
					message: '',
					res_Server_Unhandled: {}
				};
				uni.request({
					url: res_Server_Handled.targetUrl,
					method: 'GET',
					timeout: 5000,
					success: (res) => {
						console.log(res);
						if (!res.statusCode) {
							res_Server_Handled.code = 1001;
							res_Server_Handled.type = 'error';
							res_Server_Handled.message = '目标服务器响应缺少 statusCode';
							res_Server_Handled.res_Server_Unhandled = res;
							reject(res_Server_Handled);
							return;
						}
						switch (res.statusCode) {
							case 200:
								if (!res.data.code) {
									res_Server_Handled.code = 2004;
									res_Server_Handled.type = 'error';
									res_Server_Handled.message = '不是目标服务器返回的状态:200';
									res_Server_Handled.res_Server_Unhandled = res;
									reject(res_Server_Handled);
									return;
								}
								switch (res.data.code) {
									case 200:
										res_Server_Handled.code = 200;
										res_Server_Handled.type = 'data';
										res_Server_Handled.message = '目标服务器返回了正确的结果';
										res_Server_Handled.res_Server_Unhandled = res;
										resolve(res_Server_Handled);
										break;
									case 250:
										res_Server_Handled.code = 2001;
										res_Server_Handled.type = 'error';
										res_Server_Handled.message = `目标服务器 JSON 解析错误: ${res.data.message || '未知错误'}`;
										res_Server_Handled.res_Server_Unhandled = res;
										reject(res_Server_Handled);
										break;
									case 404:
										res_Server_Handled.code = 2002;
										res_Server_Handled.type = 'error';
										res_Server_Handled.message = `目标服务器文件不存在: ${res.data.message || '未知错误'}`;
										res_Server_Handled.res_Server_Unhandled = res;
										reject(res_Server_Handled);
										break;
									case 500:
										res_Server_Handled.code = 2003;
										res_Server_Handled.type = 'error';
										res_Server_Handled.message = `目标服务器其他未知错误: ${res.data.message || '未知错误'}`;
										res_Server_Handled.res_Server_Unhandled = res;
										reject(res_Server_Handled);
										break;
									default:
										res_Server_Handled.code = 3001;
										res_Server_Handled.type = 'error';
										res_Server_Handled.message = `目标服务器返回未知错误码: ${res.data.code}`;
										res_Server_Handled.res_Server_Unhandled = res;
										reject(res_Server_Handled);
								}
								break;
							case 404:
								res_Server_Handled.code = 1002;
								res_Server_Handled.type = 'error';
								res_Server_Handled.message = '目标服务器隧道闲置';
								res_Server_Handled.res_Server_Unhandled = res;
								reject(res_Server_Handled);
								break;
							case 502:
								res_Server_Handled.code = 1003;
								res_Server_Handled.type = 'error';
								res_Server_Handled.message = '目标服务器端口闲置';
								res_Server_Handled.res_Server_Unhandled = res;
								reject(res_Server_Handled);
								break;
							default:
								res_Server_Handled.code = 3002;
								res_Server_Handled.type = 'error';
								res_Server_Handled.message = `目标服务器返回未预料的 HTTP 状态码: ${res.statusCode}`;
								res_Server_Handled.res_Server_Unhandled = res;
								reject(res_Server_Handled);
						}
					},
					fail: (err) => {
						res_Server_Handled.type = 'error';
						res_Server_Handled.code = 1004;
						res_Server_Handled.message = `请求失败: ${err.errMsg}`;
						reject(res_Server_Handled);
					}
				});
			});
		},
		
		loadStaticData() {
			this.processJsonData(StaticData.data().staticData);
		},
		
		processJsonData(jsonData) {
			const allItems = [];
			if (jsonData.WebView) {
				jsonData = jsonData.WebView;
			}
			console.log('渲染数据有:', jsonData);

			for (const category in jsonData) {
				jsonData[category].forEach((item) => allItems.push({ ...item, category }));
			}
			this.allResources = allItems.map((item) => ({
				id: item.id,
				title: item.title,
				preview: item.preview,
				img: regularMatch.methods.isValidUrl(item.img) ? item.img : this.defaultImg,
				url: regularMatch.methods.isValidUrl(item.url) ? item.url : null,
				category: item.category,
				showMenu: false,
				isFavorited: false
			}));
			const categoriesSet = new Set(['全部']);
			allItems.forEach((item) => categoriesSet.add(item.category));
			this.categories = Array.from(categoriesSet);
			this.loadResources();
		},
		// Existing methods unchanged unless specified
		changeCategory(category) {
			this.currentCategory = category;
			this.page = 1;
			this.searchQuery = ''; // Reset search when changing category
			this.resources = [];
			this.loadResources();
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
		loadMore() {
			if (this.loading) return;
			this.loading = true;
			let filteredData = this.allResources.filter((item) => item.url);
			if (this.searchQuery) {
				// If searching, use filteredResources instead of category
				filteredData = this.filteredResources;
			} else if (this.currentCategory !== '全部') {
				filteredData = filteredData.filter((item) => item.category === this.currentCategory);
			}
			const start = this.page * this.pageSize;
			const moreData = filteredData.slice(start, start + this.pageSize);
			if (moreData.length === 0) {
				setTimeout(() => {
					this.showToast('已经加载完所有资料了哦~', { heightPercent: 0.6 }, { direction: 'up' }, { StayTime: 700 });
					this.loading = false;
					this.isLoadingMore = false;
					this.loadingHeight = 0;
					this.listOffset = 0;
				}, 800);
			} else {
				this.resources = this.resources.concat(moreData);
				this.page++;
				this.loading = false;
				setTimeout(() => {
					this.isLoadingMore = false;
					this.loadingHeight = 0;
					this.listOffset = 0;
					this.showToast('新内容已更新！', { heightPercent: 0.6 }, { direction: 'up' }, { StayTime: 700 });
				}, 1500);
			}
		},
		// Added search method
		filterResources() {
			const query = this.searchQuery.toLowerCase();
			if (query === '') {
				this.page = 1; // Reset page when clearing search
				this.loadResources();
			} else {
				this.filteredResources = this.allResources.filter(
					(item) =>
						item.url && // Only include items with valid URLs
						(item.title.toLowerCase().includes(query) || (item.preview && item.preview.toLowerCase().includes(query)))
				);
				this.page = 1; // Reset page for new search
				this.resources = this.filteredResources.slice(0, this.pageSize * this.page);
			}
		},
		// Other existing methods remain unchanged
		toggleMenu(id) {
			this.resources = this.resources.map((item) => ({
				...item,
				showMenu: item.id === id ? !item.showMenu : false
			}));
		},
		navigateTo(url) {
			uni.navigateTo({
				url: `/pages/learnResource/components/webview?url=${encodeURIComponent(url)}`,
				events: {
					returnData: (data) => {
						if (data.status == 'TIMEOUT') {
							this.showToast('当前页面响应超时，自动退出！或许你可以尝试使用VPN?', { heightPercent: 0.6 }, { direction: 'right' }, { StayTime: 4000 });
						} else if (data.status == 'TIMEOUTINVPN') {
							this.showToast(
								`当前页面响应超时!\n检测到当前VPN节点为 \n  ${data[0].country}!\n或许可以切换节点或者关闭VPN后再重试！`,
								{ heightPercent: 0.6 },
								{ direction: 'right' },
								{ StayTime: 12000 }
							);
						} else if (data.status == 'ERROR') {
							this.showToast('当前页面响应错误，自动退出！', { heightPercent: 0.6 }, { direction: 'right' }, { StayTime: 2000 });
						} else if (data.status == 'ERROR_hasHandle') {
							this.showToast('你刚刚浏览的页面响应错误，已经手动退出！', { heightPercent: 0.6 }, { direction: 'right' }, { StayTime: 2000 });
						}
					}
				}
			});
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

		handleTouchStart(e) {
			if (this.loading) return;
			const touch = e.touches[0];
			this.startY = touch.clientY;
			this.isTouching = true;
		},
		handleTouchMove(e) {
			if (!this.isTouching || this.loading) return;
			const touch = e.touches[0];
			const deltaY = this.startY - touch.clientY;
			this.getScrollInfo().then(({ scrollTop, scrollHeight }) => {
				const isAtBottom = scrollTop + this.windowHeight >= scrollHeight - 10;
				if (deltaY > 0 && isAtBottom) {
					const offset = Math.min(deltaY * 0.5, 200);
					this.loadingHeight = offset;
					this.listOffset = -offset;
				}
			});
		},
		handleTouchEnd(e) {
			if (!this.isTouching || this.loading) return;
			this.isTouching = false;
			if (this.loadingHeight >= 100) {
				this.loadingHeight = 83;
				this.listOffset = -83;
				this.isLoadingMore = true;
				this.loadMore();
			} else {
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

		toggleFavorite(item) {
			this.resources = this.resources.map((res) => {
				if (res.id === item.id) return { ...res, isFavorited: !res.isFavorited };
				return res;
			});
		},
		downloadFile(item) {
			if (!item.url || !regularMatch.methods.isValidUrl(item.url)) {
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
		handleShareButton(item) {
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
				this.currentShareData = null;
				return shareData;
			}
			return {
				title: '学习社区 - 资料库',
				path: '/pages/learnResource/DocLib',
				imageUrl: this.defaultImg
			};
		}
	}
};
</script>

<style lang="scss" scoped>
.container {
	height: 100vh;
	background-color: #f8f9fd;
	position: relative;
	overflow: hidden;
}

.fixed-header {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	z-index: 100;
	background: linear-gradient(135deg, #5b6af0 0%, #7b89ff 100%);
}

.categories-scroll {
	width: 100%;
	white-space: nowrap;
	background: rgba(255, 255, 255, 0.1);
	backdrop-filter: blur(10px);
}

.categories {
	display: inline-flex;
	padding: 20rpx 0;
}

.category {
	width: 180rpx;
	font-size: 32rpx;
	color: rgba(255, 255, 255, 0.8);
	text-align: center;
	padding: 10rpx 0;
	transition: all 0.3s ease;
	position: relative;
}

.category.active {
	color: #ffffff;
	font-weight: 600;
	&::after {
		content: '';
		position: absolute;
		bottom: -4rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 40rpx;
		height: 4rpx;
		background: #ffffff;
		border-radius: 2rpx;
	}
}

.load-container {
	position: relative;
	padding-top: 200rpx;
	height: 100%;
	box-sizing: border-box;
}

.resource-list {
	position: relative;
	z-index: 2;
	overflow-y: scroll;
	-webkit-overflow-scrolling: touch;
	overscroll-behavior: auto;
	padding: 20rpx 0;
	box-sizing: border-box;
}

.list-content {
	position: relative;
}

.bottom-spacer {
	height: 45rpx;
}

.load-hint {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	background: linear-gradient(135deg, #5b6af0 0%, #7b89ff 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	font-size: 28rpx;
	color: #ffffff;
	transition: all 0.3s ease;
	z-index: 1;
	border-top-left-radius: 20rpx;
	border-top-right-radius: 20rpx;
}

.resource-item {
	display: flex;
	align-items: center;
	padding: 25rpx;
	background-color: #ffffff;
	margin: 15rpx 20rpx;
	border-radius: 16rpx;
	box-shadow: 0 8rpx 16rpx rgba(91, 106, 240, 0.1);
	position: relative;
	z-index: 1;
	transition: transform 0.2s ease;
	box-sizing: border-box;

	&:active {
		transform: scale(0.98);
		box-shadow: 0 4rpx 8rpx rgba(91, 106, 240, 0.08);
	}
}

.item-img {
	width: 100rpx;
	height: 100rpx;
	margin-right: 20rpx;
	border-radius: 12rpx;
	box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
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
	font-weight: 600;
}

.item-title.ellipsis {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.item-desc {
	font-size: 26rpx;
	color: #666;
	line-height: 34rpx;
	max-width: 500rpx;
	display: block;
	margin-top: 8rpx;
}

.item-desc.ellipsis-two {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
}

.item-more {
	width: 44rpx;
	height: 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(135deg, #5b6af0 0%, #7b89ff 100%);
	border-radius: 22rpx;
	margin-left: 15rpx;
	transition: transform 0.2s ease;

	&:active {
		transform: scale(0.9);
	}
}

.more-icon {
	font-size: 36rpx;
	color: #ffffff;
}

.menu-buttons {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding: 0 20rpx 10rpx 60rpx;
	background-color: transparent;
	z-index: 5;
	gap: 20rpx;
	position: relative;
}

.menu-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	flex: 1;
	padding: 12rpx;
	margin: 0 10rpx;
	background: #ffffff;
	z-index: 10001;
	box-sizing: border-box;
	border-radius: 12rpx;
	box-shadow: 0 4rpx 8rpx rgba(91, 106, 240, 0.1);
	transition: transform 0.2s ease;

	&:active {
		transform: scale(0.95);
	}
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
	color: #333;
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
	z-index: 10001;
}

.menu-btn text {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
}

.loading,
.empty {
	text-align: center;
	font-size: 28rpx;
	color: #666;
	padding: 20rpx;
}

.search-container {
	padding: 30rpx 20rpx;
	background: rgba(255, 255, 255, 0.1);
	backdrop-filter: blur(10px);
	position: relative;
	z-index: 10;
	box-sizing: border-box;
}

.search-input {
	width: calc(100% - 48rpx);
	padding: 30rpx 32rpx;
	font-size: 30rpx;
	background: rgba(255, 255, 255, 0.9);
	border: none;
	border-radius: 12rpx;
	color: #333;
	box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
	box-sizing: border-box;
}

.placeholder {
	color: rgba(102, 102, 102, 0.6);
	font-size: 30rpx;
}
</style>

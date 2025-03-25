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
    <!-- Added Search Box -->
    <view class="search-container">
      <input type="text" placeholder="搜索资源..." v-model="searchQuery" @input="filterResources" />
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
      DEBUG: true,
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
    this.loadData();
  },
  methods: {
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
        url: `/pages/learnResource/webview?url=${encodeURIComponent(url)}`,
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
    loadData() {
      this.loadRemoteJson()
        .then((data) => {
          this.processJsonData(data);
          this.showToast('数据请求成功', { heightPercent: 0.15 }, { direction: 'down' }, { StayTime: 2000 });
        })
        .catch((err) => {
          let info = '[error] 远程JSON加载失败，使用静态数据';
          console.log(info, err);
          this.showToast(this.DEBUG ? `${info}\n[BEGUG] ${err}` : info, { heightPercent: 0.15 }, { direction: 'down' }, { StayTime: 2000 });
          this.loadStaticData();
        });
    },
    loadRemoteJson() {
      return new Promise((resolve, reject) => {
        const jsonUrl = 'https://fugui.mynatapp.cc/fg/DocLibSource.json';
        uni.request({
          url: jsonUrl,
          method: 'GET',
          timeout: 5000,
          success: (res) => {
            if (res.data && res.data.doc) resolve(res.data.doc);
            else reject(`code:success ${jsonUrl}`);
          },
          fail: (err) => reject(`code:fail ${jsonUrl}`)
        });
      });
    },
    loadStaticData() {
      const staticData = [
        {
          id: 1,
          title: '机器学习框架：scikit-learn',
          preview: '深入了解scikit-learn，这个强大的Python库简化了数据挖掘和数据分析。',
          img: '',
          url: 'https://github.com/datawhalechina/machine-learning-toy-code',
          category: '人工智能'
        },
        {
          id: 2,
          title: '稳定扩散是如何运作的',
          preview: '探索稳定扩散模型背后的机制，学习它如何生成逼真的数据点。',
          img: '',
          url: 'https://waytoagi.feishu.cn/wiki/TNIRw7qsViYNVgkPaazcuaVfndc',
          category: '人工智能'
        },
        {
          id: 3,
          title: '世界地理概览',
          preview: '快速游览世界地理，涵盖自然地貌、气候类型及人文特色。',
          img: '',
          url: 'https://www.youtube.com/watch?v=DasQ-GIkEeQ',
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
    showToast(context, ...args) {
      this.$refs.toast.show(context, ...args);
    },
    toggleFavorite(item) {
      this.resources = this.resources.map((res) => {
        if (res.id === item.id) return { ...res, isFavorited: !res.isFavorited };
        return res;
      });
    },
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
/* Existing styles unchanged */
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
  height: 45rpx;
}
.load-hint {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #cecece;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 28rpx;
  color: #666;
  transition: opacity 0.2s ease;
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
  gap: 20rpx;
}
.menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 10rpx;
  margin: 0 10rpx;
  background-color: transparent;
  z-index: 10001;
  box-sizing: border-box;
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
}
.loading,
.empty {
  text-align: center;
  font-size: 28rpx;
  color: #999;
  padding: 20rpx;
}
/* Added styles for search box */
.search-container {
  padding: 20rpx;
  background-color: #fff;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}
.search-container input {
  width: 100%;
  padding: 10rpx;
  font-size: 28rpx;
  border: 1rpx solid #ccc;
  border-radius: 8rpx;
}
</style>
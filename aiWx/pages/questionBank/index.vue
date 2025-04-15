<template>
  <view class="container">
    <view class="header">
      <view class="title">题库</view>
    </view>
    
    <view class="stats-card">
      <view class="stats-item">
        <text class="stats-value">{{ totalQuestions }}</text>
        <text class="stats-label">总题数</text>
      </view>
      <view class="stats-item">
        <text class="stats-value">{{ completedQuestions }}</text>
        <text class="stats-label">已完成</text>
      </view>
      <view class="stats-item">
        <text class="stats-value">{{ correctRate }}%</text>
        <text class="stats-label">正确率</text>
      </view>
    </view>
    
    <view class="category-list">
      <view 
        class="category-item" 
        v-for="(category, index) in categories" 
        :key="category.categoryId"
        @click="navigateToCategory(category)"
      >
        <view class="category-icon">
          <image :src="category.icon || defaultIcon" mode="aspectFit"></image>
        </view>
        <view class="category-info">
          <view class="category-name">{{ category.name }}</view>
          <view class="category-desc">{{ category.description }}</view>
          <view class="category-progress">
            <view class="progress-bar">
              <view 
                class="progress-inner" 
                :style="{ width: (category.completedCount / (category.questionCount || 1) * 100) + '%' }"
              ></view>
            </view>
            <view class="progress-text">
              {{ category.completedCount }}/{{ category.questionCount }}
            </view>
          </view>
        </view>
        <view class="category-arrow">
          <u-icon name="arrow-right" color="#999" size="28"></u-icon>
        </view>
      </view>
    </view>
    
    <view class="random-practice">
      <view class="random-title">快速练习</view>
      <view class="difficulty-buttons">
        <view 
          class="difficulty-btn" 
          v-for="(item, index) in difficulties" 
          :key="index"
          @click="startRandomPractice(item.value)"
        >
          {{ item.label }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import pageTime from '../../mixins/pageTime';

export default {
  mixins: [pageTime],
  data() {
    return {
      userId: '',
      categories: [],
      totalQuestions: 0,
      completedQuestions: 0,
      correctQuestions: 0,
      correctRate: 0,
      defaultIcon: '/static/questionBank/default-category.png',
      difficulties: [
        { label: '简单', value: 1 },
        { label: '中等', value: 2 },
        { label: '困难', value: 3 }
      ],
      loading: false
    };
  },
  onLoad() {
    this.userId = uni.getStorageSync('userId');
    this.loadCategories();
  },
  mounted() {
    this.checkUserId();
  },
  methods: {
    loadCategories() {
      this.loading = true;
      uni.showLoading({ title: '加载中' });
      
      this.$api.questionBank.getCategories(this.userId)
        .then(res => {
          if (res.code === 0) {
            this.categories = res.data || [];
            this.calculateStats();
          } else {
            uni.showToast({
              title: res.info || '获取分类失败',
              icon: 'none'
            });
          }
        })
        .catch(err => {
          console.error('获取分类失败', err);
          uni.showToast({
            title: '获取分类失败，请稍后重试',
            icon: 'none'
          });
        })
        .finally(() => {
          this.loading = false;
          uni.hideLoading();
        });
    },
    calculateStats() {
      let total = 0;
      let completed = 0;
      let correct = 0;
      
      this.categories.forEach(category => {
        total += category.questionCount || 0;
        completed += category.completedCount || 0;
        correct += category.correctCount || 0;
      });
      
      this.totalQuestions = total;
      this.completedQuestions = completed;
      
      if (completed > 0) {
        this.correctRate = Math.round((correct / completed) * 100);
      } else {
        this.correctRate = 0;
      }
    },
    navigateToCategory(category) {
      uni.navigateTo({
        url: `/pages/questionBank/category?categoryId=${category.categoryId}&name=${encodeURIComponent(category.name)}`
      });
    },
    startRandomPractice(difficulty) {
      uni.navigateTo({
        url: `/pages/questionBank/practice?difficulty=${difficulty}`
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  padding: 30rpx;
  background-color: #f8f8f8;
  min-height: 100vh;
}

.header {
  padding: 20rpx 0;
  margin-bottom: 30rpx;
  
  .title {
    font-size: 44rpx;
    font-weight: bold;
    color: #333;
  }
}

.stats-card {
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  
  .stats-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    
    .stats-value {
      font-size: 48rpx;
      font-weight: bold;
      color: #5b6af0;
      margin-bottom: 10rpx;
    }
    
    .stats-label {
      font-size: 28rpx;
      color: #666;
    }
  }
}

.category-list {
  margin-bottom: 30rpx;
  
  .category-item {
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
    
    .category-icon {
      width: 100rpx;
      height: 100rpx;
      margin-right: 20rpx;
      
      image {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    
    .category-info {
      flex: 1;
      
      .category-name {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 10rpx;
      }
      
      .category-desc {
        font-size: 26rpx;
        color: #666;
        margin-bottom: 15rpx;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .category-progress {
        display: flex;
        align-items: center;
        
        .progress-bar {
          flex: 1;
          height: 12rpx;
          background-color: #eee;
          border-radius: 6rpx;
          overflow: hidden;
          margin-right: 15rpx;
          
          .progress-inner {
            height: 100%;
            background-color: #5b6af0;
            border-radius: 6rpx;
          }
        }
        
        .progress-text {
          font-size: 24rpx;
          color: #999;
          white-space: nowrap;
        }
      }
    }
    
    .category-arrow {
      margin-left: 20rpx;
    }
  }
}

.random-practice {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  
  .random-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }
  
  .difficulty-buttons {
    display: flex;
    justify-content: space-between;
    
    .difficulty-btn {
      flex: 1;
      text-align: center;
      padding: 20rpx 0;
      margin: 0 10rpx;
      background-color: #f0f2ff;
      color: #5b6af0;
      border-radius: 10rpx;
      font-size: 28rpx;
      font-weight: bold;
      
      &:first-child {
        margin-left: 0;
      }
      
      &:last-child {
        margin-right: 0;
      }
      
      &:nth-child(1) {
        background-color: #e6f7e6;
        color: #52c41a;
      }
      
      &:nth-child(2) {
        background-color: #fff7e6;
        color: #fa8c16;
      }
      
      &:nth-child(3) {
        background-color: #fff1f0;
        color: #f5222d;
      }
    }
  }
}
</style>

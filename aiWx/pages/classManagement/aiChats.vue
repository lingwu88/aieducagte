<template>
  <view class="search-container">
    <!-- 顶部标题 -->
    <view class="header">
      <view class="title">智能学习规划</view>
      <view class="subtitle">输入您的个人背景和需求，获取学校、考研、申请、生涯规划</view>
    </view>

    <!-- 中间搜索框 -->
    <view class="search-box">
      <textarea
        v-model="inputText"
        :adjust-position="false"
        :cursor-spacing="20"
        auto-height
        :show-confirm-bar="false"
        placeholder="请输入您的学习需求或关键词..."
        :maxlength="-1"
        @focus="handleFocus"
        @blur="handleBlur"
        class="search-textarea"
      />
      
      <!-- 规划按钮 -->
      <view 
        class="search-btn"
        :class="{ active: canSend }"
        @tap="handleSearch"
      >
        规划
      </view>
    </view>

    <!-- 模式选择 -->
    <view class="mode-selector">
      <view class="mode-item active">
        <view class="mode-text">普通模式</view>
      </view>
      <view class="mode-item" @click="handleToProfession">
        <view class="mode-text">专业模式</view>
      </view>
    </view>
  </view>
</template>

<script>
import request from '../../tools/request';
import pageTime from '../../mixins/pageTime';

export default {
  mixins:[pageTime],
  mounted(){
    this.checkUserId()
    this.setType(1)
  },
  data() {
    return {
      inputText: '',
    }
  },
  methods: {
    handleFocus() {
      // 处理输入框获取焦点
    },
    handleBlur() {
      // 处理输入框失去焦点
    },
    handleSearch() {
      if (!this.canSend) return;
      
      // 保存搜索内容
      const query = this.inputText.trim();
      
      // 跳转到搜索结果页面
      uni.navigateTo({
        url: `/pages/classManagement/searchResult?query=${encodeURIComponent(query)}`
      });
    },
    handleToProfession() {
      // 跳转到专业模式页面
      uni.navigateTo({
        url: '/pages/classManagement/aiChatProfession'
      });
    }
  },
  computed: {
    canSend() {
      return this.inputText.trim().length > 0
    }
  }
}
</script>

<style lang="scss" scoped>
.search-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fd;
  padding: 40rpx;
  
  .header {
    text-align: center;
    margin-bottom: 60rpx;
    margin-top: 60rpx;
    
    .title {
      font-size: 48rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
    }
    
    .subtitle {
      font-size: 28rpx;
      color: #999;
    }
  }
  
  .search-box {
    background-color: #fff;
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 40rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
    
    .search-textarea {
      width: 100%;
      min-height: 200rpx;
      font-size: 32rpx;
      line-height: 1.5;
      margin-bottom: 30rpx;
    }
    
    .search-btn {
      width: 100%;
      height: 90rpx;
      line-height: 90rpx;
      text-align: center;
      background: linear-gradient(to right, #5b6af0, #7b89ff);
      color: #fff;
      border-radius: 45rpx;
      font-size: 34rpx;
      opacity: 0.5;
      
      &.active {
        opacity: 1;
      }
    }
  }
  
  .mode-selector {
    display: flex;
    justify-content: center;
    margin-top: 20rpx;
    
    .mode-item {
      padding: 20rpx 40rpx;
      margin: 0 20rpx;
      border-radius: 40rpx;
      background-color: #fff;
      box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
      
      &.active {
        background: linear-gradient(to right, #5b6af0, #7b89ff);
        
        .mode-text {
          color: #fff;
        }
      }
      
      .mode-text {
        font-size: 28rpx;
        color: #666;
      }
    }
  }
}
</style>
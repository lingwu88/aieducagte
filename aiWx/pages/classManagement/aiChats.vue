<template>
  <view class="search-container">
    <!-- 顶部标题 -->
    <view class="header">
      <view class="title">智能学习规划</view>
      <view class="subtitle">输入您的个人背景和需求，获取学校、考研、申请、生涯规划</view>
    </view>

    <!-- 中间搜索框 -->
    <view class="search-box">
      <input
        v-model="inputText"
        :adjust-position="false"
        :cursor-spacing="20"
        placeholder="请输入您的学习需求或关键词..."
        :maxlength="-1"
        @focus="handleFocus"
        @blur="handleBlur"
        class="search-input"
      />
      <view class="divider"></view>
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
    <view class="mode-switch">
      <view class="mode-label">选择模式：</view>
      <view class="mode-options">
        <view class="mode-option" :class="{ active: !isProfessionalMode }">
          <text>普通模式</text>
        </view>
        <view class="mode-option" :class="{ active: isProfessionalMode }" @click="handleToProfession">
          <text>专业模式</text>
        </view>
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
      isProfessionalMode: false
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
    margin-top: 100rpx;
    
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
    border-radius: 45rpx;
    padding: 0 30rpx;
    margin-bottom: 40rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    height: 110rpx;
    
    .search-input {
      flex: 1;
      height: 90rpx;
      font-size: 32rpx;
    }
    
    .divider {
      width: 2rpx;
      height: 50rpx;
      background-color: #eee;
      margin: 0 20rpx;
    }
    
    .search-btn {
      color: #5b6af0;
      font-size: 32rpx;
      padding: 0 10rpx;
      
      &.active {
        font-weight: 500;
      }
    }
  }
  
  .mode-switch {
    margin-top: 40rpx;
    
    .mode-label {
      font-size: 28rpx;
      color: #999;
      margin-bottom: 20rpx;
    }
    
    .mode-options {
      display: flex;
      flex-direction: column;
      
      .mode-option {
        display: flex;
        flex-direction: column;
        padding: 20rpx;
        border-radius: 10rpx;
        margin-bottom: 20rpx;
        background-color: #fff;
        box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.03);
        border-left: 6rpx solid transparent;
        
        text {
          font-size: 30rpx;
          color: #666;
        }
        
        .mode-desc {
          font-size: 24rpx;
          color: #999;
          margin-top: 10rpx;
        }
        
        &.active {
          border-left-color: #5b6af0;
          
          text:first-child {
            color: #5b6af0;
            font-weight: 500;
          }
        }
      }
    }
  }
}
</style>
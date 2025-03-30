<template>
  <view class="search-container">
    <!-- 背景装饰 -->
    <view class="bg-decoration">
      <view class="circle circle-1"></view>
      <view class="circle circle-2"></view>
    </view>

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

    <!-- 模式切换 -->
    <view class="mode-switch-container">
      <view class="mode-switch">
        <view 
          class="mode-tab active"
        >
          <text>普通模式</text>
        </view>
        <view 
          class="mode-tab pro-mode"
          @click="handleToProfession"
        >
          <text>专业模式</text>
        </view>
        <view class="slider"></view>
      </view>
    </view>

    <!-- 底部提示 -->
    <view class="bottom-tips">
      <text>智趣学坊 - 让学习更高效</text>
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
      inputText: ''
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
  position: relative;
  overflow: hidden;
  
  .bg-decoration {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
    
    .circle {
      position: absolute;
      border-radius: 50%;
      opacity: 0.1;
    }
    
    .circle-1 {
      top: -150rpx;
      right: -150rpx;
      width: 500rpx;
      height: 500rpx;
      background: linear-gradient(135deg, #5b6af0, #7b89ff);
    }
    
    .circle-2 {
      bottom: -200rpx;
      left: -200rpx;
      width: 600rpx;
      height: 600rpx;
      background: linear-gradient(135deg, #5b6af0, #7b89ff);
    }
  }
  
  .header {
    text-align: center;
    margin-bottom: 60rpx;
    margin-top: 100rpx;
    position: relative;
    z-index: 1;
    
    .title {
      font-size: 52rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
      background: linear-gradient(to right, #5b6af0, #7b89ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 2rpx 10rpx rgba(91, 106, 240, 0.1);
    }
    
    .subtitle {
      font-size: 28rpx;
      color: #999;
      line-height: 1.5;
      padding: 0 40rpx;
    }
  }
  
  .search-box {
    background-color: #fff;
    border-radius: 45rpx;
    padding: 0 30rpx;
    margin-bottom: 40rpx;
    box-shadow: 0 10rpx 30rpx rgba(91, 106, 240, 0.1);
    display: flex;
    align-items: center;
    height: 110rpx;
    position: relative;
    z-index: 1;
    transition: all 0.3s ease;
    
    &:focus-within {
      transform: translateY(-5rpx);
      box-shadow: 0 15rpx 40rpx rgba(91, 106, 240, 0.15);
    }
    
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
      transition: all 0.2s ease;
      
      &.active {
        font-weight: 500;
        transform: scale(1.05);
      }
    }
  }
  
  .mode-switch-container {
    margin-top: 40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 1;
    
    .mode-switch {
      position: relative;
      display: flex;
      width: 400rpx;
      height: 80rpx;
      background-color: rgba(255, 255, 255, 0.8);
      border-radius: 40rpx;
      box-shadow: 0 5rpx 20rpx rgba(91, 106, 240, 0.1);
      overflow: hidden;
      
      .mode-tab {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        z-index: 2;
        transition: all 0.3s ease;
        
        text {
          font-size: 28rpx;
          color: #999;
          transition: all 0.3s ease;
        }
        
        &.active {
          text {
            color: #fff;
            font-weight: 500;
          }
        }
        
        &.pro-mode {
          text {
            color: #666;
          }
          
          &:active {
            opacity: 0.7;
          }
        }
      }
      
      .slider {
        position: absolute;
        top: 5rpx;
        left: 5rpx;
        width: calc(50% - 10rpx);
        height: calc(100% - 10rpx);
        background: linear-gradient(to right, #5b6af0, #7b89ff);
        border-radius: 35rpx;
        z-index: 1;
      }
    }
  }
  
  .bottom-tips {
    margin-top: auto;
    text-align: center;
    padding: 30rpx 0;
    font-size: 24rpx;
    color: #bbb;
    position: relative;
    z-index: 1;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10rpx);
  }
}
</style>
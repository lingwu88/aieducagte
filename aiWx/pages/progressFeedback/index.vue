<template>
	<view class="container">
    <view class="header">
      <view class="header-content">
        <view class="title">学习进度反馈</view>
        <view class="subtitle">查看你的学习情况和综合评估</view>
      </view>
    </view>
    
    <view class="card-container">
      <view class="card" v-for="(item, index) in list" :key="index" @click="navigateTo(item)">
        <view class="card-content">
          <view class="emoji">{{ item.emoji }}</view>
          <view class="card-info">
            <view class="card-title">{{ item.description }}</view>
            <view class="card-desc">{{ item.subDesc }}</view>
          </view>
        </view>
        <view class="card-arrow">→</view>
      </view>
    </view>
	</view>
</template>

<script>
	export default {
		mounted(){
			this.checkUserId()
		},
		data() {
			return {
					list:[
						{
							description: "综合评估",
              subDesc: "查看学习能力的全面评估",
							emoji: "📊",
							url: "/pages/progressFeedback/learningProgress"
						},
						{
							description: "学习情况",
              subDesc: "了解当前学习进度和状态",
							emoji: "📚",
							url: "/pages/progressFeedback/learningSituation"
						}
					]
				}
		},
		onLoad() {

		},
		methods: {
			navigateTo(item) {
      if (item.url) {  // 添加条件避免空URL报错
        uni.navigateTo({
          url: item.url
        });
      }
    }
		}
	}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #f8f9fd;
  display: flex;
  flex-direction: column;
}

.header {
  position: relative;
  width: 100%;
  height: 220rpx;
  background: linear-gradient(135deg, #DA6A9A 0%, #e991b3 100%);
  box-shadow: 0 4rpx 20rpx rgba(218, 106, 154, 0.2);
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -100rpx;
    right: -100rpx;
    width: 300rpx;
    height: 300rpx;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -80rpx;
    left: 60rpx;
    width: 200rpx;
    height: 200rpx;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
  }
  
  .header-content {
    position: relative;
    z-index: 1;
    padding: 40rpx 40rpx;
    
    .title {
      font-size: 44rpx;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 10rpx;
    }
    
    .subtitle {
      font-size: 28rpx;
      color: rgba(255, 255, 255, 0.8);
    }
  }
}

.card-container {
  padding: 40rpx 30rpx;
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.card {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.98);
    background-color: rgba(218, 106, 154, 0.05);
  }
  
  .card-content {
    display: flex;
    align-items: center;
    gap: 24rpx;
    
    .emoji {
      font-size: 60rpx;
      width: 100rpx;
      height: 100rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(218, 106, 154, 0.1);
      border-radius: 50%;
    }
    
    .card-info {
      .card-title {
        font-size: 36rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 8rpx;
      }
      
      .card-desc {
        font-size: 26rpx;
        color: #999;
      }
    }
  }
  
  .card-arrow {
    font-size: 36rpx;
    color: #DA6A9A;
    font-weight: bold;
  }
}
</style>
<template>
	<view class="container">
    <view class="header">
      <text class="title">学习资源</text>
      <text class="subtitle">探索智能学习的无限可能</text>
    </view>
    <view class="aiessay" @tap="handleto(1)">
      <view class="card-content">
        <view class="card-info">
          <text class="card-title">AI变文</text>
          <text class="card-desc">智能文本转换与优化</text>
        </view>
        <image src="/static/classroom/learnResource/aiWrite.png" class="aiWrite"></image>
      </view>
      <view class="card-footer">
        <text class="action-text">点击体验</text>
        <uni-icons type="right" size="16" color="#7b89ff"></uni-icons>
      </view>
    </view>
    <view class="footer">
			<view class="footer-item" v-for="(item,index) in list" :key="index" @click="navigateTo(item)">
        <view class="item-card">
          <view class="item-icon">
            <image :src="item.img" alt="无法加载出图片" class="item-img"></image>
          </view>
				  <text class="item-title">{{item.description}}</text>
          <text class="item-desc">{{item.subDesc}}</text>
        </view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          description: "课件库",
          subDesc: "精选优质课程资源",
          img: "/static/classroom/learnResource/book.png",
          url: "/pages/learnResource/courseLibrary"
        },
        {
          description: "资料库",
          subDesc: "丰富学习辅助材料",
          img: "/static/classroom/learnResource/essay.png",
          url: "/pages/learnResource/DocLib"
        }
      ]
    }
  },
  onLoad() {},
  methods: {
    handleto(index) {
      console.log(index);
      if (index === 1) {
        console.log(1);
        uni.navigateTo({ url: "/pages/learnResource/aiConvert" });
      }
    },
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
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f8f9fd;
  padding: 30rpx;
  box-sizing: border-box;
  
  .header {
    width: 100%;
    padding: 40rpx 20rpx;
    margin-bottom: 30rpx;
    
    .title {
      font-size: 48rpx;
      font-weight: 700;
      color: #2d3748;
      display: block;
      margin-bottom: 10rpx;
    }
    
    .subtitle {
      font-size: 28rpx;
      color: #5d6b82;
      display: block;
    }
  }

  .aiessay {
    width: 100%;
    margin-bottom: 40rpx;
    background: linear-gradient(135deg, #5b6af0 0%, #7b89ff 100%);
    border-radius: 24rpx;
    overflow: hidden;
    box-shadow: 0 8rpx 30rpx rgba(91, 106, 240, 0.15);
    transition: transform 0.3s ease;
    
    &:active {
      transform: scale(0.98);
    }
    
    .card-content {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 40rpx;
      
      .card-info {
        flex: 1;
        
        .card-title {
          font-size: 44rpx;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 16rpx;
          display: block;
        }
        
        .card-desc {
          font-size: 28rpx;
          color: rgba(255, 255, 255, 0.8);
          display: block;
        }
      }
      
      .aiWrite {
        width: 160rpx;
        height: 160rpx;
        object-fit: contain;
      }
    }
    
    .card-footer {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 20rpx 40rpx;
      background-color: rgba(0, 0, 0, 0.1);
      
      .action-text {
        font-size: 26rpx;
        color: rgba(255, 255, 255, 0.9);
        margin-right: 10rpx;
      }
    }
  }

  .footer {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 40rpx;

    .footer-item {
      width: 48%;
      
      .item-card {
        background-color: #ffffff;
        border-radius: 20rpx;
        padding: 30rpx;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        
        &:active {
          transform: translateY(4rpx);
          box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.03);
        }
        
        .item-icon {
          width: 120rpx;
          height: 120rpx;
          background: rgba(91, 106, 240, 0.1);
          border-radius: 60rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 20rpx;
          
          .item-img {
            width: 70rpx;
            height: 70rpx;
            object-fit: contain;
          }
        }
        
        .item-title {
          font-size: 32rpx;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 10rpx;
          text-align: center;
        }
        
        .item-desc {
          font-size: 24rpx;
          color: #5d6b82;
          text-align: center;
        }
      }
    }
  }
}
</style>
<template>
	<view class="container">
		<!-- 背景装饰元素 -->
		<view class="bg-decoration bg-circle-1"></view>
		<view class="bg-decoration bg-circle-2"></view>
		<view class="bg-decoration bg-wave"></view>
		<view class="bg-decoration bg-circle-3"></view>
		<view class="bg-decoration bg-circle-4"></view>
		<view class="bg-decoration bg-dots"></view>
		<view class="bg-decoration bg-pattern"></view>
		
		<!-- 页面标题区域 -->
		<view class="header">
			<text class="title">学习资源</text>
			<text class="subtitle">丰富多样的学习工具与资料</text>
		</view>
		
		<!-- AI变文卡片 -->
		<view class="ai-card" @tap="handleto(1)">
			<view class="ai-card-content">
				<view class="ai-card-left">
					<text class="ai-card-title">AI变文</text>
					<text class="ai-card-subtitle">智能改写，一键生成精彩内容</text>
					<text class="ai-card-action">点击体验 ></text>
				</view>
				<view class="ai-card-right">
					<image :src="'http://120.26.132.46:8091/classroom/learnResource/aiWrite.png'" class="ai-card-image"></image>
				</view>
			</view>
		</view>
		
		<!-- 底部资源卡片 -->
		<view class="resource-cards">
			<view class="resource-card" v-for="(item,index) in list" :key="index" @tap="navigateTo(item)">
				<view class="resource-card-icon">
					<image :src="item.img" class="resource-card-image"></image>
				</view>
				<view class="resource-card-content">
					<text class="resource-card-title">{{item.description}}</text>
					<text class="resource-card-subtitle">{{item.subtitle}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import pageTime from '../../mixins/pageTime';
export default {
  mixins:[pageTime],
  data() {
    return {
      list: [
        {
          description: "课件库",
          subtitle: "AI规划的高质量课程",
          img: this.$request.baseUrl+"/classroom/learnResource/book.png",
          url: "/pages/learnResource/courseLibrary"
        },
        {
          description: "资料库",
          subtitle: "海量学习资料汇总",
          img: this.$request.baseUrl+"/classroom/learnResource/essay.png",
          url: "/pages/learnResource/DocLib"
        }
      ]
    }
  },
  mounted(){
    this.checkUserId()
  },
  onLoad() {},
  methods: {
    handleto(index) {
      if (index === 1) {
        uni.navigateTo({ url: "/pages/learnResource/aiConvert" });
      }
    },
    navigateTo(item) {
      if (item.url) {
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
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f8f9fd;
  padding: 30rpx;
  position: relative;
  overflow: hidden;
}

/* 背景装饰元素 */
.bg-decoration {
  position: absolute;
  z-index: 0;
}

.bg-circle-1 {
  width: 400rpx;
  height: 400rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(91, 106, 240, 0.15), rgba(123, 137, 255, 0.08));
  top: -100rpx;
  right: -150rpx;
  animation: float 8s ease-in-out infinite;
}

.bg-circle-2 {
  width: 300rpx;
  height: 300rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(123, 137, 255, 0.1), rgba(91, 106, 240, 0.05));
  bottom: 10%;
  left: -100rpx;
  animation: float 10s ease-in-out infinite reverse;
}

.bg-circle-3 {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(91, 106, 240, 0.1), rgba(123, 137, 255, 0.05));
  top: 20%;
  left: -50rpx;
  animation: float 12s ease-in-out infinite;
}

.bg-circle-4 {
  width: 250rpx;
  height: 250rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(123, 137, 255, 0.1), rgba(91, 106, 240, 0.05));
  bottom: 20%;
  right: -50rpx;
  animation: float 15s ease-in-out infinite reverse;
}

.bg-dots {
  width: 200rpx;
  height: 300rpx;
  background-image: radial-gradient(rgba(91, 106, 240, 0.2) 2px, transparent 2px);
  background-size: 18px 18px;
  top: 40%;
  right: 10%;
  opacity: 0.3;
}

.bg-pattern {
  width: 100%;
  height: 100%;
  background-image: linear-gradient(rgba(91, 106, 240, 0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(91, 106, 240, 0.03) 1px, transparent 1px);
  background-size: 30px 30px;
  opacity: 0.5;
}

.bg-wave {
  width: 100vw;
  height: 200rpx;
  background: linear-gradient(135deg, rgba(91, 106, 240, 0.03), rgba(123, 137, 255, 0.06));
  transform: skewY(-3deg);
  top: 30%;
  left: 0;
  animation: wave 15s linear infinite;
}

@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15rpx);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes wave {
  0% {
    transform: skewY(-3deg) translateX(0);
  }
  50% {
    transform: skewY(-2deg) translateX(-10rpx);
  }
  100% {
    transform: skewY(-3deg) translateX(0);
  }
}

/* 页面标题区域 */
.header {
  width: 100%;
  text-align: left;
  margin-bottom: 40rpx;
  padding: 20rpx 0;
  position: relative;
  z-index: 1;
}

.title {
  font-size: 48rpx;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.subtitle {
  font-size: 28rpx;
  color: #666;
  display: block;
}

/* AI变文卡片 */
.ai-card {
  width: 85%;
  margin: 20rpx 0 40rpx;
  border-radius: 20rpx;
  background: linear-gradient(135deg, #5b6af0, #7b89ff);
  box-shadow: 0 10rpx 20rpx rgba(91, 106, 240, 0.2);
  padding: 40rpx;
  transition: transform 0.3s ease;
  position: relative;
  z-index: 1;
}

.ai-card:active {
  transform: scale(0.98);
}

.ai-card-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.ai-card-left {
  flex: 1;
}

.ai-card-title {
  font-size: 44rpx;
  font-weight: 600;
  color: #fff;
  margin-bottom: 16rpx;
  display: block;
}

.ai-card-subtitle {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 30rpx;
  display: block;
}

.ai-card-action {
  font-size: 26rpx;
  color: #fff;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 10rpx 20rpx;
  border-radius: 30rpx;
}

.ai-card-right {
  width: 200rpx;
  height: 200rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-card-image {
  width: 180rpx;
  height: 180rpx;
  object-fit: contain;
}

/* 底部资源卡片 */
.resource-cards {
  width: 95%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20rpx;
  position: relative;
  z-index: 1;
}

.resource-card {
  width: 40%;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.resource-card:active {
  transform: translateY(4rpx);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.resource-card-icon {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  background-color: rgba(91, 106, 240, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20rpx;
}

.resource-card-image {
  width: 70rpx;
  height: 70rpx;
  object-fit: contain;
}

.resource-card-content {
  width: 100%;
  text-align: center;
}

.resource-card-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
  display: block;
}

.resource-card-subtitle {
  font-size: 24rpx;
  color: #999;
  display: block;
}
</style>
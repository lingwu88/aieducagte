<!-- /pages/learnSuggestion/learnSuggestion.vue -->
<template>
  <view class="learn-suggestion">
    <!-- 报告头部 -->
    <view class="report-header">
      <view class="report-title">
        <text class="title-text">综合评估分析报告</text>
        <text class="subtitle">基于您的学习行为数据分析</text>
      </view>
      
      <view class="user-profile">
        <view class="avatar">
          <text class="avatar-text">{{ getUserInitial() }}</text>
        </view>
        <view class="user-info">
          <text class="user-name">{{ userName }}</text>
          <text class="report-date">报告生成: {{ formatDate(reportDate) }}</text>
        </view>
      </view>
    </view>
    
    <!-- 学习倾向区域 -->
    <view class="card tendency-section">
      <view class="card-header">
        <text class="card-title">学习倾向分析</text>
        <text class="card-subtitle">您的主要学习风格和偏好</text>
      </view>
      
      <view class="rose-chart-container">
        <view id="roseChart" style="width: 100%; height: 400rpx;"></view>
      </view>
    </view>
    
    <!-- 具体反馈和建议区域 -->
    <view class="feedback-section">
      <view class="feedback-card" @tap="navigateToFeedback('contentPreference')">
        <text class="card-title">内容偏好</text>
        <text class="card-subtitle">了解您的学习偏好</text>
        <text class="detail-text">查看详情 >></text>
      </view>
      <view class="feedback-card" @tap="navigateToFeedback('strengthsWeaknesses')">
        <text class="card-title">优缺点分析</text>
        <text class="card-subtitle">发现您的学习优势与不足</text>
        <text class="detail-text">查看详情 >></text>
      </view>
      <view class="feedback-card" @tap="navigateToFeedback('learningSuggestions')">
        <text class="card-title">学习建议</text>
        <text class="card-subtitle">个性化学习路径推荐</text>
        <text class="detail-text">查看详情 >></text>
      </view>
    </view>
  </view>
</template>

<script>
import * as echarts from 'echarts';

export default {
  data() {
    return {
      userName: "张同学",
      reportDate: new Date(),
      tendencyData: [
        { name: "阅读学习", value: 85 },
        { name: "实践操作", value: 72 },
        { name: "视觉学习", value: 90 },
        { name: "听觉学习", value: 65 },
        { name: "逻辑思维", value: 78 }
      ],
      averageData: [80, 70, 85, 75, 82] // 假设的平均数据
    };
  },
  
  onReady() {
    this.initRoseChart();
  },
  
  methods: {
    getUserInitial() {
      return this.userName.charAt(0);
    },
    
    formatDate(date) {
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    },
    
    navigateToFeedback(type) {
      const routes = {
        contentPreference: '/pages/learnDashboard/contentPreference',
        strengthsWeaknesses: '/pages/learnDashboard/strengthsWeaknesses',
        learningSuggestions: '/pages/learnDashboard/learnSuggestions'
      };
      uni.navigateTo({ url: routes[type] });
    },
    
    initRoseChart() {
      const chartDom = document.getElementById('roseChart');
      const myChart = echarts.init(chartDom);
      const option = {
        polar: {},
        angleAxis: {
          type: 'category',
          data: this.tendencyData.map(item => item.name)
        },
        radiusAxis: {},
        series: [
          {
            type: 'bar',
            data: this.tendencyData.map(item => item.value),
            coordinateSystem: 'polar',
            name: '用户',
            itemStyle: { color: '#00FFCC', borderRadius: 5 }
          },
          {
            type: 'bar',
            data: this.averageData,
            coordinateSystem: 'polar',
            name: '平均水平',
            itemStyle: { color: '#666666', opacity: 0.5, borderRadius: 5 }
          }
        ],
        legend: { show: true, data: ['用户', '平均水平'] },
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            const userValue = params[0].value;
            const avgValue = params[1].value;
            const diff = userValue - avgValue;
            return `${params[0].name}<br/>用户: ${userValue}%<br/>平均: ${avgValue}%<br/>差异: ${diff > 0 ? '+' : ''}${diff}%`;
          }
        },
        animation: true
      };
      myChart.setOption(option);

      // 点击高亮效果（移动端）
      myChart.on('click', (params) => {
        myChart.setOption({
          series: [{
            itemStyle: {
              emphasis: { color: '#00FFCC', shadowBlur: 10, shadowColor: '#00FFCC' }
            }
          }]
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@font-face {
  font-family: 'iconfont';
  src: url('//at.alicdn.com/t/c/font_3948516_z48erfu8m9.woff2') format('woff2');
}

.iconfont {
  font-family: 'iconfont';
  font-size: 24px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.learn-suggestion {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding: 0 0 40rpx 0;
}

// 报告头部
.report-header {
  padding: 40rpx 30rpx;
  background: linear-gradient(135deg, #4c6ef5, #7952b3);
  color: #fff;
  border-radius: 0 0 40rpx 40rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 5rpx 15rpx rgba(76, 110, 245, 0.2);
  
  .report-title {
    margin-bottom: 30rpx;
    
    .title-text {
      display: block;
      font-size: 42rpx;
      font-weight: 600;
      margin-bottom: 10rpx;
    }
    
    .subtitle {
      font-size: 28rpx;
      opacity: 0.8;
    }
  }
  
  .user-profile {
    display: flex;
    align-items: center;
    
    .avatar {
      width: 90rpx;
      height: 90rpx;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20rpx;
      
      .avatar-text {
        font-size: 40rpx;
        font-weight: 600;
      }
    }
    
    .user-info {
      display: flex;
      flex-direction: column;
      
      .user-name {
        font-size: 32rpx;
        font-weight: 500;
        margin-bottom: 5rpx;
      }
      
      .report-date {
        font-size: 24rpx;
        opacity: 0.8;
      }
    }
  }
}

// 卡片通用样式
.card {
  background-color: #fff;
  border-radius: 20rpx;
  margin: 0 30rpx 30rpx;
  padding: 30rpx;
  box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.05);
  
  .card-header {
    margin-bottom: 20rpx;
    
    .card-title {
      display: block;
      font-size: 34rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 8rpx;
    }
    
    .card-subtitle {
      font-size: 26rpx;
      color: #666;
    }
  }
}

// 学习倾向区域
.tendency-section {
  .rose-chart-container {
    height: 400rpx;
    background-color: #f9fafc;
    border-radius: 16rpx;
    margin-bottom: 30rpx;
    overflow: hidden;
  }
}

// 反馈和建议区域
.feedback-section {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  
  .feedback-card {
    background-color: #fff;
    border-radius: 20rpx;
    padding: 30rpx;
    box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.02);
      box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.1);
    }
    
    .card-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }
    
    .card-subtitle {
      font-size: 26rpx;
      color: #666;
      margin-bottom: 10rpx;
    }
    
    .detail-text {
      font-size: 24rpx;
      color: #4C6EF5;
      align-self: flex-end;
    }
  }
}
</style>
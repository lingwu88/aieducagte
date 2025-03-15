<template>
  <view class="content-preference">
    <!-- 头部区域 -->
    <view class="header">
      <text class="title">您的学习内容偏好</text>
      <text class="subtitle">点击下方卡片，查看您的学习偏好详情。</text>
    </view>

    <!-- 内容区域 -->
    <view class="preference-cards">
      <view
        v-for="(item, index) in preferences"
        :key="index"
        class="card"
        @tap="showChart(item.type)"
      >
        <image :src="item.icon" class="icon" />
        <text class="card-title">{{ item.title }}</text>
        <text class="card-description">{{ item.description }}</text>
      </view>
    </view>

    <!-- 模态框 -->
    <view class="modal" v-if="showModal">
      <view class="modal-content">
        <view class="chart-container">
          <!-- 使用 uni-app 的 canvas 组件 -->
          <canvas canvas-id="barChart" style="width: 100%; height: 400rpx;"></canvas>
        </view>
        <button class="close-button" @tap="hideChart">关闭</button>
      </view>
    </view>
  </view>
</template>

<script>
import * as echarts from 'echarts'; // 需引入适用于小程序的 ECharts 版本，例如小程序专用包

export default {
  name: 'ContentPreference',
  data() {
    return {
      preferences: [
        {
          type: 'visual',
          title: '视觉内容',
          description: '您更喜欢通过图像和视频学习',
          icon: '/icons/eye.png'
        },
        {
          type: 'reading',
          title: '阅读文本',
          description: '您倾向于通过书籍和文章学习',
          icon: '/icons/book.png'
        },
        {
          type: 'interactive',
          title: '互动内容',
          description: '您喜欢通过实践和互动学习',
          icon: '/icons/hand.png'
        }
      ],
      chartData: {
        visual: [85, 60, 75],      // 静态数据：视觉内容、阅读文本、互动内容的得分
        reading: [60, 85, 70],
        interactive: [75, 70, 85]
      },
      showModal: false,
      selectedType: ''
    };
  },

  onLoad() {
    // 预留动态数据接口调用
    // uni.request({
    //   url: 'https://api.example.com/preferences',
    //   success: (res) => {
    //     this.chartData = res.data.chartData;
    //     this.preferences = res.data.preferences;
    //   }
    // });
  },

  methods: {
    showChart(type) {
      this.showModal = true;
      this.selectedType = type;
      this.$nextTick(() => {
        this.initChart();
      });
    },

    hideChart() {
      this.showModal = false;
    },

    initChart() {
      const chartDom = uni.createCanvasContext('barChart');
      const myChart = echarts.init(chartDom);
      const option = {
        xAxis: {
          type: 'category',
          data: ['视觉内容', '阅读文本', '互动内容']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: this.chartData[this.selectedType],
          type: 'bar',
          itemStyle: {
            color: '#4C6EF5'
          }
        }]
      };
      myChart.setOption(option);
      chartDom.draw();
    }
  }
};
</script>

<style lang="scss" scoped>
.content-preference {
  padding: 20rpx;
  font-family: 'PingFang SC', sans-serif;
}

.header {
  margin-bottom: 40rpx;
}
.header .title {
  display: block;
  font-size: 42rpx;
  font-weight: bold;
  color: #4c6ef5;
}
.header .subtitle {
  font-size: 28rpx;
  color: #666666;
}

.preference-cards {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.card {
  background: linear-gradient(135deg, #f5f7fa, #e4e9f2);
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
}
.card:hover {
  transform: scale(1.02);
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.1);
}
.card .icon {
  width: 80rpx;
  height: 80rpx;
  margin-bottom: 20rpx;
}
.card .card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}
.card .card-description {
  font-size: 28rpx;
  color: #666;
  text-align: center;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
  width: 80%;
  max-width: 600rpx;
}
.chart-container {
  margin-bottom: 20rpx;
}
.close-button {
  background-color: #00ffcc;
  color: #fff;
  border: none;
  border-radius: 10rpx;
  padding: 20rpx;
  font-size: 32rpx;
  width: 100%;
}
</style>
<template>
  <view class="situation">
    <view class="box">
      <u-tabs :scrollable="false" :list="list4" lineWidth="30" lineColor="#E483AA" :activeStyle="{
        color: '#303133',
        fontWeight: 'bold',
        transform: 'scale(1.05)'
      }" :inactiveStyle="{
        color: '#606266',
        transform: 'scale(1)'
      }" itemStyle="padding-left: 15px; padding-right: 15px; height: 34px;">
      </u-tabs>

      <!-- 添加加载状态 -->
      <view class="loading-container" v-if="loading">
        <view class="loading-spinner">
          <view class="spinner"></view>
        </view>
        <view class="loading-text">数据加载中...</view>
      </view>

      <!-- 数据加载完成后显示图表 -->
      <view class="chart-container" v-else>
        <l-echart ref="chartRef" @finished="setChart"></l-echart>
      </view>
    </view>
  </view>
</template>

<script>
import * as echarts from 'echarts'
export default {
  mounted() {
    this.checkUserId()
  },
  onLoad() {
    this.userId = uni.getStorageSync('userId')
  },
  onShow() {
    // 添加延迟加载
    this.loading = true;

    // 使用setTimeout模拟加载过程
    setTimeout(() => {
      this.getData();
    }, 800);
  },
  data() {
    return {
      loading: true, // 添加加载状态控制
      list4: [
        {
          name: '每天'
        },
        // {
        //     name: '近三日',
        // }
      ],
      data: [],
      charts: {},
      userId: "",
      typeList: ['其他', '交互问答时长', '查阅资料时长', '创作文章时长'],
      dataList: [{ value: 66, name: '交互问答时长' }, { value: 22, name: '查阅资料时长' }, { value: 2, name: "创作文章时长" }, { value: 10, name: '其他' }],
    }
  },
  methods: {
    getData() {
      this.$api.progressFeedBack.getTime({ userId: this.userId, type: 1 })
        .then(res => {
          console.log(res);
          this.data = Object.keys(res.data).map(key => res.data[key])
          console.log(this.data);
          let sum = 0
          for (let i of this.data) {
            sum += i
          }
          console.log(sum);

          this.dataList = this.data.map((item, index) => {
            return {
              value: sum === 0 ? 0 : Math.floor(item * 100 / sum),
              name: this.typeList[index]
            }
          })

          // 数据加载完成后，设置loading为false
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
          // 即使加载失败也要关闭loading状态
          this.loading = false;
        })

    },
    async setChart(customOption) {
      // 如果数据还在加载中，不初始化图表
      if (this.loading) return;

      // chart 图表实例不能存在data里
      const chart = await this.$refs.chartRef.init(echarts);
      let defaultoption = {
        title: {
          text: '使用统计',
          textStyle: {
            color: 'black',
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'item'
        },
        legend: { // 对图形的解释部分
          orient: 'vertical',
          right: 10,
          y: 'center',
          icon: 'circle',			// 添加
          formatter: (name) => {	// 添加
            // console.log(this.dataList);
            // console.log(name);

            const item = this.dataList.find(item => item.name == name)
            // console.log(index);

            return name + item.value.toString() + '%'
          },
          // textStyle: {	// 添加
          //   padding: [8, 0, 0, 0],
          //   rich: {
          //     a: {
          //       fontSize: 15,
          //       width: 110
          //     },
          //     b: {
          //       fontSize: 15,
          //       width: 70,
          //       color: '#c1c1c1'
          //     },
          //     c: {
          //       fontSize: 15
          //     }
          //   }
          // }
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['55%', '70%'],
            center: ['30%', '50%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '20',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: this.dataList
            // data:[{value:66,name:'交互问答时长'},{value:22,name:'查阅资料时长'},{value:12,name:"创作文章时长"}],
            // data:this.dataList.map(item=>item.value)
          }
        ]
      }
      console.log(this.dataList);

      let finalOption = { ...defaultoption, ...customOption }
      chart.setOption(finalOption)
      // chart.setOption({
      //   series:[
      //     {
      //       data:[{value:66,name:'交互问答时长'},{value:22,name:'查阅资料时长'},{value:12,name:"创作文章时长"}]
      //     }
      //   ]
      // })
      // chart2.setOption(this.option2)
    },
  }
}
</script>

<style scoped lang="scss">
.box {
  margin: auto 10rpx;
}

.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 400rpx;
}

.loading-spinner {
  width: 80rpx;
  height: 80rpx;
  margin-bottom: 20rpx;
}

.spinner {
  width: 100%;
  height: 100%;
  border: 6rpx solid rgba(228, 131, 170, 0.2);
  border-top-color: #E483AA;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 28rpx;
  color: #666;
}

.chart-container {
  margin: 20rpx 0;
  padding: 20rpx;
  background-color: #ffffff;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}
</style>
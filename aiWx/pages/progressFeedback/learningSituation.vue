<template>
  <view class="situation">
    <view class="box">
      <l-echart ref="chartRef" @finished="setChart"></l-echart>
    </view>
  </view>
</template>

<script>
import * as echarts from 'echarts'
export default{
  data() {
    return {
      charts:{},
      dataList: [{value:66,name:'交互问答时长'},{value:22,name:'查阅资料时长'},{value:12,name:"创作文章时长"}],
      }
  },
  methods: {
        async setChart(customOption) {
            // chart 图表实例不能存在data里
            const chart = await this.$refs.chartRef.init(echarts);
           let defaultoption={
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
                formatter: (name)=> {	// 添加
                  // console.log(this.dataList);
                  // console.log(name);
                  
                  const item = this.dataList.find(item=>item.name == name)
                  // console.log(index);
                  
                  return name+item.value.toString()+'%'
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
                  data:this.dataList
                  // data:[{value:66,name:'交互问答时长'},{value:22,name:'查阅资料时长'},{value:12,name:"创作文章时长"}],
                  // data:this.dataList.map(item=>item.value)
                }
              ]
            }
           let finalOption = {...defaultoption,...customOption}
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
    },
    onShow(){
      // this.setData()
    }
}
</script>

<style scoped lang="scss">
.box{
  margin:auto 10rpx ;
}
</style>
<template>
  <view class="time">
    <view style="width:750rpx; height:550rpx">
      <l-echart ref="chartRef" @finished="init"></l-echart>
    </view>
    <view>
      <l-echart ref="chartRef2" @finished="init"></l-echart>
    </view>
      
  </view>
</template>

<script>
import * as echarts from 'echarts'
export default {
    data() {
        return {
            // option: {
            //     tooltip: {
            //         trigger: 'axis',
            //         axisPointer: {
            //             type: 'shadow' 
            //         },
            //         confine: true
            //     },
            //     legend: {
            //         data: ['热度', '正面', '负面']
            //     },
            //     grid: {
            //         left: 20,
            //         right: 20,
            //         bottom: 15,
            //         top: 40,
            //         containLabel: true
            //     },
            //     xAxis: [
            //         {
            //             type: 'value',
            //             axisLine: {
            //                 lineStyle: {
            //                     color: '#999999'
            //                 }
            //             },
            //             axisLabel: {
            //                 color: '#666666'
            //             }
            //         }
            //     ],
            //     yAxis: [
            //         {
            //             type: 'category',
            //             axisTick: { show: false },
            //             data: ['汽车之家', '今日头条', '百度贴吧', '一点资讯', '微信', '微博', '知乎'],
            //             axisLine: {
            //                 lineStyle: {
            //                     color: '#999999'
            //                 }
            //             },
            //             axisLabel: {
            //                 color: '#666666'
            //             }
            //         }
            //     ],
            //     series: [
            //         {
            //             name: '热度',
            //             type: 'bar',
            //             label: {
            //                 normal: {
            //                     show: true,
            //                     position: 'inside'
            //                 }
            //             },
            //             data: [300, 270, 340, 344, 300, 320, 310],
            //         },
            //         {
            //             name: '正面',
            //             type: 'bar',
            //             stack: '总量',
            //             label: {
            //                 normal: {
            //                     show: true
            //                 }
            //             },
            //             data: [120, 102, 141, 174, 190, 250, 220]
            //         },
            //         {
            //             name: '负面',
            //             type: 'bar',
            //             stack: '总量',
            //             label: {
            //                 normal: {
            //                     show: true,
            //                     position: 'left'
            //                 }
            //             },
            //             data: [-20, -32, -21, -34, -90, -130, -110]
            //         }
            //     ]
            // },
            option1:{
                tooltip: {
                trigger: 'axis',
                axisPointer: {
                type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                type: 'category',
                data: ['0时','6时','12时','18时', '24时'],
                splitNumber:5,
                boundaryGap:true,
                show: true, // 是否显示X轴刻度
                // alignWithLabel: true // 刻度是否与标签对齐
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    max:2,
                    min:0,
                    axisLabel:{
                        formatter:'{value}h'
                    }
                }
            ],
            series: [
                {
                    name: '在线时间',
                    type: 'bar',
                    barWidth: '28%',
                    itemStyle:{
                        // borderColor:"#000000",
                        borderRadius: [25, 25, 0, 0] //（顺时针左上，右上，右下，左下）
                        // borderRadius: 15,
                        // borderType:'dashed'
                    },
                    data: ['1.6', '2', '0', '1', '2','0.5','1','0.3','0.3']
                },
                //i+1[i=0,3,6,9,...]
                {
                    name: '在线时间',
                    type: 'bar',
                    barWidth: '28%',
                    stack:"i+1",
                    itemStyle:{
                        // borderColor:"#000000",
                        borderRadius: [25, 25, 0, 0] //（顺时针左上，右上，右下，左下）
                        // borderRadius: 15,
                        // borderType:'dashed'
                    },
                    data: ['1.0', '1.5', '3', '2', '4','2.5','3.1','1.8','2.0']
                },
                //i+2
                {
                    name: '在线时间',
                    type: 'bar',
                    barWidth: '28%',
                    stack:"i+2",
                    itemStyle:{
                        // borderColor:"#000000",
                        borderRadius: [25, 25, 0, 0] //（顺时针左上，右上，右下，左下）
                        // borderRadius: 15,
                        // borderType:'dashed'
                    },
                    data: ['1', '0.5', '1.7', '0', '1','1.5','0.25','1.34','1.56']
                }
            ]
            },
            option2:{
                title: {
                    text: 'World Population'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {},
                grid: {
                    width:'80%',
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true,
                    // show:true
                },
                xAxis: {
                    type: 'value',
                    show:true,
                    axisLine:{
                        show:true
                    },
                    // axisTick: {
                    //     show: true, // 显示刻度线
                    // },
                    name:'完成率',
                    nameLocation:"end",
                    data:[0,25,50,75,100],
                    // boundaryGap: [0, 0.01],
                    axisLabel:{
                        formatter:'{value}%'
                    }
                },
                yAxis: {
                    type: 'category',
                    name:"任务编号",
                    data: [`课程1`, `课程2`, `课程3`, `课程4`, `课程5`, `课程6`]
                },
                series: [
                    {
                    name: '课程',
                    type: 'bar',
                    data: [12, 27, 88, 100, 99, 64]
                    }
                ]
            }
        };
    },
    // 组件能被调用必须是组件的节点已经被渲染到页面上
    methods: {
        async init() {
            // chart 图表实例不能存在data里
            const chart = await this.$refs.chartRef.init(echarts);
            const chart2 = await this.$refs.chartRef2.init(echarts)
            chart.setOption(this.option1)
            chart2.setOption(this.option2)
        }
    }
}
</script>

<style scoped lang="scss">
.content{
    border: #000000;
}
</style>
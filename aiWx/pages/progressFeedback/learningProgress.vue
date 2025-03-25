<template>
  <view class="time">
    <view class="header">
        <u-tabs
        :scrollable="false"
        :list="list4"
        lineWidth="30"
        lineColor="#f56c6c"
        :activeStyle="{
            color: '#303133',
            fontWeight: 'bold',
            transform: 'scale(1.05)'
        }"
        :inactiveStyle="{
            color: '#606266',
            transform: 'scale(1)'
        }"
        itemStyle="padding-left: 15px; padding-right: 15px; height: 34px;"
        >
        </u-tabs>
    </view>
    <view>
      <l-echart ref="chartRef" @finished="setChart"></l-echart>
    </view>
    <view>
      <l-echart ref="chartRef2" @finished="setChart2"></l-echart>
    </view>
      
  </view>
</template>

<script>
import * as echarts from 'echarts'
import { onLoad } from 'uview-ui/libs/mixin/mixin';
export default {
    data() {
        return {
            datalist:[],
            list4: [
                {
                    name: '每天'
                }, 
                // {
                //     name: '近三日',
                // }
            ],
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
            // option1:{
            //     tooltip: {
            //     trigger: 'axis',
            //     axisPointer: {
            //     type: 'shadow'
            //     }
            // },
            // grid: {
            //     left: '3%',
            //     right: '4%',
            //     bottom: '3%',
            //     containLabel: true
            // },
            // xAxis: [
            //     {
            //     type: 'category',
            //     data: ['0时','6时','12时','18时', '24时'],
            //     splitNumber:5,
            //     boundaryGap:true,
            //     show: true, // 是否显示X轴刻度
            //     // alignWithLabel: true // 刻度是否与标签对齐
            //     }
            // ],
            // yAxis: [
            //     {
            //         type: 'value',
            //         max:2,
            //         min:0,
            //         axisLabel:{
            //             formatter:'{value}h'
            //         }
            //     }
            // ],
            // series: [
            //     {
            //         name: '在线时间',
            //         type: 'bar',
            //         barWidth: '28%',
            //         itemStyle:{
            //             // borderColor:"#000000",
            //             borderRadius: [25, 25, 0, 0] //（顺时针左上，右上，右下，左下）
            //             // borderRadius: 15,
            //             // borderType:'dashed'
            //         },
            //         data: ['1.6', '2', '0', '1', '2','0.5','1','0.3','0.3']
            //     },
            //     //i+1[i=0,3,6,9,...]
            //     {
            //         name: '在线时间',
            //         type: 'bar',
            //         barWidth: '28%',
            //         stack:"i+1",
            //         itemStyle:{
            //             // borderColor:"#000000",
            //             borderRadius: [25, 25, 0, 0] //（顺时针左上，右上，右下，左下）
            //             // borderRadius: 15,
            //             // borderType:'dashed'
            //         },
            //         data: ['1.0', '1.5', '3', '2', '4','2.5','3.1','1.8','2.0']
            //     },
            //     //i+2
            //     {
            //         name: '在线时间',
            //         type: 'bar',
            //         barWidth: '28%',
            //         stack:"i+2",
            //         itemStyle:{
            //             // borderColor:"#000000",
            //             borderRadius: [25, 25, 0, 0] //（顺时针左上，右上，右下，左下）
            //             // borderRadius: 15,
            //             // borderType:'dashed'
            //         },
            //         data: ['1', '0.5', '1.7', '0', '1','1.5','0.25','1.34','1.56']
            //     }
            // ]
            // },
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
    mounted(){
        this.checkUserId()
    },
    onLoad(){
        this.userId = uni.getStorageSync('userId')
       
    },
    onShow(){
        this.getData()
        // this.setChart({
        //     series:[
        //         {
        //             data:[
        //                 value:this.dataList.map()
        //             ]
        //         }
        //     ]
        // })
    },
    // 组件能被调用必须是组件的节点已经被渲染到页面上
    methods: {
        getData(){
            this.$api.progressFeedBack.getEvalution(this.userId).then(res=>{
                console.log(res);
               this.dataList = Object.keys(res.data).map(key=>res.data[key])
                console.log(this.dataList);
                
            })
        },
        async setChart(customOption) {
            // chart 图表实例不能存在data里
           const chart = await this.$refs.chartRef.init(echarts);
           let defaultoption={
                    // title: {
                    //     text: 'Basic Radar Chart'
                    // },
                    legend: {
                        data: ['Allocated Budget']
                    },
                    radar: {
                        // shape: 'circle',
                        indicator: [
                        { name: '专业度', max: 400 },
                        { name: '多样性', max: 400 },
                        { name: '拓展度', max: 400 },
                        { name: '复习积极性', max: 400 },
                        { name: '交流活跃度', max: 400 },
                        ]
                    },
                    series: [
                        {
                        name: 'Budget',
                        type: 'radar',
                        data: [
                            {
                            value: this.dataList,
                            // name: 'Allocated Budget'
                            }
                        ]
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
        async setChart2(customOption){
            const chart = await this.$refs.chartRef2.init(echarts);
            const nameList = ['专业度','多样性','拓展度','复习积极性','交流活跃度']
            const arr = this.dataList.map((item,index)=>({
                value:item,
                name:nameList[index]
            }))
            let defaultoption = {
                    legend: {
                        top:'bottom',
                    },
                    series: [
                        {
                            label:{
                                show:false
                            },
                            labelLine:{
                                show:false
                            },
                            name: 'Nightingale Chart',
                            type: 'pie',
                            center: ['50%', '50%'],
                            itemStyle: {
                                borderRadius: 8
                            },
                            data: arr,
                            emphasis: {
                                itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
           let finalOption = {...defaultoption,...customOption}
            chart.setOption(finalOption)
           const data = this.$refs.chartRef2.resize({width:400,height:300})
        //    console.log(data);
           
            // chart.setOption({
            //   series:[
            //     {
            //       data:[{value:66,name:'交互问答时长'},{value:22,name:'查阅资料时长'},{value:12,name:"创作文章时长"}]
            //     }
            //   ]
            // })
            // chart2.setOption(this.option2)
        },
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
.header{
    margin:0 0 20rpx 0;
}
</style>
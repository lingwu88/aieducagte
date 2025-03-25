<template>
  <view class="situation">
    <view class="box">
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
      <l-echart ref="chartRef" @finished="setChart"></l-echart>
    </view>
  </view>
</template>

<script>
import * as echarts from 'echarts'
export default{
  mounted(){
			this.checkUserId()
		},
  onLoad(){
    this.userId = uni.getStorageSync('userId')
    this.getData()
  },
  data() {
    return {
      list4: [
          {
              name: '每天'
          }, 
          // {
          //     name: '近三日',
          // }
      ],
      data:[],
      charts:{},
      userId:"",
      typeList:['其他','交互问答时长','查阅资料时长','创作文章时长'],
      dataList: [{value:66,name:'交互问答时长'},{value:22,name:'查阅资料时长'},{value:2,name:"创作文章时长"},{value:10,name:'其他'}],
      }
  },
  methods: {
        getData(){
          this.$api.progressFeedBack.getTime({userId:this.userId,type:1})
          .then(res=>{
            console.log(res);
            this.data = Object.keys(res.data).map(key=>res.data[key])
            console.log(this.data);
            let sum = 0
            for(let i of this.data){
              sum +=i
            }
            console.log(sum);
            
            this.dataList = this.data.map((item,index)=>{
              console.log(item);
              
              
            return{
              value:Math.floor(item*100/sum),
              name:this.typeList[index]
            }})
          })
          .catch(err=>{
            console.log(err);
            
          })
          
        },
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
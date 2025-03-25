<template>
  <scroll-view 
    class="waterfall-container" 
    scrollbar="true"
    scroll-y="true"
    @scrolltolower="loadDataList"
    >
    <view class="waterfall-list">
      <view 
        v-if="isShow"
        v-for="item in renderList"
        :key = "item.articleId"
        class="waterfall-item"
        >
        <card 
          :src="item.avatar"
          :title="item.title" 
          :author="item.userName" 
          :bgColor="item.bgColor" 
          :content="item.content"
          :viewCount="item.viewCount"
          @toDetail="handleToDetail(item.articleId)"
        ></card>
      </view>
      
      <!-- <view 
        v-if="!isShow"
        v-for="(item, index) in temporaryList" 
        :key="iten.item.articleId"
        class="temporary-item"
        :style="getStyle(item.style) || {} "
        :data-index="index"
      >
        <card 
          :src="item.item.avatar"
          :content="item.item.content"
          :title="item.item.title" 
          :author="item.item.userName" 
          :bgColor="item.item.bgColor" 
          :viewCount="item.item.viewCount"
        >
      </card>
      </view> -->
    </view>
    <view v-if="renderList.length === 0" class="null-box">    
      <view class="null">暂无数据哦~ </view>
    </view>
  </scroll-view>
</template>

<script>
import card from './card.vue'
// import { rafThrottle } from '@/utils/tool'
	export default {
    components:{
      card
    },
    props:{
      request:{
        type:Function,
        required:true
      },
      gap:{
        type:Number,
        required:true
      },
      limit:{
        type:String,
        required:true
      },
      column:{
        type:Number,
        required:true
      },
      enterSize:{
        type:Number,
        required:true
      }
    },
    //temporary —— 在还没加载数据时，做的定高瀑布流
    data() {
      return {
        //容器视图实例
        fContainerRef:null,
        renderList:[],
        isShow:true,
        temporaryList:[],
        scrollState:{},

        //数据键值对状态
        itemSizeInfo:new Map(),

        //数据状态
        dataState:{
          loading:false,
          isFinish:false,
          currentPage:1,
          list:[]
        },
        colorList:['#ca9e9e','#cec0a3','#cdcea3','#accea3','#a3cec0','#a3c2ce','#a3aece','#b1a3ce','#cea3c5','#cea3a3'],
        userId:"",
        //一个数据源二维数组 —— 队列状态
        queueState:{
          queue:new Array(this.column).fill(0).map(()=>({list:[],height:0})),
          len:0
        }
      }
    },
    methods:{
      handleClick(id){
        // console.log('这是id',id);
      },
      handleToDetail(id){
        console.log('触发');
        
        uni.navigateTo({
          url:`/pages/index/postDetail?articleId=${id}`
        })
      },
      getStyle(style){
        // console.log(style);
        
        return style ? `
          width:${style.width};
          transform:${style.transform}
        ` : ''
      },
      //预渲染的带样式数据列表(定高)
      mountTemporaryList(size = this.enterSize){
        console.log(this.hasMoreData);
        
        if(!this.hasMoreData)
          return
        this.isShow = false
        if(size){
          for(let i = 0;i<size;i++){
            // console.log('这是queueState+column',this.queueState,this.column);
            
            const item = this.dataState.list[this.queueState.len+i]
            if(!item){  
              break
            } 
            const rect = this.itemSizeInfo.get(item.articleId)
            // console.log(item);
            // console.log("rect:",rect);

            console.log(rect);
            
            
            
            this.temporaryList.push({
              item,
              y:0,
              h:0,
              // imageHeight:rect.imageHeight,
              style:{
                width:`${rect.width}px`
              },
            })
            // console.log('这是temporaryList',this.temporaryList);
            
          }
          console.log(this.temporaryList);
          
        }
         // 使用 this.$nextTick 来等 DOM 更新完成后执行回调
      this.$nextTick(() => {
          const query = uni.createSelectorQuery().in(this)
          query.selectAll('.temporary-item').fields({
            size:true,
            rect:true,
            dataset:{
              index:true
            }
          }).exec((res)=>{
            const [itemInfo] = res
            // console.log('这是itemInfo',itemInfo);
            if(!itemInfo){
              return
            }
            // console.log('这是temporaryList',this.temporaryList);
            
            itemInfo.forEach((item,index)=>{
              // console.log(this.temporaryList[index]);
              
              if(this.temporaryList[index]){
                // console.log('这是item',item);
                this.temporaryList[index].h = item.height
              }
            })
            // console.log('这是temporaryList',this.temporaryList);
              this.updateItemSize();
              this.addInQueue(this.temporaryList.length);
              
              this.temporaryList = [];
          })
          this.isShow = true;

        });
      },
        // 其他方法
        updateItemSize() {
          // 假设这是一个更新项大小的逻辑
          console.log(this.temporaryList);
          
          this.temporaryList.forEach(({item,h})=>{
            const rect = this.itemSizeInfo.get(item.articleId)
            //更新itemSizeInfo里面的高，将目前暂存的高度赋值给itemSizeInfo
            this.itemSizeInfo.set(item.articleId,{...rect , height:h})
          })
        },
        //控制当前渲染数据列逻辑
        addInQueue(size = this.enterSize) {
          // 假设这是一个添加到队列的逻辑
          console.log("size:"+size);
          
          if(size){
            for(let i = 0 ; i<size ; i++){
              //拿到最短的数据列所处的index
              const minIndex = this.computedHeight.minIndex

              //当前列的数据list
              const currentColumn = this.queueState.queue[minIndex]

              //当前列的数据list的最后一个有效项
              const before = currentColumn.list[currentColumn.list.length - 1] || null

              //当前列的数据list的第i个数据
              const dataItem = this.dataState.list[this.queueState.len]
              //将新数据推入至最短高度列?
              const item = this.generatorItem(dataItem,before,minIndex)

              currentColumn.list.push(item)
              currentColumn.height = item.y
              this.queueState.len++
            }
          }
        },
        //根据数据源和设置的对应样式，创建真正渲染到视图上的数据
        generatorItem(item,before,index){
          const rect = this.itemSizeInfo.get(item.articleId)
          const width = rect.width
          const height = rect.height
          // const imageHeight = rect.imageHeight
          let y = 0
          if(before){
            y = before.y + before.h + this.gap
          }
          // console.log(index);
          
          return {
            item,
            y,
            h:height,
            // imageHeight,
            style:{
              width:`${width}px`,
              height:`${height}px`,
              //若当前最小下标是第一列，就不需要平移
              transform: `translate(${index === 0 ? 0 : (width + this.gap) * index}px, ${y}px)`
            }
          }
        },
      //设置每一项的样式
      setItemSize() {
        // console.log(this.itemSizeInfo);
        
        //itemSizeInfo 是一个Map键值对，在reduce中，第一个参数pre：当前容器，第二个参数current，当前元素
        this.itemSizeInfo = this.dataState.list.reduce((pre, current) => {
          //设置元素
          const itemWidth = Math.floor(
            (this.scrollState.viewWidth - (this.column - 1) * this.gap) / this.column
          );

          //当前元素
          const rect = this.itemSizeInfo.get(current.articleId);
          // console.log(current);
          // console.log(current);
          console.log(itemWidth);
          
          
          //设置itemSizeInfo
          pre.set(current.articleId, {
            width: itemWidth,
            height: rect ? rect.height : 0,
            // imageHeight: Math.floor((itemWidth * current.height) / current.width),
          });
          return pre;
        }, new Map());
      },
      handleScroll(event){
        // console.log(event);
        
        // this.fContainerRef.boundingClientRect((rect)=>{
        //   if(!rect)
        //     return
        //   this.$set(this,'scrollState',{
        //     ...this.scrollState,
        //     start:event.detail.scrollTop
        //   })
          // console.log(this.scrollState);
          
          
          // if(!this.hasMoreData && !this.dataState.loading){
          //   this.loadDataList().then(len=>{
          //     len && this.setItemSize()
          //     len && this.mountTemporaryList()
          //   })
          //   return
          // }
          // console.log(rect);
          // console.log(event.detail);
          
          
          
          console.log('当前列最小高度minHeight'+this.computedHeight.minHeight);
          //当我滚动视图超过当前时，开始重新渲染
          // if(event.detail.scrollTop + rect.height >= this.computedHeight.minHeight){
          //   this.mountTemporaryList() 
          // }
        // }).exec()
      },
      //初始化滚动视图元素状态
      initScrollState(){
        this.fContainerRef.boundingClientRect((rect)=>{
          // console.log(rect);
          // console.log('这是end,变化前',this.end);
          // console.log('这是scrollState变化前',this.scrollState);
          this.$set(this,'scrollState',{
            viewWidth:rect.width,
            viewHeight:rect.height,
            start:rect.top
          })
          // console.log('这是end,变化后',this.end);
          // console.log('这是scrollState,变化后',this.scrollState);
          
        }).exec()
      },
      async loadDataList(){
        let newArr = []
        //如果正在加载，那么就返回
        if(this.dataState.isFinish){
          return
        }

        const res = await this.request(this.lastId,this.userId,this.limit,undefined)
        const list = res.data.map(item=>({
          avatar:item.userAvatar,
          content:item.content,
          title:item.title,
          articleId:item.articleId,
          userName:item.userName,
          likeCount:item.likeCount,
          bgColor:this.colorList[Math.floor(Math.random()*10)]
        }))
         console.log(list);
         //如果没长度即没数据，那么return
         if(!list?.length){
           this.dataState.isFinish = true
           return
          }
          
        newArr = [...this.renderList,...list]
        //如果有数据
        this.$set(this,'renderList',newArr)
        // this.dataState.list.push(...list)
        this.dataState.loading = false
        // console.log(this.dataState);
        console.log(list.length);
        
        return list.length
      },
      async init(){
        // this.initScrollState()
        const len = await this.loadDataList()
        // console.log(len);
        // console.log("这是dataState的list",this.dataState.list);

        //根据数据源设置每一个数据的样式
        // this.setItemSize()
        // console.log("这是itemSizeInfo",this.itemSizeInfo);

        //构造定高渲染列表
        // len && this.mountTemporaryList()
        
      },
    },
    computed:{
      lastId(){
        return this.dataState.list.length!==0?this.dataState.list[this.dataState.list.length-1].articleId:""
      },
      // hasMoreData(){
      //   console.log(this.queueState);
      //   console.log(this.dataState);
        
        
      //   //当某一列的数据量大于当前已处理的数据项数量len时，说明还有更多数据
      //   return this.queueState.len < this.dataState.list.length
      // },
      //动态计算高度
      // computedHeight(){
      //   let minIndex = 0 ,
      //   minHeight = Infinity ,
      //   maxHeight = -Infinity
      //   //this.queueState维护一个二维数组数据列
      //   // console.log(this.queueState);
        
      //   this.queueState.queue.forEach(({height},index)=>{
      //     if(height < minHeight){
      //       minHeight = height
      //       minIndex = index
      //     }
      //     if(height > maxHeight){
      //       maxHeight = height
      //     }
      //   })
      //   return {
      //     minIndex,
      //     minHeight,
      //     maxHeight
      //   }
      // },
      // cardList(){
      //   return this.queueState.queue.reduce((pre,{list})=>pre.concat(list),[])
      // },
      // end(){
      //   // console.log('这是end',this.scrollState.viewHeight + this.scrollState.start);
        
      //   return this.scrollState.viewHeight + this.scrollState.start
      // },
      // renderList(){
      //   // console.log('这是cardList',this.cardList);
      //   // console.log('这是renderList',this.cardList.filter((i)=>{
      //   //   i.h + i.y > this.scrollState.start && i.y < this.end
      //   // }));
      //   // console.log('这是end',this.end);
      //   // console.log('这是scrollState',this.scrollState);
        
      //   return this.cardList.filter((i)=>{
      //     // console.log('这是i.h + i.y > this.scrollState.start && i.y < this.end',i.h + i.y > this.scrollState.start && i.y < this.end);
      //     //筛选在范围内的数据
      //     return i.h + i.y > this.scrollState.start && i.y < this.end
      //   })
      // }
    },
    //这是组件的生命周期
    mounted() {
      if(uni.getStorageSync('userId')){
				
				this.userId = uni.getStorageSync('userId')
        // console.log(this.userId);
				console.log('赋值',this.userId);
      }

      // this.fContainerRef = uni.createSelectorQuery().in(this).select('.waterfall-container');
      // console.log(this.fContainerRef);
      
      this.init()
      //节流滚动
      // this.throttleScroll = rafThrottle(this.handleScroll)
      // console.log(uni.getStorageSync('userId'));
      
    },
    beforeDestroy(){
      this.throttleScroll = null
    },
	}
</script>

<style lang="scss" scoped>
.waterfall{
  &-container{
    width:90vw;
    height:100%;
    margin:auto;
  }
  &-list{
    position: relative;
    display: flex;          // 启用 Flex 布局
    flex-wrap: wrap;        // 允许换行
    gap: 20rpx;             // 列间距（小程序需基础库 2.8.0+）
    width:100%;
    height:100%;
  }
  &-item{
    width: 45%;
    max-height: 250rpx;
    overflow: scroll;
    margin:0 auto;
  }
}
.null-box{
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  .null{
    font-size: 50rpx;
    text-align: center;
    font-weight: 800;    
  }
}
</style>

<template>
  <scroll-view 
    class="waterfall-container" 
    @scroll="throttleScroll"
    scrollbar="true"
    scroll-y="true"
    >
    <view class="waterfall-list">
      <view 
        v-if="isShow"
        v-for="renderItem in renderList"
        :key = "renderItem.item.id"
        :style = "getStyle(renderItem.style) || {}"
        class="waterfall-item"
        @click="handleClick(renderItem.item.id)"
        >
        <card :title="renderItem.item.title" :author="renderItem.item.author" :bgColor="renderItem.item.bgColor" :imageHeight="renderItem.imageHeight"></card>
      </view>
      
      <view 
        v-if="!isShow"
        v-for="(item, index) in temporaryList" 
        :key="index"
        class="temporary-item"
        :style="getStyle(item.style) || {} "
        :data-index="index"
      >
        <card 
          :title="item.item.title" 
          :author="item.item.author" 
          :bgColor="item.item.bgColor" 
          :imageHeight="item.imageHeight"
        >
      </card>
      </view>
    </view>

  </scroll-view>
</template>

<script>
import card from './card.vue'
import { rafThrottle } from '@/utils/tool'
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
      pageSize:{
        type:Number,
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
        isShow:true,
        temporaryList:[],
        scrollState:{},
        itemSizeInfo:new Map(),
        dataState:{
          loading:false,
          isFinish:false,
          currentPage:1,
          list:[]
        },
        queueState:{
          queue:new Array(this.column).fill(0).map(()=>({list:[],height:0})),
          len:0
        }
      }
    },
    methods:{
      handleClick(id){
        console.log('这是id',id);
      },
      getStyle(style){
        return style ? `
          width:${style.width};
          height:${style.height};
          transform:${style.transform}
        ` : ''
      },
      //预渲染的带样式数据列表(定高)
      mountTemporaryList(size = this.enterSize){
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
            const rect = this.itemSizeInfo.get(item.id)
            this.temporaryList.push({
              item,
              y:0,
              h:0,
              imageHeight:rect.imageHeight,
              style:{
                width:`${rect.width}px`
              }
            })
            // console.log('这是temporaryList',this.temporaryList);
            
          }
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
          this.temporaryList.forEach(({item,h})=>{
            const rect = this.itemSizeInfo.get(item.id)
            //更新itemSizeInfo里面的高，将目前暂存的高度赋值给itemSizeInfo
            this.itemSizeInfo.set(item.id,{...rect , height:h})
          })
        },
        addInQueue(size = this.enterSize) {
          // 假设这是一个添加到队列的逻辑
          if(size){
            for(let i = 0 ; i<size ; i++){
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
        generatorItem(item,before,index){
          const rect = this.itemSizeInfo.get(item.id)
          const width = rect.width
          const height = rect.height
          const imageHeight = rect.imageHeight
          let y = 0
          if(before){
            y = before.y + before.h + this.gap
          }
          return {
            item,
            y,
            h:height,
            imageHeight,
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
      this.itemSizeInfo = this.dataState.list.reduce((pre, current) => {
        const itemWidth = Math.floor(
          (this.scrollState.viewWidth - (this.column - 1) * this.gap) / this.column
        );
        const rect = this.itemSizeInfo.get(current.id);
        pre.set(current.id, {
          width: itemWidth,
          height: rect ? rect.height : 0,
          imageHeight: Math.floor((itemWidth * current.height) / current.width),
        });
        return pre;
      }, new Map());
    },
      handleScroll(event){
        
        this.fContainerRef.boundingClientRect((rect)=>{
          if(!rect)
            return
          this.$set(this,'scrollState',{
            ...this.scrollState,
            start:event.detail.scrollTop
          })
          
          if(!this.hasMoreData && !this.dataState.loading){
            this.loadDataList().then((len)=>{
              len && this.setItemSize()
              len && this.mountTemporaryList()
            })
            return
          }

          if(event.detail.scrollTop + rect.height >= this.computedHeight.minHeight){
            this.mountTemporaryList() 
          }
        }).exec()
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
        if(this.dataState.isFinish){
          return

        }

        const list = await this.request(this.dataState.currentPage++,this.pageSize)
        //  console.log(list);
         
        if(!list.length){
          this.dataState.isFinish = true
          return
        }
        //如果有数据
        this.dataState.list.push(...list)
        this.dataState.loading = false
        return list.length
      },
      async init(){
        this.initScrollState()
        const len = await this.loadDataList()
        // console.log(len);
        // console.log("这是dataState的list",this.dataState.list);
        this.setItemSize()
        // console.log("这是itemSizeInfo",this.itemSizeInfo);
        len && this.mountTemporaryList()
        
      },
    },
    computed:{
      hasMoreData(){
        //当某一列的数据量大于当前已处理的数据项数量len时，说明还有更多数据
        return this.queueState.len < this.dataState.list.length
      },
      //动态计算高度
      computedHeight(){
        let minIndex = 0 ,
        minHeight = Infinity ,
        maxHeight = -Infinity
        this.queueState.queue.forEach(({height},index)=>{
          if(height < minHeight){
            minHeight = height
            minIndex = index
          }
          if(height > maxHeight){
            maxHeight = height
          }
        })
        return {
          minIndex,
          minHeight,
          maxHeight
        }
      },
      cardList(){
        return this.queueState.queue.reduce((pre,{list})=>pre.concat(list),[])
      },
      end(){
        // console.log('这是end',this.scrollState.viewHeight + this.scrollState.start);
        
        return this.scrollState.viewHeight + this.scrollState.start
      },
      renderList(){
        // console.log('这是cardList',this.cardList);
        // console.log('这是renderList',this.cardList.filter((i)=>{
        //   i.h + i.y > this.scrollState.start && i.y < this.end
        // }));
        // console.log('这是end',this.end);
        // console.log('这是scrollState',this.scrollState);
        
        return this.cardList.filter((i)=>{
          // console.log('这是i.h + i.y > this.scrollState.start && i.y < this.end',i.h + i.y > this.scrollState.start && i.y < this.end);
          //筛选在范围内的数据
          return i.h + i.y > this.scrollState.start && i.y < this.end
        })
      }
    },
    mounted() {
      this.fContainerRef = uni.createSelectorQuery().in(this).select('.waterfall-container');
      this.init()
      this.throttleScroll = rafThrottle(this.handleScroll)
    },
    beforeDestroy(){
      this.throttleScroll = null
    }
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
    width:100%;
    height:100%;
  }
  &-item{
    position: absolute;
    top:0;
    left: 0;
    box-sizing: border-box;
  }
}
</style>

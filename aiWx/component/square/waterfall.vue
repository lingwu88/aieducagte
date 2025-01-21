<template>
  <scroll-view 
    class="waterfall-container" 
    @scroll="handleScroll"
    scrollbar="true"
    scroll-y="true"
    >
    <view class="waterfall-list" :style="listStyle">
      <view 
        v-if="isShow"
        v-for="renderItem in renderList"
        :key = "renderItem.item.id"
        :style = "renderItem.style"
        >
        <slot name="item" :item="renderItem.item" :imageHeight="renderItem.imageHeight"></slot>
      </view>
      <view id="temporary-list" v-else>
        <view v-for="temporary in temporaryList" :style="temporary.style">
          <slot name="item" :item="temporary.item" :imageHeight="temporary.imageHeight"></slot>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script>
	export default {
    props:{
      requesst:{
        type:Object,
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
      }
    },
    //temporary —— 在还没加载数据时，做的定高瀑布流
    data() {
      return {
        isShow:true,
        renderList:[
          {
            item:{
              id:1,
              title:"标题一个字",
              author:"作者",
              bgColor:"blue"
            },
            style:{
              width:"700rpx",
            },
            imageHeight:700
          },
          {
            item:{
              id:2,
              title:"标题二个字",
              author:"作者wu",
              bgColor:"#DA70D6"
            },
            style:{
              width:"300rpx",
            },
            imageHeight:500
          },
          {
            item:{
              id:1,
              title:"标题一个字",
              author:"作者",
              bgColor:"blue"
            },
            style:{
              width:"300rpx",
            },
            imageHeight:700
          },
          {
            item:{
              id:2,
              title:"标题二个字",
              author:"作者wu",
              bgColor:"#DA70D6"
            },
            style:{
              width:"300rpx",
            },
            imageHeight:500
          },
          {
            item:{
              id:1,
              title:"标题一个字",
              author:"作者",
              bgColor:"blue"
            },
            style:{
              width:"300rpx",
            },
            imageHeight:700
          },
          {
            item:{
              id:2,
              title:"标题二个字",
              author:"作者wu",
              bgColor:"#DA70D6"
            },
            style:{
              width:"300rpx",
            },
            imageHeight:500
          },
          {
            item:{
              id:1,
              title:"标题一个字",
              author:"作者",
              bgColor:"blue"
            },
            style:{
              width:"300rpx",
            },
            imageHeight:700
          },
          {
            item:{
              id:2,
              title:"标题二个字",
              author:"作者wu",
              bgColor:"#DA70D6"
            },
            style:{
              width:"300rpx",
            },
            imageHeight:500
          },
          {
            item:{
              id:1,
              title:"标题一个字",
              author:"作者",
              bgColor:"blue"
            },
            style:{
              width:"300rpx",
            },
            imageHeight:700
          },
          {
            item:{
              id:2,
              title:"标题二个字",
              author:"作者wu",
              bgColor:"#DA70D6"
            },
            style:{
              width:"300rpx",
            },
            imageHeight:500
          },
          {
            item:{
              id:1,
              title:"标题一个字",
              author:"作者",
              bgColor:"blue"
            },
            style:{
              width:"300rpx",
            },
            imageHeight:700
          },
          {
            item:{
              id:2,
              title:"标题二个字",
              author:"作者wu",
              bgColor:"#DA70D6"
            },
            style:{
              width:"300rpx",
            },
            imageHeight:500
          },
          {
            item:{
              id:1,
              title:"标题一个字",
              author:"作者",
              bgColor:"blue"
            },
            style:{
              width:"300rpx",
            },
            imageHeight:700
          },
          {
            item:{
              id:2,
              title:"标题二个字",
              author:"作者wu",
              bgColor:"#DA70D6"
            },
            style:{
              width:"300rpx",
            },
            imageHeight:500
          },
          {
            item:{
              id:1,
              title:"标题一个字",
              author:"作者",
              bgColor:"blue"
            },
            style:{
              width:"300rpx",
            },
            imageHeight:700
          },
          {
            item:{
              id:2,
              title:"标题二个字",
              author:"作者wu",
              bgColor:"#DA70D6"
            },
            style:{
              width:"300rpx",
            },
            imageHeight:500
          },
          {
            item:{
              id:1,
              title:"标题一个字",
              author:"作者",
              bgColor:"blue"
            },
            style:{
              width:"300rpx",
            },
            imageHeight:700
          },
          {
            item:{
              id:2,
              title:"标题二个字",
              author:"作者wu",
              bgColor:"#DA70D6"
            },
            style:{
              width:"300rpx",
            },
            imageHeight:500
          },
          {
            item:{
              id:1,
              title:"标题一个字",
              author:"作者",
              bgColor:"blue"
            },
            style:{
              width:"300rpx",
            },
            imageHeight:700
          },
          {
            item:{
              id:2,
              title:"标题二个字",
              author:"作者wu",
              bgColor:"#DA70D6"
            },
            style:{
              width:"300rpx",
            },
            imageHeight:500
          },
          {
            item:{
              id:1,
              title:"标题一个字",
              author:"作者",
              bgColor:"blue"
            },
            style:{
              width:"300rpx",
            },
            imageHeight:700
          },
          {
            item:{
              id:2,
              title:"标题二个字",
              author:"作者wu",
              bgColor:"#DA70D6"
            },
            style:{
              width:"300rpx",
            },
            imageHeight:500
          }
        ],
        temporaryList:[]
      }
    },
    methods:{
      handleScroll(){
        console.log("你触发了滚动");
        
      }
    }
    // props:{
    //   gap:{
    //     type:Number,
    //     required:true
    //   },
    //   column:{
    //     type:Number,
    //     required:true
    //   },
    //   pageSize:{
    //     type:Number,
    //     required:true
    //   },
    //   enterSize:{
    //     type:Number,
    //     default:1
    //   },
    //   request:{
    //     type:Function,
    //     required:true
    //   }
    // },
		// data() {
		// 	return {
    //     item:{},
    //     imageHeight:0,
    //     //列表数据源
    //     dataState:{
    //       loading:false,
    //       isFinish:false,
    //       currentPage:1,
    //       list:[]
    //     },
    //     //滚动的viewList的宽高
    //     scrollState:{
    //       viewWidth:0,
    //       viewHeight:0,
    //       start:0
    //     },
    //     //列数据源堆栈
    //     queueState : {
    //       queue:new Array(this.props.column).fill(0).map(()=>({list:[],height:0})),
    //       len:0
    //     },
    //     isShow : false,
    //     containerRef : {},
    //     //监听滚动元素的对象实例
    //     resizeObserver:null,
    //     //带样式渲染数据实例
    //     temporaryList:[],
    //     //存储每个瀑布流下Item的Size,以id为键,带样式的数据渲染项为Item
    //     itemSizeInfo:new Map()
		// 	}
		// },
		// onLoad() {

		// },
		// methods: {
    //   //监听滚动并调整大小方法
    //   handleResize(){
    //     console.log("调整Size");
    //     this.initScrollState()
    //     this.reComputedQueue()
    //   },
    //   //计算每一项的尺寸,并且建造一个新的Map返回给itemSizeInfo
    //   setItemSize(){
    //     this.itemSizeInfo = this.dataState.list.reduce((pre,current)=>{
    //       const itemWidth = Math.floor((this.scrollState.viewWidth - (this.props.column -1) * this.props.gap) / this.props.column)
    //       const rect = this.itemSizeInfo.get(current.id)
    //       pre.set(current.id,{
    //         width:itemWidth,
    //         height:rect?rect.height:0,
    //         imageHeight:Math.floor((itemWidth * current.height)/current.width)
    //       })
    //       return pre
    //     },new Map())
    //   },
    //   //更新瀑布流item项的高?
    //   updateItemSize(){
    //     this.temporaryList.forEach(({item,h})=>{
    //       const rect = this.itemSizeInfo.get(item.id)
    //       this.itemSizeInfo.set(item.id,{...rect,height:h})
    //     })
    //   },
    //   //将一个新数据,添加进渲染数据流栈
    //   addInQueue(size = this.props.enterSize){
    //     for(let i = 0 ; i < size ; i++){
    //       const minIndex = this.computedHeight.minIndex
    //       //找到当前的最短高度列
    //       const currentColumn = this.queueState.queue[minIndex]
    //       //找到当前列下的数据数组的最后一个有效项的下标
    //       const before = currentColumn.list[currentColumn.list.length - 1]
    //       const dataItem = this.dataState.list[this.queueState.len]
    //       const item = this.generatorItem(dataItem,before,minIndex)
    //       //将新数据推入至最短高度列?
    //       currentColumn.list.push(item)
    //       currentColumn.height = item.y
    //       this.queueState.len+1
    //     }
    //   },
    //   generatorItem(item,before,index){
    //     const rect = this.itemSizeInfo.get(item.id)
    //     const width = rect.width
    //     const height = rect.height
    //     const imageHeight = rect.imageHeight
    //     let y = 0

    //     //如果它不是该列第一个item,那么其y - item距离container顶部的距离 , 就应该有变化
    //     if(before)
    //       y = before.y + before.h + props.gap
    //     //返回一个包含乐样式的渲染数据对象
    //     return {
    //       item,
    //       y,
    //       h:height,
    //       imageHeight,
    //       style:{
    //         width:`${width}px`,
    //         height:`${height}px`,
    //         transform:`translate3d(${index === 0 ? 0 : (width+this.props.gap)* index}px,${y}px,0`
    //       }
    //     }
    //   },
    //   //加载列表请求,若有新的数据则push进数据源
    //   async loadDataList(){
    //     if(this.dataState.isFinish) return 
    //     this.dataState.loading = true
    //     const list = await this.props.request(this.dataState.currentPage++ , this.props.pageSize);
    //     if(!list.length){
    //       this.dataState.isFinish = true
    //       return
    //     }
    //     this.dataState.list.push(...list);
    //     this.dataState.loading = false
    //     return list.length
    //   },
    //   handleScroll(){
    //     //这里的containerRef应该改为微信获取类似DOM元素的效果
    //     const { scrollTop ,clientHeight } = this.containerRef
    //     this.scrollState.start = scrollTop
    //     if(!this.dataState.loading && this.hasMoreData){
    //       this.loadDataList().then((len)=>{
    //         len && this.setItemSize();
    //         len && this.mountTemporaryList()
    //       })
    //       return
    //     }
    //     if(scrollTop + clientHeight > this.computedHeight.minHeight ){
    //       this.mountTemporaryList()
    //     }
    //   },
    //   reComputedQueue(){
    //     this.setItemSize()
    //     this.queueState.queue = new Array(this.props.column).fill(0).map(()=>({list:[],height:0}))
    //     this.queueState.len = 0
    //     this.containerRef.scrollTop = 0
    //     this.mountTemporaryList(this.props.pageSize)
    //   },
    //   mountTemporaryList(size){
    //     if(!this.hasMoreData)
    //       return
    //     this.isShow = false
    //     for(let i=0;i<size;i++){
    //       const item = this.dataState.list[this.queueState.len+1]
    //       if(!item)
    //        break;
    //       const rect = this.itemSizeInfo.get(item.id)
    //       this.temporaryList.push({
    //         item,
    //         y:0,
    //         h:0,
    //         imageHeight:rect.imageHeight,
    //         style:{
    //           width:`${rect.width}px`
    //         }
    //       })
    //     }

    //       this.$nextTick(() => {
    //       const query = uni.createSelectorQuery().in(this); // 创建选择器查询
    //       query.select("#temporary-list").boundingClientRect((rect) => {
    //         const list = this.$refs.temporaryList;  // 获取 DOM 元素
    //         if (list) {
    //           // 获取每个子项的高度并更新 temporaryList
    //           Array.from(list.children).forEach((item, index) => {
    //             const rect = item.getBoundingClientRect();
    //             this.temporaryList[index].h = rect.height;
    //           });
    //         }
    //       }).exec();

    //       // 更新界面状态
    //       this.isShow = true;
    //       this.updateItemSize();
    //       this.addInQueue(this.temporaryList.length);
    //       this.temporaryList = [];  // 清空临时列表
    //     });
    //   },
    //   initScrollState(){
    //     this.scrollState.viewWidth = this.containerRef.clientWidth;
    //     this.scrollState.viewHeight = this.containerRef.clientHeight;
    //     this.scrollState.start = this.containerRef.scrollTop;
    //   },
    //   async init(){
    //     this.initScrollState();
    //     resizeObserver.observe(this.containerRef);
    //     const len = await this.loadDataList();
    //     this.setItemSize();
    //     len && this.mountTemporaryList(len);
    //   }
		// },
    // computed:{
    //   hasMoreData(){
    //     return this.queueState.len<this.dataState.list.length
    //   },
    //   end(){
    //     return this.scrollState.viewHeight + this.scrollState.start
    //   },
    //   cardList(){
    //     //reduce - 将二维数组转换成一维数组,回调函数的第二个参数是pre的初始值
    //     return this.queueState.queue.reduce((pre,{list})=> pre.concat(list),[])
    //   },
    //   renderList(){
    //     return this.cardList.value.filter((i)=>{ i.h + i.y> this.scrollState.start && i.y<this.end})
    //   },
    //   computedHeight(){
    //     let minIndex = 0,
    //     minHeight = Infinity,
    //     maxHeight = -Infinity;
    //     this.queueState.queue.forEach(({ height }, index) => {
    //       if (height < minHeight) {
    //         minHeight = height;
    //         minIndex = index;
    //       }
    //       if (height > maxHeight) {
    //         maxHeight = height;
    //       }
    //     });
    //     return {
    //       minIndex,
    //       minHeight,
    //       maxHeight,
    //     };
    //   },
    //   listStyle(){
    //     return {height:`${this.computedHeight.maxHeight}`}
    //   }
    // },
    // watch:{
    //   props:{
    //     handler(newProps,oldProps){
    //       if(newProps.column !== oldProps.column){
    //         this.handleResize()
    //       }
    //     }
    //   }
    // },
    // mounted(){
    //   //小程序不支持该监听滚动元素事件,需要修改一下
    //   this.resizeObserver = new ResizeObserver(()=>{
    //     this.handleResize()
    //   })
    //   const debounceHandleResize = debounce(this.handleResize)
    //   //为获取到的元素绑定该事件
    //   const throttledHandleScroll = rafThrottle(this.handleScroll)
    //   const container = wx.createSelectorQuery().select('#container');
    //   container.on('scroll', throttledHandleScroll);

    //   init()
    // },
    // beforeDestroy() {
    // // 在组件销毁之前取消 ResizeObserver 对 container 的观察
    //   if (this.resizeObserver && this.$refs.container) {
    //     this.resizeObserver.unobserve(this.$refs.container);
    //   }
    // } 
	}
</script>

<style lang="scss" scoped>
.waterfall{
  &-container{
    width:100%;
    height:100%;
  }
  &-list{
    position: relative;
    width:100%;
  }
  // &-item{
  //   position: absolute;
  //   top:0;
  //   left: 0;
  //   box-sizing: border-box;
  // }
}
</style>

<template>
  <view class="result-box">
    <!-- 添加装饰元素 -->
    <view class="decoration-circles">
      <view class="circle circle-1"></view>
      <view class="circle circle-2"></view>
      <view class="circle circle-3"></view>
    </view>
    
    <view class="header">
      <view class="navigation-icon" @click="back"></view>
      <view class="title">课程规划与建议</view>
      <view class="play">
        <u-icon name="grid-fill" size="28" @click="handleSetting"></u-icon>
      </view>
      <!-- <view class="collection">
        <uni-icons :type="swtichStar==false?'star':'star-filled'" size="28" @click="swtichStars"></uni-icons>
      </view> -->
    </view>
    <!-- <menuNavigate v-if="showNavigator" class="menu-navigator"></menuNavigate> -->
    <view class="control">
      <!-- <image src="/static/classroom/classManagement/control.png" class="control-icon" @click="showNavigator=!showNavigator"></image> -->
    </view>
    <view class="connection-container">
      <aiConnection :content="result" ref="aiResult" class="connection" :messageList="list" @push="handlePush" :userAvatar="img"></aiConnection>
    </view>
  </view>
</template>

<script>
// import menuNavigate from './components/menuNavigate.vue';
import aiConnection from './components/aiConnection.vue';
import request from '../../tools/request';
import { regexSSE } from '../../tools/tool'
import { convertMarkdown } from '../../tools/markdownUtils';
import pageTime from '../../mixins/pageTime';
// import AiConnection from './components/aiConnection.vue';
export default{
  mixins:[pageTime],
  components:{
    // menuNavigate,
    aiConnection
  },
  mounted(){
			this.checkUserId()
		},
  data() {
    return {
      showNavigator:false,
      list:[],
      img:"",
      result:""
    }
  },
  onLoad(){
    this.getAvatar()
  },
  onShow(){
    this.result = ''
    this.generateAi()
  },
  methods: {
    generateAi(){
      let body = uni.getStorageSync('aiSetting')
      let form = {
        ...body,
        userId:uni.getStorageSync('userId'),
        courses:body.courses.map(item=>(
        item.desc
        ))
      }

      console.log(form);
      
      
      //开启sse
      this.$api.classManagement.createSSE(`/api/ai/createSse?userId=${form.userId}`,this.logData,undefined,this.closeSSE)
      this.$api.classManagement.learnSchedule(form).then(res=>{
        console.log(res);
        
      })
      .catch(err=>{
        console.log(err);
        
      })
    },
    closeSSE(){
      // this.$api.classManagement.endSSE(uni.getStorageSync('userId')).then(res=>{
        // console.log(res);
        console.log('关闭');
        const word = convertMarkdown(this.result)
        this.$set(this,'result',word)
      // })
      // .catch(err=>{
      //   console.log(err);
        
      // })
    },
    //sse回调函数
    logData(res) {
        // 假设 res 是一个字符串，包含了 SSE 消息
        console.log(res);
        
       const data = regexSSE(res)
       if(data){
        this.result +=data
        this.$nextTick(()=>{
          this.$refs.aiResult.queryTextHeight()
        })
       }
            // this.result.word += data; // 将提取的数据添加到 result.word
    },
    handlePush(item){
      console.log(item);
      
      this.list.push(item)
    },
    handleSetting(){
      uni.navigateTo({
        url:"/pages/classManagement/aiChatProfession?type=setting"
      })
    },
    getAvatar(){
        this.$api.personal.getUserAvatar(uni.getStorageSync('userId')).then(res=>{
          console.log(res);
					this.img = request.baseUrl+(res.data?res.data:'/avatars/defaultAvatar.jpg')
					console.log(this.img);
					
        })
        .catch(err=>{
          console.log(err);
          
        })
      },
  },            
}
</script>

<style scoped lang="scss">
.result-box{
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background: linear-gradient(to bottom, #f8f9fd, #f0f2ff);
  position: relative;
  overflow: hidden;
  
  // 装饰圆形元素
  .decoration-circles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;

    .circle {
      position: absolute;
      border-radius: 50%;
      opacity: 0.1;

      &-1 {
        top: -100rpx;
        right: -100rpx;
        width: 400rpx;
        height: 400rpx;
        background: linear-gradient(135deg, #5b6af0, #7b89ff);
      }

      &-2 {
        bottom: 20%;
        left: -150rpx;
        width: 300rpx;
        height: 300rpx;
        background: linear-gradient(135deg, #7b89ff, #5b6af0);
      }

      &-3 {
        top: 40%;
        right: 10%;
        width: 200rpx;
        height: 200rpx;
        background: linear-gradient(135deg, #5b6af0, #7b89ff);
      }
    }
  }
  
  .header{
    position: -webkit-sticky;
    /* position: fixed; */
    top: 0;
    /* left: 0; */
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: 80rpx 40rpx 20rpx;
    height: 120rpx;
    background: linear-gradient(135deg, #5b6af0 0%, #7b89ff 100%);
    box-shadow: 0 4rpx 20rpx rgba(91, 106, 240, 0.2);
    position: relative;
    z-index: 1;

    .navigation-icon{
      width: 24rpx;
      height: 24rpx;
      border-left: 3px solid #ffffff;
      border-top: 3px solid #ffffff;
      transform: rotate(-45deg);
      margin-right: 20rpx;
      transition: all 0.3s ease;
      
      &:active {
        transform: rotate(-45deg) scale(0.9);
      }
    }

    .title{
      text-align: center;
      flex: 1;
      font-size: 38rpx;
      font-weight: 600;
      color: #ffffff;
    }

    .collection{
      margin-right: 30vw;
    }
    
    .play {
      width: auto;
      padding-right: 20rpx;
      
      /deep/ .u-icon {
        color: #ffffff !important;
      }
    }
  }

  .connection-container {
    width: 100%;
    flex: 1;
    padding: 20rpx;
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    // max-height: 80vh;
    // overflow:scroll
  }
  
  .control{
    top: 50%;
    left: 0;
    position: relative;
    transform: translate(-50%,0);
    z-index: 2;
    
    .control-icon{
      width: 45rpx;
      height: 45rpx;
    }
  }
}

.connection{
  flex: 1;
  // min-height: 70vh;
  // max-height: 75vh;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 20rpx;
  box-shadow: 0 10rpx 30rpx rgba(91, 106, 240, 0.1);
  // overflow: hidden;
  margin-bottom: 30rpx;
}

.hidden{
  display: none;
}
</style>
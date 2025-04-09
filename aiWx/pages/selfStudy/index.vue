<template>
  <view class="result-box">
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
    <!-- <aiConnection :content="result" class="connection" :messageList="list" @push="handlePush" :userAvatar="img"></aiConnection>   -->
  </view>
</template>

<script>
// import menuNavigate from './components/menuNavigate.vue';
// import aiConnection from './components/aiConnection.vue';
import request from '../../tools/request';
import { regexSSE } from '../../tools/tool'
import { convertMarkdown } from '../../tools/markdownUtils';
// import AiConnection from './components/aiConnection.vue';
export default{
  components:{
    // menuNavigate,
    // aiConnection
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
  // flex-direction: row;
  // flex-wrap: nowrap;
  // justify-content: flex-start;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  
  .header{
    position:sticky;
    top: 0;
    left: 0;
    display: flex;
    width:100vw;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding-top:80rpx;
    padding-left: 40rpx;
    height: 100rpx;
    background-color: #fff;

    .navigation-icon{
      width:20rpx;
      height: 20rpx;
      border-left: 3px solid #000000;
      border-top: 3px solid #000000;
      transform: rotate(-45deg);
    }

    .title{
      text-align: center;
      flex:1;
      font-size:38rpx;
      font-weight: 600;
      color:#000000;
    }

    .collection{
      margin-right: 30vw;
    }

  }

  .play{
    width: 40vw;
  }

  // .menu-navigator{
  //   // visibility: hidden;
  //   // display: none;
  //   position: relative;
  //   width: 40vw;
  //   min-height: 100vh;
  //   // background-color: #f3f3f378;
  //   background-color: #e8e8e878;
  //   border-radius: 0 50rpx 50rpx 0;
  //   transition:opacity 0.5s ease;
  // }
  
  .control{
    top: 50%;
    left: 0;
    position: relative;
    // transform: translate(0, -50%);
    transform: translate(-50%,0);
    .control-icon{
      width: 45rpx;
      height: 45rpx;
    }
  }
}
.connection{
  flex: 1;
  min-height: 100vh;
  width: 100vw;
}
.hidden{
  display: none;
}
</style>
<template>
  <view>
    <view class="container">
      <view class="header">
        <u--image src="/static/my/user.png" class="user-img" height="175rpx" width="175rpx"  shape="circle"></u--image>
        <view class="header-content">
          <text class="name" selectable="false" space="false" decode="false">{{ author }}</text>
          <text class="header-content-item" selectable="false" space="false" decode="false">{{ time }}</text>
          <text class="header-content-item" selectable="false" space="false" decode="false">来自:{{ sourceType }}</text>
        </view>
      </view>
      <view class="content">{{ content }}</view>
      <view class="footer">
        <icon img="/static/square/read.png"></icon>
        <icon img="/static/square/comment.png" @click="handleShow"></icon>
      </view>
    </view>
    <commentSection v-if="showComment"></commentSection>
  </view>
    
</template>

<script>
import icon from "./icon.vue"
import commentSection from './commentSection.vue'
export default{
  components:{
    icon,
    commentSection
  },
  props:{
    time:{
      type:String,
      required:true
    },
    author:{
      type:String,
      required:true      
    },
    content:{
      type:String,
      required:true
    },
    sourceType:{
      type:String,
      required:true
    }
  },
  data(){
    return{
      item:{
        name:"lingwu99",
        time:"2025-1-20 19:00:00",
        type:"Ai agent"
      },
      showComment:false
    }
  },
  methods: {
    handleShow(){
      this.showComment = !this.showComment
      this.$emit('showComment')
    }
  },
}
</script>

<style scoped lang="scss">
.container{
  width: 100%;
  height:100%;
  background-color: #ffffff;
  // border: 2px solid #000000;
  border-radius: 10rpx;
  margin:40rpx 0 0 0;
  box-shadow: #d2d2ef 7px -5px 1px 0px;
  

  .header{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding:10rpx;
    height: 100%;
    width: 100%;

    .user-img{
      width: 60rpx;
      height: 60rpx;
    }
    &-content{
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: flex-start;
      flex:1;
      height:200rpx;
    }
  }

  .content{
    padding: 30rpx 20rpx 0 60rpx;
    font-size: 30rpx;
  }
  .footer{
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-right: 30rpx;
  }
}
</style>

<template>
  <view class="container">
    <view class="header">
      <u--image src="/static/my/user.png" class="user-img" height="175rpx" width="175rpx"  shape="circle"></u--image>
      <view class="header-content">
        <text class="name" selectable="false" space="false" decode="false">{{ item.name }}</text>
        <text class="header-content-item" selectable="false" space="false" decode="false">{{ item.time }}</text>
        <text class="header-content-item" selectable="false" space="false" decode="false">来自:{{ item.type }}</text>
      </view>
    </view>
    <view class="content">附近的刷卡JFK大厦看来房价肯定撒尽快立法飞机开绿灯撒加风口浪尖阿三的克拉科夫就ask离开家卡拉幅度萨芬大师傅</view>
    <view class="footer">
      <icon></icon>
      <icon></icon>
    </view>
  </view>
</template>

<script>
import icon from "./icon.vue"
export default{
  components:{
    icon
  },
  props:{
    title:{
      type:String,
      required:true
    },
    author:{
      type:String,
      required:true      
    },
    imageHeight:{
      type:Number,
      required:true
    },
    bgColor:{
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
      }
    }
  }
}
</script>

<style scoped lang="scss">
.container{
  width: 100%;
  height:100%;
  background-color: #fffff7;
  margin:40rpx 0;
  box-shadow: rgb(219, 219, 233) 0 7px 10px 0px;

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
    padding: 0 20rpx;
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

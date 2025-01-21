<template>
  <view class="container">
    <view class="image"></view>
    <view class="footer">
      <text class="title">{{ title }}</text>
      <view class="author">
        <view class="author-info">
          <div class="avatar"></div>
          <text class="name">{{ author }}</text>
        </view>
        <text class="like">100</text>
      </view>
    </view>
  </view>
</template>

<script>
export default{
  name:"card",
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

    }
  }
}
</script>

<style scoped lang="scss">
.container{
  width: 100%;
  height:100%;
  background-color: #ffc3c3;

  .image{
    width:100%;
    height:v-bind("`${imageHeight}rpx`");
    border:1px solid #eee;
    border-radius:20px;
    background-color: v-bind("bgColor");
  }

  .footer{
    padding:12rpx;
    font-size: 14px;

    .title{
      margin-bottom:8rpx;
      word-break: break-all;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      color:rgba(51,51,51,0.8)
    }
    
    .author{
     font-size: 13rpx;
     display: flex;
     align-items: center;
     justify-content: space-between;
     gap:5rpx;
     
     .author-info{
      flex:1;
      display: flex;
      align-items: centr;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .avatar{
        margin-right: 6rpx;
        width: 20rpx;
        height: 20rpx;
        border-radius: 20px;
        border:1px solid rgba(0,0,0,0.08);
        background-color:v-bind("bgColor")
      }
      .name{
        width:80%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color:rgba(51,51,51,0.8);
      }
     }
    }
  }
}
</style>

<template>
  <view class="container">
    <!-- <view class="image" :style="{
      backgroundColor: `${bgColor}`,
      height: `${imageHeight}rpx`
    }"></view> -->
    <view class="box-content" :style="{
      backgroundColor:`${bgColor}`
    }">
      <view class="box-content-text">
        {{ content }}
      </view>
    </view>
      
    <view class="footer">
      <text class="title">{{ title }}</text>
      <view class="author">
        <view class="author-info">
          <!-- <div class="avatar" :style="{
            backgroundColor: `${bgColor}`,
          }"></div> -->
          <image class="avatar" :src="authorSrc" mode="aspectFit|aspectFill|widthFix" lazy-load="true" />
            
          <text class="name">{{ author }}</text>
        </view>
        <text class="like">{{likeCount}}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default{
  name:"card",
  props:{
    src:{
      type:String,
      required:true,
      default:'/avatars/defaultAvatar.jpg'
    },
    content:{
      type:String,
      required:true
    },
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
    },
    likeCount:{
      type:Number,
      default:0
    }
  },
  data(){
    return{

    }
  },
  computed:{
    authorSrc(){
      return this.$request.baseUrl + this.src
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  background-color: #FBFBFD;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
  overflow: hidden; 

  .box-content{
    background-color: #d1d1d1;
    padding:10rpx;
    color:#ffffff;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    &-text{
      font-size: 32rpx;
      
    }
  }

  .image {
    width: 100%;
    border: 1px solid #eee;
    border-radius: 20rpx 20rpx 0 0;
  }

  .footer {
    padding: 12rpx;
    font-size: 14px;

    .title {
      margin-bottom: 8rpx;
      word-break: break-all;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      color: rgba(51,51,51,0.8);
      margin-left: 16rpx;
      font-weight: 800;
    }
    
    .author {
      font-size: 13rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 5rpx;
     
      .author-info {
        flex: 1;
        display: flex;
        align-items: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        
        .avatar {
          margin-right: 6rpx;
          width: 60rpx;
          height: 60rpx;
          border-radius: 20rpx;
        }
        
        .name {
          width: 80%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: rgba(51,51,51,0.8);
          font-size: 26rpx;
        }
      }
      
      .like{
        font-size: 22rpx;
      }
    }
  }
}
</style>

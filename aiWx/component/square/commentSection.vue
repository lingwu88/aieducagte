<template>
  <view class="comment-box">
    <view class="comment-list">
      <view class="comment-item" v-for="(item,index) in commentList" :key="item.author">
        <view class="comment-item-author">{{ item.author }}:</view>
        <view class="comment-item-content">{{ item.content }}</view>
        <view class="comment-item-time">{{ item.createTime }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default{
  props:{
    commentList:{
      type:Array,
      default:[]
    }
  },
  data() {
    return {
    }
  },
}
</script>

<style scoped lang="scss">
.comment-box{
  width:100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20rpx;
  background-color: rgba(#f7f7f7,0.7);
  .comment{
    &-list{
      width: 100%;
      height: auto;
    }


    &-item{
      display:flex;
      flex-direction: row;
      align-items: center;
      font-size: 30rpx;

      &-author{
        margin-right: 10rpx;
        color:#3704f9;
      }
      &-content{
        flex: 1;
        margin:0 10rpx;
      }
      &-time{
        font-size: 20rpx;
      }
    }
  }
}
</style>
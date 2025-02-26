<template>
  <view class="comment-box">
    <view class="comment-list">
      <view class="comment-item" v-for="(item,index) in commentList">
        <view class="comment-item-author">{{ item.author }}:</view>
        <view class="comment-item-content">{{ item.content }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default{
  data() {
    return {
      commentList:[
        {
          author:"lingwu",
          content:"我靠，真是太牛逼了，我真的是对你无话可说,仰慕崇拜阿啊阿啊阿啊阿啊阿啊阿啊阿啊"
        },
        {
          author:"lingwu",
          content:"我靠，真是太牛逼了"
        },
        {
          author:"lingwu",
          content:"我靠，真是太牛逼了"
        },
        {
          author:"lingwu",
          content:"我靠，真是太牛逼了"
        }
      ]
        
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
      align-items: flex-start;
      font-size: 30rpx;

      &-author{
        margin-right: 10rpx;
        color:#3704f9;
      }
    }
  }
}
</style>
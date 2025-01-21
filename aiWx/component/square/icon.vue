<template>
  <view class="container">
    <image src="/static/square/read.png" class="image"></image>
    <text class="footer-item">100</text
  </view>
</template>

<script>
export default{
  name:"icon",
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
  background-color: #ffffff;

  .image{
    width:35rpx;
    height:35rpx;
    border:1px solid #eee;
    border-radius:20px;
  }
}
</style>

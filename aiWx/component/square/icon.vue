<template>
  <view class="container">
    <image :src=img class="image" @click="handleClick"></image>
    <text class="footer-item">{{ number }}</text>
    </view>
</template>

<script>
export default{
  name:"icon",
  props:{
    img:{
      type:String,
      required:true
    },
    number:{
      type:Number,
      required:true,
      default:0
    }
  },
  data(){
    return{

    }
  },
  methods: {
    handleClick(){
      this.$emit('click')
    }
  },
}
</script>

<style scoped lang="scss">
.container{
  width: 100%;
  height:100%;
  background-color: inherit;
  padding:10rpx;

  .image{
    position: relative;
    top:10%;
    width:35rpx;
    height:35rpx;
    margin-right: 10rpx;
    border:1px solid #eee;
  }
}
</style>

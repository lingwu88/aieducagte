<template>
  <view class="content">
    <view class="card" @click="handleClick">
      <text class="title">{{ title }}</text>
      <view class="img-list">
        <u--image :src="img" :lazy-load="true" height="250rpx" mode="widthFix"></u--image>
      </view>
      <view class="footer">
        <uni-icons type="eye-filled" size="20"></uni-icons>
        <text class="read">{{ number }}</text> 
      </view>
    </view>
  </view>
</template>

<script>
	export default {
    props:{
      // title:{
      //   type:String,
      //   required:true
      // },
      // img:{
      //   type:String,
      //   required:true
      // }
    },
		data() {
			return {
        title:"2024秋冬季学习宝典|掌握规则,轻松学习",
        img:"/static/classroom/eassyImg1.png",
        number:10000,
        // url:'https://mp.weixin.qq.com/s/ckxVWOXCFWBk9ivXYmrwDA'
			}
		},
		onLoad() {

		},
		methods: {
      handleClick(){
        this.$emit('click')
      }
		}
	}
</script>

<style lang="scss" scoped>
	.content {
    width: 100%;

    .card{
      min-height: 270rpx;
      width: 100%;
      background-color: inherit;
      border-radius: 20rpx;
      display: flex;
      flex-direction: column;
      box-shadow: rgba(100, 100, 111, 0.2) 1px -3px 0px 0px;
      border: none;
      // box-shadow: rgb(100 100 111 / 17%) 1px -1px 1px 2px;

      .title{
        padding:10rpx 0 10rpx 10rpx;
        font-size: 30rpx;
        font-family: "楷体";
      }

      .img-list{
        display: flex;
        flex-direction: row;
        justify-content: center;
      }

      .footer{
        width: 100%;
        min-height: 60rpx;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        padding:20rpx 0 0 50rpx;

        .read{
          color:gray;
          font-size: 24rpx;
          margin-left: 10rpx;
          margin-top: 7rpx;
        // margin-right: 10rpx;
        }
      }

    }
	}
</style>

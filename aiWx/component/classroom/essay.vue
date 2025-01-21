<template>
  <view class="content">
    <view class="card">
      <text class="title">{{ title }}</text>
      <view class="img-list">
        <u--image :src="img" :lazy-load="true" height="180rpx" mode="heightFix"></u--image>
      </view>
      <view class="footer">
        <text class="read">{{ number }}</text>
        <uni-icons type="eye-filled" size="20"></uni-icons>
      </view>
    </view>
  </view>
</template>

<script>
	export default {
		data() {
			return {
        title:"2024秋冬季学习宝典|掌握规则,轻松学习",
        img:"/static/classroom/eassyImg1.png",
        number:10000
			}
		},
		onLoad() {

		},
		methods: {
		}
	}
</script>

<style lang="scss" scoped>
	.content {
    width: 100%;

    .card{
      height: 270rpx;
      width: 100%;
      background-color: inherit;
      border-radius: 5rpx;
      display: flex;
      flex-direction: column;
      box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 10px 0px;

      .title{
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

        .read{
        color:gray;
        font-size: 24rpx;
        margin-left: 30rpx;
        margin-top: 7rpx;
        margin-right: 10rpx;
        }
      }

    }
	}
</style>

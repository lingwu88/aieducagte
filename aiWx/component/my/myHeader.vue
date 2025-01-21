<template>
	<view>
    <view class="card">
     <view class="image-border">
      <u--image src="/static/my/user.png" class="user-img" height="175rpx" width="175rpx"  shape="circle"></u--image>
     </view>
     <text class="description" selectable="false">点击登录/注册</text>
    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
.card{
  width: 90vw;
  height: 300rpx;
  background-color: #dffaff;
  position:relative;
  overflow: hidden;
  z-index: 0;
  background-image: url('/static/my/bg2.png');
  background-color: "black";
  background-size: cover; /* 背景图像覆盖 */
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;

  .image-border{
    position: absolute;
    top: 50rpx; /* 用户头像垂直偏移 */
    left: 30rpx; /* 用户头像水平偏移 */
    border-radius: 100rpx; /* 圆形头像 */
    z-index: 2; /* 用户头像在上层 */
  }
  .description{
    font-size: 40rpx;
  }
}
</style>

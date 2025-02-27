<template>
	<view>
    <view :class="['card',isLogin?'login-style':'noLogin-style']">
     <view class="image-border">
      <u--image src="/static/my/user.png" class="user-img" height="160rpx" width="160rpx"  shape="circle"></u--image>
     </view>
     <text :class="['description']" selectable="false" @click="handleTo">点击登录/注册</text>
     <div :class="['background',isLogin?'login-background':'noLogin-background']"></div>
    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
        isLogin:false
			}
		},
		onLoad() {
      if(uni.getStorageSync('userId')&&uni.getStorageSync('access_token')){
        this.$set(this,'isLogin',true) 
      }
		},
		methods: {
      handleTo(){
        uni.navigateTo({
          url:"/pages/login/login"
        })
      }
		}
	}
</script>

<style lang="scss" scoped>
/deep/.uni-list-item{
  width:80vw;
}
.login-style{
  box-shadow: 1px 2px 2px 0px #404696;
  color:#616060;
}
.noLogin-style{
  color:#ffffff ;
}
.card{
  // color:#ffffff;
  width: 90vw;
  height: 300rpx;
  position:relative;
  overflow: hidden;
  z-index: 0;
  display: flex;
  flex-direction: row; 
  justify-content: space-around;
  align-items: center;
  border-radius: 30rpx;

  .image-border{
    position: absolute;
    // top: 50rpx; /* 用户头像垂直偏移 */
    left: 30rpx; /* 用户头像水平偏移 */
    border-radius: 100rpx; /* 圆形头像 */
    z-index: 2; /* 用户头像在上层 */

    .user-img{
      margin:auto 0;
    }
  }
  .description{
    // color: #fff;
    font-weight: 600;
    font-size: 40rpx;
    z-index:2;
  }
}
.background{
  z-index:1;
  position:absolute;
  width: 100%;
  height: 100%;
  // background-image: url('/static/my/bg1.png');
  background-size: cover; /* 背景图像覆盖 */
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.8;
}
.login-background{
  background-image: url('/static/my/bg1.png');
}
.noLogin-background{
  background-image:url('/static/my/bg3.png')
}
</style>

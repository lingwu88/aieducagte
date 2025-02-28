<template>
  <view class="container login-container">
    <view class="bg"></view>
    <view class="title">
      <view class="first" style="font-family: KaiTi, STKaiti, serif;">阅读、规划、复习的</view>
      <view class="second" style="font-family: KaiTi, STKaiti, serif;">一站式AI学习平台</view>
    </view>
    <view class="overlay"></view>
    <view class="box">
      <view class="header">
        <image class="logo" src="/static/index.png" lazy-load="false" />
        <view class="teamName">智趣学坊</view>
      </view>
      <view class="footer">
        <view class="btn" @click="login">手机号快捷登录</view>
        <view class="check">
          <u-checkbox-group v-model="checked" placement="row">
            <u-checkbox activeColor="#8B6FF0" size="16" name="1"></u-checkbox>
          </u-checkbox-group>
          <view class="agreement" @click="handleCheck">
            <text @click.stop="toDesc">《平台用户协议以及隐私协议》</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      checked: false
    };
  },
  onLoad() {},
  methods: {
    async login() {
      if (!this.checked) {
        uni.showToast({
          title: "请勾选协议",
          icon: "none"
        });
        return;
      }
      console.log(this.$api);
      const code = await this.$api.personal.wxLogin();
      console.log(code);
      this.$api.personal.userLogin({ code }).then(res => {
        console.log(res);
        if (res?.code === 200) {
          uni.setStorageSync("userId", res.data.userId);
          uni.setStorageSync("accessToken", res.data.accessToken);
          uni.setStorageSync("refreshToken", res.data.refreshToken);
          uni.switchTab({
            url: "/pages/index/index"
          });
        } else {
          uni.showToast({
            title: "请求错误",
            icon: "none"
          });
        }
      }).catch(err => {
        console.log(err);
      });
    },
    handleCheck() {
      if (!this.checked) {
        uni.showToast({
          title: "请勾选协议",
          icon: "none"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.bg {
  height: 30vh;
  width: 100vw;
  background-color: #FFFFFF;
}

.header {
  z-index: 10;
  position: relative;
  top: -18%;
  transform: translate(0, -50%);
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .logo {
    width: 600rpx;
    height: 300rpx;
  }

  view {
    font-size: 65rpx;
    text-align: center;
    color: #FFFFFF;
    font-family: "Source Han Sans", "Noto Sans SC", sans-serif;
    font-weight: 600;
    letter-spacing: 3rpx;
    text-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.15);
  }
}

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx;
}

.overlay {
  width: 100%;
  height: 100rpx;
  border-radius: 60rpx 60rpx 0rpx 0rpx;
  margin-top: -50rpx;
  background-color: rgba(#7C55D4, 0.22);
  z-index: 8;
}

.box {
  width: 100%;
  box-sizing: border-box;
  border-radius: 60rpx 60rpx 0 0;
  background-color: #A587E7;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 20rpx;
  margin-top: -80rpx;
  z-index: 9;
  height: 50vh;
  flex: 1;
}

.title {
  position: relative;
  top: 20vh;
  width: 80%;
  text-align: left;
  transform: translate(0, 40%);
  z-index: 11;

  .first {
    font-size: 32rpx;
    color: #FFFFFF;
    font-weight: 300;
    letter-spacing: 2rpx;
    line-height: 46rpx;
  }

  .second {
    font-size: 44rpx;
    color: #F5F3FF;
    font-weight: 400;
    letter-spacing: 2rpx;
    line-height: 54rpx;
    margin-top: 12rpx;
  }
}

.btn {
  color: #ffffff;
  background-color: #6F53D9;
  border-radius: 20rpx;
  width: 60vw;
  height: 100rpx;
  line-height: 100rpx;
  text-align: center;
  font-size: 35rpx;
  margin: 40rpx auto;
  z-index: 10;
}

.check {
  display: flex;
  flex-direction: row;
  align-items: center; 
  justify-content: center;

  .agreement {
    margin-left: 10rpx; 
    font-size: 28rpx;
    color: #FFFFFF;
    font-family: "Source Han Sans", sans-serif;

    text {
      color: #F5F3FF;
    }
  }

  u-checkbox-group {
    display: flex;
    align-items: center;
  }
}
</style>
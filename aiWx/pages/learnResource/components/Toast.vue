<template>
  <view v-if="visible" class="toast" :style="{ top: top + 'rpx' }">
    {{ message }}
  </view>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      message: '',
      top: 50 // 初始顶部位置
    };
  },
  methods: {
    show(message) {
      this.message = message;
      this.visible = true;
      this.top = 50; // 重置位置
      setTimeout(() => {
        this.top = -100; // 3秒后上移消失
        setTimeout(() => {
          this.visible = false;
        }, 500); // 动画结束后隐藏
      }, 3000);
    }
  }
};
</script>

<style lang="scss" scoped>
.toast {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 20rpx 40rpx;
  border-radius: 10rpx;
  font-size: 28rpx;
  z-index: 9999;
  transition: top 0.5s ease;
  max-width: 80%;
  text-align: center;
}
</style>
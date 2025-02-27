<template>
  <view v-if="visible" class="toast" :style="{ top: top + 'px' }">
    {{ message }}
  </view>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      message: '',
      top: 50 // 初始默认值，单位为 px
    };
  },
  methods: {
    show(message, heightPercent = 0.5) {
      const systemInfo = uni.getSystemInfoSync();
      const screenHeight = systemInfo.windowHeight; // 获取屏幕高度（单位：px）
      const toastHeight = 30; // 假设 Toast 高度为 60rpx，约为 30px（根据样式调整）
      const initialTop = screenHeight * (1 - heightPercent) - toastHeight / 2; // 初始位置
      const endTop = initialTop - 150; // 结束位置：向上移动 150px

      this.message = message;
      this.top = initialTop > 0 ? initialTop : 50; // 确保不超出顶部
      this.visible = true;
      setTimeout(() => {
        this.top = endTop > -100 ? endTop : -100; // 确保结束位置合理
        setTimeout(() => {
          this.visible = false;
        }, 500); // 动画结束后隐藏
      }, 3000); // 3秒后移动
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
  pointer-events: none;
}
</style>
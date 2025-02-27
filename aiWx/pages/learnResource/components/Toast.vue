<template>
  <view v-if="visible" class="toast" :style="{ top: top + 'px', opacity: opacity }">
    {{ message }}
  </view>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      message: '',
      top: 50, // 初始位置，单位为 px
      opacity: 1 // 初始透明度
    };
  },
  methods: {
    show(message, heightPercent = 0.5) {
      const systemInfo = uni.getSystemInfoSync();
      const screenHeight = systemInfo.windowHeight; // 获取屏幕高度（单位：px）
      const toastHeight = 25; // 假设 Toast 高度为 60rpx，约为 30px（根据样式调整）
      const initialTop = screenHeight * (1 - heightPercent) - toastHeight / 2; // 初始位置
      const endTop = initialTop - 150; // 结束位置：向上移动 150px

      this.message = message;
      this.top = initialTop > 0 ? initialTop : 50; // 确保不超出顶部
      this.opacity = 1; // 重置透明度为完全不透明
      this.visible = true;

      setTimeout(() => {
        this.top = endTop > -100 ? endTop : -100; // 移动到结束位置
        this.opacity = 0; // 渐变为完全透明
        setTimeout(() => {
          this.visible = false; // 动画结束后隐藏
          this.opacity = 1; // 重置透明度为下次使用
        }, 500); // 动画持续时间与 CSS 过渡一致
      }, 2000); // 3秒后开始消失动画
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
  transition: all 0.5s ease; /* 同时过渡 top 和 opacity */
  max-width: 80%;
  text-align: center;
  pointer-events: none;
}
</style>
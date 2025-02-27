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
      top: 50 // 初始默认值，单位改为 px
    };
  },
  methods: {
    show({ message, top, endTop }) {
      this.message = message;
      this.top = top; // 使用传入的初始位置
      this.visible = true;
      setTimeout(() => {
        this.top = endTop; // 移动到结束位置
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
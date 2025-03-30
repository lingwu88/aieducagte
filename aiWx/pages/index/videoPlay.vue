<template>
  <view class="webview-container">
      <web-view :src="url" class="webview"></web-view>
  </view>
</template>

<script>
export default {
    // 显式定义 url 作为 prop
    data() {
        return {
           url:""
        };
    },
    mounted(){
        this.checkUserId()
    },
    onLoad(options) {
        console.log('webview onLoad, options:', options);
        // 不再需要手动设置 this.url，因为它已通过 prop 提供
        console.log('当前页面栈:', getCurrentPages());
        this.url = decodeURIComponent(options.videoUrl)
    },
    onUnload() {
        console.log('webview onUnload, 当前页面栈:', getCurrentPages());
    },
    methods: {
        goBack() {
            console.log('尝试返回, 当前页面栈:', getCurrentPages());
            uni.navigateBack({
                delta: 1
            });
        },
    }
};
</script>

<style lang="scss" scoped>
.webview-container {
	height: 100vh;
	position: relative;
}

.webview {
	width: 100%;
	height: 100%;
}
</style>

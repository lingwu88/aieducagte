<template>
	<view class="container">
    <view class="aiessay" @tap="handleto(1)">
      <image src="/static/classroom/learnResource/aiWrite.png" class="aiWrite"></image>
			<text class="aiWrite-text" selectable="false" space="false" decode="false">
				AI变文
			</text>
    </view>
    <view class="footer">
			<view class="footer-item" v-for="(item,index) in list" :key="index">
				<image :src="item.img" alt="无法加载出图片" class="item-img" @click="navigateTo(item)"></image>
				<text class="item-description">{{item.description}}</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          description: "课件库",
          img: "/static/classroom/learnResource/book.png",
          url: "/pages/learnResource/courseLibrary"
        },
        {
          description: "资料库",
          img: "/static/classroom/learnResource/essay.png",
          url: "/pages/learnResource/DocLib" //DocLib文件未创建
        }
      ]
    }
  },
  onLoad() {},
  methods: {
    handleto(index) {
      console.log(index);
      if (index === 1) {
        console.log(1);
        uni.navigateTo({ url: "/pages/learnResource/aiConvert" });
      }
    },
    navigateTo(item) {
      if (item.url) {  // 添加条件避免空URL报错
        uni.navigateTo({
          url: item.url
        });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .aiessay {
    width: 90vw;
    max-height: 350rpx;
    margin: 40rpx 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .aiWrite {
      width: 300rpx;
    }
    .aiWrite-text {
      font-size: 50rpx;
      color: #333;
      text-align: center;
    }
  }

  .footer {
    width: 90vw;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;

    .footer-item {
      width: 45vw;
      max-height: 400rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .item-img {
        width: 350rpx;
      }
      .item-description {
        font-size: 50rpx;
        color: #333;
        text-align: center;
      }
    }
  }
}
</style>
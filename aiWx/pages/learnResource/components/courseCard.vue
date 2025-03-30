<template>
	<view>
		<view class="card-box" @click="handlePlay">
			<view class="img-box">
				<image :src="img" class="img" mode="aspectFill"></image>
				<view class="overlay"></view>
			</view>
			<view class="title">{{ title }}</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			required: true
		},
		img: {
			type: String,
			default: 'http://120.26.132.46:8091/classroom/learnResource/course_default.png'
		}
	},
	data() {
		return {};
	},
	onLoad() {},
	methods: {
		handlePlay(){
			this.$emit('play')
		}
	}
};
</script>

<style lang="scss" scoped>
.card-box {
  width: 100%;
  min-height: 280rpx;
  border-radius: 16rpx;
  overflow: hidden;
  background-color: #ffffff;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.98);
  }

  .img-box {
    position: relative;
    width: 100%;
    height: 200rpx;
    overflow: hidden;
    
    .img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    
    .overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 60rpx;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
    }
  }

  .title {
    padding: 16rpx 20rpx;
    font-size: 28rpx;
    font-weight: 500;
    color: #333;
    line-height: 1.4;
    max-height: 78rpx; /* 确保只显示两行，28rpx * 1.4 * 2 = 78.4rpx */
    word-break: break-all;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: normal;
  }
}
</style>

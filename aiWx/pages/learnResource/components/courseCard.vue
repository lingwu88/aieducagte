<template>
	<view>
		<view class="card-box">
			<view class="img-box">
				<image :src="img" class="img" mode="aspectFill"></image>
				<view class="overlay"></view>
			</view>
			<view class="content">
				<view class="title">{{ title }}</view>
			</view>
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
			default: '/static/classroom/learnResource/course_default.png'
		}
	},
	data() {
		return {};
	},
	onLoad() {},
	methods: {}
};
</script>

<style lang="scss" scoped>
.card-box {
  width: 100%;
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  position: relative;
  
  .img-box {
    width: 100%;
    height: 220rpx;
    position: relative;
    overflow: hidden;
    
    .img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
      
      &:active {
        transform: scale(1.05);
      }
    }
    
    .overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 60rpx;
      background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
    }
  }
  
  .content {
    padding: 20rpx;
  }
  
  .title {
    font-size: 32rpx;
    font-weight: 600;
    color: #2d3748;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>

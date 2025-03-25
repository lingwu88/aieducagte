<template>
	<view>
		<view class="card-box" @click="handlePlay">
			<view class="img-box">
				<image :src="img" class="img"></image>
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
.card-box{
  width:100%;
  min-height: 350rpx;

  .img-box{
    width:100%;
    height: 180rpx;

    /deep/image{
      width:inherit;
      height: inherit;
      background-color: #000000;
    }
  }

	.title {
		font-size: 28rpx;
		font-family: Georgia, 'Times New Roman', Times, serif;
		word-break: break-all;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 4;
		text-overflow: ellipsis;
		overflow: hidden;
	}
}
</style>

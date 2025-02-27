<template>
	<view >
    <view class="card-box">
      <view class="img-box">
        <image :src="img" class="img"></image>
      </view>
      <view class="title">
        【{{title}}】
      </view>
    </view>
	</view>
</template>

<script>
	export default {
    props:{
      title:{
        type:String,
        required:true
      },
      img:{
        type:String,
        default:"/static/classroom/learnResource/course_default.png"
      }
    },
		data() {
			return {
				}
		},
		onLoad() {

		},
		methods: {
		}
	}
</script>

<style lang="scss" scoped>
.card-box{
  width:100%;
  min-height: 200rpx;

  .img-box{
    width:100%;
    height: 180rpx;

    /deep/image{
      width:inherit;
      height: inherit;
      background-color: #000000;
    }
  }

    .title{
    font-size: 38rpx;
    font-family: Georgia, 'Times New Roman', Times, serif;
  }
}

</style>
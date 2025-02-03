<template>
  <view @click="handleClick">
    <view class="menu-item " :style="{borderColor:`${color}`,color:`${color}`}" v-if="!isActive">
			<text>{{ desc }}</text>
		</view>
    <view class="item-active" :style="{backgroundColor:`${color}`, borderColor:`${color}`, color:'#fff'}" v-else>
      <text>{{ desc }}</text>
    </view>
  </view>
</template>

<script>
	export default {
		props:{
			desc:{
				type:String,
				default:""
			},
			color:{
				type:String,
				default:"#fdad3d"
			},
      "is-active":{
        type:Boolean,
        default:false
      }
		},
    data(){
      return {
        active:false
      }
    },
		onLoad() {

		},
		methods: {
      handleClick(){
        // console.log(this.isActive);
        
        this.$emit("click")
      }
		}
	}
</script>

<style lang="scss" scoped>

		.menu-item{
			width: 250rpx;
			height: 150rpx;
			background-color: #fff;
			border:1px solid #814f4f;
			border-radius: 20rpx;
			margin: 20rpx;
			font-size: 40rpx;
			text-align: center;
			line-height: 150rpx;
      border-color: var(--color);
      color: var(--color);
	}

  .item-active{
    width: 250rpx;
    height: 150rpx;
    background-color: #fff;
    border:1px solid #814f4f;
    border-radius: 20rpx;
    margin: 20rpx;
    font-size: 40rpx;
    text-align: center;
    line-height: 150rpx;
    background-color: var(--color);
    color: #fff;
  }
</style>


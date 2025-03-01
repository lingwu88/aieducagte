<template>
  <view @click="handleClick" class="tag-wrapper">
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
				default:"#5b6af0"
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
.tag-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.menu-item {
  width: 240rpx;
  height: 140rpx;
  background-color: #fff;
  border: 2rpx solid;
  border-radius: 16rpx;
  margin: 10rpx;
  font-size: 34rpx;
  text-align: center;
  line-height: 140rpx;
  border-color: var(--color);
  color: var(--color);
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:active {
    transform: scale(0.97);
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.02);
  }
}

.item-active {
  width: 240rpx;
  height: 140rpx;
  border: 2rpx solid;
  border-radius: 16rpx;
  margin: 10rpx;
  font-size: 34rpx;
  font-weight: 600;
  text-align: center;
  line-height: 140rpx;
  background-color: var(--color);
  border-color: var(--color);
  color: #fff;
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 10rpx;
    right: 10rpx;
    width: 16rpx;
    height: 16rpx;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.6);
  }
  
  &:active {
    transform: scale(0.97);
    box-shadow: 0 3rpx 10rpx rgba(0, 0, 0, 0.06);
  }
}
</style>

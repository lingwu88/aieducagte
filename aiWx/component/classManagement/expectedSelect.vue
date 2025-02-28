<template>
  <view class="select-box">
    <scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" >
          <view class="item" v-for="(item,index) in list" @click="handleChange(index)" :key="item.id">
            <view class="item-icon">
              <u-icon :name="item.isSelect?'checkmark-circle-fill':'checkmark-circle'"></u-icon>
            </view>
            <view class="item-desc">{{ item.desc }}</view>
          </view>
    </scroll-view>
  </view>
</template>

<script>
export default{
  name:"expectedSelect",
  props:{
    list:{
      type:Array,
      required:true,
      default:[]
    }
  },
  data() {
    return {
      currentIndex:-1,
    }
  },
  methods:{
    handleChange(index){
      this.$emit('select',index)
    }
  }
}
</script>

<style scoped lang="scss">
.select-box{
  height: inherit;
  width: inherit;
  background-color: #f3f3f3;
  padding: 20rpx 0;
  .scroll-Y{
    height: 100%;
  }
  .item{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 90%;
    background-color: #ffffff;
    border-radius: 40rpx;
    margin: 10rpx auto;
    padding:10rpx;

    &-desc{
      margin:0 0 0 10rpx;
    }
  }
}
</style>
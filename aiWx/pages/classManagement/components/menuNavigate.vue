<template>
  <view class="menu-box">
    <view class="menu-box-list">
      <view class="menu-box-list-item" v-for="(item,index) in list">
        {{ item }}
      </view>
    </view>
    <!-- 这里可以添加其他展示的内容 -->
  </view>
</template>

<script>
export default {
  name: 'menuNavigate',
  data() {
    return {
      list:['这是你的第一次搜索记录','这是你的第二次搜索记录','这是你的第三次搜索记录','这是你的第四次搜索记录','这是你的第五次搜索记录','这是你的第六次搜索记录','这是你的第一次搜索记录','这是你的第一次搜索记录']
    }
  },
}
</script>

<style scoped lang="scss">
/* 样式可以根据需要添加 */
.menu{
  &-box{
    width: 100%;
    min-height:100%;
    background-color: inherit;
    &-list{
      &-item{
        background-color: #ffffff;
        width: 85%;
        padding:20rpx 10rpx;
        border-radius: 20rpx;
        margin: 10rpx auto;
        font-size: 26rpx;
        text-overflow: ellipsis;
      }
    }
  }
}
</style> 
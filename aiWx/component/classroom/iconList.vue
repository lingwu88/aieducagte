<template>
	<view class="content">
    <view class="list">
      <view class="list-item" v-for="(item,index) in menu" :key="index" @click="handleTo(item)" :class="[index === 0 ? 'first-item' : '', index === menu.length-1 ? 'last-item' : '']">
        <view class="icon-wrapper" :class="[index === 0 ? 'first-icon' : '', index === menu.length-1 ? 'last-icon' : '']">
          <u-image :src="item.img" :lazy-load="true" height="120rpx" width="120rpx" :show-menu-by-longpress="false"></u-image>
        </view>
        <text class="text" selectable="false">{{ item.content }}</text>
      </view>
    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				menu:[
          {
            img:"/static/classroom/learningResource.png",
            content:"学习资源",
            path:"/pages/learnResource/index"
          },
          {
            img:"/static/classroom/classroomManagement.png",
            content:"课堂管理",
            path:"/pages/classManagement/aiChats"
          },
          {
            img:"/static/classroom/learningSuggestion.png",
            content:"学习建议",
            path:"/pages/learnSuggestion/index"
          },
          {
            img:"/static/classroom/progessFeedback.png",
            content:"进度反馈",
            path:"/pages/progressFeedback/index"
          },
        ]
			}
		},
		onLoad() {

		},
		methods: {
      handleTo(item){
        console.log('触发导航');
        console.log(item.path);
        
        uni.navigateTo({
          url:item.path
        })
      }
		}
	}
</script>

<style lang="scss" scoped>
	.content {
    width: 100%;
    padding: 20rpx 0;

    .list{
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      width: 100%;

      .list-item{
        display: flex;
        flex-direction: column;
        align-items: center;
        
        .icon-wrapper {
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 0;
          width: 160rpx;
          height: 160rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 4rpx 16rpx rgba(31, 38, 135, 0.12);
          position: relative;
          overflow: hidden;
        }
        
        &.first-item .icon-wrapper {
          border-radius: 16rpx 0 0 16rpx;
        }
        
        &.last-item .icon-wrapper {
          border-radius: 0 16rpx 16rpx 0;
        }

        .text{
          font-size: 26rpx;
          margin: 20rpx 0 10rpx;
          color: #4a5568;
          font-weight: 600;
          text-align: center;
          position: relative;
          letter-spacing: 2rpx;
        }
      }
    }
	}
</style>

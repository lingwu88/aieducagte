<template>
	<view class="content">
    <view class="list">
      <view class="list-item" v-for="(item,index) in menu" :key="index" @click="handleTo(item)">
        <view class="icon-container">
          <u-image :src="item.img" :lazy-load="true" height="80rpx" width="80rpx"></u-image>
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
            img:this.$request.baseUrl+"/classroom/classroomManagement.png",
            content:"AI课堂",
            path:"/pages/classManagement/aiChats"
          },
          {
            img:this.$request.baseUrl+"/classroom/learningResource.png",
            content:"学习资源",
            path:"/pages/learnResource/index"
          },
          {
            img:this.$request.baseUrl+"/classroom/progessFeedback.png",
            content:"进度反馈",
            path:"/pages/progressFeedback/index"
          },
          {
            img:this.$request.baseUrl+"/classroom/learningSuggestion.png",
            content:"学能图谱",
            path:"/pages/learnDashboard/index"
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

    .list{
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      width: 100%;

      .list-item{
        background-color: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 140rpx;
        margin: 0 10rpx;

        .icon-container {
          width: 120rpx;
          height: 120rpx;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 20rpx;
          box-shadow: 0 8rpx 32rpx 0 rgba(91, 106, 240, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.18);
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.3s ease;
          
          &:active {
            transform: scale(0.95);
            box-shadow: 0 4rpx 16rpx 0 rgba(91, 106, 240, 0.15);
          }
        }

        .text{
          font-size: 30rpx;
          margin: 25rpx 0;
          text-align: center;
          width: 100%;
          color: #333;
          font-weight: 500;
        }
      }
    }
	}
</style>

<template>
	<view class="container">
    <view class="header">
      <view class="title-container">
        <view class="title-line"></view>
        <view class="title">优质课程汇总</view>
      </view>
      <view class="subtitle">探索精选课程，提升你的学习体验</view>
    </view>
    <view class="course-list">
      <view v-for="(item,index) in list" :key="index" class="course-item" @longpress.stop.prevent="handleLongPress">
        <courseCard :img="item.img" :title="item.title" class="course-card"></courseCard>
      </view>
    </view>
    <view class="empty-block"></view>
	</view>
</template>

<script>
import courseCard from './components/courseCard.vue';
	export default {
    components:{courseCard},
		data() {
			return {
          list:[
            {
              img:"/static/classroom/learnResource/course_bg1.png",
              title:"这只是个示例"
            },
            {
              img:"/static/classroom/learnResource/course_bg2.png",
              title:"这只是个示例"
            },
            {
              img:"/static/classroom/learnResource/course_bg3.png",
              title:"这只是个示例"
            },
            {
              img:"/static/classroom/learnResource/course_bg4.png",
              title:"这只是个示例"
            },
            {
              img:"/static/classroom/learnResource/course_bg5.png",
              title:"这只是个示例"
            },
            {
              img:"/static/classroom/learnResource/course_bg6.png",
              title:"这只是个示例"
            },
            {
              img:"/static/classroom/learnResource/course_bg7.png",
              title:"这只是个示例"
            }
          ]
				}
		},
		onLoad() {

		},
		methods: {
      handleLongPress(e) {
        // 阻止长按默认行为
        e.stopPropagation();
        e.preventDefault();
        return false;
      }
		}
	}
</script>

<style lang="scss" scoped>
.container {
  background-color: #f8f9fd;
  min-height: 100vh;
  padding-bottom: 40rpx;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  user-select: none; /* Standard */
}

.header {
  padding: 40rpx 30rpx;
  background: linear-gradient(135deg, #eef2ff 0%, #e6ecfd 100%);
  border-radius: 0 0 30rpx 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
  margin-bottom: 30rpx;
  will-change: transform; /* 优化渲染性能 */
}

.title-container {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.title-line {
  width: 8rpx;
  height: 40rpx;
  background: linear-gradient(to bottom, #5b6af0, #7b89ff);
  border-radius: 4rpx;
  margin-right: 20rpx;
}

.title {
  font-size: 40rpx;
  font-weight: 700;
  color: #2d3748;
  letter-spacing: 2rpx;
}

.subtitle {
  font-size: 28rpx;
  color: #8a94a6;
  margin-left: 28rpx;
  margin-top: 10rpx;
}

.course-list {
  width: 100%;
  padding: 20rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  box-sizing: border-box;
}

.course-item {
  width: 48%; /* 从46%增加到48% */
  margin-bottom: 30rpx;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
  background-color: #fff;
  transition: transform 0.3s ease;
  
  &:active {
    transform: scale(0.98);
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  }
}

.course-card {
  width: 100%;
}

.empty-block {
  height: 100rpx;
}
</style>

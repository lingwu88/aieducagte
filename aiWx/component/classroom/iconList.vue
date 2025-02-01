<template>
	<view class="content">
    <view class="list">
      <view class="list-item" v-for="(item,index) in menu" :key="index" @click="handleTo(item)">
        <u-image :src="item.img" :lazy-load="true" height="120rpx" width="120rpx"></u-image>
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
            path:"/pages/classManagement/index"
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
        

        .text{
          font-size: 30rpx;
          margin: 25rpx 0;
        }
      }
    }
	}
</style>

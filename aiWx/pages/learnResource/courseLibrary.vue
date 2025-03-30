<template>
	<view class="container">
    <view class="header">
      <view class="header-content">
        <view class="title">优质课程汇总</view>
        <view class="subtitle">精选高质量学习资源，助力学习成长</view>
      </view>
    </view>
    <view class="course-list">
      <view v-for="(item,index) in list" :key="item.coursewareId" class="course-item" @click="handlePlay(item.coursewareContent)">
        <courseCard :img="item.coursewareContent.pic" :title="item.coursewareName" class="course-card"></courseCard>
      </view>
    </view>
	</view>
</template>

<script>
import courseCard from './components/courseCard.vue';
import pageTime from '../../mixins/pageTime';
	export default {
    components:{courseCard},
    onLoad(){
      this.getCourse()
    },
		data() {
			return {
          list:[
            // {
            //   img:this.$request.baseUrl+"/classroom/learnResource/course_bg1.png",
            //   title:"这只是个示例"
            // },
            // {
            //   img:this.$request.baseUrl+"/classroom/learnResource/course_bg2.png",
            //   title:"这只是个示例"
            // },
            // {
            //   img:this.$request.baseUrl+"/classroom/learnResource/course_bg3.png",
            //   title:"这只是个示例"
            // },
            // {
            //   img:this.$request.baseUrl+"/classroom/learnResource/course_bg4.png",
            //   title:"这只是个示例"
            // },
            // {
            //   img:this.$request.baseUrl+"/classroom/learnResource/course_bg5.png",
            //   title:"这只是个示例"
            // },
            // {
            //   img:this.$request.baseUrl+"/classroom/learnResource/course_bg6.png",
            //   title:"这只是个示例"
            // },
            // {
            //   img:this.$request.baseUrl+"/classroom/learnResource/course_bg7.png",
            //   title:"这只是个示例"
            // }
          ]
				}
		},
    mounted(){
			this.checkUserId()
      this.setType(2)
		},
		methods: {
      getCourse(){
        this.$api.learnResource.getCourse({
          coursewareId:"",
          limit:12
        })
        .then(res=>{
          console.log(res.data);
          console.log(JSON.parse(res.data[0].coursewareContent));
          const newArr = res.data.map(item=>({
            ...item,
            coursewareContent:JSON.parse(item.coursewareContent)
          }))
          this.$set(this,'list',newArr)
        })
        .catch(err=>{
          console.log(err);
          
        })
      },
      handlePlay(item){
        const {aid,bvid,cid} = item
        console.log(aid);
        
        const videoUrl =`https://player.bilibili.com/player.html?isOutside=true&aid=${aid}&bvid=${bvid}&cid=${cid}&p=1`
        console.log(videoUrl);
        
        uni.navigateTo({
          url:`/pages/index/videoPlay?videoUrl=${encodeURIComponent(videoUrl)}`
        })
      }
    }
	}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #f8f9fd;
}

.header {
  position: relative;
  width: 100%;
  height: 220rpx;
  background: linear-gradient(135deg, #64C88C 0%, #7fd9a2 100%);
  border-radius: 0;
  box-shadow: 0 4rpx 20rpx rgba(100, 200, 140, 0.2);
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -100rpx;
    right: -100rpx;
    width: 300rpx;
    height: 300rpx;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -80rpx;
    left: 60rpx;
    width: 200rpx;
    height: 200rpx;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
  }
  
  .header-content {
    position: relative;
    z-index: 1;
    padding: 40rpx 40rpx;
    
    .title {
      font-size: 44rpx;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 10rpx;
    }
    
    .subtitle {
      font-size: 28rpx;
      color: rgba(255, 255, 255, 0.8);
    }
  }
}

.course-list {
  width: 100%;
  padding: 30rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
}

.course-item {
  width: 46%;
  margin-bottom: 40rpx;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.98);
  }
}

.course-card {
  width: 100%;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
}
</style>

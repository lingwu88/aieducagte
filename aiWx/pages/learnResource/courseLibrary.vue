<template>
	<view class="container">
    <view class="line"></view>
    <view class="title">优质课程汇总</view>
    <view class="course-list">
      <view  v-for="(item,index) in list" :key="item.coursewareId" class="course-item">
        <courseCard :img="item.coursewareContent.pic" :title="item.coursewareName" class="course-item" @play="handlePlay(item.coursewareContent)"></courseCard>
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
.line{
  width: 100%;
  height: 40rpx;
  background-color: #f1f1f1;
}
.title{
  font-size: 40rpx;
  font-weight: 700;
  text-align: center;
  margin-top: 50rpx;
}
.course-list{
  width: 100vw;
  min-height: 400rpx;
  overflow: scroll;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
}
.course-item{
  margin:auto 30rpx;
  width: 40vw;
}
</style>

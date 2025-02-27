<template>
	<view class="container">
    <view class="course-list">
      <view  v-for="(item,index) in list" :key="index" class="course-item">
        <courseCard :img="item.img" :title="item.title" class="course-item"></courseCard>
      </view>
    </view>
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
		}
	}
</script>

<style lang="scss" scoped>
.course-list{
  width: 100%;
  min-height: 400rpx;
  display: row;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
}
.course-item{
  width: 45vw;
}
</style>

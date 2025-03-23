<template>
  <view>
    <view class="container">
      <view class="header">
        <image :src="img" class="user-img" height="175rpx" width="175rpx"  shape="circle"></image>
        <view class="header-content">
          <text class="name" selectable="false" space="false" decode="false">{{ author }}</text>
          <text class="header-content-item" selectable="false" space="false" decode="false">{{ time }}</text>
          <!-- <text class="header-content-item" selectable="false" space="false" decode="false">来自{{ sourceType }}</text> -->
        </view>
      </view>
      <view class="header-title" selectable="false" space="false" decode="false">{{ title }}</view>
      <view class="content">{{ content }}</view>
      <view class="tag-list">
        <view class="tag-item" v-for="(item,index) in tagList" :key="item">#{{ item }}</view>
      </view>
      <text class="content-type">{{ contentType }}</text>
      <view class="footer">
        <icon :img="showStar?'/static/square/star-fill.png':'/static/square/star.png'" @click="handleStar" :number="likeCount"></icon>
        <!-- <icon img="/static/square/read.png" :number="likeCount"></icon> -->
        <icon img="/static/square/comment.png" :number="commentCount" @click="handleShow"></icon>
      </view>
    </view>
    <commentSection v-if="showComment" :commentList="commentList"></commentSection>
  </view>
    
</template>

<script>
import icon from "./icon.vue"
import commentSection from './commentSection.vue'
export default{
  components:{
    icon,
    commentSection
  },
  props:{
    likeCount:{
      type:Number,
      required:true
    },
    tagList:{
      type:Array,
      required:false,
      default:[]
    },
    commentCount:{
      type:Number,
      required:true
    },
    img:{
      type:String,
      required:true
    },  
    time:{
      type:String,
      required:true
    },
    author:{
      type:String,
      required:true      
    },
    content:{
      type:String,
      required:true
    },
    sourceType:{
      type:String,
      required:false
    },
    title:{
      type:String,
      required:true
    },
    commentList:{
      type:Array,
      default:[]
    },
    showStar:{
      type:Boolean,
      required:true
    },
    contentType:{
      type:String,
      required:true
    }
  },
  data(){
    return{
       // item:{
      //   name:"lingwu99",
      //   time:"2025-1-20 19:00:00",
      //   type:"Ai agent"
      // },
      showComment:false
    }
  },
  methods: {
    handleStar(){
      console.log(this.showStar);
      this.$emit('star',this.showStar)
    },
    handleShow(){
      this.showComment = !this.showComment
      if(this.showComment){
        this.$emit('comment',this.showComment)
      }
      this.$emit('showComment',false)
    }
  },
}
</script>

<style scoped lang="scss">
.container{
  width: 100%;
  height:100%;
  background-color: #ffffff;
  // border: 2px solid #000000;
  border-radius: 10rpx;
  margin:40rpx 0 0 0;
  box-shadow: #d2d2ef 7px -5px 1px 0px;
  

  .header{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding:10rpx;
    height: 100%;
    width: 100%;

    .user-img{
      width: 100rpx;
      height: 100rpx;
      border-radius: 60rpx;
    }
    &-content{
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: flex-start;
      flex:1;
      margin-top:20rpx;
      margin-left: 20rpx;
      height:200rpx;
    }
    &-title{
      padding-left: 30rpx;
    }
  }

  .content{
    padding: 30rpx 20rpx 0 60rpx;
    font-size: 30rpx;
  }
  .tag{
    &-list{
      width: 95%;
      min-height: 40rpx;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      flex-wrap: wrap;
      margin:30rpx 0 20rpx 0;
    }
    &-item{
      margin:0 10rpx;
      color: #4f79da;
    }
  }
  .content-type{
    font-size: 28rpx;
    padding: 10rpx;
    color: #ffffff;
    margin-left: 10rpx;
    background-color: #7a6b9e;
  }
  }
  .footer{
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-right: 30rpx;
  }
</style>

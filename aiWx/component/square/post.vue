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
    }
  },
  data(){
    return{
      // item:{
      //   name:"lingwu99",
      //   time:"2025-1-20 19:00:00",
      //   type:"Ai agent"
      // },
      showComment:false,
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
  background-color: #ECEDF1;
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
      width: 120rpx;
      height: 120rpx;
      border-radius: 60%;
    }
    &-content{
      margin-left: 30rpx;
      margin-top:20rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: flex-start;
      flex:1;
      height:200rpx;
    }
    &-title{
      font-size: 40rpx;
      padding: 0 0 0 60rpx;
    }
  }

  .content{
    padding: 30rpx 20rpx 0 60rpx;
    font-size: 30rpx;
  }
  .footer{
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-right: 30rpx;
  }
}
</style>

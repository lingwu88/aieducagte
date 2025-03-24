<template>
  <view class="content-box">
    <view class="header">
        <view class="header-left">
          <image class="userAvatar" :src="info.userAvatar" />
        </view>
        <view class="header-right">
          <view class="userName">{{ info.userName }}</view>
          <view class="createTime">{{ info.createTime }}</view>
        </view>
    </view>
    <view class="content">
      <view class="content-main">{{ info.content }}</view>
      <view class="tag-list">
        <view class="tag-item" v-for="(item,index) in info.tags">#{{ item }}</view>
      </view>
      <view class="type">{{ typeList[info.type] }}</view>
      <view class="content-footer">
          <image :src="approvedSrc" class="image" @click="handleStar(info.approved,info)"></image>
          <view class="content-number">{{ info.likeCount }}</view>
      </view>
    </view>
    <view class="comment-introduce">
      <view class="description">评论({{ commentList.length }})</view>
      <u-line></u-line>
    </view>
    <view class="commentSection" >
      <view class="comment-list" v-if="commentList.length!=0">
        <view class="comment-item" v-for="(item,index) in commentList" :key="index">
          <view class="comment-header">
            <view class="comment-header-left">
              <image class="avatar" :src="item.userAvatar" />
            </view>
            <view class="comment-header-right">
              <view class="comment-name">{{ item.userName }}</view>
              <view class="comment-time">{{ item.createTime }}</view>
            </view>
          </view>
          <view class="comment-content">{{ item.cotent }}</view>
        </view>
      </view>
    </view>
    <view class="input-area">
      <view class="input">
        <view class="input-box">
          <textarea
            v-model="inputText"
            :adjust-position="false"
            :cursor-spacing="20"
            auto-height
            :show-confirm-bar="false"
            placeholder="请输入内容..."
            :maxlength="-1"
            @focus="handleFocus"
            @blur="handleBlur"
            class="input-textarea"
          />
        </view>

      </view>
      <view 
          class="send-btn"
          :class="{ active: canSend }"
          @tap="handleSend"
          v-if="!isVoiceMode"
        >
          发送
        </view>
    </view>
  </view>
</template>

<script>
export default{
  props:{
    // info:{
    //   type:Object,
    //   required:true
    // }
  },
  data() {
    return {
      info:{
        "title": "如何手写线程池",
        "articleId": "13",
        "content": "我不想干了，可恶的java，添砖jav,fjsdklajfkljdsaklfjkldsajklfjf接口的反对开放时间啊快乐减肥的快乐撒娇开发建设打开了放假啊数据lakes的快乐减肥快链接阿斯利康分时间啊都快链接反抗精神方卡链接放辣椒库a",
        "userName": "这是我啊",
        "userAvatar": this.$request.baseUrl+"/avatars/oFcZA60zZ_q2lTfGTvvt-ySA93tQ_qHlVM5nz8Ry944d94bdfa4e83cce1c30deb8f31616c4.jpg",
        "viewCount": 0,
        "likeCount": 0,
        "commentCount": 0,
        "type": 0,
        "tags": ["java"],
        "createTime": "2025-03-11 23:05:08",
        "approved": false
      },
      commentList:[],
      typeList:['资料分享','日常记录','技术交流']
    }
  },
  methods: {
     //控制（取消）收藏
     handleStar(approved,item){
				// console.log(approved,item);
				// 找到需要修改的文章
				this.$set(this,'info',{
					...this.info,
					approved:!approved
				})
				
				// this.$api.square.star({
				// 	...this.starBody,
				// 	approved:!approved,
				// 	userId:this.userId,
				// 	articleId:item.articleId
				// }).then(res=>{
				// 	console.log(res)
					
					//如果为真，则为点赞
					if(this.info.approved){
						this.$set(this.info,'likeCount',item.likeCount+1)
						uni.showToast({
							title:'点赞成功'
						})
					}
					else{
						this.$set(this.info,'likeCount',item.likeCount-1)
						uni.showToast({
							title:'取消点赞成功'
						})
					}
					console.log(index);
					
				// })
				// .catch(err=>{
				// 	console.log(err);
					
				// })
			},
  },
  onLoad(){
    console.log(this.approvedSrc);
    
  },
  computed:{
    approvedSrc(){
      return  this.$request.baseUrl + this.approve
    },
    approve(){
      return this.info.approved?'/square/star-fill.png':'/square/star.png'
    }
  }
}
</script>

<style scoped lang="scss">
.content-box{
  width: 100vw;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

  .header{
    padding: 20rpx;
    height: 150rpx;
    width: 100vw;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;

    .header-left{
      margin:20rpx 10rpx;

      .userAvatar{
        width:90rpx;
        height: 90rpx;
        border-radius: 10rpx;
      }
    }
    .header-right{
      flex: 1;
    }
  }
  .content{
    box-sizing: border-box;
    width: 100vw;
    padding:20rpx;
    &-main{
      margin:10rpx auto;
      font-size: 36rpx;
      letter-spacing: 3rpx;
      word-break: break-all;
      word-spacing: 1rpx;
    }

    .tag{
      &-list{
        margin:10rpx;
      }
      &-item{
        color: #374eff;
        font-size: 28rpx;
      }
    }

    &-footer{
      margin:10rpx;
      text-align: center;

      .image{
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        border: 1px solid #000000;
        padding: 10rpx;
      }
    }
  }

  .type{
    margin:10rpx;
    padding:10rpx;
    font-size: 32rpx;
    color: #ffffff;
    background-color: #9176da;
    border-radius: 10rpx;
    width: fit-content;
  }
  .comment{
    &-introduce{
      margin:0 10rpx 0 0;
      .description{
        font-size: 26rpx;
        padding-left: 10rpx;
        color: #c9cbdc;
      }
    }
    
  }

  .commentSection{
    flex:1;
  }

  .input-area {
    position: sticky;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: flex-end;
    padding: 20rpx;
    background-color: #fff;
    border-top: 1rpx solid #eee;
    width: 95%;

    .input{
      flex:1;
      display: flex;
      align-items: flex-end;
      background-color: #f5f5f5;
      border-radius: 10rpx;
      margin: 0 20rpx;
    }

    .mode-swtich{
      padding:10rpx;
    }

    .input-box{
      padding:0 20rpx 0 0;
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      flex: 1;


      .input-textarea{
        width: 100%;
        padding:20rpx;
        max-height: 200rpx;
        font-size: 28rpx;
        line-height: 1.5;
        box-sizing: border-box;
      }
    }

    .send-btn{
      width:120rpx;
      height:80rpx;
      line-height: 80rpx;
      text-align: center;
      background-color: #007AFF;
      color: #fff;
      border-radius: 10rpx;
      opacity: 0.5;

      &.active{
        opacity: 1;
      }
    }
  }
}
</style>
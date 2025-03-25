<template>
  <view class="content-box">
    <view class="content-list" v-if="List.length!==0">
      <view class="item" v-for="(item,index) in List" :key="item.articleId" @click="handleToDetail(item)">
        <view class="header">
          <view class="header-left">
            <image class="avatar" :src="item.userAvatar" />
            <view class="name">{{ item.userName }}</view>
          </view>
          <view class="header-right">
            <view class="title">{{ item.title }}</view>
            <view class="createTime">Time:{{ item.createTime }}</view>
          </view>
          <view class="header-more" @click.stop="toggleToast(item.showToast,index)">
            <view >⋮</view>
            <view class="toast" v-if="item.showToast">
              <view class="option" >删除</view>
            </view>
          </view>
        </view>
        <view class="type">{{ typeList[item.type] }}</view>
        <view class="content">
          <view class="essay">{{ item.content }}</view>
          <view class="tagList" v-for="(item,index) in item.tags" :key="item">
            <view class="tagItem">#{{ item }}</view>
          </view>
        </view>
        <view class="footer">
          <view class="footer-item">
            <view class="iconStar" @click.stop="toggleStar(item.collected,item,index)">
              <u-icon :name="item.collected?'star-fill':'star'" size="22"></u-icon>
            </view>
          </view>
          <view class="footer-item">
            <image :src="item.approved?'http://120.26.132.46:8091/square/star-fill.png':'http://120.26.132.46:8091/square/star.png'" class="image" @click.stop="handleApprove(item.approved,item)"></image>
            <text class="footer-number">{{ item.likeCount }}</text>
          </view>
          <view class="footer-item">
            <image :src="'http://120.26.132.46:8091/square/comment.png'" class="image" @click.stop="handleComment(item,index)"></image>
            <text class="footer-number">{{ item.commentCount }}</text>
          </view>
          <!-- <icon img="/static/square/read.png" :number="likeCount"></icon> -->
          <!-- <icon img="/static/square/comment.png" :number="commentCount" @click="handleComment"></icon> -->
        </view>
        <view class="comment-box" v-if="item.showComment">
          <view class="comment-list">
            <view class="comment-item" v-for="(item,index) in commentList" :key="item.author">
              <view class="comment-item-author">{{ item.author }}:</view>
              <view class="comment-item-content">{{ item.content }}</view>
              <view class="comment-item-time">{{ item.createTime }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="warning" v-else>
      暂未发布帖子哦~
    </view>
      
  </view>
</template>

<script>
export default{
  data() {
    return {
      typeList:['','资料分享','日常记录','技术交流'],
      List:[
        // {
        //   "title": "如何手写线程池",
        //   "articleId": "13",
        //   "content": "我不想干了，可恶的java，添砖java",
        //   "userName": "吃完米",
        //   "userAvatar": this.$request.baseUrl+"/avatars/oFcZA60zZ_q2lTfGTvvt-ySA93tQ_qHlVM5nz8Ry944d94bdfa4e83cce1c30deb8f31616c4.jpg",
        //   "viewCount": 0,
        //   "likeCount": 0,
        //   "commentCount": 0,
        //   "type": 0,
        //   "tags": ["java"],
        //   "createTime": "2025-03-11 23:05:08",
        //   "approved": false,
        //   "showComment":false,
        //   "showToast":false
        // },
        // {
        //   "title": "如何手写线程池",
        //   "articleId": "12",
        //   "content": "我不想干了，可恶的java，添砖java",
        //   "userName": "",
        //   "userAvatar": this.$request.baseUrl+"/avatars/oFcZA60zZ_q2lTfGTvvt-ySA93tQ_qHlVM5nz8Ry944d94bdfa4e83cce1c30deb8f31616c4.jpg",
        //   "viewCount": 3,
        //   "likeCount": 0,
        //   "commentCount": 0,
        //   "type": 0,
        //   "tags": ["java"],
        //   "createTime": "2025-03-11 22:27:37",
        //   "approved": false,
        //   "showComment":false,
        //   "showToast":false
        // }
      ],
      commentList:[],
      userId:"",
      approveBody:{
					userId:"",
					articleId:"",
					approved:false
      },
    }
  },
  onLoad(){
    this.userId = uni.getStorageSync('userId')
    this.getPost()
  },
  methods: {
    handleStar(status,item){
				const body = {
							userId:this.userId,
							articleId:item.articleId
				}
				return new Promise((resolve,reject)=>{
					//若真，则取消
					if(status){
						this.$api.square.cancelStar(body)
						.then(res=>{
							resolve(false)
						})
						.catch(err=>{
							reject(err)
						})
					}
					else{
						this.$api.square.starArticle(body)
						.then(res=>{
							resolve(true)
						})
						.catch(err=>{
							reject(err)
						})
					}
				})
			},
			toggleStar(starStatus,item,index){
				console.log('触发star');
				
				//更改当前状态
				this.$set(this.List,index,{
					...item,
					collected:!starStatus
				})

				this.handleStar(starStatus,item)
				.then(res=>{
					if(res){
						uni.showToast({
							title:"成功收藏"
						})
					}
					else{
						uni.showToast({
							title:"取消收藏"
						})
					}
				})
				.catch(err=>{
					console.log(err);
					uni.showToast({
						title:'错误',
						icon:"error"
					})
				})
			},
    getPost(lastId=""){
      return new Promise((resolve,reject)=>{
      	let arr
					this.$api.personal.myArticleList(this.userId)
          .then(res=>{
						console.log(res);
						const newArr = res.data.map(item=>({
							...item,
							approved:item.approved,
							userAvatar:this.$request.baseUrl+item.userAvatar,
							tags:item.tags==="[]"?[]:item.tags.slice(1, -1).split(',')
						}))
						if(lastId === ""){
							arr = newArr
						}
						else{
							arr = [...this.List, ...newArr]
						}
						console.log(arr);
						
						this.$set(this,'List',arr)
						resolve(res.data?.length?res.data.length:0)
					})
					.catch(err=>{
						console.log(err);
						reject(-1)
					})
      })
    },
    //控制（取消）收藏
    handleApprove(approved,item){
				// console.log(approved,item);
				// 找到需要修改的文章
				const index = this.List.findIndex(article=>article.articleId == item.articleId)

				//修改数组中内容
				this.$set(this.List,index,{
					...item,
					approved:!approved
				})
				console.log(this.List[index]);
				
				this.$api.square.approve({
					...this.approveBody,
					approved:!approved,
					userId:this.userId,
					articleId:item.articleId
				}).then(res=>{
					console.log(res)
					
					//如果为真，则为点赞
					if(this.List[index].approved){
						this.$set(this.List[index],'likeCount',item.likeCount+1)
						uni.showToast({
							title:'点赞成功'
						})
					}
					else{
						this.$set(this.List[index],'likeCount',item.likeCount-1)
						uni.showToast({
							title:'取消点赞成功'
						})
					}
					console.log(index);
					
				})
				.catch(err=>{
					console.log(err);
					
				})
			},
      //控制评论显示
      handleComment(item,currentIndex){
        this.$api.square.getComment(item.articleId).then(res=>{
          console.log(res);
					this.$set(this,'commentList',res.data.map(item=>({
            content:item.content,
						author:item.fromName,
						createTime:item.createTime
					})))
          this.$set(this.List,currentIndex,{
            ...item,
            showComment:!item.showComment
          })
				})
				.catch(err=>{
					console.log(err);
					
				})
			},
      handleToDetail(item){
        uni.navigateTo({
          url:"/pages/index/postDetail?articleId="+item.articleId
        })
      },
      toggleToast(status,index){
        console.log(status);
        console.log(this.List[index].showToast);
        
        this.$set(this.List,index,{
          ...this.List[index],
          showToast:!status
        })
        console.log(this.List[index].showToast);
        
      }
  },
}
</script>

<style lang="scss" scoped>
.content-box{
  width: 100vw;
  min-height: 100vh;
  background-color: #f1ebf7;

  .warning{
    text-align: center;
    font-size: 46rpx;
    /* color: #; */
    /* vertical-align: middle; */
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .content-list{
    overflow: scroll;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    .item{
      margin:20rpx 0;
      background-color: #ffffff;
      width: 90%;
      border-radius: 20rpx;

      .header{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        width: 88%;
        height: 150rpx;
        margin-left:40rpx;
        
        &-left{
          width: 20%;
          height: 100%;
          display: flex;
          justify-content: space-evenly;
          flex-direction: column;

          .avatar{
            margin-top: 10rpx;
            width: 60rpx;
            height: 60rpx;
            border-radius: 10rpx;
            background-color: #3704f9;
          }
          .name{
            font-size: 30rpx;
            margin:5rpx 0;
            overflow: hidden;      /* 隐藏溢出内容[1,2,3](@ref) */
            text-overflow: ellipsis; /* 显示省略号[1,2,3](@ref) */
            white-space: nowrap;   /* 禁止换行[1,2,3](@ref) */
          }
        }
        &-right{
          flex: 1;
          height: 100%;
          display: flex;
          justify-content: space-evenly;
          flex-direction: column;
          .title{
            font-size: 36rpx;
            font-weight: 600;
            margin-top:10rpx;
          }
          .createTime{
            position: relative;
            left: 20%;
            font-size: 26rpx;
          }
        }
        &-more{
          font-size: 50rpx;
          position: relative;
          height: 100%;
          .toast{
            position: absolute;
            font-size: 32rpx;
            color: #000000;
            width: 150rpx;
            height: 200rpx;
            -webkit-transform: translate(-100%, -20%);
            transform: translate(-100%, -20%);
            background-color: #f7f6f6;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            border-radius: 10rpx;
            align-items: center;
        }

            .option{
              margin:5rpx auto;
            }
          }
        }
      }

      .type{
        margin:20rpx auto 20rpx 20rpx;
        border-radius: 5rpx;
        background-color:#8b6ff5;
        color: #ffffff;
        height: 40rpx;
        padding:5rpx;
        width: fit-content;
      }

      .content{
        width: 100%;
        .essay{
          width: 95%;
          margin:5rpx auto;
          font-size: 32rpx;
        }
        .tagList{
          width: 95%;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: flex-start;
          align-items: flex-start;
          margin:auto;
          .tagItem{
            font-size: 26rpx;
            color: #2e47ff;
            margin:5rpx;
          }
        }
      }
      
      .footer{
        width: 95%;
        margin:auto;
        height: 60rpx;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        
        &-item{
          margin:0 20rpx;
          .image{
            margin-right: 5rpx;
            width: 40rpx;
            height: 40rpx;
          }
          .iconStar{
            margin-bottom: 10%;
          }
        }
        &-number{
          font-size: 34rpx;
          line-height: 34rpx;
          vertical-align: text-top
        }
      }
    }
  }

.comment-box{
  width:100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20rpx;
  background-color: rgba(#f7f7f7,0.7);
  .comment{
    &-list{
      width: 100%;
      height: auto;
    }


    &-item{
      display:flex;
      flex-direction: row;
      align-items: center;
      font-size: 30rpx;

      &-author{
        margin-right: 10rpx;
        color:#3704f9;
      }
      &-content{
        flex: 1;
        margin:0 10rpx;
      }
      &-time{
        font-size: 20rpx;
      }
    }
  }
}
</style>
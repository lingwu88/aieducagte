<template>
    <view class="box">
      <view v-if="List.length!==0" class="box-content">
        <view class="essay-list" >
          <view v-for="(item,index) in List" :key="item.articleId" class="item">
            <view class="icon" v-if="showControl" :class="{'icon-selected':item.isSelected}" @click.stop="toggleSelect(item.isSelected,index)"></view>
            <view class="essay-item" :class="[{'essay-item-control':showControl}]" @click.stop="handleToDetail(item.articleId)">
              <view class="left">
                <image class="avatar"  :src="item.userAvatar" lazy-load="true" />
                <view class="name">{{ item.userName }}</view>
              </view>
              <view class="main">
                <view class="title">{{ item.title }}</view>
                <view class="content">{{ item.content }}</view>
                <view class="number">
                  <u-icon name="eye" size="22"></u-icon>
                  <text class="number-text">{{ item.viewCount }}</text>
                </view>
              </view>
              <view class="right">
                <u-icon :name="item.collected?'star-fill':'star'" size="30" @tap.stop="toggleStar(item.collected,item,index)"></u-icon>
              </view>
            </view>
          </view>
        </view>
        <view class="footer" @tap="toggleControl" v-if="!showControl">
          批量管理
        </view>
        <view class="footer-another" v-else>
          <view @click.stop="toggleControl">取消管理</view>
          <view @click.stop="toggleAll">全选</view>
          <view @click.stop="delStar">取消收藏</view>   
        </view>
      </view>
      <view v-else>
        暂无数据噢~
      </view>
    </view>
</template>

<script>
import pageTime from '../../mixins/pageTime';
export default{
  mixins:[pageTime],
  data() {
    return {
      showControl:false,
      userId:"",
      resultList:[],
      List:[
        // {
        //   "title": "如何手写线程池",
        //   "articleId": "1899476692292997120",
        //   "content": "我不想干了，可恶的java，添砖java，发送金德拉克激发快乐瞬间打开放辣椒克拉三等奖快放假了刷卡机看来大家方卡链接啊",
        //   "userName": "",
        //   "userAvatar": "/static/my/avatar.png",
        //   "viewCount": 0,
        //   "likeCount": 0,
        //   "commentCount": 0,
        //   "type": 0,
        //   "tags": "java",
        //   "createTime": "2025-03-11 23:05:08",
        //   "approved": false,
        //   "isSelected":false
        // },
        // {
        //   "title": "迭代器模式",
        //   "articleId": "1892458534508040192",
        //   "content": "实现接口完成hasnext方法和next方法",
        //   "userName": "爱吃香菜",
        //   "userAvatar": "/static/my/avatar.png",
        //   "viewCount": 19,
        //   "likeCount": 2,
        //   "commentCount": 0,
        //   "type": 0,
        //   "tags": "",
        //   "createTime": "2025-02-20 14:17:29",
        //   "approved": true,
        //   "isSelected":false
        // },
        // {
        //   "title": "如何手写线程池",
        //   "articleId": "189947669229299hij0",
        //   "content": "我不想干了，可恶的java，添砖java，发送金德拉克激发快乐瞬间打开放辣椒克拉三等奖快放假了刷卡机看来大家方卡链接啊",
        //   "userName": "",
        //   "userAvatar": "/static/my/avatar.png",
        //   "viewCount": 0,
        //   "likeCount": 0,
        //   "commentCount": 0,
        //   "type": 0,
        //   "tags": "java",
        //   "createTime": "2025-03-11 23:05:08",
        //   "approved": false,
        //   "isSelected":false
        // },
        // {
        //   "title": "如何手写线程池",
        //   "articleId": "1899476692292997199",
        //   "content": "我不想干了，可恶的java，添砖java，发送金德拉克激发快乐瞬间打开放辣椒克拉三等奖快放假了刷卡机看来大家方卡链接啊",
        //   "userName": "",
        //   "userAvatar": "/static/my/avatar.png",
        //   "viewCount": 0,
        //   "likeCount": 0,
        //   "commentCount": 0,
        //   "type": 0,
        //   "tags": "java",
        //   "createTime": "2025-03-11 23:05:08",
        //   "approved": false,
        //   "isSelected":false
        // },
        // {
        //   "title": "如何手写线程池",
        //   "articleId": "189947669229299712340",
        //   "content": "我不想干了，可恶的java，添砖java，发送金德拉克激发快乐瞬间打开放辣椒克拉三等奖快放假了刷卡机看来大家方卡链接啊",
        //   "userName": "",
        //   "userAvatar": "/static/my/avatar.png",
        //   "viewCount": 0,
        //   "likeCount": 0,
        //   "commentCount": 0,
        //   "type": 0,
        //   "tags": "java",
        //   "createTime": "2025-03-11 23:05:08",
        //   "approved": false,
        //   "isSelected":false
        // },
        // {
        //   "title": "如何手写线程池",
        //   "articleId": "1899476692292997178",
        //   "content": "我不想干了，可恶的java，添砖java，发送金德拉克激发快乐瞬间打开放辣椒克拉三等奖快放假了刷卡机看来大家方卡链接啊",
        //   "userName": "",
        //   "userAvatar": "/static/my/avatar.png",
        //   "viewCount": 0,
        //   "likeCount": 0,
        //   "commentCount": 0,
        //   "type": 0,
        //   "tags": "java",
        //   "createTime": "2025-03-11 23:05:08",
        //   "approved": false,
        //   "isSelected":false
        // }
      ]
    }
  },
  onLoad(){
    this.usreId = uni.getStorageSync('userId')
    console.log(uni.getStorageSync('userId'));
    this.$set(this,'userId',uni.getStorageSync('userId'))
    console.log(this.userId);
  },
  onShow(){
    this.getCollection()
  },
  methods: {
    mounted(){
			this.checkUserId()
		},
    handleToDetail(articleId){
      uni.navigateTo({
        url:`/pages/index/postDetail?articleId=${articleId}`
      })
    }, 
    handleStar(status,item){
			  let arr = []
        arr.push(item.articleId)
				const body = {
							userId:this.userId,
							articleId:arr
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
      let newArr
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
          //直接删除
          this.List.splice(index,1)
          console.log(newArr);
          
          uni.showToast({
            title:"取消收藏"
          })
          // this.$set(this,'List',newArr)
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
    getCollection(){
      this.$api.square.getStarArticle(this.userId).then(res=>{
        console.log(res);
        const newArr = res.data.map(item=>({
							...item,
							userAvatar:this.$request.baseUrl+item.userAvatar,
							tags:(item.tags==="[]"||item.tags==="")?[]:item.tags.slice(1, -1).split(',')
						}))
        this.$set(this,'List',newArr)
        console.log(this.List);
        
						// if(lastId === ""){
						// 	arr = newArr
						// }
						// else{
						// 	arr = [...this.list, ...newArr]
						// }
						// console.log(arr);
						
						// this.$set(this,'list',arr)
						// console.log(this.list);
						
						// console.log('list:'+this.list);
      })
    },
    toggleAll(){
      // console.log(this.List);
      
      this.List = this.List.map(element => ({
        ...element,
        "isSelected":true
      }));
      // console.log(this.List);
      
    },
    toggleControl(){
      this.showControl = !this.showControl
      //撤销状态更改
      this.List = this.List.map(item=>({
        ...item,
        isSelected:false
      }))
    },
    toggleSelect(status,currentIndex){
      console.log(status);
      
      console.log(currentIndex);
      
      //修改状态
      this.$set(this.List,currentIndex,{
        ...this.List[currentIndex],
        isSelected:!status
      })
    },
    delStar(){
      //找出被选择的
      const newArr = this.List.filter(item=>!item.isSelected)
      this.resultList = this.List.filter(item=>item.isSelected)
      const body = {
            userId:this.userId,
            articleId:this.resultList.map(item=>item.articleId)
      }

      this.$api.square.cancelStar(body)
      .then(res=>{
        uni.showToast({
          title:"取消收藏"
        })
        this.$set(this,"List",newArr)
      })
      .catch(err=>{
        uni.showToast({
          title:"取消收藏失败",
          icon:"error"
        })
        //设置回初始状态
        this.$set(this,'List',this.List.map(item=>({
          ...item,
          isSelected:false
        })))
      })
      .finally(()=>{
        this.resultList = []
      })
    }
  },
}
</script>

<style scoped lang="scss">
.box{
  width: 100vw;
  min-height: 100vh;
  background-color: #ededed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &-content{
    width: 100%;
  }

  .essay-list{
    width: 90vw;
    margin: 20rpx auto;
    height: 95vh;
    overflow: scroll;
    
    .item{
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
    }

    .icon{
      width:50rpx;
      height: 50rpx;
      border-radius: 50%;
      border:1px solid #000000
    }

    .icon-selected{
      border:none;
      background-color: #556ced;
    }
    
    .essay-item-control{
      width: 80% !important;
    }

    .essay-item{
      width:100%;
      margin:20rpx auto;
      height: 250rpx;
      background-color: #ffffff;
      display: flex;
      flex-direction: row;
      border-radius: 10rpx;
      justify-content: flex-start;
      align-items: center;
      
      .left{
        padding-left: 10rpx;
        width: 20%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;

        .avatar{
          width: 90rpx;
          height: 90rpx;
          border-radius: 50%;
        }
        .name{
          height: 90rpx;
          font-size: 26rpx;
          text-align: center;
        }
      }

      .main{
        width: 70%;
        padding-left: 10rpx;  

        .title{
          font-size: 38rpx;
        }
        .content{
          height: 100rpx;
          font-size: 26rpx;
          padding-top: 5%;
          box-sizing: border-box;
          line-height: 35rpx;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
          word-break: break-all;
        }
        .number{
          padding-top: 5rpx;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;

          &-text{
            margin-left: 5rpx;
            font-size: 26rpx;
          }
        }
      }

      .right{
        position: relative;
        top: 30%;
        height: 100%;
      }
    }
  }
  .footer{
    flex:1;
    position: sticky;
    bottom: 0;
    right: 0;
    text-align: center;
    background-color: #ffffff;
    color: #000000;
    padding: 20rpx;
    font-size: 30rpx;
  }
  .footer-another{
    flex:1;
    position: sticky;
    bottom: 0;
    left:0;
    display: flex;
    flex-direction: row;
    align-items: center;
    box-sizing: border-box;
    background: #ffffff;
    padding: 20rpx;
    font-size: 30rpx;
    justify-content: space-around;
  }
}
</style>
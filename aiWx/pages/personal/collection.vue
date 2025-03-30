<template>
    <view class="box">
      <view class="essay-list" v-for="(item,index) in List" :key="item.articleId">
        <view class="icon" v-if="showControl" :class="{'icon-selected':item.isSelected}" @click="toggleSelect(item.isSelected,index)"></view>
        <view class="essay-item" :class="[{'essay-item-control':showControl}]" @click="toggleSelect(item.isSelected,index)">

          <view class="left">
            <image class="avatar" :src="item.userAvatar" lazy-load="true" />
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
            <u-icon name="star" size="22"></u-icon>
          </view>
        </view>
      </view>
      <view class="footer" @tap="toggleControl" v-if="!showControl">
        批量管理
      </view>
      <view class="footer-another" v-else>
        <view @click="toggleControl">取消管理</view>
        <view @click="toggleAll">全选</view>
        <view>取消收藏</view>   
      </view>
        
    </view>
</template>

<script>
export default{
  data() {
    return {
      showControl:true,
      List:[
        {
          "title": "如何手写线程池",
          "articleId": "1899476692292997120",
          "content": "我不想干了，可恶的java，添砖java，发送金德拉克激发快乐瞬间打开放辣椒克拉三等奖快放假了刷卡机看来大家方卡链接啊",
          "userName": "",
          "userAvatar": "/static/my/avatar.png",
          "viewCount": 0,
          "likeCount": 0,
          "commentCount": 0,
          "type": 0,
          "tags": "java",
          "createTime": "2025-03-11 23:05:08",
          "approved": false,
          "isSelected":false
        },
        {
          "title": "迭代器模式",
          "articleId": "1892458534508040192",
          "content": "实现接口完成hasnext方法和next方法",
          "userName": "爱吃香菜",
          "userAvatar": "/static/my/avatar.png",
          "viewCount": 19,
          "likeCount": 2,
          "commentCount": 0,
          "type": 0,
          "tags": "",
          "createTime": "2025-02-20 14:17:29",
          "approved": true,
          "isSelected":false
        },
        {
          "title": "如何手写线程池",
          "articleId": "189947669229299hij0",
          "content": "我不想干了，可恶的java，添砖java，发送金德拉克激发快乐瞬间打开放辣椒克拉三等奖快放假了刷卡机看来大家方卡链接啊",
          "userName": "",
          "userAvatar": "/static/my/avatar.png",
          "viewCount": 0,
          "likeCount": 0,
          "commentCount": 0,
          "type": 0,
          "tags": "java",
          "createTime": "2025-03-11 23:05:08",
          "approved": false,
          "isSelected":false
        },
        {
          "title": "如何手写线程池",
          "articleId": "1899476692292997199",
          "content": "我不想干了，可恶的java，添砖java，发送金德拉克激发快乐瞬间打开放辣椒克拉三等奖快放假了刷卡机看来大家方卡链接啊",
          "userName": "",
          "userAvatar": "/static/my/avatar.png",
          "viewCount": 0,
          "likeCount": 0,
          "commentCount": 0,
          "type": 0,
          "tags": "java",
          "createTime": "2025-03-11 23:05:08",
          "approved": false,
          "isSelected":false
        },
        {
          "title": "如何手写线程池",
          "articleId": "189947669229299712340",
          "content": "我不想干了，可恶的java，添砖java，发送金德拉克激发快乐瞬间打开放辣椒克拉三等奖快放假了刷卡机看来大家方卡链接啊",
          "userName": "",
          "userAvatar": "/static/my/avatar.png",
          "viewCount": 0,
          "likeCount": 0,
          "commentCount": 0,
          "type": 0,
          "tags": "java",
          "createTime": "2025-03-11 23:05:08",
          "approved": false,
          "isSelected":false
        },
        {
          "title": "如何手写线程池",
          "articleId": "1899476692292997178",
          "content": "我不想干了，可恶的java，添砖java，发送金德拉克激发快乐瞬间打开放辣椒克拉三等奖快放假了刷卡机看来大家方卡链接啊",
          "userName": "",
          "userAvatar": "/static/my/avatar.png",
          "viewCount": 0,
          "likeCount": 0,
          "commentCount": 0,
          "type": 0,
          "tags": "java",
          "createTime": "2025-03-11 23:05:08",
          "approved": false,
          "isSelected":false
        }
      ]
    }
  },
  methods: {
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
    }
  },
}
</script>

<style scoped lang="scss">
.box{
  width: 100vw;
  min-height: 100vh;
  background-color: #ededed;

  .essay-list{
    width: 90vw;
    margin:20rpx auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

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
      width:95%;
      margin:20rpx auto;
      height: 250rpx;
      background-color: #ffffff;
      display: flex;
      flex-direction: row;
      border-radius: 10rpx;
      justify-content: flex-start;
      align-items: center;
      
      .left{
        margin-left: 10rpx;
        width: 15%;
        .avatar{
          width: 90rpx;
          height: 90rpx;
        }
        .name{
          height: 90rpx;
        }
      }

      .main{
        width: 70%;
        padding-left: 10rpx;  

        .title{
          font-size: 38rpx;
          margin-bottom: 10rpx;
        }
        .content{
          height:100rpx;
          font-size: 26rpx;
          line-height: 35rpx;
          text-overflow: ellipsis;
          display: -webkit-box;        /* 使用弹性盒子布局 */
          -webkit-box-orient: vertical;/* 垂直排列子元素 */
          -webkit-line-clamp: 3;       /* 限制显示行数 */
          overflow: hidden;            /* 隐藏溢出内容 */
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
      }
    }
  }
  .footer{
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
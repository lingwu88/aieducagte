<template>
  <view class="box">
    <!-- 添加顶部装饰元素 -->
    <view class="decoration-circles">
      <view class="circle circle-1"></view>
      <view class="circle circle-2"></view>
      <view class="circle circle-3"></view>
    </view>
    
    <view class="page-header">
      <text class="page-title">专业模式</text>
      <text class="page-subtitle">定制您的专业学习路径</text>
    </view>
    
    <view class="form-container">
      <u--form
        labelPosition="top"
        :model="form"
        ref="uForm"
        labelWidth="150"
      >
        <!-- <u-form-item
          label="标题"
          prop="title"
          borderBottom
          ref="item1"
          leftIcon="star-fill"
          :leftIconStyle="{
            'color':'#FFEB3B',
            'width':'30rpx',
            'height':'30rpx'
          }"
        >
          <u-textarea v-model="form.title" count maxlength="40" placeholder="请输入您想要的内容主题或关键词,内容越详细准确，生成的内容越好～"></u-textarea>
        </u-form-item>
        <u-form-item
          label="特色 要求"
          prop="feature"
          borderBottom
          ref="item1"
          leftIcon="star-fill"
          :leftIconStyle="{
            'color':'#FFEB3B',
            'width':'30rpx',
            'height':'30rpx'
          }"
        >
          <u-textarea v-model="form.feature" count maxlength="400" height="200" placeholder="这里可以填写框架,也可以填写必要的主题～"></u-textarea>
        </u-form-item> -->
        <u-form-item
          label="内容 关键字"
          borderBottom
          ref="item1"
          leftIcon="star-fill"
          :leftIconStyle="{
            'color':'#FFEB3B',
            'width':'30rpx',
            'height':'30rpx'
          }"
        >
      
        <u-textarea v-model="keyword" count maxlength="100" placeholder="请输入您的要求或关键词～" class="custom-textarea"></u-textarea>
        <view class="action-buttons">
          <view class="btn-left"></view>
          <view class="green-btn" @click="handlePath">
            生成路径
          </view>
          <view class="mode-switch-btn" @click="handleToNormal">
            <image :src="'http://120.26.132.46:8091/classroom/classManagement/professional.png'"></image>
            <text>普通模式</text>
          </view>
        </view>
        </u-form-item>
        <expectedSelect class="select" :list="list" @select="handleSelect"></expectedSelect>
        <u-form-item
          label="学习强度"
          ref="item1"
          leftIcon="star-fill"
          :leftIconStyle="{
            'color':'#FFEB3B',
            'width':'30rpx',
            'height':'30rpx'
          }"
        >
          <u-slider v-model="form.strength" max="4" min="0" step="1" showValue class="custom-slider"></u-slider>
        </u-form-item>
      </u--form>
    </view>
    <view class="btn" @click="handleProduce" v-if="!type">生成</view>
    <view class="save-btn" @click="handleSave" v-else>保存</view>
  </view>
</template>

<script>
import expectedSelect from '../../component/classManagement/expectedSelect.vue';
import mpHtml from '../../components/mp-html/components/mp-html/mp-html'
import pageTime from '../../mixins/pageTime';
export default{
  mixins:[pageTime],
  components:{
    expectedSelect,
    mpHtml
  },
  data() {
    return {
      list:[
      ],
      userId:"",
      form:{
        courses:[],
        strength:0
      },
      type:'',
      keyword:"",
      content:""
    }
  },
  onLoad(options){
    this.userId = uni.getStorageSync('userId')
    if(options.type == 'setting'){
      this.type = true
    }
  },
  mounted(){
    this.checkUserId()
    this.setType(1)
  },
  methods: {
    handleProduce(){
      console.log(this.form);
      if(this.list.length === 0){
        uni.showToast({
          title:'请先生成路径!',
          icon:"error"
        })
        return
      }
      else if(this.form.courses.length === 0){
        uni.showToast({
          title:'请先选择路径',
          icon:'warning'
        })
      }
      uni.setStorageSync('aiSetting',this.form)
      uni.navigateTo({
        url:"/pages/classManagement/searchResultProfession"
      })
    },
    handleToNormal(){
      uni.navigateTo({
        url:"/pages/classManagement/aiChats"
      })
    },
    handleSelect(index){
      console.log(this.form.courses);
      
      if(index == -1){
        uni.showToast({
          title:'出错',
          icon:'none'
        })
      }
      //如果被选中的是true，说明要从数组撤出
      if(this.list[index].isSelect && this.form.courses){
        //过滤后的数组
        this.form.courses = this.form.courses.filter(item=>item.id!=index)
        console.log('过滤后的数组',this.form.courses);
        this.list[index].isSelect = false
        // const deleteIndex = this.list.findIndex(item=>item.isSelect == true)
      }
      else if(this.list[index].isSelect == false){
        this.form.courses.push(this.list[index])
        this.list[index].isSelect = true
      }
    },
    handlePath(){
      this.$api.classManagement.learnPath({
        userId:this.userId,
        inputs:this.keyword
      }).then(res=>{
        console.log(res.data);
        const arr = res.data.map(item=>{
          const data = JSON.parse(item)

          return {
            id:data.aid,
            desc:data.title,
            isSelect:false
          }
        })
        this.$set(this,'list',arr)
        this.currentIndex = 0
      })
      .catch(err=>{
        console.log(err);
        
      })
    },
    handleSave(){
      console.log(this.form);
      
      uni.setStorageSync('aiSetting',this.form)
      uni.navigateBack({
        delta:1
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.box{
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(to bottom, #f8f9fd, #f0f2ff);
  position: relative;
  overflow: hidden;
  padding-bottom: 40rpx;

  // 装饰圆形元素
  .decoration-circles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;

    .circle {
      position: absolute;
      border-radius: 50%;
      opacity: 0.1;

      &-1 {
        top: -100rpx;
        right: -100rpx;
        width: 400rpx;
        height: 400rpx;
        background: linear-gradient(135deg, #5b6af0, #7b89ff);
      }

      &-2 {
        bottom: 20%;
        left: -150rpx;
        width: 300rpx;
        height: 300rpx;
        background: linear-gradient(135deg, #7b89ff, #5b6af0);
      }

      &-3 {
        top: 40%;
        right: 10%;
        width: 200rpx;
        height: 200rpx;
        background: linear-gradient(135deg, #5b6af0, #7b89ff);
      }
    }
  }

  // 页面标题
  .page-header {
    padding: 80rpx 40rpx 30rpx;
    position: relative;
    z-index: 1;
    text-align: center;
    
    .page-title {
      font-size: 46rpx;
      font-weight: 600;
      color: #333;
      display: block;
      margin-bottom: 10rpx;
    }
    
    .page-subtitle {
      font-size: 28rpx;
      color: #666;
      display: block;
    }
  }

  // 表单容器
  .form-container {
    background-color: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border-radius: 30rpx;
    padding: 30rpx;
    margin: 0 30rpx 30rpx;
    box-shadow: 0 10rpx 30rpx rgba(91, 106, 240, 0.1);
    position: relative;
    z-index: 1;
  }

  .form{
    min-height: 80vh;
  }

  // 按钮组样式
  .action-buttons {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20rpx 0;
    width: 100%;
  }

  .btn-left {
    width: 28vw;
    visibility: hidden;
  }

  .mode-switch-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8rpx 16rpx;
    border-radius: 30rpx;
    background: linear-gradient(135deg, #ffffff, #f0f2ff);
    border: 1px solid rgba(91, 106, 240, 0.2);
    box-shadow: 0 4rpx 12rpx rgba(91, 106, 240, 0.1);
    transition: all 0.3s ease;
    
    &:active {
      transform: scale(0.96);
      box-shadow: 0 2rpx 6rpx rgba(91, 106, 240, 0.1);
    }
    
    image {
      width: 24rpx;
      height: 24rpx;
      margin-right: 6rpx;
    }
    
    text {
      font-size: 22rpx;
      color: #5b6af0;
      font-weight: 500;
    }
  }

  .green-btn{
    width: 28vw;
    height: 70rpx;
    color: #ffffff;
    border-radius: 35rpx;
    background: linear-gradient(135deg, #42b983 0%, #57b985 100%);
    text-align: center;
    font-size: 30rpx;
    font-weight: 500;
    line-height: 70rpx;
    margin: 0;
    box-shadow: 0 6rpx 12rpx rgba(87, 185, 133, 0.25);
    transition: all 0.3s ease;
    
    &:active {
      transform: scale(0.96);
      box-shadow: 0 3rpx 6rpx rgba(87, 185, 133, 0.25);
    }
  }

  .btn{
    width: 60vw;
    height: 90rpx;
    color: #ffffff;
    border-radius: 45rpx;
    background: linear-gradient(135deg, #5b6af0 0%, #7b89ff 100%);
    text-align: center;
    font-size: 36rpx;
    font-weight: 500;
    line-height: 90rpx;
    margin: 30rpx auto;
    box-shadow: 0 8rpx 16rpx rgba(91, 106, 240, 0.3);
    transition: all 0.3s ease;
    position: relative;
    z-index: 2;
    
    &:active {
      transform: scale(0.96);
      box-shadow: 0 4rpx 8rpx rgba(91, 106, 240, 0.3);
    }
  }
  .save-btn{
    width: 50vw;
    height: 80rpx;
    color: #ffffff;
    border-radius: 40rpx;
    background: linear-gradient(135deg, #7886FE 0%, #707df4 100%);
    text-align: center;
    font-size: 32rpx;
    font-weight: 500;
    line-height: 80rpx;
    margin: 24rpx auto;
    box-shadow: 0 8rpx 16rpx rgba(251, 192, 74, 0.3);
    transition: all 0.3s ease;
    position: relative;
    z-index: 2;
    
    &:active {
      transform: scale(0.96);
      box-shadow: 0 4rpx 8rpx rgba(251, 192, 74, 0.3);
    }
  }
  .navigate-box{
    position: relative;
    margin: 20rpx auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 30vw;
    height: auto;
    background-color: #ffffff;
    padding: 16rpx 30rpx;
    border-radius: 40rpx;
    box-shadow: 0 4rpx 16rpx rgba(91, 106, 240, 0.15);
    transition: all 0.3s ease;
    z-index: 2;
    
    &:active {
      transform: scale(0.96);
      box-shadow: 0 2rpx 8rpx rgba(91, 106, 240, 0.1);
    }
    
    image{
      width: 36rpx;
      height: 36rpx;
      margin-right: 10rpx;
    }
    
    view {
      font-size: 28rpx;
      color: #333;
      font-weight: 500;
    }
  }
}
</style>
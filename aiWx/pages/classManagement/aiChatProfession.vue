<template>
  <view class="box">
    <view class="form">
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
					prop="keyword"
					borderBottom
					ref="item1"
          leftIcon="star-fill"
          :leftIconStyle="{
            'color':'#FFEB3B',
            'width':'30rpx',
            'height':'30rpx'
          }"
			>
        <u-textarea v-model="form.keyword" count maxlength="100" placeholder="请输入您的要求或关键词～"></u-textarea>
			</u-form-item>
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
        <u-slider v-model="form.length" max="800" min="0" step="10" showValue></u-slider>
			</u-form-item>
      <expectedSelect class="select" :list="list" @select="handleSelect"></expectedSelect>
		</u--form>
    </view>
    <view class="navigate-box" @click="handleToNormal">
      <image src="/static/classroom/classManagement/professional.png"></image>
      <view>普通模式</view>
    </view>
    <view class="btn" @click="handleProduce">生成</view>
  </view>
</template>

<script>
import expectedSelect from '../../component/classManagement/expectedSelect.vue';
export default{
  components:{
    expectedSelect
  },
  data() {
    return {
      list:[
        {
          id:1,
          isSelect:true,
          desc:"是您想要看见的内容吗？"
        },
        {
          id:2,
          isSelect:false,
          desc:"是您想要看见的内容吗？"
        },
        {
          id:3,
          isSelect:false,
          desc:"是您想要看见的内容吗？"
        },
        {
          id:4,
          isSelect:false,
          desc:"是您想要看见的内容吗？"
        },
        {
          id:5,
          isSelect:false,
          desc:"是您想要看见的内容吗？"
        },
        {
          id:6,
          isSelect:false,
          desc:"是您想要看见的内容吗？"
        },
        {
          id:7,
          isSelect:false,
          desc:"是您想要看见的内容吗？"
        },
        {
          id:8,
          isSelect:false,
          desc:"是您想要看见的内容吗？"
        }
      ],
      form:{
        keyword:"",
        length:0
      }
    }
  },
  methods: {
    handleProduce(){
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
      const currentIndex = this.list.findIndex(item=>item.isSelect == true)
      if(index == -1){
        uni.showToast({
          title:'出错',
          icon:'none'
        })
      }
      if(index == currentIndex)
        return
      this.$set(this.list[currentIndex],'isSelect',false)
      this.$set(this.list[index],'isSelect',true)
      //判断之前是否有元素
      //判断是否选择的是当前元素
      //
    }
  },
}
</script>

<style lang="scss" scoped>
.box{
  min-height: 100vh;
  width: 100vw;

  .form{
    min-height: 80vh;

    /deep/.u-textarea.data-v-81cd9d32 {
        border-radius: 4px;
        background-color: #f9f9f9;
        border: none;
        width: 90vw;
        margin: auto;
    }
    .select{
      width: 100vw;
      height: 600rpx;
    }
  }

  .navigate-box{
    position: relative;
    margin:0 0 20rpx 0;
    left: 50%;
    transform: translate(-50%,-20%);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 30vw;
    height: auto;
    image{
      width:30rpx;
      height: 30rpx;
    }
  }

  .btn{
    width: 50vw;
    height: 100rpx;
    color: #ffffff;
    border-radius: 50rpx;
    background-color: #2299ff;
    text-align: center;
    font-size: 44rpx;
    line-height: 100rpx;
    margin: auto;
  }
}
</style>
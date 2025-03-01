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
					borderBottom
					ref="item1"
          leftIcon="star-fill"
          :leftIconStyle="{
            'color':'#FFEB3B',
            'width':'30rpx',
            'height':'30rpx'
          }"
			>
      
      <u-textarea v-model="keyword   " count maxlength="100" placeholder="请输入您的要求或关键词～"></u-textarea>
      <view class="green-btn" @click="handlePath">
        生成路径
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
       <u-slider v-model="form.strength" max="4" min="0" step="1" showValue></u-slider>
     </u-form-item>
		</u--form>
    </view>
    <view class="navigate-box" @click="handleToNormal">
      <image src="/static/classroom/classManagement/professional.png"></image>
      <view>普通模式</view>
    </view>
    <view class="btn" @click="handleProduce" v-if="!type">生成</view>
    <view class="save-btn" @click="handleSave" v-else>保存</view>
  </view>
</template>

<script>
import expectedSelect from '../../component/classManagement/expectedSelect.vue';
import mpHtml from '../../components/mp-html/components/mp-html/mp-html'

export default{
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
  methods: {
    handleProduce(){
      console.log(this.form);
      
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

      // if(index == currentIndex)
      //   return
      // this.$set(this.list[currentIndex],'isSelect',false)
      // this.$set(this.list[index],'isSelect',true)
      //判断之前是否有元素
      //判断是否选择的是当前元素
      //
    },
    handlePath(){
      this.$api.classManagement.learnPath({
        userId:this.userId,
        inputs:this.keyword
      }).then(res=>{
        console.log(res);
        console.log(JSON.parse(res.data).course_name);
        const arr = JSON.parse(res.data).course_name
        this.$set(this,'list',arr.map((item,index)=>({
          id:index,
          desc:item,
          isSelect:false
        })))
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
.green-btn{
    width: 30vw;
    height: 70rpx;
    color: #ffffff;
    border-radius: 50rpx;
    background-color: #57b985;
    text-align: center;
    font-size: 34rpx;
    line-height: 70rpx;
    margin: 10rpx auto;
}
.save-btn{
    width: 50vw;
    height: 100rpx;
    color: #ffffff;
    border-radius: 50rpx;
    background-color: #fbc94a;
    text-align: center;
    font-size: 44rpx;
    line-height: 100rpx;
    margin: auto;
}
</style>
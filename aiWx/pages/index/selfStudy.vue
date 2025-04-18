<template>
	<view>
		<view class="result-box">
			<!-- 背景装饰元素 -->
			<!-- <view class="background-elements">
				<view class="bg-circle circle-1"></view>
				<view class="bg-circle circle-2"></view>
				<view class="bg-circle circle-3"></view>
				<view class="bg-pattern pattern-1"></view>
				<view class="bg-pattern pattern-2"></view>
			</view> -->
			
			<!-- <ChatSession v-show="showNavigator" class="menu-navigator" @changeSession="toggleSession"></ChatSession>
			<view class="control" :class="{'control-selected':showNavigator}">
				<image src="/static/classroom/classManagement/control.png" class="control-icon" @click="toggleShow" ></image>
			</view> -->
			<chat class="connection" 
				:setting="model1" 
				:messageList="list" 
				:userAvatar="img" 
				:show="showNavigator"
				@controlSetting="showSetting = true"
				></chat>  
	</view>
		
	<u-popup 
		:show="showSetting" 
		mode="center" 
		:round="10" 
		:customStyle="{
				width:'650rpx',
				height:'auto',
				overflow: 'hidden'
			}"
		:closeable="true"
		:closeOnClickOverlay="true"
		@close="handleClose"
		>
		<view class="box">
			<view class="header-title">
				<text>新会话设置</text>
			</view>
			<view class="content-setting">
				<!-- 注意，如果需要兼容微信小程序，最好通过setRules方法设置rules规则 -->
				<u--form
						labelPosition="top"
						:model="model1"
						ref="uForm"
						:rules="rules"
				>
					<u-form-item
							label="学习风格"
							labelWidth="auto"
							prop="studyStyle"
							borderBottom
							@click="show.study = true;"
							class="form-item"
					>
						<u--input
								v-model="model1.studyStyle"
								disabled
								disabledColor="#ffffff"
								placeholder="请选择"
								border="none"
						></u--input>
						<u-icon
								slot="right"
								name="arrow-right"
								color="#5b6af0"
						></u-icon>
					</u-form-item>
					<u-form-item
							label="交谈风格"
							labelWidth="auto"
							prop="communicationStyle"
							borderBottom
							@click="show.communication = true;"
							class="form-item"
					>
						<u--input
								v-model="model1.communicationStyle"
								disabled
								disabledColor="#ffffff"
								placeholder="请选择"
								border="none"
						></u--input>
						<u-icon
								slot="right"
								name="arrow-right"
								color="#5b6af0"
						></u-icon>
					</u-form-item>
					<u-form-item
							label="语气风格"
							labelWidth="auto"
							prop="toneStyle"
							borderBottom
							@click="show.tone = true;"
							class="form-item"
					>
						<u--input
								v-model="model1.toneStyle"
								disabled
								disabledColor="#ffffff"
								placeholder="请选择"
								border="none"
						></u--input>
						<u-icon
								slot="right"
								name="arrow-right"
								color="#5b6af0"
						></u-icon>
					</u-form-item>
					<u-form-item
							label="深度"
							labelWidth="auto"
							prop="depth"
							borderBottom
							@click="show.depth = true;"
							class="form-item"
					>
						<u--input
								v-model="model1.depth"
								disabled
								disabledColor="#ffffff"
								placeholder="请选择"
								border="none"
						></u--input>
						<u-icon
								slot="right"
								name="arrow-right"
								color="#5b6af0"
						></u-icon>
					</u-form-item>
					<u-form-item
							labelWidth="auto"
							label="推理框架"
							prop="inferenceFramework"
							borderBottom
							@click="show.frame = true;"
							class="form-item"
					>
						<u--input
								v-model="model1.inferenceFramework"
								disabled
								disabledColor="#ffffff"
								placeholder="请选择"
								border="none"
						></u--input>
						<u-icon
								slot="right"
								name="arrow-right"
								color="#5b6af0"
						></u-icon>
					</u-form-item>


					<u-action-sheet
							:show="show.study"
							:actions="column.study"
							title="请选择"
							@close="show.study = false"
							@select="select($event,'studyStyle')"
							:key="'name'"
							:round="10"
					>
					</u-action-sheet>
					<u-action-sheet
							:show="show.communication"
							:actions="column.communication"
							title="请选择"
							@close="show.communication = false"
							@select="select($event,'communicationStyle')"
							:key="'name'"
							:round="10"
					>
					</u-action-sheet>
					<u-action-sheet
							:show="show.tone"
							:actions="column.tone"
							title="请选择"
							@close="show.tone = false"
							@select="select($event,'toneStyle')"
							:key="'name'"
							:round="10"
					>
					</u-action-sheet>
					<u-action-sheet
							:show="show.depth"
							:actions="column.depth"
							title="请选择"
							@close="show.depth = false"
							@select="select($event,'depth')"
							:key="'name'"
							:round="10"
					>
					</u-action-sheet>
					<u-action-sheet
							:show="show.frame"
							:actions="column.frame"
							title="请选择"
							@close="show.frame = false"
							@select="select($event,'inferenceFramework')"
							:key="'name'"
							:round="10"
					>
					</u-action-sheet>

					<view class="btn" @click="handleSetting">开始对话</view>
				</u--form>
			</view>
		</view>
	</u-popup>
		<!-- <u-picker :show="show.study" :columns="column.study"></u-picker>
		<u-picker :show="show.communication" :columns="column.communication"></u-picker>
		<u-picker :show="show.tone" :columns="column.tone"></u-picker>
		<u-picker :show="show.depth" :columns="column.depth"></u-picker>
		<u-picker :show="show.frame" :columns="column.frame"></u-picker> -->
  </view>
</template>

<script>
import chat from '../../component/selfStudy/chat.vue';
// import chatSession from '../../component/selfStudy/chatSession.vue';
import { regexSSE } from '../../tools/tool'
import { convertMarkdown } from '../../tools/markdownUtils';
import pageTime from '../../mixins/pageTime';
export default{
	mixins:[pageTime],
  components:{
    chat,
		// chatSession
  },
	mounted(){
			this.checkUserId()
		},
  data() {
    return {
      // showNavigator:false,
      list:[],
      img:"",
      result:"",
			showSetting:true,
			model1: {
				studyStyle:"",
				communicationStyle:"",
				toneStyle:"",
				depth:"",
				inferenceFramework:""
			},
			showSex:false,
			userId:"",
			setting:{
				// userId:"",
				// query:"",
				// conversationId:"",  
				studyStyle:'随机', 	 			//学习风格
				communicationStyle:'随机',  	//交谈风格
				toneStyle:'随机', 								//语气风格
				depth:"1/6入门",
				inferenceFramework:"演绎"    		//推理框架
			},
			show:{
				study:false,
				communication:false,
				tone:false,
				depth:false,
				frame:false
			},
			column:{
				study:[{name:'感知型'},{name:"归纳型"},{name:"主动型"},{name:"顺序型"},{name:"直觉型"},{name:"演绎型"},{name:"反思型"},{name:"随机"}],
				communication:[{name:"正式"},{name:"教科书"},{name:"讲故事"},{name:"苏格拉底式"},{name:"幽默"},{name:"随机"}],
				tone:[{name:"辩论"},{name:"鼓励"},{name:"陈述"},{name:"友好"},{name:"随机"}],
				depth:[{name:"1/6 入门"},{name:"2/6 初阶"},{name:"3/6 中阶"},{name:"4/6 高阶"},{name:"5/6 大师"},{name:"6/6 神话"}],
				frame:[{name:"演绎"},{name:"归纳"},{name:"溯因"},{name:"类比"},{name:"因果"}]
			},
			rules:{
				'studyStyle':{
					type:'string',
					required:true,
					message:"请选择"
				},
				'communicationStyle':{
					type:'string',
					required:true,
					message:"请选择"
				},
				'toneStyle':{
					type:'string',
					required:true,
					message:"请选择"
				},
				'depth':{
					type:'string',
					required:true,
					message:"请选择"
				},
				'inferenceFramework':{
					type:'string',
					required:true,
					message:"请选择"
				}
			},
			// sessionId:""
    }
  },
  onLoad(){
    this.getAvatar()
		if(uni.getStorageSync('setting'))
			this.model1 = uni.getStorageSync('setting')
		// this.getSession()
		if(uni.getStorageSync('userId'))
			this.userId = uni.getStorageSync('userId')
  },
  onShow(){
    this.result = ''
		if(uni.getStorageSync('setting'))
			this.model1 = uni.getStorageSync('setting')
    // this.generateAi()
  },
  methods: {
		select(e,type) {
			this.model1[type]=e.name
			
			// this.$refs.uForm.validateField('userInfo.sex')
		},
    getAvatar(){
        this.$api.personal.getUserAvatar(uni.getStorageSync('userId')).then(res=>{
          console.log(res);
					this.img = this.$request.baseUrl+(res.data?res.data:'/avatars/defaultAvatar.jpg')
					console.log(this.img);
					
        })
        .catch(err=>{
          console.log(err);
          
        })
      },
		toggleSession(){
			console.log('应该清空list');
			
			this.$set(this,'list',[])
		},
		toggleShow(){
			this.showNavigator = !this.showNavigator
			console.log(this.showNavigator);
			
		},
		handleSetting(){
			this.$refs.uForm.validate().then(res => {
				this.setting = {...this.setting,...this.model1}
				uni.setStorageSync('setting',this.model1)
				this.showSetting = false	
			}).catch(errors => {
				// uni.$u.toast('校验失败')
				console.log(errors);
				
				uni.showToast({
					title:"请选择完所有选项",
					icon:"none"
				})
			})
		},
		//存储设置
		handleClose(){
			this.showSetting = false
			console.log(this.model1);
			
			uni.setStorageSync('setting',this.model1)
		}
  },            
}
</script>

<style scoped lang="scss">
.result-box{
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  background: linear-gradient(135deg, #f8f9fd 0%, #f0f2ff 100%);
  position: relative;
  overflow: scroll;
  
  .background-elements {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
    pointer-events: none;
    z-index: 0;
    
    .bg-circle {
      position: absolute;
      border-radius: 50%;
      
      &.circle-1 {
        top: -5%;
        right: -10%;
        width: 500rpx;
        height: 500rpx;
        background: linear-gradient(135deg, rgba(91, 106, 240, 0.1), rgba(123, 137, 255, 0.05));
      }
      
      &.circle-2 {
        bottom: -15%;
        left: -10%;
        width: 600rpx;
        height: 600rpx;
        background: linear-gradient(135deg, rgba(123, 137, 255, 0.08), rgba(91, 106, 240, 0.03));
      }
      
      &.circle-3 {
        top: 40%;
        right: 30%;
        width: 300rpx;
        height: 300rpx;
        background: linear-gradient(135deg, rgba(91, 106, 240, 0.05), rgba(123, 137, 255, 0.02));
        opacity: 0.5;
      }
    }
    
    .bg-pattern {
      position: absolute;
      opacity: 0.4;
      
      &.pattern-1 {
        top: 10%;
        left: 5%;
        width: 200rpx;
        height: 200rpx;
        background-image: radial-gradient(rgba(91, 106, 240, 0.15) 2px, transparent 2px);
        background-size: 30rpx 30rpx;
      }
      
      &.pattern-2 {
        bottom: 15%;
        right: 10%;
        width: 250rpx;
        height: 250rpx;
        background-image: radial-gradient(rgba(123, 137, 255, 0.15) 2px, transparent 2px);
        background-size: 25rpx 25rpx;
      }
    }
  }
  
  .header{
    position:sticky;
    top: 0;
    left: 0;
    display: flex;
    width:100vw;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding-top:80rpx;
    padding-left: 40rpx;
    height: 100rpx;
    background-color: #fff;

    .navigation-icon{
      width:20rpx;
      height: 20rpx;
      border-left: 3px solid #000000;
      border-top: 3px solid #000000;
      transform: rotate(-45deg);
    }

    .title{
      text-align: center;
      flex:1;
      font-size:38rpx;
      font-weight: 600;
      color:#000000;
    }

    .collection{
      margin-right: 30vw;
    }

  }

  .play{
    width: 40vw;
  }

  .menu-navigator{
    position: relative;
	min-width: 40vw;
    height: 100vh;
    background-color: #f0f2ff;
    border-radius: 0 50rpx 50rpx 0;
    transition: all 0.3s ease;
	overflow: auto;
    box-shadow: 5rpx 0 15rpx rgba(91, 106, 240, 0.1);
  }
  
  .control{
    top: 50%;
    left: 0;
    position: absolute;
    .control-icon{
      width: 45rpx;
      height: 45rpx;
    }
  }
  .control-selected{
	left:38vw;
  }
}
.connection{
  flex: 1;
  height: 95vh;
  padding: 20rpx 30rpx;
  background-color: rgba(248, 249, 253, 0.7);
  backdrop-filter: blur(10rpx);
  border-radius: 20rpx;
  box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1;
}
.hidden{
  display: none;
}
.box{
  .header-title{
    padding: 30rpx 0;
    text-align: center;
    font-size: 36rpx;
    font-weight: 600;
    background: linear-gradient(to right, #5b6af0, #7b89ff);
    color: #ffffff;
    border-radius: 10rpx 10rpx 0 0;
    margin-bottom: 20rpx;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 150rpx;
      height: 150rpx;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      transform: translate(50%, -50%);
      z-index: 0;
    }
    
    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100rpx;
      height: 100rpx;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      transform: translate(-30%, 30%);
      z-index: 0;
    }
    
    text {
      position: relative;
      z-index: 1;
    }
  }
  .content-setting{
    padding: 0 20rpx 20rpx;
    
    /deep/.u-form-item__body{
      width: 90%;
      margin: 0 auto;
    }
    
    /deep/.u-form-item__body__right__message{
      padding-left: 30rpx;
    }
    
    .form-item {
      margin-bottom: 15rpx;
      background-color: #ffffff;
      border-radius: 12rpx;
      padding: 15rpx;
      box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      
      &:active {
        transform: scale(0.98);
      }
      
      /deep/ .u-form-item__body__left__content {
        color: #333;
        font-weight: 500;
        font-size: 28rpx;
      }
      
      /deep/ .u-input__content__field-wrapper__field {
        color: #666;
      }
    }
    
    .btn{
      text-align: center;
      border-radius: 50rpx;
      background: linear-gradient(to right, #5b6af0, #7b89ff);
      width: 70%;
      padding: 20rpx 0;
      margin: 40rpx auto 20rpx;
      color: #ffffff;
      font-weight: 500;
      font-size: 32rpx;
      box-shadow: 0 5rpx 15rpx rgba(91, 106, 240, 0.3);
      transition: all 0.3s ease;
      
      &:active {
        transform: scale(0.95);
        box-shadow: 0 2rpx 8rpx rgba(91, 106, 240, 0.2);
      }
    }
  }
}
</style>
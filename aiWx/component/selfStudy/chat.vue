<template>
	<view class="chat-container" :class="[{ 'char-container-minHeight': show }]">
		<!-- 聊天内容区域  
			scrolltoupper 上拉加载更多
			scroll-into-view 滚动到指定位置 ——似乎不生效
			scroll-top 竖直滚动条的位置
		-->
    <view class="background-decoration">
      <view class="circle circle-1"></view>
      <view class="circle circle-2"></view>
      <view class="circle circle-3"></view>
    </view>
    
    <!-- 关键修改：设置固定高度，并添加重要的style属性 -->
    <scroll-view 
      class="chat-content"
      scroll-y="true"
      :scroll-with-animation="scrollAnimation"
      :scroll-top="scrollTop" 
      :scroll-into-view="lastMessageId"
      @scrolltoupper="loadMoreHistory"
      show-scrollbar="true"
      enhanced="true"
      bounces="true"
      style="height: calc(100vh - 180rpx); flex: none; overflow-y: scroll; padding-bottom: 20rpx;"
      >
      <!-- 加载更多 -->
      <view class="loading-more" v-if="isLoading">
        <text>加载中...</text>
      </view>
      <!-- 消息列表 -->
      <view class="message-list">
        <view
          v-for="(item, index) in messageList"
          :key="item.id"
          :id="'msg-' + index"
          class="message-item"
          :class="item.type"
        >
          <!-- 头像 -->
          <image 
            :src="item.type === 'user' ? userAvatar : aiAvatar" 
            class="avatar" 
          />
          <!-- 消息内容 -->
          <view class="message-content">
            <!-- 文本消息 -->
            <!-- <mp-html 
            v-if="item.contentType === 'text'" 
            class="text-content" 
            :content="item.content">
            </mp-html> -->
						<mp-html v-if="item.contentType === 'text'" class="text-content" :content="item.content"></mp-html>

						<!-- 图片消息 -->
						<!-- <image 
              v-else-if="item.contentType === 'image'"
              class="image-content"
              :src="item.content"
              mode="widthFix"
              @tap="previewImage(item.content)"
            /> -->
            <!-- 语音消息 -->
            <view 
              v-else-if="item.contentType === 'voice'"
              class="voice-content"
              @tap="playVoice(item.content)"
            >
              <uni-icons :type="isPlaying && currentVoice === item.content ? 'sound-filled' : 'sound'" size="20"></uni-icons>
              <text>{{ item.duration }}″</text>
            </view>
          </view>

        <!-- 消息状态 -->
          <view class="message-status" v-if="item.type === 'user'">
            <text v-if="item.status === 'sending'">发送中...</text>
            <text v-else-if="item.status === 'failed'" class="error">发送失败</text>
          </view>
        </view>

        <!-- AI 输入中状态 -->
        <view class="ai-typing" v-if="isAiTyping">
          <image class="avatar" :src="aiAvatar"/>
          <view class="typing-indicator">
            <view class="dot"></view>
            <view class="dot"></view>
            <view class="dot"></view>
          </view>
        </view>
      </view>
    </scroll-view>


    <view :class="[{'input-area':true,'input-area-flex':!show}]" v-show="!show">
      <view class="mode-swtich" @tap="toggleShow">
        <uni-icons type= 'gear-filled' size="24" color="#5b6af0"></uni-icons>
      </view>
      <view class="input">
        <view class="input-box" v-if="!isVoiceMode">
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
          <!-- <uni-icons type="camera" size="28" @click="handleCamera"></uni-icons> -->
        </view>
        
        <!-- <view 
          v-else
          class="voice-input"
          :class="{ recording: isRecording }"
          @touchstart="startRecording"
          @touchend="stopRecording"
          @touchcancel="cancelRecording"
        >
          {{ isRecording ? '松开发送' : '按住说话' }}
        </view> -->
			</view>
			<view class="send-btn" :class="{ active: canSend }" @tap="handleSend" v-if="!isVoiceMode">发送</view>
		</view>
	</view>
</template>

<script>
import { saveConversation } from '../../pages/learnDashboard/components/saveConversation.vue';
import { regexSSE } from '../../tools/tool';
import { convertMarkdown } from '../../tools/markdownUtils';
//recorderManager 录音管理器 ,用来录音
const recorderManager = uni.getRecorderManager();
//innerAudioContext 音频播放器 ，用来播放音频
const innerAudioContext = uni.createInnerAudioContext();
export default {
  name:"chat",
  props: {
    userAvatar: {
      type: String,
      default: 'http://120.26.132.46:8091/my/user.png'
    },
    aiAvatar: {
      type: String,
      default:'http://120.26.132.46:8091/my/avatar.png'
    },
    show:{
      type:Boolean,
      required:true
    },
    setting:{
      type:Object,
      required:true
    }
  },
  data() {
    return {
      scrollTop: 0,
      sessionId:"",
      lastMessageId: '',
      isLoading: false,
      isPlaying: false,
      currentVoice: '',
      isVoiceMode: false,
      inputText: '',
      isRecording: false,
      page: 1,
      isAiTyping: false,
      requestbody:{},
      content:"",
      messageList:[],
      scrollAnimation: true, // 添加滚动动画控制
      scrollHeight: 0 // 添加滚动高度记录
    }
  },
  async created() {
    // this.initRecorder(),
    // this.initAudioContext()
    console.log('执行获取会话');
    
    let res = await this.getSession()
    if (!res) {
      uni.showToast({
        title: "获取会话id失败",
        icon: "none"
      })
    }
  },
  onShow(){
    this.initRequest()
    // 获取系统信息，计算安全区域
    uni.getSystemInfo({
      success: (res) => {
        // 考虑底部安全区域和导航栏高度
        const safeBottom = res.safeAreaInsets ? res.safeAreaInsets.bottom : 0;
        const navHeight = 50; // 估计的导航栏高度，单位px
        this.scrollHeight = res.windowHeight - navHeight - safeBottom;
        console.log('计算的滚动区域高度:', this.scrollHeight);
      }
    });
  },
  methods: {
    getSession(){
      return new Promise((resolve, reject) => {
        if (this.sessionId != '') {
          resolve(true)
        }
        this.$api.classManagement.getSessionId({ userId: uni.getStorageSync('userId'), type: 1 })
          .then(res => {
            console.log(res);
            this.sessionId = res.data
            resolve(true)
          })
          .catch(err => {
            console.log(err);
            reject(false)
          })
      })
			// if(this.sessionId!=""){
			// 	return
			// }
			// this.$api.classManagement
			// 	.getSessionId({ userId: uni.getStorageSync('userId'), type: 1 })
			// 	.then((res) => {
			// 		console.log(res);
			// 		this.sessionId = res.data;
			// 		console.log(this.sessionId);
			// 	})
			// 	.catch((err) => {
			// 		console.log(err);
			// 	});
		},
    toggleShow(){
      this.$emit('controlSetting')
    },
    initRequest(){
      let body = uni.getStorageSync('aiSetting')
      this.requestbody = {
        ...body,
        userId:uni.getStorageSync('userId'),
        courses:body.courses.map(item=>(
          item.desc
        ))
        
      }
      console.log(this.requestbody);
    },
    initRecorder() {
      recorderManager.onStart(() => {
        console.log('onStart');
        
        this.isRecording = true
      })

      recorderManager.onStop((res) => {
        console.log('onStop', res);
        
        this.isRecording = false
        this.sendVoiceMessage(res.tempFilePath, res.duration)
      })
    },
    initAudioContext() {
      innerAudioContext.onEnded(() => {
        this.isPlaying = false
        this.currentVoice = ''
      })
    },
    cancelRecording() {
      recorderManager.stop()
      this.isRecording = false
    },
    loadMoreHistory() {
      if (this.isLoading) return
      
      this.isLoading = true
      // 模拟加载更多消息
      setTimeout(() => {
        // TODO: 实际加载逻辑
        this.isLoading = false
      }, 1000)
    },
    handleToProfession(){
      uni.navigateTo({
        url:"/pages/classManagement/aiChatProfession"
      })
    },
    handleFocus() {
      this.isVoiceMode = false
    },
    handleBlur() {
      this.isVoiceMode = false
    },
    //发送按钮
    async handleSend() {
      if(!this.canSend) return
      //检查设置是否有空值      
      if(Object.values(this.setting)
        .some(value => 
          value === '' || value === null || value === undefined
        )
      )
      {
        uni.showToast({
          title:"请填写完设置!",
          icon:"error"
        })
        return
      }

      const userMessage = {
        type: 'user',
        contentType: 'text',
        content: this.inputText,
        status: 'sent',
        id:this.messageList.length
      }
      // this.$emit('push',userMessage)
      this.messageList.push(userMessage)
      console.log(this.messageList);
      
      this.scrollToBottom()

      
      // 显示AI输入状态
      try{
        this.isAiTyping = true
        // const response = await this.sendToAI(userMessage.content)
        this.messageList.push({
          type: 'ai',
          contentType: 'text',
          content:"",
          id:this.messageList.length
        })
        this.sendToAI(userMessage.content)
        // userMessage.status = 'sent'
        console.log(this.messageList);
        
      } catch (error) {
        // userMessage.status = 'failed'
        uni.showToast({
          title: '发送失败',
          icon: 'none'
        })
      } finally {
        this.isAiTyping = false
        this.inputText = ''
        this.scrollToBottom()
      }
    },
    handleCamera(){
      uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          console.log('选择的图片:', res.tempFilePaths[0])
        }
      })
    },
    playVoice(filePath) {
      if(this.isPlaying && this.currentVoice === filePath) {
        innerAudioContext.stop()
        this.isPlaying = false
        this.currentVoice = ''
        return
      }
      innerAudioContext.src = filePath
      innerAudioContext.play()
      this.isPlaying = true
      this.currentVoice = filePath
    },
    previewImage(url) {
      uni.previewImage({
        urls: [url]
      })
    },
    switchMode() {
      this.isVoiceMode = !this.isVoiceMode
    },
    // 开始录音
    startRecording() {
      recorderManager.start({
        duration: 60000,
        sampleRate: 16000,
        numberOfChannels: 1,
        encodeBitRate: 96000,
        format: 'mp3'
      })
    },
    stopRecording() {
      recorderManager.stop()
    },

    sendVoiceMessage(tempFilePath, duration) {
      console.log('sendVoiceMessage', tempFilePath, duration)
      this.messageList.push({
        type: 'user',
        contentType: 'voice',
        content: tempFilePath,
        duration: Math.round(duration / 1000)
      })
      this.scrollToBottom()
      
      //发送完语音后
      uni.navigateTo({
        url:"/pages/classManagement/searchResult"
      })
    },
    scrollToBottom() {
      console.log('滚动到底部，消息数量:', this.messageList.length);
      
      this.$nextTick(() => {
        // 延迟执行，确保DOM已更新
        setTimeout(() => {
          // 计算实际滚动高度
          const query = uni.createSelectorQuery().in(this);
          query.select('.message-list').boundingClientRect(data => {
            if (data) {
              console.log('消息列表高度:', data.height);
              // 设置一个足够大的值确保滚动到底部
              this.scrollTop = data.height * 2;
              console.log('设置scrollTop:', this.scrollTop);
              
              // 先禁用动画，再启用，解决某些情况下不滚动的问题
              this.scrollAnimation = false;
              setTimeout(() => {
                this.scrollAnimation = true;
                // 同时设置最后一条消息ID
                this.lastMessageId = 'msg-' + (this.messageList.length - 1);
              }, 50);
            }
          }).exec();
        }, 10);
      });
    },
    sendToAI(content) {
      return new Promise((resolve,reject)=>{
        console.log(this.sessionId);
        
        this.generateAi(this.sessionId)
        .then(res=>{
          resolve('ai连接成功')
        })
        .catch(err=>{
          reject('ai连接失败'+err)
        })
      })
    },
    //使用复习ai
    generateAi(id=""){
      console.log(id);
      
      // let body = uni.getStorageSync('aiSetting')
      return new Promise((resolve,reject)=>{
        let data = {
          ...this.setting,
          userId:uni.getStorageSync('userId'),
          conversationId:id,
          query:this.inputText
        }
        
        //开启sse
        this.$api.classManagement.createSSE(
          `/api/ai/createSse?userId=${data.userId}`,
          this.logData,
          undefined,
          this.closeSSE
        )
        this.$api.selfStudy.reviewAi(data)
        .then(res=>{
          console.log(res);
          resolve('成功连接')
        })
        .catch(err=>{
          reject('连接失败'+err)
        })
      })
    },
    closeSSE(){
      // this.$api.classManagement.endSSE(uni.getStorageSync('userId')).then(res=>{
        // console.log(res);
        console.log('关闭');
        const word = convertMarkdown(this.messageList[this.messageList.length-1].content)
        console.log(this.messageList);
        this.$set(this.messageList,this.messageList.length-1,{
          ...this.messageList[this.messageList.length-1],
          content:word
        })
        this.scrollToBottom()
        console.log(this.messageList);
        
      // })
      // .catch(err=>{
      //   console.log(err);
      // })
    },
    //sse回调函数
    logData(res) {
      // 假设 res 是一个字符串，包含了 SSE 消息
      console.log(res);
       const data = regexSSE(res)
       if(data){
        // this.content +=data
        this.messageList[this.messageList.length-1].content +=data
       }
      // this.result.word += data; // 将提取的数据添加到 result.word
    },
    
  },
  computed: {
    canSend() {
      return this.inputText.trim().length > 0
    }
  }
}
</script>

<style lang="scss" s scoped>
.char-container-minHeight {
	height: 95vh !important;
}
.chat-container {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fd;
  position: relative;
  overflow: scroll;
  
  .background-decoration {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
    
    .circle {
      position: absolute;
      border-radius: 50%;
      opacity: 0.05;
      
      &.circle-1 {
        top: 5%;
        right: -5%;
        width: 300rpx;
        height: 300rpx;
        background: linear-gradient(135deg, #5b6af0, #7b89ff);
      }
      
      &.circle-2 {
        bottom: 20%;
        left: -8%;
        width: 400rpx;
        height: 400rpx;
        background: linear-gradient(135deg, #7b89ff, #5b6af0);
      }
      
      &.circle-3 {
        top: 40%;
        right: 20%;
        width: 200rpx;
        height: 200rpx;
        background: linear-gradient(135deg, #6a79f0, #5b6af0);
      }
    }
  }

  .chat-content {
    /* 移除flex: 1，避免弹性布局影响滚动 */
    position: relative;
    z-index: 1;
    padding: 10rpx 0;
    /* 移除高度设置，由内联样式控制 */
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('data:image/svg+xml;utf8,<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect width="1" height="1" fill="rgba(91, 106, 240, 0.03)"/></svg>');
      background-size: 20rpx 20rpx;
      pointer-events: none;
      opacity: 0.5;
    }

    .loading-more{
      padding: 20rpx;
      text-align: center;
      color: #999;
      font-size: 24rpx;
    }

    .message-list{
      .message-item{
        display: flex;
        // margin-bottom: 30rpx;
        padding: 30rpx 20rpx 20rpx 20rpx;
        position: relative;
        
        &.user{
          flex-direction: row-reverse;
          margin-right: 40rpx;
          
          .avatar {
            margin-right: -45rpx;
          }

          .message-content{
            margin-right: 20rpx;
            margin-left: 60rpx;
            background: linear-gradient(135deg, #5b6af0, #7b89ff);
            color: #fff;
            box-shadow: 0 4rpx 12rpx rgba(91, 106, 240, 0.2);
            
            //用来制作对话框的那个小角
            &::after{
              right: -16rpx;
              border-left-color: #6a79f0;
            }
          }
        }

        &.ai{
          .message-content{
            margin-left: 20rpx;
            margin-right: 60rpx;
            background-color: #fff;
            margin-left: 40rpx;
            box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
            
            &::after{
              left: -16rpx;
              border-right-color: #fff;
            }
          }
        }

        .avatar{
          width: 80rpx;
          height: 80rpx;
          border-radius: 50%;
          box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
          border: 2rpx solid #fff;
        }

        .message-content{
          position: relative;
          padding: 20rpx;
          border-radius: 18rpx;
          max-width: 60%;
          
          &::after{
            content: '';
            position: absolute;
            top: 20rpx;
            border: 8rpx solid transparent;
          }

          .text-content{
            word-break: break-all;
            line-height: 1.6;
            font-size: 28rpx;
          }

          .image-content{ 
            max-width: 100%;
            border-radius: 8rpx;
          }

          .voice-content {
            display: flex;
            align-items: center;
            padding: 10rpx 20rpx;
            
            text {
              margin-left: 10rpx;
              color: #999;
            }
          }
          
        }
      }
    }
    .ai-typing {
      display: flex;
      align-items: flex-start;
      margin-bottom: 30rpx;
      padding: 0 20rpx;
      
      .avatar{
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
        border: 2rpx solid #fff;
      }
      
      .typing-indicator {
        display: flex;
        align-items: center;
        background-color: #fff;
        padding: 20rpx;
        border-radius: 18rpx;
        margin-left: 20rpx;
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
        
        .dot {
          width: 10rpx;
          height: 10rpx;
          border-radius: 50%;
          background: linear-gradient(135deg, #5b6af0, #7b89ff);
          margin: 0 4rpx;
          animation: typing 1s infinite;
          
          &:nth-child(2) {
            animation-delay: 0.2s;
          }
          
          &:nth-child(3) {
            animation-delay: 0.4s;
          }
        }
      }
    }
  }

  .input-area-flex{
    display: flex;
    align-items: flex-end;
  }
  .input-area {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20rpx;
    background-color: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10rpx);
    border-top: 1rpx solid rgba(238, 238, 238, 0.8);
    z-index: 100; /* 增加z-index确保在最上层 */
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

    .input{
      flex: 1;
      display: flex;
      align-items: flex-end;
      background-color: #ffffff;
      border-radius: 40rpx;
      margin: 0 20rpx;
      border: 1rpx solid rgba(91, 106, 240, 0.2);
      box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.03);
      transition: all 0.3s ease;
      
      &:focus-within {
        border-color: rgba(91, 106, 240, 0.5);
        box-shadow: 0 2rpx 15rpx rgba(91, 106, 240, 0.1);
      }
    }

    .mode-swtich{
      padding: 10rpx;
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background-color: rgba(91, 106, 240, 0.1);
      transition: all 0.3s ease;
      
      &:active {
        transform: scale(0.9);
        background-color: rgba(91, 106, 240, 0.2);
      }
    }

    .input-box{
      padding: 0 20rpx 0 0;
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      flex: 1;


      .input-textarea{
        width: 100%;
        padding: 20rpx 30rpx;
        max-height: 200rpx;
        font-size: 28rpx;
        line-height: 1.5;
        box-sizing: border-box;
        border-radius: 40rpx;
      }
    }

    .voice-input{
      flex:1;
      padding:20rpx;
      background-color: #f5f5f5;
      border-radius: 10rpx;
      margin: 0 20rpx;
      text-align: center;

      &.recording{
        background-color: #e6e6e6;
      }
    }

    .send-btn{
      width: 120rpx;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      background: linear-gradient(135deg, #5b6af0, #7b89ff);
      color: #fff;
      border-radius: 40rpx;
      opacity: 0.5;
      box-shadow: 0 4rpx 12rpx rgba(91, 106, 240, 0.2);
      transition: all 0.3s ease;

      &.active{
        opacity: 1;
        
        &:active {
          transform: scale(0.95);
          box-shadow: 0 2rpx 8rpx rgba(91, 106, 240, 0.15);
        }
      }
    }
  }
}
@keyframes typing {
	0%,
	100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-6rpx);
	}
}
</style>

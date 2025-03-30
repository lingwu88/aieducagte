<template>
  <!-- 头部导航栏 -->
  <view class="chat-container">
    <view class="header">
      <view class="navigation-icon" @click="back"></view>
      <view class="title">课程规划与建议</view>
      <view class="voice-play">
        <uni-icons type="sound" size="28"></uni-icons>
      </view>
      <view class="collection">
        <uni-icons :type="swtichStar==false?'star':'star-filled'" size="28" @click="swtichStars"></uni-icons>
      </view>
    </view>

    <view class="content">
      <view class="content-title">搜索:{{ result.title }}</view>
      <view class="second">
        <!-- <view class="base">基于{{ result.base }}篇参考资料</view> -->
        <!-- <view class="select">
          <uni-data-select
            v-model="value"
            :localdata="range"
            @change="change"
          ></uni-data-select>
        </view> -->
      </view>
      <view :class="{'word':true,'word-finish':isFinish}">
        <mp-html class="html-content" :content="result.word"/>
      </view>
    </view>

    <!-- 底部输入框 -->
    <view class="input-area">

      <view class="input">
        <view class="mode-swtich" @tap="switchMode">
          <uni-icons :type="isVoiceMode ? 'chat' : 'mic'" size="24"></uni-icons>
        </view>
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
          <uni-icons type="camera" size="28" @click="handleCamera"></uni-icons>
        </view>
        
        <view 
          v-else
          class="voice-input"
          :class="{ recording: isRecording }"
          @touchstart="startRecording"
          @touchend="stopRecording"
          @touchcancel="cancelRecording"
        >
          {{ isRecording ? '松开发送' : '按住说话' }}
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
import mpHtml from '../../components/mp-html/components/mp-html/mp-html'
import { regexSSE } from '../../tools/tool'
import { convertMarkdown } from '../../tools/markdownUtils'
//recorderManager 录音管理器 ,用来录音
const recorderManager = uni.getRecorderManager()
//innerAudioContext 音频播放器 ，用来播放音频
const innerAudioContext = uni.createInnerAudioContext()
export default {
  props: {
  },
  components:{
    mpHtml
  },
  data() {
    return {
      form:{
        userId:'',
        query:"",
        conversationId:""
      },
      result:{
        base:0,
        title:"",
        word:""
      },
      value: 0,
      range: [
        { value: 0, text: "简洁" },
        { value: 1, text: "标准" },
        { value: 2, text: "深入" },
      ],
      isLoading: false,
      messageList: [],
      isPlaying: false,
      currentVoice: '',
      isVoiceMode: false,
      inputText: '',
      isRecording: false,
      swtichStar:false,
      isFinish:false,
      planId:""
    }
  },
  onLoad(options){
    if(uni.getStorageSync('userId')){
      console.log(uni.getStorageSync('userId'));
      
      this.form.userId = uni.getStorageSync('userId')
    }
    
    if(options){
      console.log(options.query);
      this.generateAi(options.query)
    }
    this.getSessionId()
  },
  mounted() {
			// this.initHighLight()
			// console.log(this.initHighLight);
			// //先处理essay中的换行符
			// this.result.word = this.result.word.replace(/\\n/g, '<br>')
			// // console.log(this.mdEssay);
			
			// const word = marked(this.result.word).replace(/<pre>/g, "<pre class='hljs'>")
			// this.$set(this.result,"word",word)
      // console.log(this.result.word);

		},
  created() {
    this.initRecorder(),
    this.initAudioContext()
  },
  methods: {
      back(){
        uni.navigateBack({
          delta:1
        })
      },
    change(e) {
      console.log("e:", e);
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
    handleFocus() {
      this.isVoiceMode = false
    },
    handleBlur() {
      this.isVoiceMode = false
    },
    generateAi(query=''){
      let text
      if(query!=''){
        text = query
        this.result.title = query
      }
      else{
        text = this.inputText
        this.result.title = text
      }
      console.log(this.form);
      console.log({
        ...this.form,
        query:text
      });
      
      //开启sse
      this.$api.classManagement.createSSE(`/api/ai/createSse?userId=${this.form.userId}`,this.logData,undefined,this.closeSSE)
      this.$api.classManagement.generalAi({
        ...this.form,
        query:text
      }).then(res=>{
        console.log(res);
        this.inputText = ''
      })
      .catch(err=>{
        console.log(err);
        
      })
    },
    //SSE结束回调
    closeSSE(id){
      this.$api.classManagement.endSSE(id).then(res=>{
        console.log('关闭');
        const word = convertMarkdown(this.result.word)
        this.$set(this.result,'word',word)
        this.inputText = ''
        this.isFinish = true
      })
      .catch(err=>{
        console.log(err);
        
      })
    },
    //sse回调函数
    logData(res) {
      console.log(res);
      // console.log("返回数据类型"+typeof res);
      
        // 假设 res 是一个字符串，包含了 SSE 消息
       const data = regexSSE(res)
      //  console.log(data);
       
       if(data){
        this.result.word +=data
        // console.log(this.result.word);
        
       }
            // this.result.word += data; // 将提取的数据添加到 result.word
    },
    async handleSend() {
      if(!this.canSend) return
      this.result.word = ''
      this.isFinish = false
      this.generateAi()
    },
    getSessionId(){
      if(this.form.conversationId!=''){
        return 
      }
      this.$api.classManagement.getSessionId({userId:this.form.userId,type:2}).then(res=>{
        console.log(res);
        this.form.conversationId = res.data
      })
      .catch(err=>{
        console.log(err);
        
      })
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

    //拿到音频暂存文件
    sendVoiceMessage(tempFilePath, duration) {
      console.log('sendVoiceMessage', tempFilePath, duration)
      this.messageList.push({
        type: 'user',
        contentType: 'voice',
        content: tempFilePath,
        duration: Math.round(duration / 1000)
      })
      this.scrollToBottom()
    },
    sendToAI(content) {
        // TODO: 实现实际的AI服务调用
        return new Promise((resolve) => {
        setTimeout(() => {
          resolve('这是AI的回复消息...')
        }, 1000)
      })
    },
    //切换收藏
    async swtichStars(){
      let data 
      try{
        data = await this.toggleStar(this.swtichStar)
      }
      catch(e){
        data = e
      }

      uni.showToast({
        title:data.msg,
        icon:'none'
      })
      console.log(this.swtichStar);
      
      if(data.status){
          this.swtichStar = !this.swtichStar
      }
      console.log(this.swtichStar);
      
    },
    //控制收藏
    async toggleStar(status){
      //若当前为真，则是取消收藏
      return new Promise((resolve,reject)=>{

        if(status){
          this.$api.classManagement.cancelSave({
            userId:this.form.userId,
            planId:this.planId
          })
          .then(res=>{
            console.log(res);
            resolve({status:true,msg:"成功取消收藏"})
            // return  {status:true,msg:"成功取消收藏"}
          })
          .catch(err=>{
            console.log(err);
            reject({status:false,msg:"取消收藏失败"+err.data.info})
            // return {status:false,msg:"取消收藏失败"+err}
          })
        }
        //收藏
        else{
          console.log(this.result.word);
          
          this.$api.classManagement.saveGeneral({
            userId:this.form.userId,
            plan:this.result.word
          })
          .then(res=>{
            console.log(res);
            resolve({status:true,msg:"成功收藏"})
            // return {status:true,msg:"成功收藏"}
          })
          .catch(err=>{
            console.log(err);
            reject({status:false,msg:"收藏失败"+err})
            // return {status:false,msg:"收藏失败"+err}
          })
        }
      })

    }
  },
  computed: {
    canSend() {
      return this.inputText.trim().length > 0
    }
  }
}
</script>

<style lang="scss"s scoped>
.chat-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;

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

  .content{
    min-height: 80vh;
    background-color: #fff;

    .html-content{
      letter-spacing: 2rpx;
      word-break: break-word;
    }

    &-title{
      font-size: 50rpx;
      font-weight: 600;
      padding:30rpx;
    }
    .second{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 90%;
      font-size: 38rpx;
      margin:0 30rpx;

      /deep/.uni-select{
        border:none;
      }

      /deep/ .uni-icons{
          font-size: 20px;
        }
    }

    .word{
      width: 90vw;
      margin:0 auto;
    }
    .word-finish{
      padding: 20rpx;
      background-color: #8282821f;
    }
  }

  .input-area {
    position:sticky;
    bottom:0;
    left: 0;
    display: flex;
    align-items: flex-end;
    padding: 20rpx;
    background-color: #fff;
    border-top: 1rpx solid #eee;

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
      align-items: center;
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
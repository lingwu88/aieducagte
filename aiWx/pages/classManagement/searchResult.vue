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
      <view class="content-title">{{ result.title }}</view>
      <view class="second">
        <view class="base">基于{{ result.base }}篇参考资料</view>
        <view class="select">
          <uni-data-select
            v-model="value"
            :localdata="range"
            @change="change"
          ></uni-data-select>
        </view>
      </view>
      <view class="word">
        <mp-html :content="result.word"/>
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
import { marked } from 'marked'
import hljs from "highlight.js"
import "highlight.js/scss/atom-one-dark.scss"
import mpHtml from '../../components/mp-html/components/mp-html/mp-html'
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
      result:{
        title:"这是搜索标题",
        base:"8",
        word:"\"introduce\":\"1. **计算机科学导论**：这是入门课程，介绍计算机科学的基本概念和原理，包括编程基础、计算机系统组成和基本算法。目标是为学生建立对计算机科学领域的整体理解，为后续更深入的学习打下坚实的基础。\\n\\n2. **数据结构与算法**：基于导论中获得的编程和逻辑思维能力，本课程深入探讨各种数据结构（如数组、链表、树等）和经典算法（排序、搜索等）。学习目标是掌握高效的数据管理和问题解决技巧，这些技能在操作系统、网络和数据库等后续课程中至关重要。\\n\\n3. **操作系统原理**：在此阶段，学生将学习操作系统如何管理硬件资源和提供服务给应用程序。课程内容涵盖进程管理、内存管理、文件系统等。此课程直接依赖于之前所学的数据结构知识，并为理解和设计复杂的软件系统奠定基础。\\n\\n4. **计算机网络基础**：该课程讲解计算机网络的工作原理，从物理层到应用层的各层协议，以及网络安全基础。它结合了操作系统中关于通信机制的知识，并为分布式系统和互联网应用开发提供了必要背景。\\n\\n5. **数据库系统设计**：专注于关系型数据库的设计、实现和优化，包括SQL语言、事务处理、并发控制等内容。这门课利用了之前学到的数据结构和算法知识，同时也涉及到操作系统的存储管理和网络中的数据传输。\\n\\n6. **人工智能与机器学习**：作为高级课程，它探索智能系统的设计与实现，重点在于机器学习算法及其应用。此课程整合了前面所有课程的知识——编程、数据处理、计算资源管理、网络通信和大规模数据存储，使学生能够构建复杂的人工智能解决方案。\""
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
      swtichStar:false
    }
  },
  mounted() {
			this.initHighLight()
			console.log(this.initHighLight);
			//先处理essay中的换行符
			this.result.word = this.result.word.replace(/\\n/g, '<br>')
			// console.log(this.mdEssay);
			
			const word = marked(this.result.word).replace(/<pre>/g, "<pre class='hljs'>")
			this.$set(this.result,"word",word)
      console.log(this.result.word);

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
    	//初始化highlight和转换md
			initHighLight(){
				hljs.configure({
        	useBR: true,
        	tabReplace: " ",
      	});
				marked.setOptions({
					renderer: new marked.Renderer(),
					gfm: true,
					tables: true,
					breaks: true,
					pedantic: false,
					highlight: function (code, lang) {
						if (lang && hljs.getLanguage(lang)) {
							return hljs.highlightAuto(code, { language: lang }).value;
						} else {
							return hljs.highlightAuto(code).value;
						}
					},
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
    async handleSend() {
      if(!this.canSend) return

      const userMessage = {
        type: 'user',
        contentType: 'text',
        content: this.inputText,
        status: 'sending'
      }
      this.messageList.push(userMessage)
      this.inputText = ''
      
      // 显示AI输入状态
      try{
        this.isAiTyping = true
        const response = await this.sendToAI(userMessage.content)
        userMessage.status = 'sent'
        this.messageList.push({
          type: 'ai',
          contentType: 'text',
          content: response
        })
      } catch (error) {
        userMessage.status = 'failed'
        uni.showToast({
          title: '发送失败',
          icon: 'none'
        })
      } finally {
        this.isAiTyping = false
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
    swtichStars(){
      if(this.swtichStar == false){
        this.$set(this,"swtichStar",true)
        console.log("此时是false");
        
      }
      else{ 
        this.$set(this,"swtichStar",false)
      }
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
<template>
  <view class="chat-container">
    <!-- 聊天内容区域  
			scrolltoupper 上拉加载更多
			scroll-into-view 滚动到指定位置 ——似乎不生效
			scroll-top 竖直滚动条的位置
		-->
    <scroll-view class="chat-content" scroll-y scroll-top="scrollTop" :scroll-into-view="lastMessageId"
      @scrolltoupper="loadMoreHistory">
      <!-- 加载更多 -->
      <view class="loading-more" v-if="isLoading">
        <text>加载中...</text>
      </view>

      <view class="content">
        <view class="word">
          <mp-html :content="content" />
        </view>
      </view>
    </scroll-view>
  </view>

</template>

<script>
//recorderManager 录音管理器 ,用来录音
const recorderManager = uni.getRecorderManager()
//innerAudioContext 音频播放器 ，用来播放音频
const innerAudioContext = uni.createInnerAudioContext()
export default {
  name: "aiConnection",
  props: {
    userAvatar: {
      type: String,
      default: 'http://120.26.132.46:8091/my/user.png'
    },
    aiAvatar: {
      type: String,
      default: 'http://120.26.132.46:8091/my/avatar.png'
    },
    messageList: {
      type: Array,
      default: []
    },
    content: {
      type: String,
      default: "",
      required: true
    }
  },
  data() {
    return {
      scrollTop: 0,
      lastMessageId: '',
      isLoading: false,
      isPlaying: false,
      currentVoice: '',
      isVoiceMode: false,
      inputText: '',
      isRecording: false,
      page: 1,
      isAiTyping: false,
      requestbody: {}
    }
  },
  created() {
    this.initRecorder(),
      this.initAudioContext()
  },
  onShow() {
    this.initRequest()
  },
  methods: {
    initRequest() {
      let body = uni.getStorageSync('aiSetting')
      this.requestbody = {
        ...body,
        userId: uni.getStorageSync('userId'),
        courses: body.courses.map(item => (
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
    handleToProfession() {
      uni.navigateTo({
        url: "/pages/classManagement/aiChatProfession"
      })
    },
    handleFocus() {
      this.isVoiceMode = false
    },
    handleBlur() {
      this.isVoiceMode = false
    },
    async handleSend() {
      if (!this.canSend) return

      const userMessage = {
        type: 'user',
        contentType: 'text',
        content: this.inputText,
        status: 'sending'
      }
      this.$emit('push', userMessage)
      // this.messageList.push(userMessage)
      this.scrollToBottom()

      this.inputText = ''

      // 显示AI输入状态
      try {
        this.isAiTyping = true
        const response = await this.sendToAI(userMessage.content)
        userMessage.status = 'sent'
        this.$emit('push', {
          type: 'ai',
          contentType: 'text',
          content: response
        })
        // this.messageList.push()

        //ai应答后跳转
        // uni.navigateTo({
        //   url:"/pages/classManagement/searchResult"
        // })
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
    handleCamera() {
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
      if (this.isPlaying && this.currentVoice === filePath) {
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
      this.$emit('push', {
        type: 'user',
        contentType: 'voice',
        content: tempFilePath,
        duration: Math.round(duration / 1000)
      })
      // this.messageList.push({
      //   type: 'user',
      //   contentType: 'voice',
      //   content: tempFilePath,
      //   duration: Math.round(duration / 1000)
      // })
      this.scrollToBottom()

      //发送完语音后
      uni.navigateTo({
        url: "/pages/classManagement/searchResult"
      })
    },
    scrollToBottom() {
      console.log(this.messageList.length);

      this.$nextTick(() => {
        this.lastMessageId = 'msg-' + (this.messageList.length - 1)
      })
    },
    sendToAI(content) {
      // let body = uni.getStorageSync('aiSetting')
      // let form = {
      //   ...body,
      //   userId:uni.getStorageSync('userId'),
      //   courses:body.courses.map(item=>(
      //     item.desc
      //   ))

      // }
      return new Promise((resolve, reject) => {

        // this.$api.classManagement.learnSchedule(this.form).then(res=>{
        //   console.log(res);
        //   resolve(res)
        // })
        // .catch(err=>{
        //   console.log(err);
        //   reject(err)
        // })
      })
      // TODO: 实现实际的AI服务调用
      //   return new Promise((resolve) => {
      //   setTimeout(() => {
      //     resolve('这是AI的回复消息...')
      //   }, 1000)
      // })
    }

  },
  computed: {
    canSend() {
      return this.inputText.trim().length > 0
    }
  }
}
</script>

<style lang="scss" s scoped>
.chat-container {
  width: inherit;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;

  .chat-content {
    flex: 1;
    padding: 20rpx;

    .loading-more {
      padding: 20rpx;
      text-align: center;
    }

    .message-list {
      .message-item {
        display: flex;
        margin-bottom: 30rpx;

        &.user {
          flex-direction: row-reverse;
          margin-right: 40rpx;


          .message-content {
            margin-right: 20rpx;
            margin-left: 60rpx;
            background-color: #007AFF;
            color: #fff;

            //用来制作对话框的那个小角
            &::after {
              right: -16rpx;
              border-left-color: #007AFF;
            }
          }
        }

        &.ai {
          .message-content {
            margin-left: 20rpx;
            margin-right: 60rpx;
            background-color: #fff;
            margin-left: 40rpx;

            &::after {
              left: -16rpx;
              border-right-color: #fff;
            }
          }
        }

        .avatar {
          width: 80rpx;
          height: 80rpx;
          border-radius: 50%;
        }

        .message-content {
          position: relative;
          padding: 20rpx;
          border-radius: 10rpx;
          max-width: 60%;

          &::after {
            content: '';
            position: absolute;
            top: 20rpx;
            border: 8rpx solid transparent;
          }

          .text-content {
            word-break: break-all;
            line-height: 1.5;
          }

          .image-content {
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

      .avatar {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
      }

      .typing-indicator {
        display: flex;
        align-items: center;
        background-color: #fff;
        padding: 20rpx;
        border-radius: 10rpx;
        margin-left: 20rpx;

        .dot {
          width: 8rpx;
          height: 8rpx;
          border-radius: 50%;
          background-color: #999;
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



  .input-area {
    position: sticky;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: flex-end;
    padding: 20rpx;
    background-color: #fff;
    border-top: 1rpx solid #eee;

    .input {
      flex: 1;
      display: flex;
      align-items: flex-end;
      background-color: #f5f5f5;
      border-radius: 10rpx;
      margin: 0 20rpx;
    }

    .mode-swtich {
      padding: 10rpx;
    }

    .input-box {
      padding: 0 20rpx 0 0;
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      flex: 1;


      .input-textarea {
        width: 100%;
        padding: 20rpx;
        max-height: 200rpx;
        font-size: 28rpx;
        line-height: 1.5;
        box-sizing: border-box;
      }
    }

    .voice-input {
      flex: 1;
      padding: 20rpx;
      background-color: #f5f5f5;
      border-radius: 10rpx;
      margin: 0 20rpx;
      text-align: center;

      &.recording {
        background-color: #e6e6e6;
      }
    }

    .send-btn {
      width: 120rpx;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      background-color: #007AFF;
      color: #fff;
      border-radius: 10rpx;
      opacity: 0.5;

      &.active {
        opacity: 1;
      }
    }
  }

  .navigate-box {
    position: relative;
    margin: 0 0 20rpx 0;
    left: 50%;
    transform: translate(-50%, -20%);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 30vw;
    height: auto;

    image {
      width: 30rpx;
      height: 30rpx;
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
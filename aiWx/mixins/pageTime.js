// mixins/pageTimeTracker.js
export default {
  data() {
    return {
      pageEnterTime: null,
      pageLeaveTime: null,
      isTargetPage: false,
      type: 0
      // userId:""
    }
  },

  methods: {
    // 判断当前是否为需要监控的目标页面（可被组件覆盖）
    // checkIsTargetPage() {
    //   console.log(this.$route?.path);

    //   const pageRoute = this.$route?.path || ''
    //   return [
    //     '/pages/user/profile',
    //     '/pages/product/detail'
    //   ].includes(pageRoute)
    // },
    setType(type) {
      this.type = type
    },
    // 发送数据到服务端（带重试机制）
    async sendTimeDataToServer(payload) {
      try {
        const res = await this.$api.progressFeedBack.saveTime(payload)
        console.log('数据上传成功:', res)
        return true
      } catch (error) {
        // console.error('上传失败，尝试本地存储:', error)
        // this.saveDataToLocal(payload)
        return false
      }
    },

    // 本地存储降级方案
    // saveDataToLocal(data) {
    //   const pendingData = JSON.parse(localStorage.getItem('PENDING_PAGE_DATA') || '[]')
    //   pendingData.push(data)
    //   localStorage.setItem('PENDING_PAGE_DATA', JSON.stringify(pendingData))
    // }
  },

  // 生命周期管理
  beforeMount() {
    // this.isTargetPage = this.checkIsTargetPage()
    // if (this.isTargetPage) {
    this.pageEnterTime = Math.floor(Date.now() / 1000)
    console.log('进入时的时间戳: ' + this.pageEnterTime);

    console.log('页面进入时间:', new Date(this.pageEnterTime))
    // }
  },

  // 处理页面离开逻辑
  beforeDestroy() {
    // if (this.isTargetPage) {
    this.pageLeaveTime = Math.floor(Date.now() / 1000)
    // const duration = this.pageLeaveTime - this.pageEnterTime

    const payload = {
      startTime: this.pageEnterTime,
      endTime: this.pageLeaveTime,
      userId: uni.getStorageSync('userId'),
      type: this.type
      // pagePath: this.$route.path
    }

    // 尝试立即上传
    this.sendTimeDataToServer(payload)

    // 处理本地暂存数据
    // const pendingData = JSON.parse(localStorage.getItem('PENDING_PAGE_DATA') || '[]')
    // if (pendingData.length > 0) {
    //   Promise.all(pendingData.map(data => this.sendTimeDataToServer(data)))
    //     .then(() => localStorage.removeItem('PENDING_PAGE_DATA'))
    // }
    // }
  },

  // 小程序生命周期适配
  // onUnload() {
  //   this.beforeDestroy()
  // }
}
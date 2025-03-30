<template>
	<view class="container">
		<view class="header">
			<textarea
				placeholder="请输入内容"
				v-model="value"
				auto-height
				:show-confirm-bar="false"
				class="textarea-box"
				count
				maxlength=400
			>
			</textarea>
			<text class="text-count" selectable="false">{{ value.length }}/400</text>
			<view class="icon-list">
				<view class="icon-item" v-for="(item,index) in iconList" :key="index" @tap="handleUpload(index)">
					<view class="icon-border">
						<uni-icons :type="item.type" size="20"></uni-icons>
					</view>
					<view class="icon-text">{{ item.desc }}</view>
				</view>
			</view>
		</view>
		<progress
			:progress="progressLength"
			:steps="nodes"
			:currentStep="currentIndex"
			class="progress"
		></progress>
		<view class="menu-container">
			<view class="title">请选择改写风格</view>
			<view class="menu">
				<tag v-for="(item,index) in list" :key="index" :desc="item.desc" :color="item.color" :is-active="index === menuActive" @click="handleMenuClick(index)"></tag>
			</view>
		</view>
		<view class="start-btn" @click="handleConvert">开始生成</view>
	</view>
</template>

<script>
import progress from './components/progress.vue';
import tag from './components/tag.vue'
	export default {
		components:{
			tag,
			progress
		},
		data() {
			return {
				value:"",
				list1:[
					{
						title:"定义文案风格"
					},
					{
						title:"自动生成"
					}
				],
				iconList:[
					{
						type:"link",
						desc:"网页链接"
					},
					{
						type:"font",
						desc:"剪切版文字"
					},
					{
						type:"upload-filled",
						desc:"本地文件"
					},
					{
						type:"weixin",
						desc:"微信文件"
					}
				],
				active:0,
				list:[
					{
						desc:"故事叙述",
						color:"#7884F0"
					},
          {
            desc:"幽默讽刺",
						color:"#64C88C"
          },
          // {
          //   desc:"学术严谨",
					// 	color:"#24aa9d"
          // },
          // {
          //   desc:"新闻播报",
					// 	color:"#4c6dc9"
          // },
          // {
          //   desc:"文艺诗意",
					// 	color:"#d25481"
          // },
          {
            desc:"活泼口语",
						color:"#DA6A9A"
          },
					{
						desc:"正式学术",
						color:"#F1BE1B;"
					}
          // {
          //   desc:"商业风格",
					// 	color:"#6d6d6d"
          // },
					],
					menuActive:-1,
					progressLength:0,
					nodes:[
						{
							label:'初始',
							value:0
						},
						{
							label:'改写风格',
							value:1
						},
						{
							label:'生成内容',
							value:2
						}
					],
					currentIndex:0
				}
		},
		onLoad() {

		},
		mounted() {
		},
		methods: {
			handleMenuClick(index){
				this.menuActive = index
				this.$set(this,'currentIndex',1)
				this.$set(this,'progressLength',50)
				console.log(this.menuActive);
			},
			handleUpload(index){
				if(index === 3){
					// 微信聊天记录文件
					uni.chooseMessageFile({
						count: 1,
						type: 'file',
						extension: this.allowTypes,
						success: (res) => {
							const file = res.tempFiles[0]
							console.log(file);
							// 检查文件大小				
						}
					});
				}
				else if(index === 2){
					uni.chooseImage({
						count: 1,
						sizeType: ['original', 'compressed'],
						sourceType: ['album', 'camera'],
						success: (res) => {
							console.log('选择的图片:', res.tempFilePaths[0])
						}
					})
				}
				else{
					uni.showToast({
						title: '此功能暂未开放',
						icon: 'none'
					})
				}
			},
			handleConvert(){
				console.log(this.value);
				this.$api.learnResource.convert({
					userId:uni.getStorageSync('userId'),
					text:this.value,
					style:this.list[this.menuActive].desc
				}).then(res=>{
					console.log(res);
					uni.navigateTo({
						url: '/pages/learnResource/convertResult?snowId=' + res.data
					})
				})
				.catch(err=>{
					console.log(err);
				})
			}  
		}
	}
</script>

<style lang="scss" scoped>
.container {
  background-color: #f8f9fd;
  min-height: 100vh;
  padding-bottom: 40rpx;
}

.header {
  padding: 30rpx;
  background: linear-gradient(135deg, #eef2ff 0%, #e6ecfd 100%);
  border-radius: 0 0 30rpx 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
  position: relative;
  min-height: 180rpx;
  height: auto;
  max-height: none;
  margin-bottom: 30rpx;
  
  .text-count {
    position: absolute;
    right: 50rpx;
    top: 30rpx;
    font-size: 24rpx;
    color: #8a94a6;
    font-weight: 500;
    z-index: 10;
    background-color: rgba(255, 255, 255, 0.7);
    padding: 6rpx 10rpx;
    border-radius: 10rpx;
  }
  
  .textarea-box {
    width: 90vw;
    border: none;
    border-radius: 20rpx;
    margin: 20rpx auto;
    padding: 30rpx;
    background-color: #fff;
    word-break: break-all;
    word-wrap: break-word;
    font-size: 30rpx;
    color: #333;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    max-height: 300rpx;
    
    &:focus {
      box-shadow: 0 6rpx 24rpx rgba(0, 0, 0, 0.08);
    }
  }

  .icon-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
    margin: 40rpx 0 20rpx 0;
    padding-top: 20rpx;
    border-top: 2rpx solid rgba(0, 0, 0, 0.05);

    .icon-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: transform 0.2s ease;
      
      &:active {
        transform: scale(0.95);
      }
    }
    
    .icon-border {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      background-color: #fff;
      position: relative;
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      
      &:active {
        background-color: #f0f3ff;
      }

      /deep/ .uni-icons {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #5b6af0;
      }
    }
    
    .icon-text {
      font-size: 24rpx;
      margin-top: 14rpx;
      color: #5d6b82;
    }
  }
}

.progress {
  width: 85vw;
  margin: 60rpx auto;
  height: 100rpx;
}

.menu-container {
  margin-top: 20rpx;
  padding: 0 30rpx;

  .title {
    font-size: 36rpx;
    font-weight: 600;
    margin: 0 0 30rpx 10rpx;
    color: #2d3748;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -10rpx;
      left: 0;
      width: 60rpx;
      height: 6rpx;
      background: linear-gradient(90deg, #5b6af0, #8091ff);
      border-radius: 3rpx;
    }
  }

  .menu {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 0 auto;
    gap: 20rpx;
  }
}

.start-btn {
  width: 90vw;
  height: 100rpx;
  border-radius: 50rpx;
  margin: 60rpx auto 40rpx;
  background: linear-gradient(135deg, #5b6af0 0%, #7b89ff 100%);
  color: #fff;
  font-size: 34rpx;
  font-weight: 600;
  text-align: center;
  line-height: 100rpx;
  box-shadow: 0 8rpx 20rpx rgba(91, 106, 240, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:active {
    transform: translateY(2rpx);
    box-shadow: 0 4rpx 10rpx rgba(91, 106, 240, 0.2);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 70%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: 0.5s;
  }
  
  &:active::after {
    left: 100%;
  }
}
</style>

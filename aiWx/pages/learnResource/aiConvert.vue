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
						color:"#fdad3d"
					},
          {
            desc:"幽默讽刺",
						color:"#36a5d8"
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
						color:"#f4e963"
          },
					{
						desc:"正式学术",
						color:"#ce9494;"
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
							label:'选择文案风格',
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
.header{
  padding: 20rpx;
	background-color: #f2f4ff;
	min-height:180rpx;
	max-height: 460rpx;
	/deep/ .u-input{
		background-color: #fff;
		border:none;
		border-radius: 40rpx;
		box-shadow: 2px 4px 9px 0px #dadada;
	}
	.text-count{
		// position: relative;
		position: absolute;
		// margin:0 0 20rpx 0;
		left:85vw;
		font-size: 20rpx;
		color: #000000;
	}
	.textarea-box{
		width: 90vw;
		border:1px solid #000000;
		border-radius: 20rpx;
		margin: 20rpx auto;
		padding: 20rpx;
		background-color: #fff;
		word-break: break-all;
		word-wrap: break-word;
	}

	.icon-list{
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-around;
		align-items: center;
		margin: 60rpx 0 20rpx 0;

		.icon-item{
			display: flex;
			flex-direction: column;
			align-items: center;
		}	
		.icon-border{
			width: 60rpx;
			height: 60rpx;
			border-radius: 50%;
			background-color: #fff;
			position: relative;

			/deep/ .uni-icons{
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%);
			}
		}
		.icon-text{
			font-size: 20rpx;
			margin-top: 10rpx;
		}
	}
}
.progress{
	width: 90vw;
  margin: 60rpx auto;
	height: 100rpx;
}
.menu-container{
  margin-top: 20rpx;
	overflow-y: scroll;

	.title{
		font-size: 38rpx;
		font-weight: bold;
		margin: 0 20rpx 20rpx 20rpx;
	}

	.menu{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		width:80vw;
		margin: 0 auto;

		.menu-item{
			width: 250rpx;
			height: 150rpx;
			background-color: #fff;
			border:1px solid #814f4f;
			border-radius: 20rpx;
			margin: 20rpx;
			font-size: 40rpx;
			text-align: center;
			line-height: 150rpx;

			&-0{
				border-color: #fdad3d;
				color: #fdad3d;
				&::after{
					background-color: #fdad3d;
					color: #fff;
				}
			}
			&-1{
				border-color: #36a5d8;
				color: #36a5d8;
				&::after{
					background-color: #36a5d8;
					color: #fff;
				}
			}
			&-2{
				border-color: #24aa9d;
				color: #24aa9d;
				&::after{
					background-color: #24aa9d;
					color: #fff;
				}
			}
			&-3{
				border-color: #4c6dc9;
				color: #4c6dc9;
				&::after{
					background-color: #4c6dc9;
					color: #fff;
				}
			}
			&-4{
				border-color: #d25481;
				color: #d25481;
				&::after{
					background-color: #d25481;
					color: #fff;
				}
			}
			&-5{
				border-color: #f4e963;
				color: #f4e963;
				&::after{
					background-color: #f4e963;
					color: #fff;
				}
			}
			&-6{
				border-color: #6d6d6d;
				color: #6d6d6d;
				&::after{
					background-color: #6d6d6d;
					color: #fff;
				}
			}
		}

	}
}
.start-btn{
		width:90vw;
		height: 100rpx;
		border-radius: 80rpx;
		margin: 20rpx auto;
		background-color: #2126b7;
		color:#fff;
		font-size: 38rpx;
		font-weight: bold;
		text-align: center;
		line-height: 100rpx;
}
</style>


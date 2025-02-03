<template>
	<view class="container">
		<view class="header">
			<u-input
      placeholder="请输入内容"
      border="surround"
      v-model="value"
      ></u-input>
			<view class="icon-list">
				<view class="icon-item" v-for="(item,index) in iconList" :key="index">
					<view class="icon-border">
						<uni-icons :type="item.type" size="20"></uni-icons>
					</view>
					<view class="icon-text">{{ item.desc }}</view>
				</view>
			</view>
		</view>
		<view class="progress">
			<uni-section title="基本用法" type="line" padding>
				<uni-steps :options="list1" :active="active" />
			</uni-section>
		</view>
		<view class="menu-container">
			<view class="title">请选择改写风格</view>
			<view class="menu">
				<tag v-for="(item,index) in list" :key="index" :desc="item.desc" :color="item.color" :is-active="index === menuActive" @click="handleMenuClick(index)"></tag>
			</view>
		</view>
		<view class="start-btn">开始生成</view>
	</view>
</template>

<script>
import tag from './components/tag.vue'
	export default {
		components:{
			tag
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
				active:-1,
				list:[
					{
						desc:"故事叙述",
						color:"#fdad3d"
					},
          {
            desc:"幽默风趣",
						color:"#36a5d8"
          },
          {
            desc:"学术严谨",
						color:"#24aa9d"
          },
          {
            desc:"新闻播报",
						color:"#4c6dc9"
          },
          {
            desc:"文艺诗意",
						color:"#d25481"
          },
          {
            desc:"轻松口语",
						color:"#f4e963"
          },
          {
            desc:"商业风格",
						color:"#6d6d6d"
          },
					],
					menuActive:-1
				}
		},
		onLoad() {

		},
		methods: {
			handleMenuClick(index){
				this.menuActive = index
				console.log(this.menuActive);
			}
		}
	}
</script>

<style lang="scss" scoped>
.header{
  padding: 20rpx;
	background-color: #f2f4ff;
	height:180rpx;
	/deep/ .u-input{
		background-color: #fff;
		border:none;
		border-radius: 40rpx;
		box-shadow: 2px 4px 9px 0px #dadada;
	}

	.icon-list{
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-around;
		align-items: center;
		margin: 20rpx 0;

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
  margin-top: 20rpx;
}
.menu-container{
  margin-top: 20rpx;

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


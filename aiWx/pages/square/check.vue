<template>
	<view class=" content">
		<view class="header">
			<u-search placeholder="请输入关键词，如名称，打卡内容等" v-model="keyword" :inputStyle="inputStyle"></u-search>
		</view>
		<view class="select">
			<uni-data-select
      v-model="value"
      :localdata="range"
      @change="change"
    ></uni-data-select>
		<uni-data-select
				v-model="value2"
				:localdata="range2"
				@change="change"
				:clear="false"
				emptyTips="暂无数据"
				placeholder="任务选择"
			></uni-data-select>
		</view>
		<u-list width="90vw">
      <u-list-item v-for="(item, index) in list" :key="index">
        <post 
					class="item" 
					:content="item.content" 
					:author="item.author" 
					:sourceType="item.sourceType" 
					:time="item.time"
					@showComment="controlShow"
				></post>
      </u-list-item>
    </u-list>
		<!-- <image class="edit-icon" src="/static/square/edit.png"></image> -->
		<image src='/static/square/edit.png' class="image" @click="handleClick"></image>
		<view :class="showInput?'input-area':'input-hidden'" >

		<view class="input">
			<!-- <view class="mode-swtich">
				<uni-icons type='chat' size="24"></uni-icons>
			</view> -->
			<view class="input-box">
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
import post from '../../component/square/post.vue'
	export default {
		components:{
			post
		},
		data() {
			return {
				value: 1,
				range: [
					{ value: 0, text: "篮球" },
					{ value: 1, text: "足球" },
					{ value: 2, text: "游泳" },
				],
				value2:0,
				range2: [
						{ value: 0, text: "升序" },
						{ value: 1, text: "降序" },
				],
				rule:0,
				bgImg:"/static/square/checkIn2.png",
				inputStyle:{
					width: "500rpx",
				},
				keyword:"",
				list:[
						{
							content:"这是一个自律帖子",
							author:"王源",
							id:1,
							time:"2025-1-20 19:00:00",
							sourceType:"ai Agent"
						},
						{
							content:"小小地水一下，+3",
							author:"棂唔",
							id:2,
							time:"2024-12-20 18:23:00",
							sourceType:"ai Agent"
						},
						{
							content:"公告：孩子们，我又回来了！！！",
							author:"劳大",
							id:3,
							time:"2024-10-1 9:00:00",
							sourceType:"ai Agent"
						},
						{
							content:"自学python第100天打卡，今日内容：分阶段快就离开",
							author:"heby",
							id:4,
							time:"2024-7-21 15:32:00",
							sourceType:"ai Agent"
						},
						{
							content:"这是今天的宵夜！北京烤鸭，超级好吃，超推荐友友们来品尝",
							author:"今天吃没吃",
							id:5,
							time:"2024-5-21 12:48:00",
							sourceType:"ai Agent"
						},
						{
							content:"考研+v12306699903,等你！！",
							user:"考研上岸callMe",
							id:6,
							time:"2024-6-18 10:56:00",
							sourceType:"ai Agent"
						},
					],
					showInput:false
				}
		},
		onLoad() {

		},
		methods: {
			change(e) {
				console.log("e:", e);
				if(e==0){
					this.$set(this,'list',this.list.sort((a, b) => new Date(a.time) - new Date(b.time)))
				}
				else{
					this.$set(this,'list',this.list.sort((a, b) => new Date(b.time) - new Date(a.time)))
				}
			},
			controlShow(){
				this.showInput = !this.showInput
			},
			handleClick(){
				uni.navigateTo({
					url:'/pages/square/edit'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
 .image{
    // position: relative;
    // top:10%;
    width:75rpx;
    height:75rpx;
    border:1px solid #eee;
		border-radius: 20rpx;
		position:absolute;
		bottom:100rpx;
		left: 80%;
		// background-color: #007AFF;
  }
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		background-color: #fffffff5;
		min-height: 100vh;
		width: 100vw;
	

		.header{
			margin-top:20rpx;
		}

		.select{
			width:100vw;
			margin-top:40rpx;
			display: flex;
			flex-direction: row;
			justify-content: space-around;
			align-items: center;

			/deep/.uni-select{
				width: 40vw;
				border-radius: 50rpx;

				.uni-select__input-text {
					color: #000;
					text-align: center;
					font-size: 36rpx;
					font-weight: 500;
				}
			}
		}

		.check-img{
			width: 200rpx;
			height: 200rpx;
			position:absolute;
			right:10rpx;
			bottom: 20rpx;
			background-color: inherit;
		}
	}
	.item{
		min-height: 300rpx;
	}

	.input-area {
		position:sticky;
		bottom: 0;
		left: 0;
		width: 100vw;
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
      align-items: flex-end;
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
	.input-hidden{
		visibility: hidden;
		display: none;
		width: 0;
		height: 0;
	}
</style>
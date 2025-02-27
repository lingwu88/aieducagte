<template>
	<view class="container login-container">
		<view class="bg">
		</view>
		<view class="title">
		 <view class="first">阅读、规划、复习的</view>
		 <view class="second">一站式AI学习平台</view>
		</view>
		<view class="overlay"></view>
		<view class="box">
			<view class="header">
				<image class="logo" src="/static/index.png" lazy-load="false" />
				<view class="teamName">智趣学坊</view>
			</view>
			<!-- <view class="btn">手机号快捷登录</view> -->
			<view class="footer">
				<view class="btn" @click="login">手机号快捷登录</view>
				<view class="check">
					<u-checkbox-group v-model="checked" placement="row">
						<u-checkbox activeColor="#8B6FF0" size="16" name="1"></u-checkbox>
					</u-checkbox-group>
					<view @click="handleCheck">
						<text @click.stop="toDesc">《平台用户协议以及隐私协议》</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				checked:false
				}
		},
		onLoad() {

		},
		methods: {
		async	login(){
				if(this.checked==false){
					uni.showToast({
						title:"请勾选协议",
						icon:'none'
					})
					return
				}
				console.log(this.$api);
				
				const code = await this.$api.personal.wxLogin()
					// console.log(res)
					console.log(code);
				this.$api.personal.userLogin({code}).then(res=>{
					console.log(res);

					//登录成功，设置userId
					if(res?.code === 200){
						uni.setStorageSync('userId',res.data.userId)
						uni.setStorageSync('accessToken',res.data.accessToken)
						uni.setStorageSync('refreshToken',res.data.refreshToken)

						uni.switchTab({
							url:'/pages/index/index'
						})
					}
					else{
						uni.showToast({
							title:'请求错误',
							icon:'none'
						})
					}
				})
				.catch(err=>{
					console.log(err);
					
				})
			},
			handleCheck(){
				if(this.checked == false){
					uni.showToast({
						title:"请勾选协议",
						icon:'none'
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.bg{
	height: 30vh;
	width: 100vw;
}
.header{
	z-index:10;
	position: relative;
	top:-18%;
	transform: translate(0,-50%);
	
	.logo{
		width:600rpx;
		height: 300rpx;
	}
	view{
		font-size: 50rpx;
		text-align: center;
		color: #000000;
	}
}

.login-container{
	display: flex;
	flex-direction: column;
	align-items: c	enter;
	padding: 20rpx;
}
.overlay{
	width: 100%;
	height: 100rpx;
	border-radius: 60rpx 60rpx 0rpx 0rpx;
	margin-top: -50rpx;
	// background-color: rgba(204,241,196, 0.5);
	background-color: rgba(#7C55D4,.22);

	z-index: 8;
}
.box{
	width: 100%;
	box-sizing: border-box;
	border-radius: 60rpx 60rpx 0 0;
	background-color: #A587E7;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding:100rpx 20rpx;
	margin-top: -80rpx;
	z-index: 9;
	height: 50vh;
	flex: 1;

}
.title{
	position:relative;

	top:20vh;
	transform: translate(20%,50%);
	font-size: 38rpx;
	width: 60%;
	z-index: 11;
	.second{
		position: relative;
		left: 40rpx;
	}
}
.btn{
	color:#ffffff;
	// background-color: rgb(204,241,196);
	// background-color: rgb(204,241,196);
	background-color: #6F53D9;
	// background-color: #67bd55;
	// background-color: #43d7b5;
	border-radius: 20rpx;
	width: 60vw;
	height: 100rpx;
	line-height: 100rpx;
	text-align: center;
	font-size: 40rox;
	margin: 40rpx auto;
	z-index: 10;
}
.check{
	display: flex;
	align-items: baseline;
	view{
		margin:20rpx 0 10rpx 0;
		font-size:28rpx;
		color: #999999;
		text{
			color:#F5F3FF;
		}
	}
}
</style>
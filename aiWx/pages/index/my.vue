<template>
	<view class="container main">
    <myHeader></myHeader>
		<list></list>
		<view class="btn">登出</view>
	</view>
</template>

<script>
import myHeader from '../../component/my/myHeader.vue';
import list from '../../component/my/list.vue';
	export default {
		components:{
			myHeader,
			list
		},
		data() {
			return {
				userId:'',
				title: 'Hello'
			}
		},
		onLoad() {
			if(uni.getStorageSync('userId')){
				this.userId = uni.getStorageSync('userId')
			}
		},
		onShow(){
			this.getInfo()
		},
		methods: {
			getInfo(){
				this.$api.personal.getUserInfo(this.userId).then(res=>{
					console.log(res);
				})
				.catch(err=>{
					console.log(err);
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.main{
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
}
.btn{
	position:sticky;
	width: 50vw;
	height: 100rpx;
	border-radius: 60rpx;
	bottom:-10%;
	font-size: 36rpx;
	line-height: 100rpx;
	text-align: center;
	color: #ffffff;
	background-color: #989adc;
}
</style>

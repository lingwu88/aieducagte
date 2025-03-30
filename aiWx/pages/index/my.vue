<template>
	<view class="container main">
    <myHeader class="header" :isLogin="isLogin" :img="img" :name="userName"></myHeader>
		<list @clear="clearStorage"></list>
		<view class="btn" @click="logout" v-if="isLogin">登出</view>
	</view>
</template>

<script>
import myHeader from '../../component/my/myHeader.vue';
import list from '../../component/my/list.vue';
import request from '../../tools/request';
import pageTime from '../../mixins/pageTime';

	export default {
		mixins:[pageTime],
		components:{
			myHeader,
			list
		},
		mounted(){
			this.checkUserId()
		},
		data() {
			return {
				userId:'',
				isLogin:false,
				img:'',
				userName:""
			}
		},
		onLoad() {
			this.img = request.baseUrl+'/avatars/defaultAvatar.jpg'
		},
		onShow(){
			//有id才请求
			if(uni.getStorageSync('userId')){
				this.userId = uni.getStorageSync('userId')
				this.isLogin = true
				this.getInfo()	
				this.getAvatar()
			}
		},
		methods: {
			clearStorage(){
				console.log(uni.getStorageInfoSync().keys);
				const keys = uni.getStorageInfoSync().keys

				//遍历清除缓存
				if(keys.length!==0){
					keys.forEach(element => {
						if(element === 'userId' || element === 'refreshToken' || element === 'accessToken')
							return
						else
							uni.removeStorageSync(element)
					});
					uni.showToast({
						title:"成功清除缓存",
						icon:'none'
					})
				}
				else{
					uni.showToast({
						title:"已无任何可清空缓存",
						icon:"warning"
					})
				}
			},
			getInfo(){
				this.$api.personal.getUserInfo(this.userId).then(res=>{
										// this.$set(this,'img',res.data.avatar)
					this.$set(this,'userName',res.data.userName?res.data.userName:"请填写昵称")
				})
				.catch(err=>{
					console.log(err);
				})
			},
			logout(){
				this.$api.personal.logout({userId:this.userId}).then(res=>{
					console.log(res);
					this.$set(this,'isLogin',false)
					this.$set(this,'img',request.baseUrl+'/avatars/defaultAvatar.jpg')
					uni.removeStorageSync('userId')
					uni.removeStorageSync('accessToken')
					uni.removeStorageSync('refreshToken')
					uni.showToast({
						title:"成功登出"
					})
				})
				.catch(err=>{
					console.log(err);
				})
			},
			getAvatar(){
        this.$api.personal.getUserAvatar(this.userId).then(res=>{
          console.log(res);
					this.img = request.baseUrl+(res.data!=='/avatars/'?res.data:'/avatars/defaultAvatar.jpg')
					console.log(this.img);
					
        })
        .catch(err=>{
          console.log(err);
          
        })
      },
		}
	}
</script>

<style lang="scss" scoped>
.main{
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;

	.header{
		margin-top: 30rpx;
	}
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
	background-color: #bec1e8;

}
</style>

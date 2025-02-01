<template>
	<view class="container content">
		<waterfall class="fall" :gap="15 " :page-size="20" :column="column" :enter-size="column * 4" :request="getData">
		</waterfall>
		<image :src="bgImg" class="check-img" @tap="navigaTo"></image>
	</view>
</template>
<script>
import waterfall from '../../component/square/waterfall.vue'
import list from "../../config/index.js"
	export default {
		components:{ waterfall  },
		data() {
			return {
					fContainerRef:null,
					column:2,
					fContainerObserver:null,
					bgImg:"/static/square/checkIn2.jpg",
					list:[
								{
									title:"我是自律博主",
									content:"这是一个自律帖子",
									user:"王源",
									number:111
								},
								{
									title:"我是自律博主",
									content:"这是一个自律帖子",
									user:"王源",
									number:111
								},
								{
									title:"我是自律博主",
									content:"这是一个自律帖子",
									user:"王源",
									number:111
								},
								{
									title:"我是自律博主",
									content:"这是一个自律帖子",
									user:"王源",
									number:111
								},
								{
									title:"我是自律博主",
									content:"这是一个自律帖子",
									user:"王源",
									number:111
								},
								{
									title:"我是自律博主",
									content:"这是一个自律帖子",
									user:"王源",
									number:111
								},
						]
				}
		},
		methods: {
			changeColumn(width){
				if (width > 960) {
					this.column = 5;
				} else if (width >= 690 && width < 960) {
					this.column = 4;
				} else if (width >= 500 && width < 690) {
					this.column = 3;
				} else {
					this.column = 2;
				}
			},
			getData(page,pageSize){
				return new Promise((resolve)=>{
					setTimeout(()=>{
						resolve(list.slice((page-1)*pageSize,(page-1)*pageSize+pageSize))
					},1000)
				})
			},
			navigaTo(){
				uni.navigateTo({url:"/pages/square/check"})
			}
		},
		mounted() {
			
		},
		onLoad() {
		},
	}
</script>

<style lang="scss" scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width:700rpx;
		height:95vh;
		background-color: #fff1d0a1;
		margin: 2vh 2.5vw 0 2.5vw;
		
		.fall{
			height: 100%;
		}
		.header{
			font-size: 40rpx;
			font-size: "宋体";
		}

		.check-img{
			width: 200rpx;
			height: 200rpx;
			position:absolute;
			right:10rpx;
			bottom: 20rpx;
			background-color: #ffffff;
		}
	}

</style>

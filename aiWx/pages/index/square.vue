<template>
	<view class="container content">
		<!-- <waterfall class="fall">
			<template #item="{item,imageHeight}">
				<card
					:imageHeight="imageHeight"
					:itle="item.title"
					:author="item.author"
					:bgColor="item.bgColor"
				>
				</card>
			</template>
		</waterfall> -->
    <text class="header" selectable="false">广场</text>
		<image :src="bgImg" class="check-img" @tap="navigaTo"></image>
	</view>
</template>

<script>
import waterfall from '../../component/square/waterfall.vue'
import card from '../../component/square/card.vue'
	export default {
		components:{ waterfall , card },
		data() {
			return {
					fContainerRef:null,
					column:6,
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
		onLoad() {
			console.log("你好");
			
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
			// getData(page,pageSize){
			// 	return new Promise((resolve)=>{
			// 		setTimeout(()=>{
			// 			resolve(list.slice((page-1)*pageSize,(page-1)*pageSize+pageSize))
			// 		},1000)
			// 	})
			// }
		},
		Mounted:{
		},
		onLoad() {
		},
		methods: {
			navigaTo(){
				uni.navigateTo({url:"/pages/square/check"})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width:700rpx;
		height:1000rpx;
		border:1px solid red;
		background-color: #fff1d0a1;

		
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

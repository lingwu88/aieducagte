<template>
	<view class="container content">
		<waterfall class="fall">
			<template #item="{item,imageHeight}">
				<card
					:imageHeight="imageHeight"
					:itle="item.title"
					:author="item.author"
					:bgColor="item.bgColor"
				>
				</card>
			</template>
		</waterfall>
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
		
		.fall{
			height: 100%;
		}
		.header{
			font-size: 40rpx;
			font-size: "宋体";
		}

	}

</style>

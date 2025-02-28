<template>
	<view class="container content">
		<text class="header" selectable="false" >学习自足，答疑解惑</text>			
		<iconList class="list" ></iconList>
		<u-search placeholder="请输入关键词进行查找" v-model="keyword"></u-search>
		<u-list 
			width="90vw"
			@scrolltolower="handleLoad"
			#>
      <u-list-item v-for="(item, index) in list" :key="index">
        <essay @click="handleTo(item)" :img="item.img" :title="item.title"></essay>
      </u-list-item>
    </u-list>
		
	</view>
</template>

<script>
import {indexList} from '../../config'
import iconList from '../../component/classroom/iconList.vue';
import essay from '../../component/classroom/essay.vue';
	export default {
		components:{
			iconList,
			essay
		},
		data() {
			return {
				// title: 'Hello',
				page:1,
				pageSize:5,
				inputStyle1:{
					height:"50rpx",
					width:"90vw"
				},	value: 1,
				range: [
					{ value: 0, text: "篮球" },
					{ value: 1, text: "足球" },
					{ value: 2, text: "游泳" },
      ],
				list:[
				],
				// 	{
				// 		title:"2024秋冬季学习宝典|掌握规则,轻松学习",
				// 		img:"/static/classroom/eassyImg1.png",
				// 		url:""
				// 	},
				// 	{
				// 		title:"2024秋冬季学习宝典|掌握规则,轻松学习",
				// 		img:"/static/classroom/eassyImg1.png",
				// 		url:""
				// 	},
				// 	{
				// 		title:"2024秋冬季学习宝典|掌握规则,轻松学习",
				// 		img:"/static/classroom/eassyImg1.png",
				// 		url:""
				// 	},
				// 	{
				// 		title:"2024秋冬季学习宝典|掌握规则,轻松学习",
				// 		img:"/static/classroom/eassyImg1.png",
				// 		url:""
				// 	},					{
				// 		title:"2024秋冬季学习宝典|掌握规则,轻松学习",
				// 		img:"/static/classroom/eassyImg1.png",
				// 		url:""
				// 	},
				// 	{
				// 		title:"2024秋冬季学习宝典|掌握规则,轻松学习",
				// 		img:"/static/classroom/eassyImg1.png",
				// 		url:""
				// 	},
				// 	{
				// 		title:"2024秋冬季学习宝典|掌握规则,轻松学习",
				// 		img:"/static/classroom/eassyImg1.png",
				// 		url:""
				// 	},
				// ],
				keyword:""
			}
		},
		onLoad() {
			this.getInfo(this.page,this.pageSize)
		},
		methods: {
			search(){
				console.log("监听变化，并触发关键词搜索，并返回结果");
			},
			handleClick(){
				
			},
			handleTo(item){
				uni.navigateTo({
						url: `/pages/learnResource/webview?url=${encodeURIComponent(item.url)}`
					});
			},
			getInfo(page,pageSize){
				uni.showLoading({
					title:'加载中'
				})
				this.getInfoData(page,pageSize).then(res=>{
					this.list.push(...res)
					console.log(res);
					
				})
				.catch(err=>{

				})
				.finally(
					uni.hideLoading()
				)
			},
			//模拟数据接口
			getInfoData(page,pageSize){
				return new Promise((resolve,reject)=>{
					setTimeout(()=>{
						resolve(indexList.slice((page-1)*pageSize,(page-1)*pageSize+pageSize))
					})
				})
			},
			handleLoad(){
				this.page = this.page+1
				//如果没有更多数据
				if((this.page-1)>=indexList.length){
					uni.showToast({
						title:"已经没有更多数据了",
						icon:'none'
					})
					return
				}
				this.getInfo(this.page,this.pageSize)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;

		.header{
			margin:30rpx 0;
			font-size: 50rpx;
			font-weight: 700;
			width: 100%;
			text-align: center;
		}

		.list{
			width: 90vw;
			margin:30rpx 0;
		}

		/deep/.u-search{
				flex: 0;
				width: 90%;
			}

		// .article-list{
		// 	width: 90vw;
		// 	height: 120rpx;
		// 	margin:30rpx 0 0 40rpx;
		// }
		/deep/.u-list-item{
			margin:30rpx 0 20rpx 0;
		}
	}
</style>

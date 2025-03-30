<template>
	<view class="container content">
		<view class="header-section">
			<text class="header" selectable="false" >学习自足，答疑解惑</text>			
		</view>
		<iconList class="list" ></iconList>
		<u-search 
			placeholder="请输入关键词进行查找" 
			v-model="keyword"
			@search="handleSearch"
			@custom="handleSearch"
			:show-action="true"
			action-text="搜索"
			:animation="true"
			shape="round"
			:clearabled="true"
			:input-style="searchStyle"
			:custom-style="searchCustomStyle"
		></u-search>
		<u-list 
			width="90vw"
			@scrolltolower="handleLoad"
			>
			<view v-if="renderList.length!=0">
				<u-list-item v-for="(item, index) in renderList" :key="item.title">
					<essay @click="handleTo($event,item)" :img="item.img" :title="item.title"></essay>
				</u-list-item>
			</view>
			<view v-else>
				<view>
					暂无资源~
				</view>
					
			</view>
				
    </u-list>
		
	</view>
</template>

<script>
import {indexList} from '../../config'
import iconList from '../../component/classroom/iconList.vue';
import essay from '../../component/classroom/essay.vue';
import pageTime from '../../mixins/pageTime';
	export default {
		mixins:[pageTime],
		components:{
			iconList,
			essay
		},
		mounted(){
    	this.checkUserId()
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
				renderList:[],
				keyword:"",
				searchStyle:{
					height:"50rpx",
					width:"90vw"
				},
				searchCustomStyle:{
					backgroundColor:"#fff",
					borderRadius:"40rpx",
					boxShadow:"0 4rpx 12rpx rgba(0, 0, 0, 0.05)"
				}
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
			handleTo(e,item){
				console.log(item.urk);
				
				uni.navigateTo({
						url: `/pages/learnResource/webview?url=${item.url}`
					});
			},
			getInfo(page,pageSize){
				uni.showLoading({
					title:'加载中'
				})
				this.getInfoData(page,pageSize).then(res=>{
					this.renderList.push(...res)
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
			},
			handleSearch(){
				const arr = this.list.filter(item=>item.title.includes(this.keyword))
				console.log(arr);
				this.$set(this,'renderList',arr)
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
		background-color: #f8f9fd;
		min-height: 100vh;

		.header-section{
			width: 100%;
			text-align: center;
			margin: 40rpx 0 30rpx;
			position: relative;
		}
		
		.header{
			font-size: 50rpx;
			font-weight: 700;
			background: linear-gradient(90deg, #5b6af0, #7b89ff);
			-webkit-background-clip: text;
			color: transparent;
		}

		.list{
			width: 90vw;
			margin: 40rpx 0;
			padding: 20rpx;
			background: rgba(255, 255, 255, 0.7);
			border-radius: 20rpx;
			box-shadow: 0 10rpx 30rpx rgba(91, 106, 240, 0.08);
		}

		/deep/.u-search{
			flex: 0;
			width: 90%;
			margin-bottom: 20rpx;
			
			.u-search__content {
				background: rgba(255, 255, 255, 0.9) !important;
				border-radius: 40rpx !important;
				box-shadow: 0 8rpx 20rpx rgba(91, 106, 240, 0.1) !important;
				padding: 0 10rpx !important;
				height: 80rpx !important;
				border: 1px solid rgba(91, 106, 240, 0.1) !important;
			}
			
			.u-search__action {
				color: #5b6af0 !important;
				font-weight: 500 !important;
				font-size: 30rpx !important;
			}
			
			.u-search__field {
				height: 80rpx !important;
			}
			
			.u-search__input {
				font-size: 28rpx !important;
				color: #333 !important;
			}
			
			.u-search__icon {
				color: #5b6af0 !important;
				margin: 0 10rpx !important;
			}
			
			.u-search__placeholder {
				color: #999 !important;
			}
		}

		/deep/.u-list-item{
			margin: 30rpx 0 20rpx 0;
			
			.u-list-item__wrapper {
				background: white;
				border-radius: 16rpx;
				box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
				overflow: hidden;
				transition: transform 0.2s ease;
				
				&:active {
					transform: scale(0.98);
				}
			}
		}
	}
</style>

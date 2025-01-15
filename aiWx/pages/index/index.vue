<template>
	<view class="container content">
		<text class="header" selectable="false" >学习自足，答疑解惑</text>			
		<iconList class="list"></iconList>
		<u-search placeholder="请输入关键词进行查找" v-model="keyword"></u-search>
		<u-list width="90vw">
      <u-list-item v-for="(item, index) in list" :key="index">
        <essay></essay>
      </u-list-item>
    </u-list>
		
	</view>
</template>

<script>
import iconList from '../../component/classroom/iconList.vue';
import essay from '../../component/classroom/essay.vue';
	export default {
		components:{
			iconList,
			essay
		},
		data() {
			return {
				title: 'Hello',
				inputStyle1:{
					height:"50rpx",
					width:"90vw"
				},
				list:[
					{
						title:"2024秋冬季学习宝典|掌握规则,轻松学习",
						img:"/static/classroom/eassyImg1.png"
					},
					{
						title:"2024秋冬季学习宝典|掌握规则,轻松学习",
						img:"/static/classroom/eassyImg1.png"
					},
					{
						title:"2024秋冬季学习宝典|掌握规则,轻松学习",
						img:"/static/classroom/eassyImg1.png"
					},
					{
						title:"2024秋冬季学习宝典|掌握规则,轻松学习",
						img:"/static/classroom/eassyImg1.png"
					},					{
						title:"2024秋冬季学习宝典|掌握规则,轻松学习",
						img:"/static/classroom/eassyImg1.png"
					},
					{
						title:"2024秋冬季学习宝典|掌握规则,轻松学习",
						img:"/static/classroom/eassyImg1.png"
					},
					{
						title:"2024秋冬季学习宝典|掌握规则,轻松学习",
						img:"/static/classroom/eassyImg1.png"
					},
				],
				keyword:""
			}
		},
		onLoad() {

		},
		methods: {
			search(){
				console.log("监听变化，并触发关键词搜索，并返回结果");
				
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

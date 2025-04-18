<template>
	<view class=" content">
		<view class="header">
			<u-search placeholder="请输入关键词，如名称，打卡内容等" v-model="keyword" :inputStyle="inputStyle" @search="handleSearch"
				@custom="handleSearch"></u-search>
		</view>
		<view class="select">
			<uni-data-select v-model="value" :localdata="range" @change="change($event, 'type')"></uni-data-select>
			<uni-data-select v-model="value2" :localdata="range2" @change="change($event, 'orderMode')" :clear="false"
				emptyTips="暂无数据" placeholder="任务选择"></uni-data-select>
		</view>
		<view class="list-content" v-if="list.length !== 0">
			<u-list width="90vw" @scrolltolower="loadData">
				<u-list-item v-for="(item, index) in list" :key="item.articleId">
					<post class="item" :likeCount="item.likeCount" :commentCount="item.commentCount" :content="item.content"
						:author="item.userName" :sourceType="item.sourceType" :time="item.createTime" :title="item.title"
						:img="item.userAvatar" :showApprove="item.approved" :showStar="item.collected" @showComment="controlShow"
						@approve="handleApprove($event, item, index)" @star="toggleStar($event, item, index)"
						@comment="handleComment($event, item)" @detail="toDetail($event, item)" :commentList="commentList"
						:viewCount="item.viewCount" :tagList="item.tags" :contentType="typeList[item.type]"></post>
				</u-list-item>
			</u-list>
			<!-- <image class="edit-icon" src="/static/square/edit.png"></image> -->
			<view :class="showInput ? 'input-area' : 'input-hidden'">

				<view class="input">
					<!-- <view class="mode-swtich">
						<uni-icons type='chat' size="24"></uni-icons>
					</view> -->
					<view class="input-box">
						<textarea v-model="inputText" :adjust-position="false" :cursor-spacing="20" auto-height
							:show-confirm-bar="false" placeholder="请输入内容..." :maxlength="-1" class="input-textarea" />
					</view>
				</view>
				<view class="send-btn" :class="{ active: canSend }" @tap="handleSend">
					发送
				</view>

			</view>
		</view>
		<view class="null-box" v-else>
			<view class="null">暂无数据~</view>
		</view>
		<image :src="'http://120.26.132.46:8091/square/edit.png'" class="image" @click="handleClick"></image>
	</view>
</template>

<script>
import post from './post.vue';
import pageTime from '../../mixins/pageTime';
import request from '../../tools/request';

export default {
	mixins: [pageTime],
	mounted() {
		this.checkUserId()
		this.setType(3)
	},
	components: {
		post
	},
	data() {
		return {
			value: 1,
			range: [
				{ value: 0, text: "所有" },
				{ value: 1, text: "资料分享" },
				{ value: 2, text: "日常记录" },
				{ value: 3, text: "技术交流" },
			],
			value2: 0,
			range2: [
				{ value: 0, text: "最新发布" },
				{ value: 1, text: "高分推荐" },
				{ value: 2, text: "最热发布" }
			],
			bgImg: this.$request.baseUrl + "/square/checkIn2.png",
			inputStyle: {
				width: "500rpx",
			},
			inputText: "",
			keyword: "",
			articleListBody: {
				userId: "",
				articleId: "",
				limit: 6,
				orderMode: 0,
				type: 0
			},
			approveBody: {
				userId: "",
				articleId: "",
				approved: false
			},
			list: [],
			userId: "",
			// list:[
			// 		{
			// 			content:"这是一个自律帖子",
			// 			author:"王源",
			// 			id:1,
			// 			time:"2025-1-20 19:00:00",
			// 			sourceType:"ai Agent"
			// 		},
			// 		{
			// 			content:"小小地水一下，+3",
			// 			author:"棂唔",
			// 			id:2,
			// 			time:"2024-12-20 18:23:00",
			// 			sourceType:"ai Agent"
			// 		},
			// 		{
			// 			content:"公告：孩子们，我又回来了！！！",
			// 			author:"劳大",
			// 			id:3,
			// 			time:"2024-10-1 9:00:00",
			// 			sourceType:"ai Agent"
			// 		},
			// 		{
			// 			content:"自学python第100天打卡，今日内容：分阶段快就离开",
			// 			author:"heby",
			// 			id:4,
			// 			time:"2024-7-21 15:32:00",
			// 			sourceType:"ai Agent"
			// 		},
			// 		{
			// 			content:"这是今天的宵夜！北京烤鸭，超级好吃，超推荐友友们来品尝",
			// 			author:"今天吃没吃",
			// 			id:5,
			// 			time:"2024-5-21 12:48:00",
			// 			sourceType:"ai Agent"
			// 		},
			// 		{
			// 			content:"考研+v12306699903,等你！！",
			// 			user:"考研上岸callMe",
			// 			id:6,
			// 			time:"2024-6-18 10:56:00",
			// 			sourceType:"ai Agent"
			// 		},
			// 	],
			showInput: false,
			commentList: [],
			currentIndex: -1,
			typeList: ['暂无该类别', '资料分享', '日常记录', '技术交流']
			// tagList:[]
			// list:[
			// 		{
			// 			content:"这是一个自律帖子",
			// 			author:"王源",
			// 			id:1,
			// 			time:"2025-1-20 19:00:00",
			// 			sourceType:"ai Agent"
			// 		},
			// 		{
			// 			content:"小小地水一下，+3",
			// 			author:"棂唔",
			// 			id:2,
			// 			time:"2024-12-20 18:23:00",
			// 			sourceType:"ai Agent"
			// 		},
			// 		{
			// 			content:"公告：孩子们，我又回来了！！！",
			// 			author:"劳大",
			// 			id:3,
			// 			time:"2024-10-1 9:00:00",
			// 			sourceType:"ai Agent"
			// 		},
			// 		{
			// 			content:"自学python第100天打卡，今日内容：分阶段快就离开",
			// 			author:"heby",
			// 			id:4,
			// 			time:"2024-7-21 15:32:00",
			// 			sourceType:"ai Agent"
			// 		},
			// 		{
			// 			content:"这是今天的宵夜！北京烤鸭，超级好吃，超推荐友友们来品尝",
			// 			author:"今天吃没吃",
			// 			id:5,
			// 			time:"2024-5-21 12:48:00",
			// 			sourceType:"ai Agent"
			// 		},
			// 		{
			// 			content:"考研+v12306699903,等你！！",
			// 			user:"考研上岸callMe",
			// 			id:6,
			// 			time:"2024-6-18 10:56:00",
			// 			sourceType:"ai Agent"
			// 		},
			// ],
		}
	},
	onLoad() {
		this.userId = uni.getStorageSync('userId')
	},
	onShow() {
		this.getList()
	},
	methods: {
		toDetail(e, item) {
			uni.navigateTo({
				url: `/pages/index/postDetail?articleId=${item.articleId}`
			})
		},
		async loadData() {
			//先获取到当前末尾id
			const lastId = this.list[this.list.length - 1].articleId
			const len = await this.getList(lastId)
			console.log("len:" + len);

			if (len != -1 && len == 0) {
				uni.showToast({
					icon: "none",
					title: "已经到底了哦~"
				})
			}
		},
		getList(lastId = null) {
			return new Promise((resolve, reject) => {
				let arr
				this.$api.square.getArticleList({
					...this.articleListBody,
					articleId: lastId,
					userId: this.userId,
				}).then(res => {
					console.log(res);
					const newArr = res.data.map(item => ({
						...item,
						approved: item.approved,
						userAvatar: request.baseUrl + item.userAvatar,
						tags: (item.tags === "[[]]" || item.tags === "[]" || item.tags === "") ? [] : item.tags.slice(1, -1).split(',')
					}))
					if (lastId === null) {
						arr = newArr
					}
					else {
						arr = [...this.list, ...newArr]
					}
					console.log(arr);

					this.$set(this, 'list', arr)
					console.log(this.list);
					resolve(res.data?.length ? res.data.length : 0)

				})
					.catch(err => {
						console.log(err);
						reject(-1)
					})
			})
		},
		handleStar(status, item) {
			let arr = []
			arr.push((item.articleId).toString())
			const body = {
				userId: this.userId,
				articleId: arr
			}
			return new Promise((resolve, reject) => {
				//若真，则取消
				if (status) {
					this.$api.square.cancelStar(body)
						.then(res => {
							resolve(false)
						})
						.catch(err => {
							reject(err)
						})
				}
				else {
					this.$api.square.starArticle(body)
						.then(res => {
							resolve(true)
						})
						.catch(err => {
							reject(err)
						})
				}
			})
		},
		toggleStar(starStatus, item, index) {
			console.log('触发star');


			this.handleStar(starStatus, item)
				.then(res => {
					if (res) {
						uni.showToast({
							title: "成功收藏"
						})
					}
					else {
						uni.showToast({
							title: "取消收藏"
						})
					}
					//更改当前状态
					this.$set(this.list, index, {
						...item,
						collected: !starStatus
					})
				})
				.catch(err => {
					console.log(err);
					uni.showToast({
						title: '错误',
						icon: "error"
					})
				})
		},
		handleApprove(approved, item, index) {
			// console.log(approved,item);
			// // 找到需要修改的文章
			// const index = this.list.findIndex(article=>article.articleId == item.articleId)
			console.log(this.list[index]);

			this.$api.square.approve({
				...this.approveBody,
				approved: !approved,
				userId: this.userId,
				articleId: item.articleId
			}).then(res => {
				//如果为真，则为点赞
				if (approved) {
					this.$set(this.list[index], 'likeCount', item.likeCount - 1)
					uni.showToast({
						title: '取消点赞成功'
					})
				}
				else {
					this.$set(this.list[index], 'likeCount', item.likeCount + 1)
					uni.showToast({
						title: '点赞成功'
					})
				}

				//修改数组中内容
				this.$set(this.list, index, {
					...item,
					approved: !approved
				})
			})
				.catch(err => {
					console.log(err);
				})
		},
		handleSearch() {
			console.log(this.keyword);
			uni.getStorageSync('userId')
			this.$api.square.searchArticle({ content: this.keyword, userId: this.userId }).then(res => {
				console.log(res);
				this.$set(this, 'list', res.data.map(item => ({
					...item,
					userAvatar: request.baseUrl + item.userAvatar
				})))
			})
				.catch(err => {
					console.log(err);

				})
		},
		change(e, type) {
			//改变值
			this.articleListBody[type] = e

			this.$api.square.getArticleList({
				...this.articleListBody,
				articleId: null,
				userId: this.userId,
			}).then(res => {
				console.log(res);
				const newArr = res.data.map(item => ({
					...item,
					approved: item.approved,
					userAvatar: request.baseUrl + item.userAvatar,
					tags: (item.tags === "[[]]" || item.tags === "[]" || item.tags === "") ? [] : item.tags.slice(1, -1).split(',')
				}))
				this.$set(this, 'list', newArr)
				console.log(this.list);
				
			})
				.catch(err => {
					console.log(err);
				})
			// if(e==0){
			// 	this.$set(this,'list',this.list.sort((a, b) => new Date(a.time) - new Date(b.time)))
			// }
			// else{
			// 	this.$set(this,'list',this.list.sort((a, b) => new Date(b.time) - new Date(a.time)))
			// }
		},
		controlShow() {
			this.showInput = !this.showInput
		},
		handleClick() {
			uni.navigateTo({
				url: '/pages/square/edit'
			})
		},
		handleComment(show, item) {
			if (show)
				this.currentIndex = this.list.findIndex(data => data.articleId == item.articleId)
			else {
				//为-1，说明没有展开的评论区
				this.currentIndex = -1
				return
			}
			this.$api.square.getComment(item.articleId).then(res => {
				console.log(res);
				this.$set(this, 'commentList', res.data.map(item => ({
					content: item.content,
					author: item.fromName,
					createTime: item.createTime
				})))
			})
				.catch(err => {
					console.log(err);

				})
		},
		handleSend() {
			//根据当前index,判断是什么
			if (this.currentIndex == -1)
				return
			if (this.inputText.trim() == '') {
				uni.showToast({
					title: '请输入评论内容',
					icon: 'none'
				})
			}
			this.$api.square.comment({
				fromId: this.userId,
				userId: this.userId,
				content: this.inputText,
				articleId: this.list[this.currentIndex].articleId
			})
				.then(res => {
					console.log(res);
					this.$set(this.commentList, this.commentList.length, {
						content: res.data.content,
						author: res.data.fromName,
						createTime: res.data.createTime
					})


					// })
					uni.showToast({
						title: "成功评论"
					})
				})
				.catch(err => {
					console.log(err);

				})
			this.inputText = ""
		}
	},
	computed: {
		canSend() {
			return this.inputText.trim().length > 0
		}
	}
}
</script>

<style lang="scss" scoped>
.image {
	// position: relative;
	// top:10%;
	width: 75rpx;
	height: 75rpx;
	border: 1px solid #eee;
	border-radius: 20rpx;
	position: absolute;
	bottom: 100rpx;
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


	.header {
		margin-top: 20rpx;
	}

	.select {
		width: 100vw;
		margin-top: 40rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;

		/deep/.uni-select {
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

	.check-img {
		width: 180rpx;
		height: 180rpx;
		position: absolute;
		right: 10rpx;
		bottom: 20rpx;
		background-color: transparent;
	}
}

.item {
	min-height: 300rpx;
}

.input-area {
	position: sticky;
	bottom: 0;
	left: 0;
	// width: 95vw;
	display: flex;
	align-items: flex-end;
	padding: 20rpx;
	background-color: #fff;
	border-top: 1rpx solid #eee;

	.input {
		flex: 1;
		display: flex;
		align-items: flex-end;
		background-color: #f5f5f5;
		border-radius: 10rpx;
		margin: 0 20rpx;
	}

	.mode-swtich {
		padding: 10rpx;
	}

	.input-box {
		padding: 0 20rpx 0 0;
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		flex: 1;


		.input-textarea {
			width: 100%;
			padding: 20rpx;
			max-height: 200rpx;
			font-size: 28rpx;
			line-height: 1.5;
			box-sizing: border-box;
		}
	}

	.send-btn {
		width: 120rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		background-color: #007AFF;
		color: #fff;
		border-radius: 10rpx;
		opacity: 0.5;

		&.active {
			opacity: 1;
		}
	}
}

.input-hidden {
	visibility: hidden;
	display: none;
	width: 0;
	height: 0;
}

.null-box {
	flex: 1;
	width: 100vw;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;

	.null {
		font-size: 50rpx;
		text-align: center;
		font-weight: 800;
	}
}
</style>
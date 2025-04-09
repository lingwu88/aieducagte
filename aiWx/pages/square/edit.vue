<template>
	<view class="content">
		<view class="input-area">
			<!-- <view class="input-box">

				<textarea
					v-model="inputText"
					:adjust-position="false"
					:cursor-spacing="20"
					:show-confirm-bar="false"
					placeholder="请输入内容..."
					:maxlength="-1"
					@focus="handleFocus"
					@blur="handleBlur"
					class="input-textarea"
				/>
				</view> -->
			<view class="box">
				<view class="form">
					<u--form labelPosition="top" :model="form" ref="uForm" labelWidth="150">
						<u-form-item label="标题" prop="title" borderBottom ref="item1">
							<input v-model="form.title" placeholder="请输入标题"></input>
						</u-form-item>
						<u-form-item label="内容" prop="content" borderBottom ref="item1">
							<u-textarea v-model="form.content" count maxlength="400" height="200" placeholder="这里可以输入内容"></u-textarea>
						</u-form-item>
					</u--form>
					<view class="box-tag">
						<view class="box-tag-item" v-for="(item, index) in selectedTag" :key="item.id">#{{ item.name }}</view>
					</view>
					<view class="preview">
						<view class="image-container">
							<view v-for="(image, index) in images" :key="index" class="image-preview">
								<image :src="image" class="image" @click="previewImage(image)" />
								<view class="delete-btn" @click="deleteImage(index)">删除</view>
							</view>
						</view>
					</view>
				</view>
				<view class="options-list">
					<!-- <view class="icon-list"> -->
					<!-- <u-icon name="photo-fill" @click="uploadImage" size="30"></u-icon> -->
					<!-- <uni-icons type="paperclip" size="30"  color="#000000"></uni-icons> -->
					<!-- </view> -->
					<view class="publish-btn" @click="handlePublish">
						<text>发表</text>
					</view>
				</view>
				<!-- <view class="clear-btn" @click="clearText">
				<text>清空文本</text>
			</view> -->
				<!-- <view class="upload-btn">
				<text>上传图片</text>
			</view> -->
			</view>
			<view class="type-box">
				<view class="type-header">
					类别选择
				</view>
				<view class="type-content">
					<view class="type-item" :class="{ 'itemSelected': typeIndex == 1 }" @click="toggleSwtich(1)">资料分享</view>
					<view class="type-item" :class="{ 'itemSelected': typeIndex == 2 }" @click="toggleSwtich(2)">日常记录</view>
					<view class="type-item" :class="{ 'itemSelected': typeIndex == 3 }" @click="toggleSwtich(3)">技术交流</view>
				</view>
			</view>
			<view class="tag">
				<view class="tag-header">推荐话题</view>
				<view class="tag-list">
					<view :class="['tag-item', { 'active': selectedTag.some(tag => tag.id === item.id) }]"
						v-for="(item, index) in tagList" :key="item.id" @click="toggleTag(item)">#{{ item.name }}</view>
				</view>
			</view>
			<view class="footer" @click="showPopup">+ 添加标签</view>
		</view>
		<u-popup :show="show" @close="close" mode="center" :round="20" :customStyle="{
			backgroundColor: '#ffffff',
			width: '600rpx',
			height: '250rpx'
		}">
			<view class="popup">
				<view class="popup-header">添加新标签</view>
				<u--input placeholder="请输入内容" border="surround" v-model="newTag"></u--input>
				<view class="popup-footer">
					<view @click.stop="handleCancel">取消</view>
					<view @click.stop="addTag">确认</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import pageTime from '../../mixins/pageTime'
import FormData from '../../tools/formdata/index'
export default {
	mixins: [pageTime],
	data() {
		return {
			inputText: '',
			images: [],
			typeIndex: 1,
			form: {
				userId: '',
				title: "",
				content: "",
				type: 1,
				tags: []
			},
			tagList: [
				{
					name: '计科开发者学习',
					id: '1',
				},
				{
					name: '有趣内容分享',
					id: '2'
				},
				{
					name: '打卡挑战',
					id: '3',
				},
				{
					name: '人工智能学习的思考',
					id: '4'
				},
				{
					name: '零基础',
					id: '5'
				}
				// {
				// 	name:'前端',
				// 	id:'1'
				// },
				// {
				// 	name:'后端',
				// 	id:'2'
				// },
				// {
				// 	name:'一个实习生的自救之旅',
				// 	id:'3'
				// },
				// {
				// 	name:'面经',
				// 	id:'4'
				// },
				// {
				// 	name:'牛马的日常生活',
				// 	id:'5'
				// }
			],
			selectedTag: [],
			show: false,
			newTag: "",
			nowList: []
		}
	},
	mounted() {
		this.checkUserId()
		this.setType(3)
	},
	onLoad() {
		if (uni.getStorageSync('tags'))
			this.nowList = uni.getStorageSync('tags')

		if (this.nowList.length !== 0) {
			this.nowList.forEach((item => {
				this.tagList.push({
					name: item,
					id: this.tagList.length + 1
				})
			}))
		}
	},
	onUnload() {
		uni.setStorageSync('tags', this.nowList)
	},
	methods: {
		handleCancel() {
			this.newTag = ""
			this.show = false
		},
		uploadImage() {
			// 这里可以使用 uni.chooseImage 来选择图片
			uni.chooseImage({
				count: 1,
				success: (res) => {
					this.images.push(res.tempFilePaths[0]);
				}
			});
		},
		toggleSwtich(index) {
			this.typeIndex = index
			this.form.type = index
		},
		clearText() {
			this.form.title = '';
			this.form.content = ''
		},
		deleteImage(index) {
			this.images.splice(index, 1);
		},
		previewImage(image) {
			uni.previewImage({
				current: image,
				urls: this.images
			});
		},
		handleFocus() {
			// 处理焦点事件
		},
		handleBlur() {
			// 处理失去焦点事件
		},
		showPopup() {
			this.show = true
		},
		addTag() {
			//推入数组
			this.tagList.push({ name: this.newTag, id: (this.tagList.length + 1).toString() })
			this.nowList.push(this.newTag)
			if (this.nowList.length > 3) {
				this.nowList.shift()
			}
			console.log(this.show);

			this.show = false
			this.newTag = ""
		},
		//关闭弹窗，清空数据
		close() {
			this.show = false
			this.newTag = ""
		},
		toggleTag(item) {
			//查看是否在已选中找到
			const index = this.selectedTag.findIndex(data => data.id === item.id)
			if (index === -1) {
				this.selectedTag.push(item)
				this.form.tags.push(item.name)
			}
			else {
				this.selectedTag.splice(index, 1)
				this.form.tags.splice(index, 1)
			}
		},
		handlePublish() {
			if (this.form.title.trim() != '' && this.form.content.trim() != '') {
				// const formData = new FormData();
				// formData.append('userId', uni.getStorageSync('userId'));
				// formData.append('title', this.form.title);
				// formData.append('content', this.form.content);
				// formData.append('type', this.form.type);
				// // Convert tags array to string before appending
				// formData.append('tags', JSON.stringify(this.form.tags));

				const formData = {
					userId: uni.getStorageSync('userId'),
					title: this.form.title,
					content: this.form.content,
					type: this.form.type,
					tags: this.form.tags
				}
				// console.log(formData.getData());


				this.$api.square.pushlishArticle(formData).then(res => {
					console.log(res);
					uni.showToast({
						title: '发表成功'
					})
					uni.navigateBack({
						delta: 1,
						fail() {
							uni.navigateTo({
								url: "/pages/square/check"
							})
						}
					})
				})
					.catch(err => {
						console.log(err);

					})
			}
			else {
				uni.showToast({
					title: "标题或内容不能为空!",
					icon: 'none'
				})
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.content {
	display: flex;
	flex-direction: column;
	padding: 20rpx;
	background-color: #ffffff;

	.popup {
		&-header {
			height: 100rpx;
			line-height: 100rpx;
			font-size: 30rpx;
			text-align: center;
		}

		/deep/.u-border {
			border: none
		}

		/deep/.u-input__content__field-wrapper__field {
			text-align: center !important;
		}

		&-footer {
			width: 100%;
			height: 70rpx;
			display: flex;
			flex-direction: row;
			justify-content: space-around;
			align-items: center;
			font-size: 28rpx;
		}
	}
}

.input-area {
	display: flex;
	flex-direction: column;
	margin-bottom: 20rpx;
	min-height: 100vh;

	.tag {
		flex: 0.9;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;


		&-list {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: flex-start;
			align-items: flex-start;
		}

		&-item {
			padding: 10rpx;
			font-size: 28rpx;
			box-sizing: border-box;
			border-radius: 10rpx;
			margin: 10rpx;
			line-height: 25rpx;
			height: 50rpx;
			background-color: #64C88C;
			color: white;
		}

		.active {
			color: #000000;
			background-color: #eaeaea;
		}

	}

	.footer {
		text-align: center;
		width: 100%;
		margin-bottom: 30rpx;
		color: #024dbe;
	}

	.type {

		&-box {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: flex-start;
			margin: 0 0 20rpx 0;
		}

		&-header {
			margin-bottom: 20rpx;
			font-size: 36rpx;
		}

		&-content {
			display: flex;
			flex-direction: row;
			justify-content: space-evenly;
			align-items: center;

			.itemSelected {
				background-color: #ef8282d9;
				color: #ffffff;
				border: none
			}
		}

		&-item {
			margin: 10rpx;
			font-size: 30rpx;
			// border: 1px solid black;
			color: #000000;
			border: 1px solid #000000;
			border-radius: 5rpx;
			background-color: #ffffff;
			padding: 5rpx;
		}

	}
}

.input-box {
	background-color: #f5f5f5;
	border-radius: 10rpx;
}

.input-textarea {
	width: 100%;
	padding: 10rpx;
	border: none;
	resize: none;
	font-size: 28rpx;
	color: #333;
	height: 50vh;
}

.options-list {
	width: 100%;
	min-height: 100rpx;
	margin: 0 0 20rpx 0;
	background-color: #ffffff;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	border-bottom: 1px solid #e2e2e2;

	.icon-list {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		width: 30%;
		padding: 0 0 0 20rpx;
	}
}

.clear-btn {
	background-color: #ef8c87;
	color: #fff;
	text-align: center;
	padding: 10rpx;
	border-radius: 5rpx;
	cursor: pointer;
	margin-top: 10rpx;
	height: 60rpx;
	border-radius: 60rpx;
	line-height: 60rpx;
}

.preview {
	margin-top: 20rpx;

}

.image-container {
	display: flex;
	flex-wrap: wrap;
}

.image-preview {
	margin: 5rpx;
	position: relative;
}

.image {
	width: 100px;
	height: 100px;
	border-radius: 5rpx;
}

.delete-btn {
	position: absolute;
	top: 0;
	right: 0;
	// background-color: rgba(255, 0, 0, 0.7);
	border-bottom: 1px solid #000000;
	// color: white;
	padding: 2rpx 5rpx;
	border-radius: 3rpx;
	cursor: pointer;
	height: 60rpx;
	border-radius: 60rpx;
	line-height: 60rpx;
}

.upload-btn {
	background-color: hsl(211, 100%, 50%);
	color: #fff;
	text-align: center;
	padding: 10rpx;
	border-radius: 5rpx;
	cursor: pointer;
	height: 60rpx;
	border-radius: 60rpx;
	line-height: 60rpx;
}

.publish-btn {
	width: 200rpx;
	max-height: 50rpx;
	background-color: #7884F0;
	color: #fff;
	text-align: center;
	padding: 10rpx;
	// border-radius: 3rpx;
	cursor: pointer;
	height: 60rpx;
	border-radius: 60rpx;
	// line-height: 60rpx;
	// margin-top:20rpx;
}

.box {

	.form {
		min-height: 40vh;

		/deep/.u-textarea.data-v-81cd9d32 {
			border-radius: 4px;
			// background-color: #f9f9f9;
			background-color: #ffffff;
			border: none;
			width: 90vw;
			margin: auto;
		}
	}

	.navigate-box {
		position: relative;
		margin: 0 0 20rpx 0;
		left: 50%;
		transform: translate(-50%, -20%);
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 30vw;
		height: auto;

		image {
			width: 30rpx;
			height: 30rpx;
		}
	}

	&-tag {
		padding: 10rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		flex-wrap: wrap;
		align-items: flex-start;

		&-item {
			margin: 10rpx;
			border-radius: 3rpx;
			padding: 10rpx;
			min-height: 30rpx;
			background-color: #a38bd2;
			color: white
		}
	}
}
</style>
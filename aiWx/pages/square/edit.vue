<template>
	<view class="content">
		<view class="input-area">
			<view class="input-box">
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
			</view>
			<view class="clear-btn" @click="clearText">
				<text>清空文本</text>
			</view>
		</view>
		<view class="preview">
			<view class="image-container">
				<view v-for="(image, index) in images" :key="index" class="image-preview">
					<image :src="image" class="image" @click="previewImage(image)" />
					<view class="delete-btn" @click="deleteImage(index)">删除</view>
				</view>
			</view>
		</view>
		<view class="upload-btn" @click="uploadImage">
			<text>上传图片</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				inputText: '',
				images: []
			}
		},
		onLoad() {

		},
		methods: {
			uploadImage() {
				// 这里可以使用 uni.chooseImage 来选择图片
				uni.chooseImage({
					count: 1,
					success: (res) => {
						this.images.push(res.tempFilePaths[0]);
					}
				});
			},
			clearText() {
				this.inputText = '';
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
}

.input-area {
	display: flex;
	flex-direction: column;
	margin-bottom: 20rpx;
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

.clear-btn {
	background-color: #FF3B30;
	color: #fff;
	text-align: center;
	padding: 10rpx;
	border-radius: 5rpx;
	cursor: pointer;
	margin-top: 10rpx;
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
}

.upload-btn {
	background-color: #007AFF;
	color: #fff;
	text-align: center;
	padding: 10rpx;
	border-radius: 5rpx;
	cursor: pointer;
}
</style>
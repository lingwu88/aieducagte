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
					<u--form
						labelPosition="top"
						:model="form"
						ref="uForm"
						labelWidth="150"
				>
					<u-form-item
							label="标题"
							prop="title"
							borderBottom
							ref="item1"
					>
						<input v-model="form.title" placeholder="请输入标题"></input>
					</u-form-item>
					<u-form-item
							label="内容"
							prop="content"
							borderBottom
							ref="item1"
					>
						<u-textarea v-model="form.content" count maxlength="400" height="200" placeholder="这里可以内容"></u-textarea>
					</u-form-item>
				</u--form>
			</view>
			<view class="clear-btn" @click="clearText">
				<text>清空文本</text>
			</view>
		</view>
		<view class="preview" v-if="images.length > 0">
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
		<view class="publish-btn" @click="handlePublish">
			<text>发表</text>
		</view>
	</view>	
</view>
</template>

<script>
	export default {
		data() {
			return {
				inputText: '',
				images: [],
      form:{
				userId:'',
				title:"",
				content:""
      }
    }
  },
  onLoad() {

	},
	methods: {
		uploadImage() {

			uni.chooseImage({
				count: 1,
				success: (res) => {
					this.images.push(res.tempFilePaths[0]);
				}
			});
		},
		clearText() {
			this.form.title = '';
			this.form.content=''
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
		onLoad() {

		},
		handlePublish(){
			if(this.form.title.trim()!='' && this.form.content.trim()!=''){
				this.$api.square.pushlishArticle({
					...this.form,
					userId:uni.getStorageSync('userId')
				}).then(res=>{
					console.log(res);
					uni.showToast({
						title:'发表成功'
					})
					uni.navigateBack({
						delta:1
					})
				})
				.catch(err=>{
					console.log(err);
					
				})
			}
			else{
				uni.showToast({
					title:"标题或内容不能为空!",
					icon:'none'
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
	background-color: #f8f9fd;
	position: relative;
}

.input-area {
	display: flex;
	flex-direction: column;
	margin-bottom: 20rpx;
	min-height: 100vh;
	background-color: rgba(255, 255, 255, 0.9);
	border-radius: 15rpx;
	padding: 30rpx;
	box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.08);
	border: 1rpx solid rgba(255, 255, 255, 0.3);
	position: relative;
	z-index: 1;
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
	background: linear-gradient(135deg, #ff5252 0%, #ff7676 50%, #ef8c87 100%);
	color: #fff;
	text-align: center;
	padding: 10rpx;
	cursor: pointer;
	margin-top: 30rpx;
	height: 70rpx;
	border-radius: 35rpx;
	line-height: 70rpx;
	box-shadow: 0 4rpx 12rpx rgba(239, 140, 135, 0.3);
	position: relative;
	overflow: hidden;
	transition: box-shadow 0.2s ease, filter 0.2s ease;
	
	&:active {
		box-shadow: 0 2rpx 6rpx rgba(239, 140, 135, 0.2);
		filter: brightness(0.95);
	}
	
	&::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 50%;
		background: linear-gradient(to bottom, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0));
		border-radius: 35rpx 35rpx 0 0;
	}
}

.preview {
	margin-top: 30rpx;
	background-color: rgba(255, 255, 255, 0.9);
	border-radius: 15rpx;
	padding: 30rpx;
	box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.08);
	border: 1rpx solid rgba(255, 255, 255, 0.3);
	position: relative;
	z-index: 1;
}

.image-container {
	display: flex;
	flex-wrap: wrap;
}

.image-preview {
	margin: 10rpx;
	position: relative;
	transition: transform 0.2s ease;
	
	&:active {
		transform: scale(0.98);
	}
}

.image {
	width: 150rpx;
	height: 150rpx;
	border-radius: 10rpx;
	object-fit: cover;
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
}

.delete-btn {
	position: absolute;
	top: 0;
	right: 0;
	background-color: rgba(255, 255, 255, 0.9);
	color: #ef8c87;
	padding: 2rpx 10rpx;
	border-radius: 20rpx;
	cursor: pointer;
	font-size: 24rpx;
	box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
	backdrop-filter: blur(5px);
	-webkit-backdrop-filter: blur(5px);
}

.upload-btn {
	background: linear-gradient(135deg, #4a59e5 0%, #5b6af0 50%, #7b89ff 100%);
	color: #fff;
	text-align: center;
	padding: 10rpx;
	cursor: pointer;
	height: 70rpx;
	border-radius: 35rpx;
	line-height: 70rpx;
	margin-top: 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(91, 106, 240, 0.3);
	position: relative;
	overflow: hidden;
	z-index: 1;
	transition: box-shadow 0.2s ease, filter 0.2s ease;
	
	&:active {
		box-shadow: 0 2rpx 6rpx rgba(91, 106, 240, 0.2);
		filter: brightness(0.95);
	}
	
	&::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 50%;
		background: linear-gradient(to bottom, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0));
		border-radius: 35rpx 35rpx 0 0;
	}
}

.publish-btn {
	background: linear-gradient(135deg, #4a59e5 0%, #5b6af0 50%, #7b89ff 100%);
	color: #fff;
	text-align: center;
	padding: 10rpx;
	cursor: pointer;
	height: 70rpx;
	border-radius: 35rpx;
	line-height: 70rpx;
	margin-top: 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(91, 106, 240, 0.3);
	position: relative;
	overflow: hidden;
	z-index: 1;
	transition: box-shadow 0.2s ease, filter 0.2s ease;
	
	&:active {
		box-shadow: 0 2rpx 6rpx rgba(91, 106, 240, 0.2);
		filter: brightness(0.95);
	}
	
	&::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 50%;
		background: linear-gradient(to bottom, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0));
		border-radius: 35rpx 35rpx 0 0;
	}
}

.box {
	.form {
		min-height: 50vh;

		/deep/.u-textarea.data-v-81cd9d32 {
			border-radius: 8rpx;
			background-color: rgba(249, 249, 249, 0.8);
			backdrop-filter: blur(5px);
			-webkit-backdrop-filter: blur(5px);
			border: none;
			width: 80vw;
			margin: auto;
			padding: 10rpx;
			text-align: left;
		}
		
		/deep/ .u-textarea__field {
			text-align: left;
		}
		
		/deep/ .u-form-item__body {
			padding: 10rpx 20rpx;
		}
		
		/deep/ input {
			background-color: rgba(249, 249, 249, 0.8);
			backdrop-filter: blur(5px);
			-webkit-backdrop-filter: blur(5px);
			border-radius: 8rpx;
			padding: 10rpx 20rpx;
		}
	}

	.navigate-box {
		position: relative;
		margin: 0 0 20rpx 0;
		left: 50%;
		transform: translate(-50%,-20%);
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
}
</style>
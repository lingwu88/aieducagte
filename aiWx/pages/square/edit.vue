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
			// 这里可以使用 uni.chooseImage 来选择图片
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
		handlePublish(){
			if(this.form.title.trim()!='' && this.form.content.trim()!=''){
				this.$api.square.pushlishArticle({
					...this.form,
					userId:uni.getStorageSync('userId')
				}).then(res=>{
					console.log(res);
					
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
	background-color: #ffffff;
}

.input-area {
	display: flex;
	flex-direction: column;
	margin-bottom: 20rpx;
	min-height: 100vh;
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
	background-color: #007AFF;
	color: #fff;
	text-align: center;
	padding: 10rpx;
	border-radius: 5rpx;
	cursor: pointer;
	height: 60rpx;
	border-radius: 60rpx;
	line-height: 60rpx;
}
.publish-btn{
	background-color: #6984a0;
	color: #fff;
	text-align: center;
	padding: 10rpx;
	border-radius: 5rpx;
	cursor: pointer;
	height: 60rpx;
	border-radius: 60rpx;
	line-height: 60rpx;
	margin-top:20rpx;
}
.box{

  .form{
    min-height: 50vh;

    /deep/.u-textarea.data-v-81cd9d32 {
        border-radius: 4px;
        background-color: #f9f9f9;
        border: none;
        width: 90vw;
        margin: auto;
    }
  }

  .navigate-box{
    position: relative;
    margin:0 0 20rpx 0;
    left: 50%;
    transform: translate(-50%,-20%);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 30vw;
    height: auto;
    image{
      width:30rpx;
      height: 30rpx;
    }
  }
}
</style>
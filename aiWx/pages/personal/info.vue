<template>
  <view class="container">
      <view class="header">
          <text class="title">修改个人信息</text>
      </view>
      <view class="form">
          <view class="form-item">
              <text class="label">头像:</text>
              <image :src="avatar" class="avatar" @click="chooseAvatar" />
          </view>
          <view class="form-item">
              <text class="label">昵称:</text>
              <input v-model="nickname" class="input" placeholder="请输入昵称" />
          </view>
          <view class="form-item">
              <text class="label">性别:</text>
              <picker mode="selector" :range="genders" @change="onGenderChange">
                  <view class="picker">
                      {{ selectedGender }}
                  </view>
              </picker>
          </view>
          <view class="form-item">
              <text class="label">生日:</text>
              <picker mode="date" @change="onBirthdayChange">
                  <view class="picker">
                      {{ birthday || '选择生日' }}
                  </view>
              </picker>
          </view>
          <view class="form-item">
              <text class="label">个性签名:</text>
              <textarea v-model="signature" class="textarea" placeholder="请输入个性签名"></textarea>
          </view>
          <view class="button-box">
              <button class="save-button" @click="saveInfo">保存</button>
          </view>
      </view>
  </view>
</template>

<script>
export default {
  data() {
      return {
          avatar: '/static/my/avatar.png', // 默认头像
          nickname: '',
          genders: ['男', '女'],
          selectedGender: '男',
          birthday: '',
          signature: ''
      };
  },
  methods: {
      chooseAvatar() {
          uni.chooseImage({
              count: 1,
              success: (res) => {
                  this.avatar = res.tempFilePaths[0]; // 更新头像
              }
          });
      },
      onGenderChange(e) {
          this.selectedGender = this.genders[e.detail.value]; // 更新性别
      },
      onBirthdayChange(e) {
          this.birthday = e.detail.value; // 更新生日
      },
      saveInfo() {
          // 保存个人信息的逻辑
          uni.showToast({
              title: '信息已保存',
              icon: 'success'
          });
          console.log({
              avatar: this.avatar,
              nickname: this.nickname,
              gender: this.selectedGender,
              birthday: this.birthday,
              signature: this.signature
          });
      }
  }
}
</script>

<style scoped>
.container {
  padding: 20px;
  background-color: #f9f9f9;
}

.header {
  margin-bottom: 20px;
}

.title {
  font-size: 24px;
  font-weight: bold;
}

.form {
  width:80vw;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-item {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.label {
  width: 80px;
  font-size: 16px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-left: 10px;
}

.input {
  flex: 1;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  padding: 10px;
}

.picker {
  flex: 1;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  padding: 10px;
  text-align: center;
}

.textarea {
  flex:1;
  height: 80px;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  padding: 10px;
}

.button-box {
  margin-top: 20px;
  text-align: center;
}

.save-button {
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 16px;
}
</style>
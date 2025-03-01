<template>
  <view class="container">
    <view class="header">
      <text class="title">修改个人信息</text>
    </view>
    <view class="form-container">
      <u--form
        labelPosition="left"
        :model="form"
        :rules="rules"
        ref="uForm"
        labelWidth="70"
      >
        <u-form-item
          label="头像"
          prop="avatar"
          ref="item1"
        >
          <view class="avatar-container">
            <image :src="label.avatar" class="avatar" @click="chooseAvatar" />
          </view>
        </u-form-item>
        <u-form-item
          label="昵称"
          prop="nickname"
          ref="item1"
        >
          <input v-model="form.userName" class="input" placeholder="请输入昵称" />
        </u-form-item>
        <u-form-item
          label="手机"
          prop="phone"
          ref="item1"
        >
          <input v-model="form.phone" class="input" placeholder="请输入手机号" /> 
        </u-form-item>
        <u-form-item
          label="性别"
          prop="sex"
          ref="item1"
        >
          <picker mode="selector" :range="genders" @change="onGenderChange" range-key="label">
            <view class="picker">
              {{ label.gender || '请选择性别' }}
            </view>
          </picker>
        </u-form-item>
        <!-- <u-form-item
          label="生日"
          prop="birthday"
          @click="showSex = true; hideKeyboard()"
          ref="item1"
          >
          <picker mode="date" @change="onBirthdayChange">
              <view class="picker">
                  {{ form.birthday || '选择生日' }}
              </view>
          </picker>
        </u-form-item> -->
        <u-form-item
          label="个性签名"
          prop="signature"
          ref="item1"
        >
          <textarea v-model="form.signature" class="textarea" placeholder="请输入个性签名"></textarea>
        </u-form-item>
        <view class="button-box">
          <button class="save-button" @click="saveInfo">保存</button>
        </view>
      </u--form>
    </view>
  </view>
</template>

<script>
import request from '../../tools/request';
export default {
  data() {
      return {
        label:{
          avatar:"/static/my/avatar.png",
          userName:"",
          gender:"",
          signature:"",
          phone:""  
        },
        form:{
          userId:'',
          // avatar: '', // 默认头像
          usersName: '',
          gender:0,
          phone:'', 
          // birthday: '',
          signature: ''
        },
        genders: [
          {
            value:0,
            label:'隐藏'
          },
          {
            value:1,
            label:'男'
          },
          {
            value:2,
            label:'女'
          }
        ],
        userId:'',
        rules:{

        }
      };
  },
  onLoad(){
    if(uni.getStorageSync('userId'))
      this.userId = uni.getStorageSync('userId')
  },
  onShow(){
    this.getAvatar()
    this.getInfo()
  },
  methods: {
      chooseAvatar() {
          uni.chooseImage({
              count: 1,
              success: (res) => {
                  this.label.avatar = res.tempFilePaths[0]; // 更新头像
                  console.log(res);
                  // this.form.avatar = res.tempFiles[0]
                  // console.log(this.form.avatar);
                  
                  //更新头像
                  this.$api.personal.uploadAvatar({
                    userId:this.userId,
                    file:this.label.avatar
                  }).then(res=>{
                    console.log(res);
                  })
                  .catch(err=>{
                    console.log(err);
                    
                  })
              }
          });
      },
      getAvatar(){
        this.$api.personal.getUserAvatar(this.userId).then(res=>{
          console.log(res);
          this.label.avatar = request.baseUrl + res.data
        })
        .catch(err=>{
          console.log(err);
          
        })
        // this.$set(this.label,'avatar',this.$api.personal.getUserAvatar(this.userId    ))
        // console.log(this.label.avatar);
        
      },
      onGenderChange(e) {
        this.form.gender = this.genders[e.detail.value].value ; // 更新性别
        this.findGender()
      },
      // onBirthdayChange(e) {
      //     this.birthday = e.detail.value; // 更新生日
      // },
      getInfo(){
				this.$api.personal.getUserInfo(this.userId).then(res=>{
					console.log(res);
          this.$set(this,'form',{
            signature:res.data.signature,
            userName:res.data.userName,
            phone:res.data.phone,
            gender:res.data.gender
          })
          this.findGender()
          // this.$set(this.label,'avatar')
				})
				.catch(err=>{
					console.log(err);
				})
			},
      findGender(){
        console.log(this.form);
        
        const item = this.genders.find(item => item.value == this.form.gender)
        console.log(item.label);
        
        this.$set(this.label,'gender',item.label)
        console.log(this.label);
        
      },
      saveInfo() {
          console.log(this.form);
          this.$api.personal.changeInfo({
            ...this.form,
            userId:this.userId
          }).then(res=>{
            console.log(res);
            
          })
          .catch(err=>{
            console.log(err);
            
          })
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
  min-height: 100vh;
  padding: 30rpx;
  background: linear-gradient(135deg, #f8f9fc, #eef1f8);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.container::before {
  content: '';
  position: absolute;
  top: -100rpx;
  right: -100rpx;
  width: 400rpx;
  height: 400rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(25, 137, 250, 0.1), transparent 70%);
  z-index: 0;
}

.container::after {
  content: '';
  position: absolute;
  bottom: -100rpx;
  left: -100rpx;
  width: 300rpx;
  height: 300rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 122, 255, 0.08), transparent 70%);
  z-index: 0;
}

.header {
  width: 100%;
  margin-bottom: 50rpx;
  padding: 30rpx 0;
  text-align: center;
  position: relative;
  z-index: 1;
}

.title {
  font-size: 44rpx;
  font-weight: 600;
  color: #333;
  position: relative;
  display: inline-block;
  padding: 0 20rpx;
  background: linear-gradient(to right, #007aff, #1989fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 2rpx;
}

.title::after {
  content: '';
  position: absolute;
  bottom: -10rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 80rpx;
  height: 6rpx;
  background: linear-gradient(to right, #007aff, #1989fa);
  border-radius: 3rpx;
}

.form-container {
  width: 92%;
  background: linear-gradient(to bottom, #ffffff, #f9fafc);
  border-radius: 20rpx;
  padding: 40rpx 30rpx;
  box-shadow: 0 15rpx 35rpx rgba(0, 0, 0, 0.05);
  border: 1rpx solid rgba(255, 255, 255, 0.8);
  position: relative;
  z-index: 1;
}

.form-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 120rpx;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.9), transparent);
  border-radius: 20rpx 20rpx 0 0;
  z-index: -1;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 10rpx;
}

.avatar {
  width: 150rpx;
  height: 150rpx;
  border-radius: 50%;
  border: 4rpx solid #f0f0f0;
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #f0f0f0, #ffffff);
}

.avatar:active {
  transform: scale(0.96);
}

.input {
  flex: 1;
  height: 80rpx;
  border: 1rpx solid #eaeaea;
  border-radius: 12rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  background: linear-gradient(to bottom, #f8f8f8, #ffffff);
  transition: all 0.3s;
}

.input:focus {
  border-color: #007aff;
  background: #ffffff;
  box-shadow: 0 0 15rpx rgba(0, 122, 255, 0.15);
}

.picker {
  flex: 1;
  height: 80rpx;
  border: 1rpx solid #eaeaea;
  border-radius: 12rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  background: linear-gradient(to bottom, #f8f8f8, #ffffff);
  display: flex;
  align-items: center;
}

.textarea {
  width: 100%;
  height: 180rpx;
  border: 1rpx solid #eaeaea;
  border-radius: 12rpx;
  padding: 20rpx;
  font-size: 28rpx;
  background: linear-gradient(to bottom, #f8f8f8, #ffffff);
  box-sizing: border-box;
}

.button-box {
  margin-top: 60rpx;
  display: flex;
  justify-content: center;
}

.save-button {
  width: 80%;
  height: 90rpx;
  background: linear-gradient(135deg, #1989fa, #007aff, #0062cc);
  color: white;
  border: none;
  border-radius: 45rpx;
  font-size: 32rpx;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10rpx 25rpx rgba(0, 122, 255, 0.25);
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  letter-spacing: 2rpx;
}

.save-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: 0.5s;
}

.save-button:active {
  transform: translateY(2rpx);
  box-shadow: 0 5rpx 15rpx rgba(0, 122, 255, 0.2);
}

.save-button:active::before {
  left: 100%;
}

/* 响应式调整 */
@media screen and (min-width: 768px) {
  .form-container {
    width: 650rpx;
  }
  
  .save-button {
    width: 60%;
  }
}
</style>
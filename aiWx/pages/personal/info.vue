<template>
  <view class="container">
      <view class="header">
          <text class="title">修改个人信息</text>
      </view>
      <view class="form">
      <u--form
      labelWidth="60"
				labelPosition="left"
				:model="form"
				:rules="rules"
				ref="uForm"
        >
        <u-form-item
					label="头像"
					prop="avatar"
					ref="item1"
          >
            <image :src="label.avatar" class="avatar" @click="chooseAvatar" />
          </u-form-item>
          <u-form-item
            label="昵称"
            prop="nickname"
            ref="item1"
            >
            <input v-model="form.userName" class="input" placeholder="请输入昵称" />
          </u-form-item>
          <u-form-item
            label="手机号"
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
                    {{ label.gender }}
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
              label="个性签"
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
          phone:"",
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
  width: inherit;
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
<template>
  <view class="container">
    <view class="header">
      <text class="title">修改个人信息</text>
    </view>
    <view class="form">
      <u--form labelPosition="left" :model="form" :rules="rules" ref="uForm" labelWidth="60">
        <u-form-item label="头像" prop="avatar" ref="item1">
          <image :src="label.avatar" class="avatar" @click="chooseAvatar" />
        </u-form-item>
        <u-form-item label="昵称" prop="nickname" ref="item1">
          <input v-model="form.userName" class="input" placeholder="请输入昵称" />
        </u-form-item>
        <u-form-item label="手机号" prop="phone" ref="item1">
          <input v-model="form.phone" class="input" placeholder="请输入手机号" />
        </u-form-item>
        <u-form-item label="性别" prop="sex" ref="item1">
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
        <u-form-item label="个性签" prop="signature" ref="item1">
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
import pageTime from '../../mixins/pageTime';
export default {
  mixins: [pageTime],
  data() {
    return {
      label: {
        avatar: this.$request.baseUrl + "/my/avatar.png",
        userName: "",
        gender: "",
        signature: "",
        phone: ""
      },
      form: {
        userId: '',
        // avatar: '', // 默认头像
        usersName: '',
        gender: 0,
        phone: '',
        // birthday: '',
        signature: ''
      },
      genders: [
        {
          value: 0,
          label: '隐藏'
        },
        {
          value: 1,
          label: '男'
        },
        {
          value: 2,
          label: '女'
        }
      ],
      userId: '',
      rules: {
        phone: [
          {
            pattern: /^1[3456789]\d{9}$/g,
            // 正则检验前先将值转为字符串

            message: '手机号格式有误'
          }
        ]
      }
    };
  },
  onLoad() {
    if (uni.getStorageSync('userId'))
      this.userId = uni.getStorageSync('userId')
    this.getAvatar()
    this.getInfo()
  },
  onShow() {
  },
  onReady() {
    //onReady 为uni-app支持的生命周期之一
    this.$refs.uForm.setRules(this.rules)
  },
  mounted() {
    this.checkUserId()
  },
  methods: {
    chooseAvatar() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          console.log(res);

          // let resSize = tempFiles[0].size;
          // if(resSize > 1024*1024*10){
          //   uni.showToast({
          //     title:"上传图片大小不能超过10MB",
          //     icon:"error"
          //   })
          //   return
          // }
          // wx.shareFileMessage({
          //   filePath: res.tempFilePaths[0],
          //   success() {
          //     console.log('分享成功');

          //   },
          //   fail: console.error,
          // })
          // console.log(res.tempFilePaths[0])
          const file = res.tempFilePaths[0]

          //更新头像
          this.$api.personal.uploadAvatar({
            userId: this.userId,
            file: file
          }).then(res => {
            this.$set(this, 'label', {
              ...this.label,
              avatar: file
            })
            console.log(res);
          })
            .catch(err => {
              console.log(err);

            })
        }
      });
    },
    getAvatar() {
      this.$api.personal.getUserAvatar(this.userId).then(res => {
        console.log(res);
        this.$set(this, 'label', {
          ...this.label,
          avatar: res.data !== '/avatars/' ? this.$request.baseUrl + res.data : this.$request.baseUrl + "/avatars/defaultAvatar.jpg"
        })
      })
        .catch(err => {
          console.log(err);

        })
      // this.$set(this.label,'avatar',this.$api.personal.getUserAvatar(this.userId    ))
      // console.log(this.label.avatar);

    },
    onGenderChange(e) {
      this.form.gender = this.genders[e.detail.value].value; // 更新性别
      this.findGender()
    },
    // onBirthdayChange(e) {
    //     this.birthday = e.detail.value; // 更新生日
    // },
    getInfo() {
      this.$api.personal.getUserInfo(this.userId).then(res => {
        console.log(res);
        this.$set(this, 'form', {
          signature: res.data.signature,
          userName: res.data.userName,
          phone: res.data.phone,
          gender: res.data.gender
        })
        this.findGender()
        // this.$set(this.label,'avatar')
      })
        .catch(err => {
          console.log(err);
        })
    },
    findGender() {
      console.log(this.form);

      const item = this.genders.find(item => item.value == this.form.gender)
      console.log(item.label);

      this.$set(this.label, 'gender', item.label)
      console.log(this.label);

    },
    saveInfo() {
      this.$refs.uForm.validate().then(res => {
        uni.$u.toast('校验通过')
      }).catch(errors => {
        uni.$u.toast('校验失败')
        return
      })


      this.$api.personal.changeInfo({
        ...this.form,
        userId: this.userId
      }).then(res => {
        console.log(res);
        uni.switchTab({
          url: "/pages/index/index"
        })
      })
        .catch(err => {
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
  width: 80vw;
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
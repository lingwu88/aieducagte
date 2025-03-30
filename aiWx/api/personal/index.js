import request from "../../tools/request";

export function wxLogin(params) {
  return new Promise((resolve, reject) => {
    // uni.showLoading({
    //   title:'加载中'
    // })
    wx.login({
      success(res) {
        console.log(res);

        if (res.code) {
          // console.log(res.code);

          resolve(res.code)
          // uni.showToast({
          //   title:'登录成功',
          //   icon:'none'
          // })
        } else {
          uni.showToast({
            title: res.errMsg,
            icon: 'none'
          })
          console.log('登录失败！' + res.errMsg)
          reject(res.errMsg)
        }
      }
    })
  })
}

//第一个是url，第二个是data，第三个是contentType，第四个是token
export function userLogin(data) {
  return request.post(
    `/api/user/login`,
    data,
    undefined,
    false
  )
}

export function getUserInfo(userId) {
  return request.get(
    `/api/user/info?userId=${userId}`
  )
}

export function uploadAvatar(data) {
  // return request.post(
  //   '/api/user/avatar',
  //   data
  // )
  console.log(data);

  return new Promise((resolve, reject) => {
    // uni.showLoading({
    //   title:'加载中'
    // })
    uni.uploadFile({
      url: request.baseUrl + '/api/user/avatar', //仅为示例，非真实的接口地址
      filePath: data.file,
      name: 'file',
      formData: {
        'userId': data.userId
      },
      header: {
        Authorization: request.access_token
      },
      success: (uploadFileRes) => {
        console.log(uploadFileRes.data);
        resolve(uploadFileRes)
      },
      fail(err) {
        console.log(err);

      }
    });
  })
}

//修改信息
export function changeInfo(data) {
  return request.post(
    '/api/user/modifyInfo',
    data
  )
}

//获取头像
export function getUserAvatar(userId) {
  return request.get(
    `/api/user/getAvatar?userId=${userId}`,
  )
}

export function logout(data) {
  return request.post(
    '/api/user/logout',
    data
  )
}

//获取个人帖子
export function myArticleList(userId) {
  return request.get(
    `/api/square/queryMyArticleList?userId=${userId}`,
  )
}
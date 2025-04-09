// const baseUrl = "http://120.26.132.46:8091"
const baseUrl = 'http://120.26.132.46:8091'
const timeout = 50000
const access_token = uni.getStorageSync('accessToken')
// const baseUrlAi =  'http://t6emjh.natappfree.cc'

// Token 管理器
// const tokenManager = {
//   currentToken: uni.getStorageSync('accessToken'),
//   pendingRequests: [],

//   // 更新 token
//   updateToken(newToken) {
//     this.currentToken = newToken;
//     uni.setStorageSync('accessToken', newToken);
//     // 重试所有等待中的请求
//     this.retryPendingRequests();
//   },

//   // 获取当前 token
//   getToken() {
//     return this.currentToken;
//   },

//   // 添加待重试请求
//   addPendingRequest(requestConfig) {
//     this.pendingRequests.push(requestConfig);
//   },

//   // 重试所有等待中的请求
//   retryPendingRequests() {
//     const requests = [...this.pendingRequests];
//     this.pendingRequests = [];
//     requests.forEach(config => {
//       request(config.url, config.params, config.data, config.method, config.contentType, config.token, ...config.args);
//     });
//   }
// };

function post(url, data, contentType, token = true, ...args) {
  return request(baseUrl + url, undefined, data, 'POST', contentType, token, ...args)
}

function postParams(url, params, contentType, token) {
  console.log(params);

  return request(baseUrl + url, params, undefined, 'POST', contentType, token)
}

function get(url, contentType, token = true, ...args) {
  return request(baseUrl + url, undefined, undefined, "GET", contentType, token, ...args)
}

function postFile(url, data, contentType, token, responseType) {
  return requestPostFile(baseUrl + url, data, undefined, contentType, token, responseType)
}

function request(url, params = {}, data = {}, method = "POST", contentType = "application/json", token, ...args) {
  return new Promise((resolve, reject) => {
    uni.showLoading({
      title: "加载中"
    })

    const requestConfig = {
      url,
      method,
      data,
      params,
      timeout,
      header: {
        Authorization: token ? uni.getStorageSync('accessToken') : '',
        contentType,
      },
      ...args,
      success(res) {
        uni.hideLoading()
        console.log(res)

        // 检查并更新token
        if (res?.header?.Authorization) {
          console.log('有新token', res.header.Authorization);
          tokenManager.updateToken(res.header.Authorization);
        }

        if (res.statusCode === 200 && res?.data.code === 200) {
          resolve(res.data)
        }
        else if (res.statusCode === 200 && res.data === '') {
          resolve(res)
        }
        // token 过期或无效
        else if (res.statusCode === 401 || res?.code === 2002 || res?.code === 2001) {
          uni.showToast({
            title: '登录已过期，请重新登录',
            icon: 'none'
          })
          uni.navigateTo({
            url: '/pages/login/login',
            fail: () => {
              uni.redirectTo({
                url: '/pages/login/login' // 错误页面的路径
              });
            }
          })
        }
        //如果响应失败
        else if (res.statusCode != 200) {
          uni.showToast({
            title: res.data.info ? res.data.info : '系统繁忙',
            icon: 'error'
          })
          reject(res)
        }
        //响应成功，但状态码非200
        else {
          uni.showToast({
            title: res.data.info ? res.data.info : '系统繁忙',
            icon: 'error'
          })
          reject(res.data.info)
        }
      },
      fail(err) {
        uni.hideLoading()
        uni.showToast({
          title: err.errMsg,
          icon: "none"
        })
        reject(err)
        console.log(err);
      }
    }

    uni.request(requestConfig);
  })
}

function requestPostFile(url, data = {}, method = "POST", contentType = "application/json", token = true, responseType) {
  // console.log(responseType);
  return new Promise((resolve, reject) => {


    uni.request({
      url,
      method,
      data,
      timeout,
      responseType: 'arraybuffer',
      header: {
        Authorization: token ? uni.getStorageSync('accessToken') : '',
        // userId: uni.getStorageSync('userId'),
        contentType,
      },
      // responseType:'blob'
      // success(res){
      //   console.log('成功返回');

      //   console.log(res)
      //   resolve(res)
      //   // if(res.statusCode == 500){
      //   //   uni.showToast({
      //   //     title:'系统繁忙',
      //   //     icon:'error'
      //   //   })
      //   // }
      //   // if(res.statusCode == 200){
      //   //   resolve(res.data)
      //   // }

      // },
      // fail(err){
      //   uni.showToast({
      //     title:err.errMsg,
      //     icon:"none"
      //   })
      //   reject(err)
      //   console.log(err);
      // }
    }).then(res => {
      console.log(res);
      resolve(res)
    })
      .catch(err => {
        console.log(err);
        reject(err)
      })
  })
}

function requestUploadAvatar(data) {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: baseUrl + '/api/user/avatar', //仅为示例，非真实的接口地址
      filePath: data.file,
      name: 'file',
      formData: {
        'userId': data.userId
      },
      header: {
        Authorization: uni.getStorageSync('accessToken')
      },
      success: (uploadFileRes) => {
        console.log(uploadFileRes.data);
        resolve(uploadFileRes)
      },
      fail(err) {
        console.log(err);
        reject(err)
      }
    });
  })
}

function requestUploadForm(data) {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: baseUrl + '/api/square/postArticle', //仅为示例，非真实的接口地址
      filePath: "123",
      name: "123",
      formData: data,
      header: {
        Authorization: uni.getStorageSync('accessToken')
      },
      success: (res) => {
        console.log(res);
        resolve(res)
      },
      fail(err) {
        console.log(err);
        reject(err)
      }
    });
  })
}

export default {
  baseUrl,
  access_token,
  post,
  postParams,
  get,
  postFile,
  requestUploadAvatar,
  requestUploadForm
}
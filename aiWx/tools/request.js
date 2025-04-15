// const baseUrl = "http://120.26.132.46:8091"
const baseUrl = 'http://120.26.132.46:8091'
const timeout = 50000
const access_token = uni.getStorageSync('accessToken')
// const baseUrlAi =  'http://t6emjh.natappfree.cc'

function post(url, data, contentType, token, ...args) {
  return request(baseUrl + url, undefined, data, 'POST', contentType, token, ...args)
}

function postParams(url, params, contentType, token) {
  console.log(params);

  return request(baseUrl + url, params, undefined, 'POST', contentType, token)
}

function get(url, contentType, token, ...args) {
  return request(baseUrl + url, undefined, undefined, "GET", contentType, undefined, args)
}

function postFile(url, data, contentType, token, responseType) {
  return requestPostFile(baseUrl + url, data, undefined, contentType, token, responseType)
}

function request(url, params = {}, data = {}, method = "POST", contentType = "application/json", token = true, ...args) {
  return new Promise((resolve, reject) => {
    console.log(args.map(item => { console.log(...item) }));
    uni.showLoading({
      title: "加载中"
    })
    uni.request({
      url,
      method,
      data,
      params,
      timeout,
      header: {
        Authorization: token ? uni.getStorageSync('accessToken') : '',
        // userId: uni.getStorageSync('userId'),
        contentType,
      },
      ...args,
      success(res) {
        uni.hideLoading()
        console.log(res)
        if (res.statusCode === 200 && res?.data.code === 200) {
          resolve(res.data)
        }
        else if (res.statusCode === 200 && res.data === '') {
          resolve(res)
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
    })
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

export default {
  baseUrl,
  access_token,
  post,
  postParams,
  get,
  postFile
}
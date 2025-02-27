const baseUrl = " http://ag4ytv.natappfree.cc"
const timeout = 5000
const access_token = uni.getStorageSync('accessToken')

function post(url,data,contentType,token){
  return request(baseUrl+url,undefined,data,'POST',contentType,token)
}

function postParams(url,params,contentType,token){
  console.log(params);
  
  return request(baseUrl+url,params,undefined,'POST',contentType,token)
}

function get(url,contentType,token,...args){
  return request(baseUrl+url,undefined,undefined,"GET",contentType,token,...args)
}

function request(url,params={},data={},method = "POST",contentType="application/json",token=true,...args){
  return new Promise((resolve,reject)=>{
    console.log(...args);
    
    uni.request({
      url,
      method,
      data,
      params,
      timeout,
      header:{
        Authorization:token?access_token:'',
        'content-type':contentType,
      },
      ...args,
      success(res){
        console.log(res)
        if(res.statusCode == 500){
          uni.showToast({
            title:'系统繁忙',
            icon:'error'
          })
        }
        if(res.statusCode == 200){
          resolve(res.data)
        }
   
      },
      fail(err){
        uni.showToast({
          title:err.errMsg,
          icon:"none"
        })
        reject(err)
        console.log(err);
      }
    })
  })
}

export default {
  baseUrl,
  access_token,
  post,
  postParams,
  get
}
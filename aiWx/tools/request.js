const baseUrl = "http://5u6m6c.natappfree.cc"
const timeout = 5000
const access_token = uni.getStorageSync('accessToken')

function post(url,data,contentType,token,...args){
  return request(baseUrl+url,undefined,data,'POST',contentType,token,...args)
}

function postParams(url,params,contentType,token){
  console.log(params);
  
  return request(baseUrl+url,params,undefined,'POST',contentType,token)
}

function get(url,contentType,token,...args){
  return request(baseUrl+url,undefined,undefined,"GET",contentType,token,args)
}

function postFile(url,data,contentType,token,responseType){
  return requestPostFile(baseUrl+url,data,undefined,contentType,token,responseType)
}

function request(url,params={},data={},method = "POST",contentType="application/json",token=true,...args){
  return new Promise((resolve,reject)=>{
    console.log(args.map(item=>{console.log(...item)}));
    
    uni.request({
      url,
      method,
      data,
      params,
      timeout,
      header:{
        Authorization:token?access_token:'',
        contentType,
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

function requestPostFile(url,data={},method = "POST",contentType="application/json",token=true,responseType){
  // console.log(responseType);
  return new Promise((resolve,reject)=>{

    
    uni.request({
      url,
      method,
      data,
      timeout,
      responseType: 'arraybuffer',
      header:{
        Authorization:token?access_token:'',
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
    }).then(res=>{
      console.log(res);
      resolve(res)
    })
    .catch(err=>{
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
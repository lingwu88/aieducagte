import request from "../../tools/request";
import * as TextEncoding from 'text-encoding-shim'

//通用ai
export function generalAi(data) {
  return request.post(
    '/api/ai/general-learning-plan',
    data
  )
}

//通用ai结果收藏
export function saveGeneral(data){
  return request.post(
    '/api/ai/save-plan',
    data
  )
}

//取消收藏
export function cancelSave(data){
  return request.post(
    '/api/ai/cancel-plan',
    data
  )
}

//获取会话id
export function getSessionId({userId,type}) {
  return request.get(
    `/api/ai/get-conversaion-id?userId=${userId}&type=${type}`
  )
}

//结束sse会话
export function endSSE(data) {
  return request.get(
    `/api/ai/closeSse?userId=${data}`,
  )
}

//解码二进制流数据
function decode(data) {
  console.log(data);
  const arrayBuffer = data;
  const uint8Array = new Uint8Array(arrayBuffer);
  return new TextEncoding.TextDecoder('utf-8').decode(uint8Array);
  // 根据协议对数据进行解析，省略...
  // 注意数据可能是不连续的，需要通过 buffer 进行拼接
}

//创建sse会话
export function createSSE(url, onData, onError = null, onComplete = null) {
  //维护的定时器id
  let timeoutId = null
  //五秒
  const TIMEOUT_DURATION = 100000

  // console.log(onComplete);


  function resetTimeout() {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      console.log('超时,无数据,主动断开连接');
      // requestTask.abort()   //终止SSE
      onComplete(uni.getStorageSync('userId'))
    }, TIMEOUT_DURATION)
  }

  // 在 complete 回调中清理定时器
  function handleComplete() {
    console.log('结束了');
    
    if (timeoutId) clearTimeout(timeoutId);
    if (onComplete) onComplete();
  }


  function onChunkReceived(res) {
    onData(decode(res.data))
    resetTimeout()
  }

  function onHeadersReceived(res) {
    console.log('onHeadersReceived', res)
  }

  const requestTask = uni.request({
    url: request.baseUrl + url,
    method: 'GET',
    header: {
      Accept: 'text/event-stream', // 确保服务器知道我们期望的是流式响应
      Authorization: uni.getStorageSync('accessToken'),
      // ...其他参数
    },
    enableChunked: true, // onChunkReceived, 否则走success()
    responseType: 'arraybuffer',
    success: (res) => {
      console.log('Data received:', res.data) // 开启 enableChunked 时仅最后一次会走这个
    },
    fail: (error) => { // 错误处理
      if (onError) {
        onError(error)
      }
      console.error('SSE failed:', error)
    },
    complete: () => { // 完成接收
      console.log('完成接收');

      handleComplete()

      if (onComplete) {
        onComplete()
      }

      //解绑
      if (onHeadersReceived) {
        requestTask?.offHeadersReceived(onHeadersReceived)
      }
      if (onChunkReceived) {
        // @ts-expect-error uni-app types lost
        requestTask?.offChunkReceived(onChunkReceived)
      }
    },
  })
  if (onHeadersReceived) {
    requestTask.onHeadersReceived(onHeadersReceived)
  }
  if (onChunkReceived) {
    // @ts-expect-error uni-app types lost
    requestTask.onChunkReceived(onChunkReceived) // 注册数据接收响应函数
  }
  return requestTask // 外部可通过 requestTask.abort(); 主动结束
}


//学习规划
export function learnSchedule(data) {
  return request.post(
    '/api/ai/daily-schedule',
    data
  )
}

//产生学习路径
export function learnPath(data) {
  return request.post(
    '/api/ai/learning-path',
    data
  )
}


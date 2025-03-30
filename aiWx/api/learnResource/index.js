import request from "../../tools/request";

//ai变文接口
export function convert(data){
  return request.post(
    '/api/ai/change-text',
    data
  )
}

export function getConvert(snowId){
  return request.get(
    `/api/ai/get-text?snowId=${snowId}`,
  )
}

export function exportFile(data){
  return request.postFile(
    '/api/ai/change-format',
    data,
    undefined,
    undefined,
    'blob'
  )
}

//获取课程库
export function getCourse({coursewareId,limit}){
  return request.get(
    `/api/resource/getCoursewareList?coursewareId=${coursewareId}&limit=${limit}`
  )
}

//获取资源
export function getResource({userId,limit,resourceId}){
  return request.get(
    `/api/resource/getResourceList?userId=${userId}&limit=${limit}&resourceId=${resourceId}`
  )
}

//保存资源
// export function saveResource({}){
//   return request.get(
//     '/api/resource/saveResource'
//   )
// }


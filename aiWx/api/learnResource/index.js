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
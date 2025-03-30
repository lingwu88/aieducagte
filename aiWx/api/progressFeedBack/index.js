import request from "../../tools/request";

//获取综合评估
export function getEvalution(userId){
  return request.get(
    `/api/user/getEvalution?userId=${userId}`
  )
}

//获取时间
export function getTime({userId,type}){
  return request.get(
    `/api/user/getUserStudyTime?userId=${userId}&type=${type}`
  )
}

//上传时间
export function saveTime(data){
  return request.post(
    '/api/user/saveTime',
    data
  )
}
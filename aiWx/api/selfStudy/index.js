import request from "../../tools/request";

//课后复习
export function reviewAi(data){
  return request.post('/api/ai/review',data)
}
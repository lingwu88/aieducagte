import request from "../../tools/request";

export function generalAi(data){
  return request.post(
    '/api/ai/general-learning-plan',
    data
  )
}
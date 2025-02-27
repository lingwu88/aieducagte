import request from "../../tools/request";

export function pushlishArticle({userId,title,content}){
  return request.post(
    '/api/square/postArticle?userId='+userId+'&title='+title+'&content='+content 
  )
}
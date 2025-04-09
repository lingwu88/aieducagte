import request from "../../tools/request";

//获取文章列表
export function getArticleList({ articleId, limit, userId, orderMode, type = 0 }) {
  return request.get(
    '/api/square/getArticleList?limit=' + limit + '&userId=' + userId + '&articleId=' + articleId + '&orderMode=' + orderMode + "&type=" + type
  )
}

export function getComment(articleId) {
  return request.get(`/api/square/getCommentList?articleId=${articleId}`)
}

//获取收藏文章
export function getStarArticle(userId) {
  return request.get(
    `/api/user/getCollectArticleList?userId=${userId}`,
  )
}

//控制点赞
export function approve(data) {
  return request.post(
    '/api/square/approveArticle',
    data
  )
}

//评论
export function comment(data) {
  return request.post(
    '/api/square/postComment',
    data
  )
}

//删除评论
export function delComment(data) {
  return request.post(
    '/api/square/deleteComment',
    daat
  )
}

//发表文章
export function pushlishArticle(data) {
  // return request.post(
  //   '/api/square/postArticle',
  //   data,
  //   'application/x-www-form-urlencoded'
  // )
  return request.requestUploadForm(data)
}

//删除文章
export function delArticle(data) {
  return request.post(
    '/api/square/deleteArticle',
    data
  )
}

//搜索文章
export function searchArticle({ userId, content }) {
  const url = decodeURI(`/api/square/queryArticleByName?content=${content}&userId=${userId}`)
  console.log(url);

  return request.get(
    url,
    'application/x-www-form-urlencoded;charset=utf-8'
  )
}

//id获取文章
export function queryIdArticle({ userId, articleId }) {
  return request.get(
    `/api/square/queryArticle?userId=${userId}&articleId=${articleId}`
  )
}

//删除文章
export function deleteArticle(data) {
  return request.post(
    '/api/square/deleteArticle',
    data
  )
}

//收藏文章
export function starArticle(data) {
  return request.post(
    '/api/user/collectArticle',
    data
  )
}

//取消收藏
export function cancelStar(data) {
  return request.post(
    '/api/user/cancelCollectArticle',
    data
  )
}
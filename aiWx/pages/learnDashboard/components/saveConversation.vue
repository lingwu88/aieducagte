<script>
// 封装保存对话的函数
export const saveConversation = (inputText) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'http://fugui.mynatapp.cc/api/save-conversation', // 后端 API 地址
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        userid: 'user_12345', // 固定用户ID，可改为参数传入
        message: inputText    // 使用传入的 inputText
      },
      success: (res) => {
        if (res.statusCode === 200) {
          console.log('200');
          resolve(res.data); // 成功时返回响应数据
        } else {
          console.log('100');
          reject(new Error(`状态码: ${res.statusCode}`)); // 非 200 状态码
        }
      },
      fail: (err) => {
        console.log('请求失败:', err);
        reject(err); // 请求失败时抛出错误
      }
    });
  });
};

export default {
  name: 'SaveConversation'
};
</script>

<template>
  <!-- 空模板，因为这是一个工具组件 -->
  <div></div>
</template>

<style scoped>
/* 无需样式，因为这是一个工具组件 */
</style>
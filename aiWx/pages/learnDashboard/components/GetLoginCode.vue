<script>
// 封装获取微信登录凭证的函数
export const getLoginCode = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: (loginRes) => {
        const code = loginRes.code; // 获取用户 code 令牌
        if (code) {
          console.log('获取登录 code 成功:', code);
          resolve(code); // 成功时返回 code
        } else {
          console.log('未获取到 code');
          reject(new Error('登录失败，未获取到 code')); // 未返回 code
        }
      },
      fail: (err) => {
        console.log('wx.login 调用失败:', err);
        reject(err); // 请求失败时抛出错误
      }
    });
  });
};

export default {
  name: 'GetLoginCode'
};
</script>

<template>
  <!-- 空模板，因为这是一个工具组件 -->
  <div></div>
</template>

<style scoped>
/* 无需样式，因为这是一个工具组件 */
</style>
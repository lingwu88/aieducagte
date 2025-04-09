<script>
// 封装保存对话的函数
export const saveConversation = (inputText) => {
	return new Promise((resolve, reject) => {
		// 第一步：获取微信登录凭证 (code)
		wx.login({
			success: (loginRes) => {
				const code = loginRes.code; // 获取用户 code 令牌
				if (code) {
					console.log('获取登录 code 成功:', code);

					// 第二步：使用 code 作为 userid 保存对话
					wx.request({
						url: 'http://fugui.mynatapp.cc/api/save-conversation', // 后端 API 地址
						method: 'POST',
						header: {
							'content-type': 'application/json'
						},
						data: {
							userCode: code, // 将 code 赋值给 userid
							message: inputText // 使用传入的 inputText
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
							reject(err); // 保存请求失败时抛出错误
						}
					});
				} else {
					console.log('未获取到 code');
					reject(new Error('登录失败，未获取到 code')); // 未返回 code
				}
			},
			fail: (err) => {
				console.log('wx.login 调用失败:', err);
				reject(err); // 获取 code 失败时抛出错误
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

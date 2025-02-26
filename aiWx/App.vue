<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "uview-ui/index.scss";
</style>

<script>
export default {
	//首次打开时触发，且只触发一次
	onLaunch: function () {
		wx.getSetting({
			withSubscriptions:true,
			success: (result) => {
				// console.log(result);
				//用户信息
				if (result.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              // console.log(res.userInfo)
            }
          })
        }
				else{
					wx.authorize({
					scope: 'scope.userInfo',
					success () {
						// 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
						wx.startRecord()
						}
					})
				}
				//模糊地理位置
				if (result.authSetting['scope.userFuzzyLocation']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              // console.log(res)
            }
          })
        }
				else{
					wx.authorize({
					scope: 'scope.userFuzzyLocation',
					success () {
						// 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
						wx.startRecord()
						}
					})
				}
			},
			fail: () => {},
			complete: () => {}
		});
		console.log('App Launch')
	},
	onShow: function () {
		console.log('App Show')
	},
	onHide: function () {
		console.log('App Hide')
	}
}
</script>

<style>
/*每个页面公共css */
.container{
	box-sizing: border-box;
	height: 100vh;
	background-color: #ffffff;
	font-size:30rpx;
	width: 100vw;
}
</style>

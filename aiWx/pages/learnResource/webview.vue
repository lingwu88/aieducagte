<!-- version:1.0.0.2 -->
<template>
    <view class="webview-container">
        <web-view :src="decodedUrl" class="webview" @error="handleWebviewError" @load="handleWebviewLoad"></web-view>
    </view>
</template>
<script>
export default {
    // 显式定义 url 作为 prop
    props: {
        url: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            pageLoaded: false,
            pageError: false,
            isUsingVPN: false
        };
    },
    mounted(){
			this.checkUserId()
		},
    // 使用计算属性来解码 url
    computed: {
        decodedUrl() {
            return decodeURIComponent(this.url);
        }
    },
    onLoad(options) {
        console.log('webview onLoad, options:', options);
        // 不再需要手动设置 this.url，因为它已通过 prop 提供
        console.log('当前页面栈:', getCurrentPages());
        this.envTest();
    },
    onUnload() {
        console.log('webview onUnload, 当前页面栈:', getCurrentPages());
    },
    methods: {
        goBack() {
            console.log('尝试返回, 当前页面栈:', getCurrentPages());
            uni.navigateBack({
                delta: 1
            });
        },
        envTest(interval = 100, timeout = 4500) {
            const eventChannel = this.getOpenerEventChannel();
            const startTime = Date.now();

            const poll = async () => {
                if (!this.checkInWebView()) {
                    return;
                }
                if (this.pageError == true) {
                    setTimeout(() => {
                        this.goBack();
                        this.returnStatus('ERROR');
                    }, 1000);
                    return;
                }

                if (Date.now() - startTime >= timeout && this.pageLoaded == false) {
                    let Vresult = await this.checkVPN();
                    setTimeout(() => {
                        let Status = 'TIMEOUT';
                        if (this.isUsingVPN) {
                            Status += 'INVPN';
                        }
                        this.goBack();
                        this.returnStatus(Status, Vresult);
                    }, 1000);
                    return;
                }

                setTimeout(poll, interval);
            };

            poll();
        },
        returnStatus(status, ...args) {
            const eventChannel = this.getOpenerEventChannel();
            if (typeof status !== 'string') {
                throw new Error('status must be a string');
            }
            if (this.checkInWebView()) {
                eventChannel.emit('returnData', { status: status, ...args });
            }
        },
        checkInWebView() {
            const pages = getCurrentPages();
            const currentPage = pages[pages.length - 1];

			return currentPage.options.url?true:false;
        },
        checkVPN() {
            return new Promise((resolve, reject) => {
                uni.request({
                    url: 'http://ip-api.com/json/?fields=status,message,country,isp,proxy',
                    success: (res) => {
                        console.log('IP 信息:', res.data);
                        if (res.data.status === 'success') {
                            this.isUsingVPN = res.data.proxy;
                            if (this.isUsingVPN) {
                                console.log('检测到用户使用 VPN');
                                this.returnStatus('VPNDetected');
                            } else {
                                console.log('未检测到 VPN');
                            }
                            resolve(res.data);
                        } else {
                            this.isUsingVPN = false;
                            const error = new Error(`IP查询失败: ${res.data.message}`);
                            resolve(error);
                        }
                    },
                    fail: (err) => {
                        const error = new Error(`请求失败: ${err.errMsg}`);
                        this.isUsingVPN = false;
                        resolve(error);
                    }
                });
            });
        },
        handleWebviewError(event) {
            this.pageError = true;
            const errMsg = event.detail.errMsg || '未知错误';
            let toastMsg = '页面加载失败，请检查网络或联系开发者';
            if (errMsg.includes('network')) {
                toastMsg = '网络连接失败，请检查网络设置';
            } else if (errMsg.includes('url')) {
                toastMsg = 'URL 无效，请联系开发者维护';
            }
        },
        handleWebviewLoad(event) {
            this.pageLoaded = true;
            console.log('web-view 加载成功:', event.detail);
        }
    }
};
</script>

<style lang="scss" scoped>
.webview-container {
	height: 100vh;
	position: relative;
}

.webview {
	width: 100%;
	height: 100%;
}
</style>

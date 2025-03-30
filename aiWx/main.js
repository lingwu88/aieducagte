import App from './App'
import { initHighLight } from './tools/markdownUtils';

// #ifndef VUE3
import Vue from 'vue'
import uView from "uview-ui";
import api from './api'
import request  from './tools/request';
Vue.use(uView);
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
//全局混入
Vue.mixin({
  methods: {
    checkUserId() {
      const userId = uni.getStorageSync('userId');
      if (!userId) {
        uni.navigateTo({ url: '/pages/login/login' });
        return false;
      }
      return true;
    }
  }
})
Vue.prototype.$api = api
Vue.prototype.$request = request
app.$mount()

// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif

//初始化高亮md设置
initHighLight()
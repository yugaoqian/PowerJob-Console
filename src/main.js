import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import { Message } from 'element-ui';
import './styles.scss'
import './plugins/element.js'
import i18n from './i18n/i18n';

// 引入表单校验
import rules from "./utils/rules";
// axios 负责统一拦截处理 ResultDTO，fly 负责处理不需要拦截的请求
import axios from 'axios';
import flyio from 'flyio';
import router from "./router";
import store from "./store";
import common from "./common";

// 引入jsencrypt
import JSEncrypt from 'jsencrypt/bin/jsencrypt.min.js';

Vue.use(ElementUI);
// let baseURL = "http://139.224.83.134:7700";
let baseURL = process.env.VUE_APP_BASE_URL;

let timeout = 10000;

Vue.prototype.common = common;
/* ******* axios config ******* */
Vue.prototype.axios = axios;
axios.defaults.baseURL = baseURL;
axios.defaults.timeout = timeout;
/* ******* fly.io config ******* */
Vue.prototype.flyio = flyio;
flyio.config.baseURL = baseURL;
flyio.config.timeout = timeout;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app');

//请求发送拦截，没有 appId 要求重新 "登录"
axios.interceptors.request.use((request) => {

  let url = request.url;
  let isListAppInfo = url.search("/appInfo/list") !== -1;
  let isAppRegister = url.search("/appInfo/save") !== -1;
  let isUserRegister = url.search("/user/save") !== -1;
  let isAssertAppInfo = url.search("/appInfo/assert") !== -1;

  if (isListAppInfo || isAppRegister || isUserRegister || isAssertAppInfo) {
    return request;
  }

  let appId = store.state.appInfo.id;
  if (appId === undefined || appId === null) {
    router.push("/");
    // remove no appId warn due to too much user report this is a bug...
    return Promise.reject();
  }
  return request;

}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// 请求返回拦截，封装公共处理逻辑
axios.interceptors.response.use((response) => {
  if (response.data.success === true) {
    return response.data.data;
  }
  Message.warning("ERROR：" + response.data.message);
  return Promise.reject(response.data.msg);
}, (error) => {
  Message.error(error.toString());
  return Promise.reject(error);
});

Vue.prototype.$getRsaCode = function(obj) {
	let encrypt = new JSEncrypt();
	var publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCGgI1dx/sirWCSkP2Cgc837HJU68oY/7MTN8xMN71ynOf89xiUxAJM5HYNge2XZBNKj0qQz9VTItaseOzTdm9BsVopjEZjEJs93Krtv3hfkbvfj0VkEsX808w4JaAlmvGPlVi2lhueRLdcWlTpjw/J4cYX+qleN+O4q/z1fnyZeQIDAQAB';
	encrypt.setPublicKey(publicKey);
	return encrypt.encrypt(obj);
};

// 定义表单校验全局调用
Vue.prototype.$rules = rules;

export default baseURL;

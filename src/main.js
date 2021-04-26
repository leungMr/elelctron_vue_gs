import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue'
import axios from 'axios'
import {message} from "ant-design-vue"
axios.defaults.baseURL = 'http://localhost:3000'
Vue.prototype.$http = axios
Vue.prototype.$message = message
Vue.use(Antd)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

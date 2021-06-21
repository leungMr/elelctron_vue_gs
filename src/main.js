import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue'
import axios from 'axios'
import {message} from "ant-design-vue"
import animated from 'animate.css'

const {ipcRenderer} = require("electron")
axios.defaults.baseURL = 'http://localhost:3000'
Vue.prototype.$electron = ipcRenderer
Vue.prototype.$http = axios
Vue.prototype.$message = message
Vue.prototype.$publicConfig = config
Vue.use(Antd)
Vue.use(animated)
Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)
// 解决重复点击同一个路由报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/data',
    component: () => import(/* webpackChunkName: "about" */ '../views/DataManage')
  },
  {
    path: '/marking',
    component: () => import(/* webpackChunkName: "about" */ '../views/Marking')
  },
  {
    path: '/markingInfo',
    component: () => import(/* webpackChunkName: "about" */ '../views/MarkingInfo')
  }
]

const router = new VueRouter({
  routes
})

export default router

import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

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
  }
]

const router = new VueRouter({
  routes
})

export default router

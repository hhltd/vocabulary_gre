import Vue from 'vue'
import VueRouter from 'vue-router'

//引入组件 懒加载
const Home = () => import('../views/home/Home')
const Learn = () => import('../views/learn/Learn')
const Revise = () => import('../views/revise/Revise')

//安装插件
Vue.use(VueRouter)

//创建路由对象
const routes = [
  {
    path: '',
    redirect: '/home'
  },

  {
    path: '/home',
    component: Home
  },

  {
    path: '/learn',
    component: Learn
  },

  {
    path: '/revise',
    component: Revise
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

//导出router
export default router

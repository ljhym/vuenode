import Vue from 'vue'
import VueRouter from 'vue-router'

// const Login = () => import(/* webpackChunKName: "login_login" */ '../components/Login.vue')
// const home = () => import(/* webpackChunKName: "login_login" */ '../components/home.vue')
import Login from '../components/Login.vue'
import home from '../components/home.vue'
// import Welcome from '../components/Welcome.vue'

// const Users = () => import(/* webpackChunKName: "users" */ '../components/user/Users.vue')
import Users from '../components/user/Users.vue'

// const Rights = () => import(/* webpackChunKName: "Rights_Roles" */ '../components/power/Rights.vue')
// const Roles = () => import(/* webpackChunKName: "Rights_Roles" */ '../components/power/Roles.vue')
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'

// const Cate = () => import(/* webpackChunKName: "f4" */ '../components/power/Rights.vue')
// const Params = () => import(/* webpackChunKName: "f4" */ '../components/goods/Cate.vue')
// const List = () => import(/* webpackChunKName: "f4" */ '../components/goods/List.vue')
// const Add = () => import(/* webpackChunKName: "f4" */ '../components/goods/Add.vue')
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import List from '../components/goods/List.vue'
import Add from '../components/goods/Add.vue'

// const Order = () => import(/* webpackChunKName: "Order_Report" */ '../components/order/Order.vue')
// const Report = () => import(/* webpackChunKName: "Order_Report" */ '../components/report/Report.vue')
import Order from '../components/order/Order.vue'
import Report from '../components/report/Report.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', redirect: '/users' },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: List },
      { path: '/goods/add', component: Add },
      { path: '/order', component: Order },
      { path: '/report', component: Report }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenstr = window.sessionStorage.getItem('token')
  if (!tokenstr) return next('/login')
  next()
})

export default router

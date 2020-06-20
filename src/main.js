import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'

// 删除导入element-ui
// import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器样式
// 删除样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// 导入富文本编辑器样式
// 加载进度条
import NProgress from 'nprogress'
// 删除样式
// import 'nprogress/nprogress.css'
import router from './router'
Vue.prototype.$http = axios

axios.defaults.baseURL = 'http://127.0.0.1:80'

// 拦截所有请求
axios.interceptors.request.use(config => {
  // 显示进度条
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(config => {
  NProgress.done()
  // 隐藏进度条
  return config
})

// axios.defaults.baseURL = 'http://192.168.43.31:8888/'
Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)
// 导入富文本编辑器,注册为全局组件
Vue.use(VueQuillEditor)
// 创建全局过滤器
Vue.filter('dateFormat', function (orignVal) {
  const dt = new Date(orignVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

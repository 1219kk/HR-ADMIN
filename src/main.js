import Vue from 'vue'
// css样式 不同浏览器标签渲染一致
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 国际化
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css 样式

import App from './App'
import store from './store'
import router from './router' // 路由

import '@/icons' // icon svg
import '@/permission' // permission control 权限控制
// import '@/directives'
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 * 有接口用不上假数据
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

// 控制台生产提示
Vue.config.productionTip = false

// 批量导入自定义指令 作用可以简化指令的写法
// 可以把所有的按需导出全部导入到一个对象 对象的名字叫directives
import * as obj from '@/directives'
Object.keys(obj).forEach(item => {
  Vue.directive(item, obj[item])
})

import components from './components'
Vue.use(components)
// 初始化
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

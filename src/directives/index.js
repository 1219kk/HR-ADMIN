// import Vue from 'vue'
// 自定义指令
// 封装一个DOM操作供一堆组件使用
// Vue.directive('imgerror', {
//
// inserted (el, binding) {
//   // el.src = binding.value
//   el.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
// },
// 数据更新的时候
//   update (el, binding) {
//     // el.src = binding.value
//     el.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
//   }
// })
export const imgerror = {
  update (el, binding) {
    //     // el.src = binding.value
    // el.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
    el.onerror = function () {
      this.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
    }
  }
}

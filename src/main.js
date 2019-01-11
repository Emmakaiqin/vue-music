// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import FastClick from 'fastclick'
import './assets/css/index.styl'
Vue.config.productionTip = false
FastClick.attach(document.body)
/* eslint-disable  */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router,
})

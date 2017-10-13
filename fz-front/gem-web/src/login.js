import Vue from 'vue'
import VueResource from 'vue-resource'
// 公用脚本
import common from './assets/js/common'
// 使用element
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-default/index.css'
require('element-ui/lib/theme-default/index.css');
// 项目模块
import login from './components/login/login.vue'
require('./assets/sass/login.scss');
Vue.use(VueResource);
Vue.use(ElementUI);

common.init();
/*
 * eslint-disable no-new
 * 新建实例在非路由应用的时候可以使用,加入路由就不需要使用实例
*/
new Vue({
  el: '#app',
  components: { 'login':login },
  ready:function () {

  }
});

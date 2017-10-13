import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
// 公用脚本
import common from './assets/js/common'
// 使用element
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-default/index.css'
require('element-ui/lib/theme-default/index.css');
require('./assets/sass/login.scss');
// 项目模块
import login from './components/login/login.vue'
import lookForPwd from './components/login/lookForPwd.vue'
import byMail from './components/login/byMail.vue'
import byPhone from './components/login/byPhone.vue'
import resetPwd from './components/login/resetPwd.vue'
import registerPhone from './components/register/registerPhone.vue'
import registerMail from './components/register/registerMail.vue'
import verifyMail from './components/register/verifyMail.vue'
import addDatas from './components/register/addDatas.vue'

Vue.use(VueResource);
Vue.use(VueRouter);
Vue.use(ElementUI);

common.init();
var router = new VueRouter({
  routes: [
    {
      path: '/',
      name: '/',
      component: login
    },
    {
      path: '/registerPhone',
      name: 'registerPhone',
      component: registerPhone
    },
    {
      path: '/registerMail',
      name: 'registerMail',
      component: registerMail
    },
    {
      path: '/verifyMail',
      name: 'verifyMail',
      component: verifyMail
    },
    {
      path: '/lookForPwd',
      name: 'lookForPwd',
      component: lookForPwd
    },
    {
      path: '/byMail',
      name: 'byMail',
      component: byMail
    },
    {
      path: '/byPhone',
      name: 'byPhone',
      component: byPhone
    },
    {
      path: '/resetPwd',
      name: 'resetPwd',
      component: resetPwd
    },
    {
      path: '/addDatas',
      name: 'addDatas',
      component: addDatas
    }
  ]
});
/*
 * eslint-disable no-new
 * 新建实例在非路由应用的时候可以使用,加入路由就不需要使用实例
*/
new Vue({
  el: '#app',
  router:router,
  // components: { 'login':login },
  ready:function () {

  }
});

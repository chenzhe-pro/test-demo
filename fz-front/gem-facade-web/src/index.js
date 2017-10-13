import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import Vuex from 'vuex'

// 公用脚本
import common from './assets/js/common'

// 使用element
import ElementUI from 'element-ui'
import NProgress from 'NProgress'
// import 'element-ui/lib/theme-default/index.css'
require('element-ui/lib/theme-default/index.css');
require('NProgress/nprogress.css');
require('./assets/js/jquery.jscrollpane.css');
require('./assets/sass/index.scss');
// 公用过滤器
import initFilter from './filter/commonFilter'
import mousewheel from './assets/js/jquery.mousewheel'
import divscroll from './assets/js/jquery.jscrollpane'
// 项目模块,供路由器调用
import loading from './components/common/loading.vue'
import initSet from './components/init/initSet.vue'
import departmentSet from './components/init/departmentSet.vue'
import hrDepartment from './components/department/department.vue'
import postReset from './components/postReset/post.vue'
import personSet from './components/personSet/personSet.vue'
import myTarget from './components/target/myTarget.vue'
import indicatorCom from './components/target/indicatorsCom.vue'
// import targetStystem from './components/target/targetStystem.vue'
import noticeManage from './components/notice/noticeManage.vue'
import checkManage from './components/check/checkManage.vue'
import task from './components/task/task.vue'
import index from './components/index/index.vue'
import dailySheet from './components/index/dailySheet.vue'
import employeeCheck from './components/index/employeeCheck.vue'
import monthlyPlan from './components/index/monthlyPlan.vue'
import todoTask from './components/index/todoTask.vue'
import strategy from './components/strategy/strategy.vue'
import plan from './components/strategy/plan.vue'
import examine from './components/examine/examine.vue'
import manage from './components/manage/manage.vue'
import homePage from './components/homePage/homePage.vue'

Vue.use(VueResource);
Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(ElementUI);

common.init();
initFilter();
// 全局拦截器
Vue.http.interceptors.push(function(request, next) {
  // 给get请求加上时间戳,防止ie的get请求缓存
  if(request.method=='GET')
  {
    request.params._timesnap_=new Date().getTime();
  }
  // continue to next interceptor
  next(function(response) {
    response=response.body;
    if(response&&response.code==='NO_LOGIN')
    {
      window.location.href='login.html';
    }
  });
});
var store = new Vuex.Store({
  state: {
    userInfo: {},
    uploadData: [],
    helpList:[],
    personId:'',
    createTime:'',
    unReadNum: '',
    year:'',
    text:''
  },
  mutations: {
    changePerson:function(state,data){
      state.personId=data;
    },
    changeDate:function (state,data) {
      state.createTime=data;
    },
    change:function (state,data) {
      state.userInfo=data;
    },
    changeUpload:function (state,data) {
      state.uploadData=data;
    },
    getHelp:function (state,data) {
      state.helpList=data;
    },
    setUnRead: function (state,data) {
      state.unReadNum=data;
    },
    setYear: function (state,data) {
      state.year=data;
    },
    setText: function (state,data) {
      state.text=data;
    },
  }
});
/*
 * eslint-disable no-new
 * 新建实例在非路由应用的时候可以使用,加入路由就不需要使用实例
 */
var router = new VueRouter({
  routes: [
    {
      path: '/',
      name: '/',
      component: loading
    },
    {
      path: '/initSet',
      name: 'initSet',
      component: initSet
    },
    {
      path: '/index',
      name: 'index',
      component: index
    },
    {
      path: '/checkManage',
      name: 'checkManage',
      component: checkManage
    },
    {
      path: '/hrDepartment',
      name: 'hrDepartment',
      component: hrDepartment
    },
    {
      path: '/postReset',
      name: 'postReset',
      component: postReset
    },
    {
      path: '/personSet',
      name: 'personSet',
      component: personSet
    },
    {
      path: '/myTarget',
      name: 'myTarget',
      component: myTarget
    },
    {
      path: '/indicatorCom',
      name: 'indicatorCom',
      component: indicatorCom
    },
    {
      path: '/noticeManage',
      name: 'noticeManage',
      component: noticeManage
    },
    {
      path: '/task',
      name: 'task',
      component: task
    },
    {
      path: '/targetStystem',
      name: 'targetStystem',
      component: function (resolve) {
        // 这个特殊的 require 语法告诉 webpack 自动将编译后的代码分割成不同的块，
        // 这些块将通过 Ajax 请求自动下载。
        require(['./components/target/targetStystem.vue'], resolve)
      }
    },
    {
      path: '/strategy',
      name: 'strategy',
      component: strategy
    },
    {
      path: '/plan',
      name: 'plan',
      component: plan
    },
    {
      path: '/examine',
      name: 'examine',
      component: examine
    },
    {
      path: '/manage',
      name: 'manage',
      component: manage
    },
    {
      path: '/homePage',
      name: 'homePage',
      component: homePage
    },
  ]
});
router.beforeEach(function (to, from, next) {
  NProgress.start();
  // next();
  Vue.http.get(common.projectPath + 'sys/help/detail/pageName/'+to.name,{
    params:{

    }
  }).then(function (data) {
    data = data.body;
    if (data.code=='SUCCESS') {
      store.commit('getHelp',data.data);
    }else{
      Vue.prototype.$message.error(data.message);
    }
  })
  next();
});
router.afterEach(function (to, from) {
  var url = to.path;
  console.log('成功浏览到: ' + url);
  if (url == "/initSet" || url == "/") {
    $("head title").text("初始化设置-方舟绩效平台");
    window.common.check_menu = "initSet"
  }
  else if (url == "/task") {
    $("head title").text("任务管理-方舟绩效平台");
    window.common.check_menu = "task"
  }
  else if (url == "/index") {
    $("head title").text("主页-方舟绩效平台");
    window.common.check_menu = "index"
  }
  else if (url == "/hrDepartment") {
    $("head title").text("部门调整-方舟绩效平台");
    window.common.check_menu = "hrDepartment"
  }
  else if (url == "/post") {
    $("head title").text("岗位调整-方舟绩效平台");
    window.common.check_menu = "post"
  }
  else if (url == "/personSet") {
    $("head title").text("人员调整-方舟绩效平台");
    window.common.check_menu = "personSet"
  }
  else if (url == "/helpManage") {
    $("head title").text("帮助管理-方舟绩效平台");
    window.common.check_menu = "helpManage"
  }
  else if (url == "/myTarget") {
    $("head title").text("目标管理-我的目标");
    window.common.check_menu = "myTarget"
  }
  else if (url == "/indicatorCom") {
    $("head title").text("公司指标库-方舟绩效平台");
    window.common.check_menu = "indicatorCom"
  }
  else if (url == "/noticeManage") {
    $("head title").text("通知管理-方舟绩效平台");
    window.common.check_menu = "noticeManage"
  }
  else if (url == "/checkManage") {
    $("head title").text("考核管理-方舟绩效平台");
    window.common.check_menu = "checkManage"
  }
  else if (url == "/metaDataManage") {
    $("head title").text("元数据管理-方舟绩效平台");
    window.common.check_menu = "metaDataManage"
  }
  else if (url == "/remindManage") {
    $("head title").text("提醒设置管理-方舟绩效平台");
    window.common.check_menu = "remindManage"
  }
  else if (url == "/taskManage") {
    $("head title").text("任务设置管理-方舟绩效平台");
    window.common.check_menu = "taskManage"
  }
  else if (url == "/remindDataManage") {
    $("head title").text("提醒资料管理-方舟绩效平台");
    window.common.check_menu = "remindDataManage"
  }
  else if (url == "/flagDataManage") {
    $("head title").text("标签资料管理-方舟绩效平台");
    window.common.check_menu = "flagDataManage"
  }
  else if (url == "/ruleDataManage") {
    $("head title").text("编码规则资料管理-方舟绩效平台");
    window.common.check_menu = "ruleDataManage"
  }
  else if (url == "/accountManage") {
    $("head title").text("账户资料管理-方舟绩效平台");
    window.common.check_menu = "accountManage"
  }
  else if (url == "/targetStystem") {
    $("head title").text("目标系统图-方舟绩效平台");
    window.common.check_menu = "targetStystem"
  }

  NProgress.done();
});

var app = new Vue({
  el: '#app',
  store:store,
  router: router,
  mounted:function () {//组件都已经初始化
    var _com = this;
    this.$http.post(common.projectPath + 'usr/employee/currentAccount',{}, {
      emulateJSON: false
    }).then(function (data) {
      data = data.body;
      if (data.code=='SUCCESS') {
        _com.$store.commit('change',data.data);
      }else{
        _com.$message.error(data.message);
      }
    });
    _com.$http.get(common.projectPath+'/sys/help/detail/pageName/'+common.check_menu).then(function (data) {
      data=data.body;
      if(data.code=='SUCCESS'){
        _com.$store.commit('getHelp',data.data);
      }else {
        _com.$message.error(data.message);
      }
    })
  }
});




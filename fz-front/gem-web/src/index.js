import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import Vuex from 'vuex'

// 公用脚本
import common from './assets/js/common'

// 使用element
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-default/index.css'
require('element-ui/lib/theme-default/index.css');
require('./assets/sass/index.scss');
// 公用过滤器
import initFilter from './filter/commonFilter'
// 项目模块,供路由器调用
import loading from './components/common/loading.vue'
import roleManage from './components/role/roleManage.vue'
import menuManage from './components/menu/menuManage.vue'
import basicManage from './components/basic/basicManage.vue'
import userManage from './components/user/userManage.vue'
import tenantManage from './components/tenant/tenantManage.vue'
import flagManage from './components/flag/flagManage.vue'
import helpManage from './components/help/helpManage.vue'
import ruleManage from './components/rule/ruleManage.vue'
import indicatorManage from './components/indicator/indicatorManage.vue'
import objectManage from './components/object/objectManage.vue'
import metaDataManage from './components/metaData/metaDataManage.vue'
import remindManage from './components/remind/remindManage.vue'
import taskManage from './components/task/taskManage.vue'
import remindDataManage from './components/basic/remindDataManage.vue'
import flagDataManage from './components/basic/flagDataManage.vue'
import ruleDataManage from './components/basic/ruleDataManage.vue'
import accountManage from './components/basic/accountDataManage.vue'
import strategyManage from './components/strategy/strategyManage.vue'
import domainManage from './components/domain/domainManage.vue'

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
      path: '/menuManage',
      name: 'menuManage',
      component: menuManage
    },
    {
      path: '/roleManage',
      name: 'roleManage',
      component: roleManage
    },
    {
      path: '/domainManage',
      name: 'domainManage',
      component: domainManage
    },
    {
      path: '/basicManage',
      name: 'basicManage',
      component: basicManage
    },
    {
      path: '/tenantManage',
      name: 'tenantManage',
      component: tenantManage
    },
    {
      path: '/userManage',
      name: 'userManage',
      component: userManage
    },
    {
      path: '/flagManage',
      name: 'flagManage',
      component: flagManage
    },
    {
      path: '/helpManage',
      name: 'helpManage',
      component: helpManage
    },
    {
      path: '/ruleManage',
      name: 'ruleManage',
      component: ruleManage
    },
    {
      path: '/indicatorManage',
      name: 'indicatorManage',
      component: indicatorManage
    },
    {
      path: '/objectManage',
      name: 'objectManage',
      component: objectManage
    },
    {
      path: '/metaDataManage',
      name: 'metaDataManage',
      component: metaDataManage
    },
    {
      path: '/remindManage',
      name: 'remindManage',
      component: remindManage
    },
    {
      path: '/taskManage',
      name: 'taskManage',
      component: taskManage
    },
    {
      path: '/remindDataManage',
      name: 'remindDataManage',
      component: remindDataManage
    },
    {
      path: '/flagDataManage',
      name: 'flagDataManage',
      component: flagDataManage
    },
    {
      path: '/ruleDataManage',
      name: 'ruleDataManage',
      component: ruleDataManage
    },
    {
      path: '/accountManage',
      name: 'accountManage',
      component: accountManage
    },
    {
      path: '/strategyManage',
      name: 'strategyManage',
      component: strategyManage
    }
  ]
});
router.beforeEach(function (to, from, next) {
  var url = to.path;
  // if(url==='/')
  // {
  //   store.state.userInfo
  // }
  next();
});
router.afterEach(function (to, from) {
  var url = to.path;
  console.log('成功浏览到: ' + url);
  if (url == "/menuManage" || url == "/") {
    $("head title").text("菜单管理-方舟绩效后台管理系统");
    window.common.check_menu = "menuManage"
  }
  else if (url == "/roleManage") {
    $("head title").text("角色管理-方舟绩效后台管理系统");
    window.common.check_menu = "roleManage"
  }
  else if (url == "/tenantManage") {
    $("head title").text("租户管理-方舟绩效后台管理系统");
    window.common.check_menu = "tenantManage"
  }
  else if (url == "/basicManage") {
    $("head title").text("基础资料管理-方舟绩效后台管理系统");
    window.common.check_menu = "basicManage"
  }
  else if (url == "/userManage") {
    $("head title").text("员工管理-方舟绩效后台管理系统");
    window.common.check_menu = "userManage"
  }
  else if (url == "/flagManage") {
    $("head title").text("标签管理-方舟绩效后台管理系统");
    window.common.check_menu = "flagManage"
  }
  else if (url == "/strategyManage") {
    $("head title").text("策略管理-方舟绩效后台管理系统");
    window.common.check_menu = "strategyManage"
  }
  else if (url == "/helpManage") {
    $("head title").text("帮助管理-方舟绩效后台管理系统");
    window.common.check_menu = "helpManage"
  }
  else if (url == "/ruleManage") {
    $("head title").text("编码规则管理-方舟绩效后台管理系统");
    window.common.check_menu = "ruleManage"
  }
  else if (url == "/indicatorManage") {
    $("head title").text("指标管理-方舟绩效后台管理系统");
    window.common.check_menu = "indicatorManage"
  }
  else if (url == "/objectManage") {
    $("head title").text("对象管理-方舟绩效后台管理系统");
    window.common.check_menu = "objectManage"
  }
  else if (url == "/metaDataManage") {
    $("head title").text("元数据管理-方舟绩效后台管理系统");
    window.common.check_menu = "metaDataManage"
  }
  else if (url == "/remindManage") {
    $("head title").text("提醒设置管理-方舟绩效后台管理系统");
    window.common.check_menu = "remindManage"
  }
  else if (url == "/taskManage") {
    $("head title").text("任务设置管理-方舟绩效后台管理系统");
    window.common.check_menu = "taskManage"
  }
  else if (url == "/remindDataManage") {
    $("head title").text("提醒资料管理-方舟绩效后台管理系统");
    window.common.check_menu = "remindDataManage"
  }
  else if (url == "/flagDataManage") {
    $("head title").text("标签资料管理-方舟绩效后台管理系统");
    window.common.check_menu = "flagDataManage"
  }
  else if (url == "/ruleDataManage") {
    $("head title").text("编码规则资料管理-方舟绩效后台管理系统");
    window.common.check_menu = "ruleDataManage"
  }
  else if (url == "/accountManage") {
    $("head title").text("账户资料管理-方舟绩效后台管理系统");
    window.common.check_menu = "accountManage"
  }
  else if (url == "/domainManage") {
    $("head title").text("业务领域管理-方舟绩效后台管理系统");
    window.common.check_menu = "domainManage"
  }
});
var userInfo={
  mobilePhone:'',
  roles:[]
};
var store = new Vuex.Store({
  state: {
    userInfo: {},
    roleId:window.sessionStorage.roleId,
    helpList:[]
  },
  mutations: {
    change:function (state,data) {
      state.userInfo=data;
    },
    changeMenu:function (state,data) {
      state.helpList=data;
    },
    changeRoleId:function (state,data) {
      state.roleId=data;
      window.sessionStorage.roleId=data;
    }
  }
});
var app = new Vue({
  el: '#app',
  store:store,
  router: router,
  mounted:function () {//组件都已经初始化
    var _com = this;
    this.$http.post(common.projectPath + 'currentAccount',{}, {
      emulateJSON: false
    }).then(function (data) {
      data = data.body;
      if (data.code=='SUCCESS') {
        if(data.data)
          _com.$store.commit('change',data.data);
        else
          window.location.href='login.html';
      }else{
        _com.$message.error(data.message);
      }
    });
    var vol={
      data:{

      },
      "pageSize": 20
    };
    _com.$http.post(common.projectPath + 'sys/help/pageList',vol, {
      emulateJSON: false
    }).then(function (data) {
      data = data.body;
      if (data.code==='SUCCESS') {
        _com.$store.commit('changeMenu',data.data);
      } else {
        _com.$message.error(data.message);
      }
    })
  }
});




<!-- 内容标题模板  Created by chenzhe on 17/4/14-->
<template>
    <div class="content_head clearfix" :role="userInfo.ruleId">
      <div class="head_left_content clearfix" >
        <p v-show="!showMenu&&!showBreadcrumb">初始设置</p>
        <div class="breadcrumb" v-show="showBreadcrumb">
          <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ name: 'homePage' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item >
              <el-dropdown menu-align="start" @command="redirect_">
                <span class="el-dropdown-link">
                  {{pageModule.name}}<i class="fa fa-angle-down ml5"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(value, key) in breadcrumbData" :command="value.route">{{value.name}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="head_menu_content" v-if="showMenu&&pageRouter==='homePage'" :style="{width:homePageMenuData.length*110+80+'px'}">
        <ul class="clearfix cl-effect-17">
          <li v-for="x in homePageMenuData">
            <a href="javascript:;" @click="redirect_(x.route)" :class="{active:pageRouter===x.route}" :data-hover="x.title"><span>{{x.title}}</span></a>
          </li>
        </ul>
      </div>
      <div class="head_menu_content" v-if="showMenu&&pageRouter!=='homePage'" :style="{width:pageModule.subCount*110+80+'px'}">
        <ul class="clearfix cl-effect-17">
          <li v-for="(value, key) in pageModule.sub">
            <a href="javascript:;" @click="redirect_(key)" :class="{active:pageRouter===key}" :data-hover="value"><span>{{value}}</span></a>
          </li>
        </ul>
      </div>
      <div class="head_right_content">
        <el-tooltip  placement="bottom" effect="dark" >
          <div slot="content" v-html="headHelpInfo">这里是帮助信息!</div>
          <img src="../../assets/img/help.svg" alt="" class="help_icon">
        </el-tooltip>
        <span class="fl">帮助</span>
      </div>
    </div>
</template>
<script>
    module.exports = {
      data:function () {
        return{
          menu_content:this.$slots.menu_content?true:false,
          menuData:[

          ],
          pageRouter:this.$route.name,
          headHelpInfo:'',
          homePageMenuData:[
            {title:'主页',route:'homePage'},
            {title:'目标管理',route:'myTarget'},
            {title:'策略计划',route:'strategy'},
            {title:'考核管理',route:'examine'}
          ],
          breadcrumbData:{
//            homePage:{
//              name:'主页',
//              route:'homePage',
//              sub:{
//                homePage:'主页',
//                myTarget:'目标管理',
//                strategy:'策略计划',
//                indicatorCom:'考核管理'
//              },
//              subCount:4
//            },
            target:{
              name:'目标管理',
              route:'myTarget',
              sub:{
                myTarget:'我的目标',
                targetStystem:'目标系统图',
                indicatorCom:'公司指标库'
              },
              subCount:3
            },
            strategy:{
              name:'策略计划',
              route:'strategy',
              sub:{
                strategy:'策略',
                plan:'计划'
              },
              subCount:2
            },
            examine:{
              name:'考核管理',
              route:'examine',
              sub:{
                examine:'考核管理',
//                targetStystem:'目标系统图',
//                indicatorCom:'公司指标库'
              },
              subCount:1
            },
          }
        }
      },
      watch:{
        helpList:function () {
          var _com=this;
          if(_com.helpList.length>0){
            for(var i=0;i<_com.helpList.length;i++){
              if(_com.helpList[i].sequence==0){
                _com.headHelpInfo=_com.helpList[i].content?_com.helpList[i].content:'暂无帮助';
              }
            }
          }else{
            _com.headHelpInfo='暂无帮助'
          }
        }
      },
      computed:{
        helpList:function () {
          return this.$store.state.helpList;
        },
        pageModule:function () {
          for(var key in this.breadcrumbData)
          {
            if(this.breadcrumbData[key].sub[this.pageRouter])//找到页面所属模块
            {
              return this.breadcrumbData[key];
            }
          }
          return {};
        },
        userInfo:function () {
          var userInfo=this.$store.state.userInfo,isJurisdiction=false;
          if(userInfo.ruleId)
          {
            if(userInfo.ruleId==='HR')
            {
              this.menuData=[
                {title:'主页',route:'homePage'},
                {title:'考核管理',route:'examine'},
                {title:'指标管理',route:'indicatorManage'},
                {title:'任务管理',route:'task'},
                {title:'组织架构',route:'hrDepartment'},
                {title:'岗位管理',route:'postReset'},
                {title:'人员管理',route:'personSet'},
                {title:'公司指标库',route:'indicatorHr'},
                {title:'通知管理',route:'noticeManage'}
              ];
            }
            else if(userInfo.ruleId==='MANAGER'){
              this.menuData=[
                {title:'主页',route:'homePage'},
                {title:'考核管理',route:'examine'},
                {title:'指标管理',route:'indicatorManage'},
                {title:'任务管理',route:'task'},
                {title:'通知管理',route:'noticeManage'}
              ];
            }
            else if(userInfo.ruleId==='BOSS'){
              this.menuData=[
                {title:'主页',route:'homePage'},
                {title:'考核管理',route:'examine'},
                {title:'指标管理',route:'indicatorManage'},
                {title:'任务管理',route:'task'},
                {title:'通知管理',route:'noticeManage'}
              ];
            }
            else if(userInfo.ruleId==='EMPLOYEE'){
              this.menuData=[
                {title:'主页',route:'homePage'},
                {title:'考核管理',route:'examine'},
                {title:'指标管理',route:'indicatorManage'},
                {title:'任务管理',route:'task'},
                {title:'通知管理',route:'noticeManage'}
              ];
            }
            //判断该用户是否有权限访问该页面 isJurisdiction为true有权限,反之没有
            for(var i=0;i<this.menuData.length;i++)
            {
              if(this.$route.path==='/initSet'||this.$route.path==='/'+this.menuData[i].route){//有权限
                isJurisdiction=true;
                break;
              }
            }
//            if(!isJurisdiction){
//              this.redirect_(this.menuData[0].route);
//            }
          }
          return userInfo;
        }
      },
      methods:{
        redirect_:function (route) {
          this.$router.push({name:route});
        }
      },
      props:{
        // 是否显示中间菜单
        showMenu:{
          default:function () {
            return true
          }
        },
        // 是否显示面包屑导航
        showBreadcrumb:{
          default:function () {
            return true
          }
        }
      },
      mounted:function () {
        this.$nextTick(function () {
        })

      }
    }
</script>

<!--主页-->
<template>
  <div class="wrapper mainPage" v-loading.fullscreen="pageLoading">
    <page-head></page-head>
    <div class="content_wrapper">
      <content_head show-menu="true"></content_head>
      <div class="content_content clearfix">
        <monthly-plan class="content_left" v-if="userInfo.ruleId!=='BOSS'"></monthly-plan>
        <div class="content_middle " v-if="userInfo.ruleId!=='EMPLOYEE'">
          <daily-sheet v-if="userInfo.ruleId!=='BOSS'"></daily-sheet>
          <todo-task></todo-task>
        </div>
        <div class="content_middle" v-if="userInfo.ruleId==='EMPLOYEE'">
          <todo-task></todo-task>
        </div>
        <employee-check v-if="userInfo.ruleId!=='EMPLOYEE'" class="content_right"></employee-check>
        <daily-sheet v-if="userInfo.ruleId==='EMPLOYEE'"></daily-sheet>

      </div>
    </div>
  </div>
</template>

<script>
  import head from '../common/head.vue'
  import content_head from '../common/content_head.vue'
  import dailySheet from  './dailySheet.vue'
  import monthlyPlan from './monthlyPlan.vue'
  import todoTask from './todoTask.vue'
  import employeeCheck from './employeeCheck.vue'
  module.exports = {
    components: {
      'page-head': head,
      'content_head': content_head,
      'daily-sheet': dailySheet,
      'monthly-plan': monthlyPlan,
      'todo-task': todoTask,
      'employee-check': employeeCheck
    },
    data: function () {
      return {
        pageLoading:true
      }
    },
    computed:{
      userInfo:function () {
        return this.$store.state.userInfo;
      }
    },
    methods: {
      init:function () {
        var _com=this;
        this.pageLoading=true;
        setTimeout(function () {
          _com.pageLoading=false;
        },500);
      }
    },
    mounted: function () {
        this.init();
    }
  }
</script>

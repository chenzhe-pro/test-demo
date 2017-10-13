<!--头部组件-->
<template>
  <div class="head_warpper">
    <div class="head">
      <span class="company_name" v-text="userInfo.tenant?userInfo.tenant.enterpriseName:''">苏州金联云创科技有限公司</span>
      <div class="head-right">
        <span @click="daliy_modal=true"><i class="fa fa-calendar-plus-o" aria-hidden="true"></i> 日清表</span>
        <span @click="redirect_('manage')" class="ml15 mr15" v-if="userInfo.ruleId!=='EMPLOYEE'"><i class="fa fa-table" aria-hidden="true" ></i> 管理</span>
        <!--<span class="head_notify" @click="redirect_('noticeManage')"><i class="fa fa-bell-o animated" aria-hidden="true"></i> <span class="notify_num c9">{{ unReadNum }}</span></span>-->
        <el-dropdown placement="bottom-end" @command="handleCommand"  class="">
          <div class="user_dropdown">
            <i class="fa fa-user-circle dropdown-toggle" aria-hidden="true"></i>
            <span class="user_name ml5 mr5" >{{userInfo.realName?userInfo.realName:''}}</span>
            <i class="fa fa-angle-down c9" aria-hidden="true"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="c">切换岗位</el-dropdown-item>
            <el-dropdown-item command="r">修改密码</el-dropdown-item>
            <el-dropdown-item command="l">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <el-dialog v-model="daliy_modal" :close-on-click-modal="false" size="full">
      <span slot="title">日清表</span>
      <div class="dialog_title_line"></div>
      <daliyTable></daliyTable>
    </el-dialog>
    <el-dialog v-model="show_modal" title="切换岗位" size="tiny">
      <div class="dialog_title_line"></div>
      <div class="position_list mb20">
        <el-radio-group v-model="checked_position">
          <el-radio :label="x.id" v-for="x in userInfo.postions">{{x.name}}</el-radio>
        </el-radio-group>
      </div>
      <el-button type="primary" size="small" @click="setPos" style="display: block;width: 60px;margin: 0 auto;">确定</el-button>
    </el-dialog>
  </div>
</template>

<script>
  import daliyTable from '../homePage/daliyTable.vue'
  module.exports = {
    data: function () {
      return {
        daliy_modal:false,
        show_modal:false,
        checked_position:''
      }
    },
    computed:{
      userInfo:function () {
        return this.$store.state.userInfo;
      },
      unReadNum: function () {
        return this.$store.state.unReadNum;
      }
    },
    methods:{
      getNoticeNum: function () {
        var _com = this;
        _com.$http.get(common.projectPath+'sys/notity/countUnRead').then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.$store.commit('setUnRead',data.data);
          }else {
            _com.$message.error(data.message);
          }
        })
      },
      getCurrentPos:function () {
        var _com = this;
        _com.$http.get(common.projectPath+'usr/employee/currentPosition').then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.checked_position = data.data.id;
          }else {
            _com.$message.error(data.message);
          }
        })
      },
      setPos:function () {
        var _com = this;
        _com.$http.get(common.projectPath+'usr/employee/switch/'+_com.checked_position).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
//            _com.$message.success('切换成功!');
//            _com.show_modal=false;
//            _com.$nextTick(function () {
              window.location.reload();
//            });
          }else {
            _com.$message.error(data.message);
          }
        })
      },
      redirect_:function (name) {
        this.$router.push({name:name});
      },
      handleCommand:function (command) {
        var _com=this;
        if(command=='r'){
          _com.resetPwd();
        }else if(command=='l'){
          _com.logout();
        }
        else
        {
          _com.show_modal=true;
          _com.getCurrentPos();
        }
      },
      resetPwd:function () {
        var _com=this;
        window.location.href='login.html#/resetPwd'
      },
      init:function () {
        $('.fa-question').hover(function () {
          $(this).addClass("pulse")
        },function () {
          $(this).removeClass("pulse")
        });
        $('.fa-cog').hover(function () {
          $(this).addClass("rotateIn")
        },function () {
          $(this).removeClass("rotateIn")
        });
        $('.head_notify').hover(function () {
          $(this).children('.fa-bell-o').addClass("swing")
        },function () {
          $(this).children('.fa-bell-o').removeClass("swing")
        });
      },
      logout:function () {
        var _com=this;
        _com.$http.post(common.projectPath+'logout',{
//        _com.$http.post('http://192.168.1.105:8061/logout',{
          emulateJSON: false
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            quicker.delCookie("admin_phone",'/');
            quicker.delCookie("admin_mail",'/');
            window.location.href='login.html';
            if(window.sessionStorage.date){
              window.sessionStorage.removeItem('date')
            }
          }
          else
          {
            _com.$message({
              duration:1000,
              showClose: true,
              message: data.message
            });
          }
        });
      }
    },
    components: {
      'daliyTable':daliyTable,
    },
    mounted:function () {
      this.init();
//      this.getNoticeNum();
      this.$nextTick(function () {

      })
    }
  }
</script>
<style scoped lang="scss" rel="stylesheet/scss">

</style>

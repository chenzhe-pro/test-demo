<!--头部组件-->
<template>
  <div class="head">
    <div class="head-ceiling">
      <!--<img src="../../assets/img/icon.png" alt="" class="head-logo fl">-->
      <div class="head-input">
      </div>
      <div class="head-ceiling-main">
        <div class="head-dropdown-area fl ml20">
          <span class="user_name" v-text="userInfo.mobilePhone?userInfo.mobilePhone:userInfo.mail">admin</span>
          <el-tooltip class="item" effect="dark" :content="'序号:'+menuTitle" placement="bottom">
            <i class="fa fa-question animated" aria-hidden="true"></i>
          </el-tooltip>
          <!--<i class="fa fa-question animated" aria-hidden="true" @click="init"></i>-->
          <i class="fa fa-cog animated" aria-hidden="true"></i>
          <i class="fa fa-bell animated" aria-hidden="true"></i>
          <el-dropdown placement="bottom-end" @command="logout">
            <!--<img src="../../assets/img/ion-avatar.png" alt="" class="user-logo">-->
            <i class="fa fa-user-circle-o dropdown-toggle" aria-hidden="true"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  module.exports = {
    data: function () {
      return {
        menuTitle:common.check_menu
//        userInfo:this.$store.state.userInfo
      }
    },
    computed:{
      userInfo:function () {
        return this.$store.state.userInfo;
      },
      helpList:function () {
        return this.$store.state.helpList;
      }
    },
    methods:{
      init:function () {
        var _com=this;
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
        $('.fa-bell').hover(function () {
          $(this).addClass("swing")
        },function () {
          $(this).removeClass("swing")
        });
        for(var i=0;i<_com.helpList.length;i++){
          if(_com.helpList[i].pageName==_com.menuTitle){
            _com.menuTitle=_com.helpList[i].sequence
          }
        }
      },
      logout:function () {
        var _com=this;
        _com.$http.post(common.projectPath+'logout',{
          emulateJSON: false
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
//            quicker.delCookie("cy_admin_id",'/');
//            quicker.delCookie("admin_phone",'/');
//            quicker.delCookie("admin_mail",'/');
            window.location.href='login.html';
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
    mounted:function () {
      var _com=this;
//      this.getList();
      this.$nextTick(function () {
        _com.init();
      });

    }
  }
</script>
<style scoped lang="scss" rel="stylesheet/scss">

</style>

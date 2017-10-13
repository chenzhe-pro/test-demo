<template>
  <div class="wrapper">
    <div class="login_box register">
      <div class="img_box"><img src="../../assets/img/logo_small.png" alt=""></div>
      <div class="login_item sub_header">
        <p class="">找回密码</p>
      </div>
      <el-form :model="pwdForm" :rules="ruleInline" ref="pwdForm">
        <el-form-item prop="loginName" class="login_item" >
          <el-input v-model="pwdForm.loginName"  placeholder="手机/邮箱"></el-input>
        </el-form-item>
      </el-form>
      <div class="login_item ">
      <el-button type="primary" class="login_btn" @click="next()" :disabled="disBtn">下一步</el-button>
      </div>
      <div class="login_item clearfix">
        <span class="fr">已有账户，去<a href="#/" class="blue_jump">登录</a></span>
      </div>
    </div>
    <page-foot></page-foot>
  </div>
</template>

<script>

  import foot from '../common/foot.vue'

  import com_ready from '../../assets/js/componentReady'
  //  var bg_img=require('../assets/img/login_bg.jpg');
  module.exports = {
    data: function () {
      return {
        pwdForm: {
          loginName:'',
          password: '',
        },
        ruleInline: {
          loginName: [
            {required: true, message: '请填写手机号码或者邮箱地址', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请填写密码', trigger: 'blur'},
            {type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur'}
          ]
        }
      }
    },
    computed:{
      disBtn:function () {
        if(this.pwdForm.loginName){
          return false;
        }else{
          return true;
        }
      }
    },
    methods: {
      /**
       * 登录验证
       * @param name 登录框模型名
       */
      next: function () {
        quicker.setCookie("login_name", this.pwdForm.loginName, '/');
        window.location.hash='#/byPhone'
//        var _com = this;
//          if(_com.pwdForm.loginName.indexOf('@')>0){
//            window.location.hash='#/byMail'
//          }else{
//            window.location.hash='#/byPhone'
//          }
      }
    },
    mounted: function () {
      var _com = this;
      quicker.returnTop();
      this.$nextTick(function () {
        com_ready();
      });
    },
    components: {
      'page-foot': foot
    }
  }

</script>

<style lang="scss">

</style>

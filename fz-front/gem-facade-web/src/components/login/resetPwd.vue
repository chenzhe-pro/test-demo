<template>
  <div class="wrapper">
    <div class="login_box register">
      <!--<div class="img_box"><img src="../../assets/img/logo_small.png" alt=""></div>-->
      <div class="login_item sub_header">
        <p class="">修改密码</p>
      </div>
      <el-form :model="registerForm" :rules="ruleInline" ref="registerForm">
        <el-form-item prop="oldPwd" class="login_item" >
          <el-input v-model="registerForm.oldPwd" type="password"  placeholder="请输入旧密码"></el-input>
        </el-form-item>
        <el-form-item prop="firstPwd" class="login_item">
          <el-input v-model="registerForm.firstPwd" type="password" placeholder="请输入新密码" @blur="checkRepeat()"></el-input>
        </el-form-item>
        <el-form-item prop="checkPwd" class="login_item" >
          <el-input v-model="registerForm.checkPwd" type="password" placeholder="请重复新密码"></el-input>
        </el-form-item>
      </el-form>
      <div class="login_item clearfix">
        <!--<a class="white_btn fl" style="width: 46%; " href="#/byPhone">上一步</a>-->
        <el-button type="primary" class="login_btn" :disabled="disBtn"  @click="saveNewPwd()">保存</el-button>
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
      var checkPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.registerForm.firstPwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        registerForm: {
          oldPwd:'',
          firstPwd:'',
          checkPwd: '',
        },
//        disBtn:true,
        ruleInline: {
          oldPwd: [
            {required: true, message: '请填写旧密码', trigger: 'blur'},
          ],
          firstPwd: [
            {required: true, message: '请填写密码', trigger: 'blur'},
            {type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur'}
          ],
          checkPwd: [
            {validator:checkPass, trigger: 'blur'},
          ]
        }
      }
    },
    computed:{
      disBtn:function () {
        if(this.registerForm.oldPwd&&this.registerForm.firstPwd&&
          this.registerForm.checkPwd){
          return false;
        }else{
          return true;
        }
      }
    },
    methods: {
      aaa:function () {
        this.$router.push({name:register})
      },
      /**
       * 检查新旧密码是否一样
       */
      checkRepeat:function () {
        if(this.registerForm.firstPwd==this.registerForm.oldPwd){
          this.$message.error('输入的新密码与旧密码重复!请重新输入!');
        }
      },
      /**
       * 保存修改的密码
       */
      saveNewPwd: function () {
        var _com = this,
          url,
          vo = {
            "oldPassWord": _com.registerForm.oldPwd,
            "password": _com.registerForm.checkPwd,
          };
        _com.$refs.registerForm.validate(function (valid) {
          if (valid) {
            url = 'usr/employee/modifyTwoPassword';
            _com.$http.post(common.projectPath + url, vo, {
              emulateJSON: false //emulateJSON 默认是false,以json形式传参;true以formData形式,post的时候必传
            }).then(function (data) {
              data = data.body;
              if (data.code=='SUCCESS') {
                quicker.delCookie("admin_pwd")
                window.location.href = "login.html";
              } else {
                _com.$message.error(data.message);
              }
            })
          }
        })
      },
      reset: function () {
        var _com = this;
        _com.$refs.registerForm.resetFields();
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

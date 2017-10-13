<template>
  <div class="wrapper">
    <div class="login_box register">
      <div class="img_box"><img src="../../assets/img/logo_small.png" alt=""></div>
      <div class="login_item sub_header">
        <p class="">找回密码</p>
      </div>
      <el-form :model="registerForm" :rules="ruleInline" ref="registerForm">
        <el-form-item prop="mobilePhone" class="login_item" >
        <el-input v-model="registerForm.mobilePhone"  @blur="checkPhone"></el-input>
      </el-form-item>
        <el-form-item prop="smsCount" class="login_item" >
          <el-col :span="14">
            <el-input v-model="registerForm.smsCount"  placeholder="验证码"></el-input>
          </el-col>
          <el-col :span="10" class="pl20">
            <el-button type="primary" class="login_btn" @click="sendMsg">发送验证码</el-button>
          </el-col>
        </el-form-item>
        <el-form-item prop="firstPwd" class="login_item" >
          <el-input v-model="registerForm.firstPwd" type="password"  placeholder="设置密码"></el-input>
        </el-form-item>
        <el-form-item prop="checkPwd" class="login_item" >
          <el-input v-model="registerForm.checkPwd" type="password" placeholder="重复密码"></el-input>
        </el-form-item>
      </el-form>
      <div class="login_item clearfix">
        <a class="white_btn fl" style="width: 46%; " href="#/lookForPwd">上一步</a>
        <el-button type="primary" class="login_btn fr" style="width: 46%;" @click="nextStep()" :disabled="disRegister">完成</el-button>
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
          mobilePhone:quicker.getCookie("login_name")?decodeURIComponent(quicker.getCookie("login_name")) : '',
          smsCount: '',
          firstPwd:'',
          checkPwd:'',
        },
        disSendBtn:true,
        ruleInline: {
          mobilePhone: [
            {required: true, message: '请填写手机号码', trigger: 'blur'},
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
      disRegister:function () {
        if(this.registerForm.mobilePhone&&this.registerForm.smsCount&&this.registerForm.firstPwd&&this.registerForm.checkPwd){
          return false;
        }else{
          return true;
        }
      }
    },
    methods: {
      /**
       * 判断是否可以发送验证码
       */
      checkPhone:function () {
        var _com=this;
        if(_com.registerForm.mobilePhone){
          _com.disSendBtn=false;
        }else{
          _com.disSendBtn=true;
        }
//        _com.$refs.registerForm.validateField('mobilePhone',function (valid){
//          if(!valid){
//            _com.disSendBtn=false;
//          }else{
//            _com.disSendBtn=true;
//          }
//        })
      },
      sendMsg:function () {
        var _com=this;
        if(_com.registerForm.mobilePhone.indexOf('@')<=0){
          _com.$http.get(common.projectPath+'sendMsgForPassword',{
            params:{
              mobile:_com.registerForm.mobilePhone
            }
          }).then(function (data) {
            data = data.body;
            if (data.code=='SUCCESS') {
              _com.$message.success('验证码发送成功!');
            }else{
              _com.$message.error(data.message);
            }
          })
        }else{
          _com.$http.get(common.projectPath+'sendEmailForPassword',{
            params:{
              toEmail:_com.registerForm.mobilePhone
            }
          }).then(function (data) {
            data = data.body;
            if (data.code=='SUCCESS') {
              _com.$message.success('验证码发送成功!');
            }else{
              _com.$message.error(data.message);
            }
          })
        }
      },
      /**
       * 登录验证
       * @param name 登录框模型名
       */
      nextStep: function () {
        var _com = this,
          url,vo={};
        if(_com.registerForm.mobilePhone.indexOf('@')<=0){
          vo = {
            mobilePhone: _com.registerForm.mobilePhone,
            smsCount:_com.registerForm.smsCount,
            password:_com.registerForm.checkPwd,
          }
          url = 'updatePsdForPhone';
        }else{
          vo = {
            mail: _com.registerForm.mobilePhone,
            emailCount:_com.registerForm.smsCount,
            password:_com.registerForm.checkPwd,
          };
          url = 'updatePsdForEmail';
        }
        _com.$refs.registerForm.validate(function (valid) {
          if (valid) {
            _com.$http.post(common.projectPath + url, vo, {
              emulateJSON: false //emulateJSON 默认是false,以json形式传参;true以formData形式,post的时候必传
            }).then(function (data) {
              data = data.body;
              if (data.code=='SUCCESS') {
                window.location.hash='#/'
              } else {
                _com.$message.error(data.message);
              }
            })
          }
        })
      },
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

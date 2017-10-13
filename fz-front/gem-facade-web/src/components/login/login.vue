<template>
  <div class="wrapper">
    <div class="login_box" @keyup.enter="login()">
      <div class="img_box"><img src="../../assets/img/logo_small.png" alt=""></div>
      <div class="login_item sub_header">
        <p class="">方舟绩效管理系统</p>
      </div>
      <!--<div class="login_item">-->
        <!--<el-input v-model="loginForm.loginName" placeholder="手机/邮箱"></el-input>-->
      <!--</div>-->
      <!--<div class="login_item">-->
        <!--<el-input v-model="loginForm.password" type="password" placeholder="密码"></el-input>-->
      <!--</div>-->
      <el-form :model="loginForm" :rules="ruleInline" ref="loginForm">
        <el-form-item prop="loginName" class="login_item" >
          <el-input v-model="loginForm.loginName"  placeholder="手机/邮箱"></el-input>
        </el-form-item>
        <el-form-item prop="password" class="login_item" >
          <el-input v-model="loginForm.password" type="password"  placeholder="密码"></el-input>
        </el-form-item>
      </el-form>
      <div class="login_item clearfix">
      <a href="#/registerPhone" class="fl gray">免费注册</a>
      <a href="#/lookForPwd" class="fr gray">忘记密码</a>
      </div>
      <div class="login_item ">
      <el-button type="primary" class="login_btn" @click="login()" :disabled="disBtn">登录</el-button>
      </div>
    </div>
    <el-dialog v-model="modal_company" title="选择任职公司" size="tiny">
        <!--<el-form>-->
          <el-radio-group v-model="radio">
            <el-radio v-for="t in tenantList" :label="t.id" >{{t.enterpriseName}}</el-radio>
          </el-radio-group>
      <div slot="footer">
        <div class="btns clearfix" style="width: 320px;margin: 0px auto">
          <div class="btn btn-light fl" @click="modal_company=false">取消</div>
          <div class="btn btn-primary fr" @click="enter()">确定</div>
        </div>
      </div>
        <!--</el-form>-->
    </el-dialog>
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
        loginForm: {
          loginName:quicker.getCookie("admin_name")?quicker.getCookie("admin_name"):'',
          password:quicker.getCookie("admin_pwd")?quicker.getCookie("admin_pwd"): '',
        },
        radio:'',
        tenantId:'',
        modal_company:false,
        tenantList:[],
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
//      changeTenant:
      disBtn:function () {
        if(this.loginForm.loginName&&this.loginForm.password){
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
      login: function () {
        var _com = this,
          url,
          vo = {
            password: _com.loginForm.password,
            loginName:_com.loginForm.loginName
          };
        _com.$refs.loginForm.validate(function (valid) {
          if (valid) {
            url = 'myCompany';
            _com.$http.post(common.projectPath + url, vo, {
              emulateJSON: false //emulateJSON 默认是false,以json形式传参;true以formData形式,post的时候必传
            }).then(function (data) {
              data = data.body;
              if (data.code=='SUCCESS') {
                quicker.setCookie("admin_name", _com.loginForm.loginName, '/')
                quicker.setCookie("admin_pwd", _com.loginForm.password, '/')
                _com.tenantList=[];
                if(data.data){
                  for(var i=0;i<data.data.length;i++){
                    if(data.data[i].tenant)
                    _com.tenantList.push(data.data[i].tenant)
                  }
                }
                if(_com.tenantList.length==1){
                  _com.radio=_com.tenantList[0].id;
                  _com.enter();
                }else {
                  _com.modal_company=true;
                }
              } else {
                _com.$message.error(data.message);
              }
            })
          }
        })
      },
      /**
       * 登录验证
       * @param name 登录框模型名
       */
      enter: function () {
        var _com = this,
          url,
          vo = {
            password: _com.loginForm.password,
            loginName:_com.loginForm.loginName,
            tenantId:_com.radio
          };
        _com.$refs.loginForm.validate(function (valid) {
          if (valid) {
            url = 'login';
            _com.$http.post(common.projectPath + url, vo, {
              emulateJSON: false //emulateJSON 默认是false,以json形式传参;true以formData形式,post的时候必传
            }).then(function (data) {
              data = data.body;
              if (data.code=='SUCCESS') {
                if(data.data.currentProcess){
                  if(data.data.currentProcess.indexOf('-')>-1){
                    var lis=data.data.currentProcess.split('-');
                    window.location.href = "index.html#/initSet?step="+lis[0]+'&sub_step='+lis[1];
                  }else{
                    window.location.href = "index.html#/initSet?step="+data.data.currentProcess;
                  }
                }else{
                  window.location.href = "index.html#/homePage";
                }
              } else {
                _com.$message.error(data.message);
              }
            })
          }
        })
      },
      reset: function () {
        var _com = this;
        _com.$refs.loginForm.resetFields();
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

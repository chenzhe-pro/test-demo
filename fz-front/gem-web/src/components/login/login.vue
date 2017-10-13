<template>
  <div class="wrapper ofh">
    <div class="login-box" @keyup.enter="login()">
      <p style="font-size:28px;font-weight:bold;color:#fff" class="tc">方舟绩效</p>
      <p style="font-size:20px;font-weight:bold;color:#fff" class="tc mb20">后台管理系统</p>
      <el-card class="login-inner">
        <el-form ref="loginForm" :model="loginForm" label-width="80px" label-position="left" :rules="ruleInline">
          <el-form-item prop="loginName" label="登录名">
            <el-input type="text" v-model="loginForm.loginName" placeholder="输入手机号码或者邮箱地址">
              <template slot="prepend"><i class="fa fa-user" aria-hidden="true"></i></template>
            </el-input>
          </el-form-item>
          <!--<el-form-item prop="mail" label="邮箱">-->
            <!--<el-input type="text" v-model="loginForm.mail" placeholder="输入邮箱地址">-->
              <!--<template slot="prepend"><i class="fa fa-user" aria-hidden="true"></i></template>-->
            <!--</el-input>-->
          <!--</el-form-item>-->
          <el-form-item prop="password" label="密码">
            <el-input type="password" v-model="loginForm.password" placeholder="输入密码">
              <template slot="prepend"><i class="fa fa-lock" aria-hidden="true"></i></template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="ghost" @click="reset()" style="margin-right: 8px">重置</el-button>
            <el-button type="primary" align="center" @click="login()">登录</el-button>
          </el-form-item>
        </el-form>
      </el-card>
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
        loginForm: {
          loginName:'',
//          mail: '',
          password: '',
//          phone:''
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
    methods: {
      /**
       * 登录验证
       * @param name 登录框模型名
       */
      login: function () {
        var _com = this,
          url,
          vo = {
//            mail: _com.loginForm.mail,
            password: _com.loginForm.password,
            loginName:_com.loginForm.loginName
          };
        _com.$refs.loginForm.validate(function (valid) {
          if (valid) {
            url = 'login';
            _com.$http.post(common.projectPath + url, vo, {
              emulateJSON: false //emulateJSON 默认是false,以json形式传参;true以formData形式,post的时候必传
            }).then(function (data) {
              data = data.body;
              if (data.code=='SUCCESS') {
//                quicker.setCookie("admin_phone", data.data.mobilePhone, '/');
//                quicker.setCookie("admin_mail", data.data.mail, '/');
//                if(data.data.roles)
//                for (var t = 0; t < data.data.roles.length; t++) {
//                  roleList.push(data.data.roles[t].id);
//                }
//                quicker.setCookie("cy_admin_roles", encodeURIComponent(JSON.stringify(roleList)), '/');
//                quicker.setCookie("cy_admin_id", data.obj.id, '/');
                sessionStorage.removeItem('roleId');
                window.location.href = "index.html";
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

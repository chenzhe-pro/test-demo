<template>
  <div class="wrapper">
    <div class="login_box register ">
      <div class="img_box"><img src="../../assets/img/logo_small.png" alt=""></div>
      <div class="login_item sub_header">
        <p class="">验证邮箱</p>
      </div>
      <div class="receive_mail">
        我们已向您的注册邮箱845***821@qq.com发送了一封邮件，请您注意
        <a href="" class="blue_jump">接收邮件</a>

      </div>
      <div class="login_item ">
        <div class="login_btn receive_btn" @click="login()">去邮箱接收邮件</div>
      </div>
      <div class="login_item">
        <p class="small_text">请注意查收邮件，并按照邮件中的提示操作，完成安全认证。没有收到邮件？
          <a href="" class="blue_jump">重新发送</a>
        </p>
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
        registerForm: {
          loginName:'',
          password: '',
          checked:true
        },
        ruleInline: {
          mail: [
            {required: true, message: '请填写邮箱地址', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请填写密码', trigger: 'blur'},
            {type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      aaa:function () {
        this.$router.push({name:register})
      },
      /**
       * 登录验证
       * @param name 登录框模型名
       */
      login: function () {
        var _com = this,
          url,
          vo = {
//            mail: _com.registerForm.mail,
            password: _com.registerForm.password,
            loginName:_com.registerForm.loginName
          };
        _com.$refs.registerForm.validate(function (valid) {
          if (valid) {
            url = '/login';
            _com.$http.post(common.projectPath + url, vo, {
              emulateJSON: false //emulateJSON 默认是false,以json形式传参;true以formData形式,post的时候必传
            }).then(function (data) {
              data = data.body;
              if (data.code=='SUCCESS') {
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

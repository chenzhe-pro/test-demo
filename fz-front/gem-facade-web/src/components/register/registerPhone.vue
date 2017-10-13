<template>
  <div class="wrapper">
    <div class="login_box register">
      <div class="img_box"><img src="../../assets/img/logo_small.png" alt=""></div>
      <div class="login_item sub_header">
        <p class="">注册账号</p>
      </div>
      <el-form :model="registerForm" :rules="ruleInline" ref="registerForm">
        <el-form-item prop="enterpriseName" class="login_item" >
          <el-input v-model="registerForm.enterpriseName"  placeholder="公司名称"></el-input>
        </el-form-item>
        <el-form-item prop="mobilePhone" class="login_item" >
        <el-input v-model="registerForm.mobilePhone"  placeholder="手机号" @blur="checkPhone" ></el-input>
      </el-form-item>
        <el-form-item prop="smsCount" class="login_item" >
          <el-col :span="14">
            <el-input v-model="registerForm.smsCount"  placeholder="验证码"></el-input>
          </el-col>
          <el-col :span="10" class="pl20">
            <el-button v-if="!Countdown" type="primary" class="login_btn" @click="sendMsg()" :disabled="disSendBtn">发送验证码</el-button>
            <el-button v-else type="primary" class="login_btn" @click="sendMsg()" :disabled="Countdown">重新发送{{second}}s</el-button>
          </el-col>
        </el-form-item>
        <el-form-item prop="password" class="login_item" >
          <el-input v-model="registerForm.password"  type="password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item prop="checked" class="login_item" >
          <el-checkbox v-model="registerForm.checked">
            我已阅读并接受
            <a class="blue_jump" @click="modal_show=true">用户协议</a>
          </el-checkbox>
        </el-form-item>
      </el-form>
      <div class="login_item ">
        <el-button type="primary" class="login_btn" @click="register()" :disabled="disRegister">注册</el-button>
      </div>
      <div class="login_item clearfix">
        <a href="#/registerMail" class="fl blue_jump">使用邮箱注册</a>
        <span class="fr">已有账户，去<a href="#/" class="blue_jump" >登录</a></span>
      </div>
    </div>
    <el-dialog v-model="modal_show" title="方舟绩效软件服务协议" size="large">
      <div>
        <p>方舟绩效软件（以下简称“本软件”）依据《方舟网服务协议》（以下简称“本协议”）的规定提供服务，本协议具有合同效力。本协议为您与方舟绩效软件（http://kpi.fz-ark.com）所有者方舟管理咨询股份有限公司（以下简称“我司”）所属之间所订立的约定。注册时，请您认真阅读本协议，审阅并接受或不接受本协议。</p>
        <br>
        <p>若您已经注册为本软件用户，即表示您已充分阅读、理解并同意自己与我司订立本协议，且您自愿接受本协议的条款约束。我司有权随时变更本协议并在本软件上予以公告。经修订的条款一经在本软件的公布后，立即自动生效。如您不同意相关变更，必须停止使用本软件。一旦您继续使用本软件，则表示您已接受并自愿遵守经修订后的条款。</p>
        <br>
        <b>第一条 </b>  您的权利和义务
        <p>1.   您有权根据本协议及我司发布的相关规则，参加我司的有关活动及有权享受本软件提供的其他有关资讯及信息服务；</p>
        <p>2.   您须自行负责自己的账号和密码，且须对在账号密码下发生的所有活动承担责任。您有权根据需要更改账户密码。因您的过错导致的任何损失由您自行承担，该过错包括但不限于：不按照提示操作，未及时进行操作，遗忘或泄漏密码，密码被他人破解，您使用的计算机被他人侵入等；
        </p>
        <p>3.   您在使用本软件过程中，不得传播包括但不限于含有下列内容之一的信息：</p>
        <p class="ml20">i.	危害国家安全，损害国家荣誉和利益，颠覆国家政权，破坏国家统一的；</p>
        <p class="ml20">ii.	破坏国家宗教政策，宣扬邪教和封建迷信，煽动民族仇恨、破坏民族团结的；</p>
        <p class="ml20">iii. 散布谣言，扰乱社会秩序，破坏社会稳定的；</p>
        <p class="ml20">iv. 散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</p>
        <p class="ml20">v. 侮辱或者诽谤他人，侵害他人合法权利的，或其它道德上令人反感的内容；</p>
        <p class="ml20">vi. 煽动非法集会、结社、游行示威、聚众扰乱社会秩序的；</p>
        <p class="ml20">vii. 含有中国法律、法规以及任何具有法律效力之规范所限制或禁止的其它内容的。</p>
        <p>4.   您应当向我司提供真实准确的注册信息，包括但不限于联系电话、地址、邮政编码等。保证我司可以通过上述联系方式与您进行联系。同时，您也应当在相关资料实际变更时及时更新有关注册资料；<br>
          5.   您不得以任何形式擅自转让或授权他人使用自己在本软件的账号；<br>
          6.   您有义务确保在本软件上发布的信息真实、准确、无误导性；　<br>
          7.   您使用本软件应当遵守诚实信用原则，不得从事与本软件服务无关的不当行为；<br>
          8.   您承诺自己在使用本软件实施的所有行为应遵守法律、法规、行政规章和我司的相关规定以及各种社会公共利益或公共道德。如有违反导致任何法律后果的发生，您将以自己的名义独立承担相应的法律责任；<br>
          9.   您在使用本软件过程中如与其他用户产生纠纷，可以请求我司从中予以协调处理。您如发现其他用户有违法或违反本协议的行为，可以向我司举报；<br>
          10. 未经我司书面允许，您不得将本软件的任何资料以及本软件所展示的任何信息作商业性利用（包括但不限于以复制、修改、翻译等形式制作衍生作品、分发或公开展示）；<br>
          11. 您不得使用以下方式登录本软件或破坏本软件所提供的服务：
        <p>A.   以任何机器人软件、蜘蛛软件、爬虫软件、刷屏软件或其它自动方式访问或登录本软件；<br>
          B.   通过任何方式对本软件内部结构造成或可能造成不合理或不合比例的重大负荷的行为；<br>
          C.   通过任何方式干扰或试图干扰软件的正常工作或软件上进行的任何活动。</p>
        </p>
        <br>
        <p><b>第二条   </b>方舟软件的权利和义务</p>
        <p>1.   我司有义务对您在注册使用本软件信息中所遇到的问题及反映的情况及时解决；　<br>
          2.   我司有权对您的注册资料进行审查，对存在任何问题或怀疑的注册资料，我司有权发出通知询问您并要求您做出解释、改正；<br>
          3.   您因使用本软件与其他用户产生纠纷的，双方可将纠纷告知我司，或我司知悉纠纷情况的，经审核后，我司有权通过电子邮件及电话联系向纠纷双方了解纠纷情况，并将所了解的情况通过电子邮件互相通知对方；用户通过司法机关依照法定程序要求我司提供相关资料，我司将积极配合并提供有关资料；<br>
          4.   因网上信息软件的特殊性，我司没有义务对所有用户的行为及其他事项进行事先审查，但如发生以下情形，我司有权无需征得用户的同意即可限制用户的活动、向用户核实有关资料、发出警告通知、暂时中止、无限期中止及拒绝向该用户继续提供服务：<br>
          　
        <p>
        <p>A.   用户违反本协议或因被提及而纳入本协议的相关规则；</p>
        　<p>B.   存在用户或其他第三方通知我司，认为某个用户或具体事项存在违法或不当行为，并提供相关证据，而我司无法联系到该用户核证或验证该用户向我司提供的任何资料；<br>　　</p>
        　<p>C.   存在用户或其他第三方通知我司，认为某个用户或具体事项存在违法或不当行为，并提供相关证据。我司以普通非专业使用者的知识水平标准对相关内容进行判别，可以明显认为这些内容或行为可能对本软件用户或本软件造成财务损失或法律责任。<br></p>
        </p>
        5.   根据国家法律、法规、行政规章规定、本协议的内容和我司所掌握的事实依据，可以认定该用户存在违法或违反本协议行为以及在本软件上的其他不当行为，我司有权无需征得用户的同意作出删除相关信息、终止服务提供等处理；<br>
        6.   我司有权在不通知用户的前提下，删除或采取其他限制性措施处理下列信息：包括但不限于以规避费用为目的；以炒作信用为目的；存在欺诈等恶意或虚假内容；违反公共利益或可能严重损害我司和其他用户合法利益。
        <p>
          <br>
          <b>第三条   </b>服务的中断和终止</p>
        1.   我司可自行全权决定以任何理由（包括但不限于我司认为用户已违反本协议及相关规则的字面意义和精神，或用户在超过360日内未登录本软件等）终止对用户的服务，并有权在两年内保存用户在我司的全部资料（包括但不限于用户信息、项目信息等）。同时我司可自行全权决定，在发出通知或不发出通知的情况下，随时停止提供全部或部分服务。服务终止后，我司没有义务为用户保留原账户中或与之相关的任何信息，或转发任何未曾阅读或发送的信息给用户或第三方；<br>
        2.   若用户申请终止本软件服务，需经我司审核同意，方可解除与我司的协议关系，但我司仍保留下列权利：<br>
        A.   我司有权在法律、法规、行政规章规定的时间内保留该用户的资料,包括但不限于以前的用户资料、记录等；<br>
        B.   若终止服务之前，该用户在本软件上存在违法行为或违反本协议的行为，我司仍可行使本协议所规定的权利。<br>
        3.   用户存在下列情况，我司可以终止向该用户提供服务：　　<br>
        A.   在用户违反本协议及相关规则规定时，我司有权终止向该用户提供服务。我司将在中断服务时通知用户。但该用户在被我司终止提供服务后，再一次直接或间接或以他人名义注册为本软件用户的，我司有权再次单方面终止为该用户提供服务；<br>
        B.   我司发现用户注册资料中主要内容是虚假的，我司有权随时终止为该用户提供服务；<br>
        C.   本协议终止或更新时，用户未确认新的协议的；<br>
        D.   其它我司认为需终止服务的情况。

        </p>
        <br>
        <p><b>第四条   </b>我司的责任范围</p>
        <p>
          1.   我司不能随时预见到任何技术上的问题或其他困难。该等困难可能会导致数据损失或其他服务中断。本软件是在现有技术基础上提供的服务。我司不保证以下事项∶<br>
          A.   本软件将符合所有用户的要求；<br>
          B.   本软件不受干扰、能够及时提供、安全可靠或免于出错；<br>
          C.   本服务使用权的取得结果是正确或可靠的。<br>
          2.   是否经由本软件下载或取得任何资料，由您自行考虑、衡量并且自负风险，因下载任何资料而导致您电脑系统的任何损坏或资料流失，您应负完全责任。希望您在使用本软件时，小心谨慎并运用常识；<br>
          3.   您经由本软件取得的建议和资讯，无论其形式或表现，绝不构成本协议未明示规定的任何保证；<br>
          4.   基于以下原因而造成的利润、商誉、使用、资料损失或其它无形损失，我司不承担任何直接、间接、附带、特别、衍生性或惩罚性赔偿（即使我司已被告知前款赔偿的可能性）：<br>
        <p>A.   本软件的使用或无法使用；</p>
        <p>B.   您的传输或资料遭到未获授权的存取或变更；</p>
        <p>C.   我司在任何第三方之声明或行为；</p>
        <p>D.   我司其它相关事宜。</p>

        </p>
        <br>
        <p><b>第五条   </b>知识产权</p>
        <p>
          本软件及本软件所使用的任何相关软件、程序、内容，包括但不限于作品、图片、档案、资料、网站构架、网站版面的安排、网页设计、经由本软件或广告商向用户呈现的广告或资讯，均由我司或其它权利人依法享有相应的知识产权，包括但不限于著作权、商标权、专利权或其它专属权利等，受到相关法律的保护。未经我司或权利人明示授权，用户保证不修改、出租、出借、出售、散布本软件及本软件所使用的上述任何资料和资源，或根据上述资料和资源制作成任何种类产品。
        </p>
        <br>
        <p><b>第六条   </b>隐私权</p>
        <p>
          1.   信息使用：<br>
          A.   我司不会向任何人出售或出借用户的个人或法人信息，除非事先得到用户得许可；<br>
          B.   我司亦不允许任何第三方以任何手段收集、编辑、出售或者无偿传播用户的个人或法人信息。任何用户如从事上述活动，一经发现，我司有权立即终止与该用户的服务协议，查封其账号。<br>
          2.   信息披露：用户的个人或法人信息将在下述情况下部分或全部被披露：<br>
          A.   经用户同意，向第三方披露；<br>
          B.   若用户是合法的知识产权使用权人并提起投诉，应被投诉人要求，向被投诉人披露，以便双方处理可能的权利纠纷；<br>
          C.   根据法律的有关规定，或者行政、司法机关的要求，向第三方或者行政、司法机关披露；<br>
          D.   若用户出现违反中国有关法律或者网站规定的情况，需要向第三方披露；<br>
          E.   为提供您所要求的产品和服务，而必须和第三方分享用户的个人或法人信息；<br>
          F.   其它我司根据法律或者软件规定认为合适的披露。<br>
          3.   信息安全：<br>
          A.   使用本软件服务时，请用户妥善保护自己的个人或法人信息，仅在必要的情形下向他人提供；<br>
          B.   如果用户发现自己的个人或法人信息泄密，尤其是用户账户或“支付账户管理”账户及密码发生泄露，请用户立即联络我司客服，以便我们采取相应措施。
        </p>
        <br>
        <p><b>第七条   </b>不可抗力</p>
        <p>
          因不可抗力或者其他意外事件，使得本协议的履行不可能、不必要或者无意义的，双方均不承担责任。本协议所称之不可抗力意指不能预见、不能避免并不能克服的客观情况，包括但不限于战争、台风、水灾、火灾、雷击或地震、罢工、暴动、瘟疫流行、黑客攻击、网络病毒、电信部门技术管制、政府行为或任何其它自然或人为造成的灾难等客观情况。
        </p>
        <br>
        <p><b>第八条   </b>隐私保密</p>
        <p>
          1.   如您未满18周岁，则您应在监护人监护、指导下阅读本协议和使用本服务。不具备前述条件的，您应立即终止注册或停止使用本软件服务。<br>
          2.   为更为有效的向用户提供服务，本软件收集的数据，可能会用于数据分析，我司有权将用户注册及使用本服务过程中所提供、形成的信息提供给我司的关联机构。除本协议另有规定外，我司不对外公开或向第三方提供用户的信息。<br>
          3.   双方保证在对讨论、签订、执行本协议中所获悉的属于对方的且无法自公开渠道获得的文件及资料（包括但不限于商业秘密、公司计划、运营活动、财务信息、技术信息、经营信息及其他商业秘密）予以保密。未经该资料和文件的原提供方同意，另一方不得向第三方泄露该商业秘密的全部或者部分内容。但法律、法规、行政规章另有规定或者双方另有约定的除外。
        </p>
        <br>
        <p><b>第九条   </b>纠纷解决方式</p>
        <p>
          1.   本协议及其规则的有效性、履行和与本协议及其规则效力有关的所有事宜，将受中华人民共和国法律管辖，任何争议仅适用中华人民共和国法律；<br>
          2.   凡因本协议及其规则发生的所有纠纷，双方可协商解决，若协商解决不了，双方同意提交争议至南通市有管辖权的法院进行解决。
        </p>
        <br>
        <p><b>第十条   </b>附则</p>
        <p>
          在本协议中所使用的下列词语，除非另有定义，应具有以下含义：<br>
          “本软件”在无特别说明的情况下，均指"方舟绩效软件"。<br>
          “我司”在无特别说明的情况下，均指"方舟管理咨询股份有限公司"。<br>
          “用户”：指具有完全民事行为能力的方舟绩效软件各项服务的个人或企业用户使用者。<br>
          “企业用户”：根据中国法律、法规、行政规章成立并合法存在的机关、企事业单位、社团组织和其他组织。
        </p>
      </div>
      <div slot="footer">
        <div class="btns clearfix" style="width: 150px;margin: 0px auto">
          <div class="btn btn-primary fr" @click="modal_show=false">确 定</div>
        </div>
      </div>
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
        modal_show:false,
        registerForm: {
          enterpriseName:'',
          mobilePhone:'',
          password: '',
          smsCount:'',
          checked:false
        },
        second:60,
        tenantId:'',
        disSendBtn:true,
//        disRegister:true,
        ruleInline: {
          enterpriseName: [
            {required: true, message: '请填写公司名称', trigger: 'blur'}
          ],
          mobilePhone: [
            {required: true, message: '请填写手机号码', trigger: 'blur'},
            {message: '填写正确电话号码', trigger: 'blur',pattern:/^0?(13[0-9]|15[012356789]|177|18[0-9]|14[57])[0-9]{8}$/}
          ],
          password: [
            {required: true, message: '请填写密码', trigger: 'blur'},
            {type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur'}
          ],
          smsCount: [
            {required: true, message: '请填写验证码', trigger: 'blur'},
          ]
        },
        Countdown:false
      }
    },
    computed:{
      disRegister:function () {
        if(this.registerForm.enterpriseName&&this.registerForm.mobilePhone&&
          this.registerForm.password&&this.registerForm.smsCount&&this.registerForm.checked){
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
        _com.disSendBtn=true;
        _com.$http.post(common.projectPath +'hasReg?registerName='+_com.registerForm.mobilePhone,{
        }).then(function (data) {
          data = data.body;
          if(data.code=='SUCCESS'){
            _com.$refs.registerForm.validateField('mobilePhone',function (valid){
              if(!valid){
                _com.disSendBtn=false;
              }else{
                _com.disSendBtn=true;
              }
            });
          }else{
            _com.$message.error(data.message);
          }
        })

      },
      update:function () {
        if(this.second <= 0)
        {
          this.Countdown = false;
        }
        else{
          this.second--;
        }
      },
      /**
       * 发送验证码
       */
      sendMsg:function () {
        var _com=this,data={
          mobile:_com.registerForm.mobilePhone
        };
//        _com.$refs.registerForm.validateField('mobilePhone',function (valid) {
//          if(valid){
            _com.$http.get(common.projectPath +'sendMsg',{
              params:{
                mobile:_com.registerForm.mobilePhone
              }
            }).then(function (data) {
              data = data.body;
              if(data.code=='SUCCESS'){
                _com.$message.success('验证码发送成功!');
                _com.Countdown=true;
                if (this.second > 0) {
                  var timer=setInterval(this.update, 1000);
                }else{
                  clearInterval(timer);
                  _com.second = 60;
                }
              }else{
                _com.$message.error(data.message);
              }
            })
//          }
//        })

      },
      /**
       * 登录验证
       * @param name 登录框模型名
       */
      register: function () {
        var _com = this,
          url,
          vo = {
            enterpriseName: _com.registerForm.enterpriseName,
            mobilePhone: _com.registerForm.mobilePhone,
            password: _com.registerForm.password,
            smsCount:_com.registerForm.smsCount
          };
        _com.$refs.registerForm.validate(function (valid) {
          if (valid) {
            url = '/register';
            _com.$http.post(common.projectPath + url, vo, {
              emulateJSON: false //emulateJSON 默认是false,以json形式传参;true以formData形式,post的时候必传
            }).then(function (data) {
              data = data.body;
              if (data.code=='SUCCESS') {
                _com.tenantId=data.data.id;
                quicker.setCookie("tenant_id", _com.tenantId, '/');
                _com.init();
              } else {
                _com.$message.error(data.message);
              }
            })
          }
        })
      },
      init: function () {
        var _com = this,data={
          id:_com.tenantId
        };
        _com.$http.post(common.projectPath+'init',data,{
          emulateJSON: false //emulateJSON 默认是false,以json形式传参;true以formData形式,post的时候必传
        }).then(function (data) {
          data = data.body;
          if(data.code=='SUCCESS'){
            window.location.hash = "#/addDatas";
          }else{
            _com.$message.error(data.message);
          }
        })
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

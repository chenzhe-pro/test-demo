<template>
  <div class="wrapper">
    <div class="login_box register">
      <div class="img_box"><img src="../../assets/img/logo_small.png" alt=""></div>
      <div class="login_item sub_header">
        <p class="">完善资料</p>
      </div>
      <!--<div class="login_item">-->
        <!--<el-input v-model="dataForm.loginName" placeholder="手机/邮箱"></el-input>-->
      <!--</div>-->
      <!--<div class="login_item">-->
        <!--<el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>-->
      <!--</div>-->
      <el-form :model="dataForm" :rules="ruleInline" ref="dataForm">
        <el-form-item class="login_item" >
          <el-cascader
            :options="options"
            @active-item-change="handleItemChange"
            :props="props" placeholder="公司所在地"
          ></el-cascader>
          <!--<el-select v-model="dataForm.loginName" placeholder="公司所在地">-->
            <!--<el-option label="区域一" value="shanghai"></el-option>-->
            <!--<el-option label="区域二" value="beijing"></el-option>-->
          <!--</el-select>-->
        </el-form-item>
        <el-form-item class="login_item" >
          <el-cascader
            :options="industry"
            @active-item-change="handleIdsChange"
            :props="props2" placeholder="所处行业"
          ></el-cascader>
        </el-form-item>
        <el-form-item class="login_item" >
          <el-select v-model="dataForm.companySize" placeholder="公司规模">
            <el-option v-for="a in size" :label="a.label" :value="a.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="login_item" >
          <el-select v-model="dataForm.turnover" placeholder="年营业额">
            <el-option v-for="t in turnover" :label="t.label" :value="t.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="login_item ">
      <el-button type="primary" class="login_btn" @click="getDatas()">完成注册</el-button>
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
        props: {
          value: 'value',
          children: 'simpleCitys'
        },
        props2: {
          value: 'value',
          children: 'postSimple'
        },
        options:[],//公司所在地显示
        industry:[],//行业数据
        dataForm: {
          turnover:'',
          companySize:'',
          location:[],
          industry:[]
        },
        size:[
          {label:'20人以下',value:'A'},
          {label:'20~99人',value:'B'},
          {label:'100~499人',value:'C'},
          {label:'500~999人',value:'D'},
          {label:'1000~9999人',value:'E'},
          {label:'10000人以上',value:'F'},
        ],
        turnover:[
          {label:'10万以下',value:'A'},
          {label:'10万~50万',value:'B'},
          {label:'50万~100万',value:'C'},
          {label:'100万~300万',value:'D'},
          {label:'300万~1000万',value:'E'},
          {label:'1000万~3000万',value:'F'},
          {label:'3000万~1亿',value:'G'},
          {label:'1亿~3亿',value:'H'},
          {label:'3亿以上',value:'I'},
        ],
        ruleInline: {
          location: [
            {required: true,type:'array', message: '请选择公司所在地', trigger: 'change'}
          ],
          industry: [
            {required: true,type:'array', message: '请选择所处行业', trigger: 'change'}
          ],
          companySize: [
            {required: true, message: '请选择公司规模', trigger: 'change'}
          ],
          turnover: [
            {required: true, message: '请选择年营业额', trigger: 'change'}
          ],
//          password: [
//            {required: true, message: '请填写密码', trigger: 'blur'},
//            {type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur'}
//          ]
        }
      }
    },
    computed:{
      disBtn:function () {
        if(this.dataForm.turnover&&this.dataForm.companySize&&
          this.dataForm.location.length>0&&this.dataForm.industry.length>0){
          return false;
        }else{
          return true;
        }
      }
    },
    methods: {
      handleIdsChange:function (val) {
        var _com=this;
        _com.dataForm.industry=val;
        _com.$http.get(common.projectPath+'common/industry/subdetail/list',{
          params:{
            positionId:_com.dataForm.industry[0]
          }
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            if(data.data){
              for(var i=0;i<data.data.length;i++){
                data.data[i].label=data.data[i].name
                data.data[i].value=data.data[i].id
              }
              for(var k=0;k<_com.industry.length;k++){
                if(_com.industry[k].id==_com.dataForm.industry[0]){
                  _com.industry[k].postSimple=data.data;
                }
              }
            }
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      handleItemChange:function (a) {
        var _com=this;
        _com.dataForm.location=a;
        console.log(_com.dataForm.location);
        if(a.length==1){
          _com.$http.get(common.projectPath+'common/area/city/list',{
            params:{
              provinceId:_com.dataForm.location[0]
            }
          }).then(function (data) {
            data=data.body;
            if(data.code=='SUCCESS'){
              if(data.data){
                for(var i=0;i<data.data.length;i++){
                  data.data[i].label=data.data[i].name
                  data.data[i].value=data.data[i].id
                  data.data[i].simpleCitys=[]
                }
                for(var k=0;k<_com.options.length;k++){
                  if(_com.options[k].id==_com.dataForm.location[0]){
                    _com.options[k].simpleCitys=data.data;
                  }
                }
              }
            }else{
              _com.$message.error(data.message);
            }
          })
        }else{
          _com.$http.get(common.projectPath+'common/area/district/list',{
            params:{
              cityId:_com.dataForm.location[1]
            }
          }).then(function (data) {
            data=data.body;
            if(data.code=='SUCCESS'){
              if(data.data){
                for(var i=0;i<data.data.length;i++){
                  data.data[i].label=data.data[i].name
                  data.data[i].value=data.data[i].id
                }
                for(var k=0;k<_com.options.length;k++){
                  if(_com.options[k].children)
                  for(var j=0;j<_com.options[k].children.length;j++){
                    _com.options[k].children.simpleCitys=[];
                    if(_com.options[k].children[j].id==_com.dataForm.location[1]){
                      _com.options[k].children[j].simpleCitys=data.data;
                      console.log(_com.options[k])
                    }
                  }
                }
              }
            }else{
              _com.$message.error(data.message);
            }
          })
        }

      },
      getDatas:function () {
        var ids=quicker.getCookie("tenant_id")?decodeURIComponent(quicker.getCookie("tenant_id")) : null;

        var _com=this,data={
          id:ids,
//          turnover:_com.dataForm.turnover,
//          scale:_com.dataForm.companySize,
          province:_com.dataForm.location[0],
          city:_com.dataForm.location[1],
          district:_com.dataForm.location[2],
          positionId:_com.dataForm.industry[0],
          industryId:_com.dataForm.industry[1],
        };
        if(_com.dataForm.companySize){
          data.scale=_com.dataForm.companySize;
        }
        if(_com.dataForm.turnover){
          data.turnover=_com.dataForm.turnover;
        }
        if(_com.dataForm.turnover||_com.dataForm.companySize||
          _com.dataForm.location.length>0||_com.dataForm.industry.length>0){
          _com.$http.post(common.projectPath+'updateInfo',data,{
            emulateJSON: false //emulateJSON 默认是false,以json形式传参;true以formData形式,post的时候必传
          }).then(function (data) {
            data = data.body;
            if(data.code=='SUCCESS'){
              _com.$message.success('您已完成注册!请登录!');
              window.location.hash='#/'
            }else{
              _com.$message.error(data.message);
            }
          })
        }else{
          window.location.hash='#/'
        }
      },
      getProvince:function () {
        var _com=this;
        _com.$http.get(common.projectPath+'common/area/province/list',{
          params:{}
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            if(data.data){
              for(var i=0;i<data.data.length;i++){
                data.data[i].label=data.data[i].name
                data.data[i].value=data.data[i].id
              }
            }
            _com.options=data.data;
          }else{
            _com.$message.error(data.message);

          }
        })
      },
      getIndustry:function () {
        var _com=this;
        _com.$http.get(common.projectPath+'common/industry/major/list',{
          params:{}
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            if(data.data){
              for(var i=0;i<data.data.length;i++){
                data.data[i].label=data.data[i].name
                data.data[i].value=data.data[i].id
              }
            }
            _com.industry=data.data;
          }else{
            _com.$message.error(data.message);
          }
        })
      }
    },
    mounted: function () {
      var _com = this;
//      _com.getDatas();
      _com.getProvince();
      _com.getIndustry();
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

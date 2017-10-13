<!--头部组件-->
<template>
  <div class="departmentSet" v-loading.fullscreen="pageLoading">
    <p class="set_title mb10">方法一：利用软件提供的《绩效人员花名册》，填写后导入软件，完成初始化</p>
    <div class="set_content">
      <div class="gray-box">
        <p class="instructions mb10">
          步骤一：下载《绩效人员花名册》，根据公司实际需求填写参加绩效考核的人员信息，并保存；
          <a style="color: #3DA8F5" class=" primary" href="http://kpid.fz-ark.com/api/绩效考核人员花名册.xlsx">点击下载</a>
        </p>
        <div class="clearfix">
          <p class="instructions fl mr10">
            步骤二：上传《绩效人员花名册》
          </p>
          <el-upload class="upload-demo"  accept=".xlsx" :action="fileUrl" :show-file-list="false" :on-error="error"  :on-success="success">
            <a class="fl primary" v-if="beforeUpload">点击上传</a>
            <a class="fl primary" v-else>重新上传</a>
          </el-upload>
        </div>

      </div>
      <div>
        <el-button style="width: 150px;height:40px;margin:20px 0 20px 450px;" type="primary" :disabled="disFirstBtn"  @click="nextStep()">下一步</el-button>
      </div>
    </div>
    <!--<div class="set_content">-->
      <!--<p class="method_text">方法二：公司已有绩效考核人员的花名册（excel表格形式），且包含了工号、手机号、岗位、上级领导、上级领导工号、所属部门、上级部门等信息，可用此方法导入软件，完成初始化。导入前，请将表头栏目作为第一行，具体人员信息自第2行开始；若导入出现问题，请调整表格后重新上传</p>-->
      <!--<div class="gray-box">-->
        <!--<div class="clearfix">-->
          <!--<p class="instructions fl mr20">-->
            <!--上传公司自有绩效考核人员花名册-->
            <!--&lt;!&ndash;请将您公司参与考核人员的花名册（exl格式）命名为绩效考核人员花名册并上传，如果有改动，请点击重新上传，上传完毕之后，请将您表单里的内容与绩效考核人员花名册-模板里的内容勾选对应&ndash;&gt;-->
          <!--</p>-->
          <!--<el-upload class="upload-demo"  accept=".xlsx" :action="fileUrl2" list-type="text"-->
                     <!--:file-list="fileList" :show-file-list="false" :on-success="getList" :before-upload="getLoading">-->
            <!--<a class="fl primary" v-if="selfUpload">点击上传 </a>-->
            <!--<a class="fl primary" v-else>重新上传</a>-->
          <!--</el-upload>-->
        <!--</div>-->

        <!--&lt;!&ndash;<div class="clearfix">&ndash;&gt;-->
          <!--&lt;!&ndash;<img class="fl mr20" src="../../assets/img/excel.png" alt="">&ndash;&gt;-->
          <!--&lt;!&ndash;<span class="fl mr20">绩效考核花名册</span>&ndash;&gt;-->
          <!--&lt;!&ndash;<a class="fl primary mr20" >{{selfHeader}}</a>&ndash;&gt;-->

        <!--&lt;!&ndash;</div>&ndash;&gt;-->

      <!--</div>-->
        <!--<el-button :disabled="disBtn"  style="width: 150px;height:40px;margin:20px 0 20px 450px;" type="primary"  @click="getNext">下一步</el-button>-->
    <!--</div>-->
  </div>
</template>

<script>
  module.exports = {
    data: function () {
      return {
        departmentForm:{
          region:[]
        },
        tableHeader:'',//方法一上传的模板名字
        selfHeader:'',//方法二上传的自定义模板名字
        localList:[],
        customList:[],
        secondStep:false,
        beforeUpload:true,//方法一是否显示重新上传
        selfUpload:true,//方法二是否显示重新上传
        fileList:[],//上传的excel模板
//        fileList1:[],//上传的excel模板
        fileUrl:common.projectPath + 'usr/employee/upload',//上传Excel表格的请求路径
        fileUrl2:common.projectPath + 'usr/employee/customUpload',//上传Excel表格的请求路径
        disBtn:true,
        disFirstBtn:true,
        pageLoading:false,
        checkIf:false
      }
    },
    computed:{
      userInfo:function () {
        return this.$store.state.userInfo;
      }
    },
    props:['childFun'],
    methods:{
      nextStep:function () {
        this.childFun('1-1','2-1','next')
        this.childFun('1-2','2-1','next')
      },
      success:function (data,fileList) {

        if(data.code=='SUCCESS'){
          this.tableHeader=data.data.fileName
          this.$message.success(data.message);
          this.disFirstBtn=false;
          this.beforeUpload=false;
        }else{
          this.$message.error({
            showClose:true,
            message:data.message,
            duration:10000
          });
        }

      },
      error:function (data) {
        this.$message.error(
          {
            showClose:true,
            message:data.message,
            duration:10000
          }
        );
      },
      /**
       * 方法二上传成功之后回调函数
       * @param data 上传成功得到的返回值
       */
      getList:function (data) {
        var _com=this;

        _com.checkIf=true;
        setTimeout(function () {
          _com.pageLoading=false;
        },500);
        if(data.code=='SUCCESS'){
          if(data.data){
            _com.localList=data.data.local;
            for(var i=0;i<_com.localList.length;i++){
              _com.departmentForm.region[i]=''
            }
            this.$store.commit('changeUpload',data.data);
            _com.customList=data.data.custom;
            _com.selfHeader=data.data.customFileName[0];
            _com.disBtn=false;
            _com.selfUpload=false;
            this.$message.success(data.message);
          }
        }else{
          this.$message.error({
            showClose:true,
            message:data.message,
            duration:10000
          });
        }


      },
      getLoading:function (file) {
        this.pageLoading=true;
      },
      getNext:function () {
        if(this.localList){
          window.location.href='index.html#/initSet?step=1&sub_step=2'
//          this.childFun('1-1','1-2','next');
        }else{

        }
      }
    },
    components: {

    },
    mounted:function () {
      this.$nextTick(function () {
        quicker.returnTop();
      })
    }
  }
</script>


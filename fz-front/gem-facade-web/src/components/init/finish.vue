<!--头部组件-->
<template>
  <div class="departmentSet" v-if="!secondStep">
    <div class="set_content">
      <div class="mb20 mt30">
        <p class="mb10">恭喜您，完成了公司账号的初始化，点击按钮“完成”：</p>
        <p>1、为导入的绩效考核人员分配员工账号，并将分配的账号及初始密码发送至手机上，提醒员工登陆软件并修改密码；</p>
        <p>2、正式完成公司账号初始化设置，进入软件使用界面。如有疑问或建议，请拨打客服电话 0512-81234567。</p>

      </div>

      <div class="btns clearfix" style="width: 320px;margin: 40px auto">
        <div class="btn btn-light fl" @click="childFun('5','4','prev')">上一步</div>
        <div class="btn btn-primary fr" @click="childFun('5','','next')">完成</div>
      </div>
    </div>
  </div>
</template>

<script>
  module.exports = {
    data: function () {
      return {
        departmentForm:{
          region:[]
        },
        tableHeader:'绩效考核花名册',
        localList:[],
        customList:[],
        secondStep:false,
        fileList:[],//上传的excel模板
        fileUrl:common.projectPath + 'usr/employee/upload',//上传Excel表格的请求路径
        fileUrl2:common.projectPath + 'usr/employee/customUpload',//上传Excel表格的请求路径
      }
    },
    computed:{
      userInfo:function () {
        return this.$store.state.userInfo;
      }
    },
    props:['childFun'],
    methods:{
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


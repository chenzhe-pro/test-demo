<!--头部组件-->
<template>
  <div class="departmentSet" >
    <p class="set_title">基础信息匹配</p>
    <div class="set_content">
      <div class="select_form">
        <el-form ref="departmentForm" :model="departmentForm" label-width="100px">
          <el-form-item v-for="(s,index) in localList" :label="s" >
            <el-select v-model="departmentForm.region[index]" placeholder="请选择与左侧相匹配的内容">
              <el-option v-for="c in customList" :label="c" :value="c"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="btns pt40 clearfix" style="width: 320px;margin: 40px auto">
      <div class="btn btn-light fl" @click="goLast">上一步</div>
      <div class="btn btn-primary fr" @click="goNext">下一步</div>
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
        required:[],
        secondStep:false,
        fileList:[],//上传的excel模板
        fileUrl:common.projectPath + 'usr/employee/upload',//上传Excel表格的请求路径
        fileUrl2:common.projectPath + 'usr/employee/customUpload',//上传Excel表格的请求路径
      }
    },
    computed:{
      uploadData:function () {
        return this.$store.state.uploadData;
      }
    },
    props:['childFun'],
    methods:{
      goLast:function () {
        this.childFun('1-2','1-1','prev');
      },
      init:function () {
        this.localList=this.uploadData.local;
        for(var i=0;i<this.localList.length;i++){
          this.departmentForm.region.push('');
        }
        this.customList=this.uploadData.custom;
        this.required=this.uploadData.required;
      },
      goNext:function () {
        var _com=this,data={
          "items":[]
        };
//        _com.localList=this.uploadData.local

        for(var i=0;i<_com.departmentForm.region.length;i++){
          data.items.push({key:_com.departmentForm.region[i],value:''})
        }
        for(var j=0;j<_com.localList.length;j++){
          if(j<_com.departmentForm.region.length){
            data.items[j].value=_com.localList[j];
          }
        }
        var arr=[];
        for(var key in data.items){
          if(data.items[key].key&&data.items[key].value){
            arr.push(data.items[key].value)
          }
        }
        if(_com.isContained(arr,this.required)){
          _com.$http.post(common.projectPath+'usr/employee/saveCustom',data,{
          }).then(function (data) {
            data=data.body;
            if(data.code=='SUCCESS'){
              this.childFun('1-1','2-1','next');
              this.childFun('1-2','2-1','next');
            }else{
              _com.$message.error({
                showClose:true,
                message:data.message,
                duration:10000
              });
            }
          })
        }else{
          var a=[];
          a=this.required;
          for(var k=0;k<a.length;k++){
            for(var l=0;l<_com.departmentForm.region.length;l++){
              if(a[k]==_com.departmentForm.region[l]){
                a.splice(k,1)
              }
            }
          }
          _com.$message.error(
          {
            showClose:true,
            message:a+'是必选项!',
            duration:10000
          });
        }

      },
      isContained:function (a,b) {
        if(a.length < b.length) return false;
        var aStr = a.toString();
        for(var i = 0, len = b.length; i < len; i++){
          if(aStr.indexOf(b[i]) == -1) return false;
        }
        return true;
      }
//
    },
    components: {

    },
    mounted:function () {
      this.init();
      this.$nextTick(function () {
        quicker.returnTop();
      })
    }
  }
</script>


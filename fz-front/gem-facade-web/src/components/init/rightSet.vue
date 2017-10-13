<!--头部组件-->
<template>
  <div class="checkSet" v-if="!secondStep">
    <p class="set_title">权限设置</p>
    <div class="set_content">
      <div>请根据公司实际情况设置相应人员：</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" label-position="left" class="mt20 demo-ruleForm">
        <el-form-item label="Boss：">
          <el-select style=""  v-model="ruleForm.boss" size="small" filterable remote clearable
                     placeholder="请指派人员" :remote-method="remoteMethod" :loading="loading">
            <el-option v-for="item in personList" :key="item.id" :label="item.realName" :value="item.id">
            </el-option>
          </el-select>
          <div class="f12" style="width: 192px;line-height: normal;color: #999;">本系统默认由Boss审批公司目标系统图,Boss可查看公司所有员工绩效相关信息。</div>
        </el-form-item>
        <el-form-item label="总经理：">
          <el-select style=""  v-model="ruleForm.manager" size="small" filterable remote clearable
                     placeholder="请指派人员" :remote-method="remoteMethod" :loading="loading">
            <el-option v-for="item in personList" :key="item.id" :label="item.realName" :value="item.id">
            </el-option>
          </el-select>
          <div class="f12" style="width: 192px;line-height: normal;color: #999;">本系统默认由总经理创建公司目标系统图，并维护公司指标库。</div>
        </el-form-item>
      </el-form>
    </div>
    <div class="btns clearfix" style="width: 320px;margin: 40px auto">
      <div class="btn btn-light fl" @click="childFun('4','3','prev')">上一步</div>
      <div class="btn btn-primary fr" @click="nextStep()">下一步</div>
    </div>
  </div>
</template>

<script>
  module.exports = {
    data: function () {
      return {
        ruleForm:{
          boss:'',
          manager:''
        },
        personList:[],
        planList:[],
        checkList:[],
      }
    },
    computed:{
      userInfo:function () {
        return this.$store.state.userInfo;
      }
    },
    props:['childFun'],
    methods:{
      getList:function () {
        var _com=this;
        _com.$http.get(common.projectPath + 'usr/approvesetting/queryApprove',{
          parmas:{}
        }).then(function (data) {
          data=data.body;
          if(data.code==='SUCCESS'){
            for(var i=0;i<data.data.length;i++){
              data.data[i].list=[];
              if(data.data[i].upper==='Y'){
                data.data[i].list.push('直接主管')
              }
              if(data.data[i].senior==='Y'){
                data.data[i].list.push('间接主管')
              }
              if(data.data[i].name==='工作目标'){
                _com.workList=data.data[i];
              }else if(data.data[i].name==='工作计划表'){
                _com.planList=data.data[i];
              }else if(data.data[i].name==='考核表'){
                _com.checkList=data.data[i];
              }
            }
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      nextStep:function () {
        console.log(this.workList)
        var _com=this,
          data=[
            {
              name:'工作目标',
              upper:'',
              senior:'',
              id:_com.workList.id
            },
            {
              name:'工作计划表',
              upper:'',
              senior:'',
              id:_com.planList.id
            },
            {
              name:'考核表',
              upper:'',
              senior:'',
              id:_com.checkList.id
            }
          ]
        if(_com.workList.list.indexOf('直接主管')>-1){
          data[0].upper='Y'
        }else{
          data[0].upper='N'
        }
        if(_com.workList.list.indexOf('间接主管')>-1){
          data[0].senior='Y'
        }else{
          data[0].senior='N'
        }
        if(_com.planList.list.indexOf('直接主管')>-1){
         data[1].upper='Y'
        }else{
          data[1].upper='N'
        }
        if(_com.planList.list.indexOf('间接主管')>-1){
          data[1].senior='Y'
        }else{
          data[1].senior='N'
        }
        if(_com.checkList.list.indexOf('直接主管')>-1){
          data[2].upper='Y'
        }else{
          data[2].upper='N'
        }
        if(_com.checkList.list.indexOf('间接主管')>-1){
          data[2].senior='Y'
        }else{
          data[2].senior='N'
        }
        _com.$http.post(common.projectPath + 'usr/approvesetting/update',data,{

        }).then(function (data) {
          data=data.body;
          if(data.code==='SUCCESS'){
            _com.$message.success('保存成功!');
            _com.childFun('4','5','next');
          }else {
            _com.$message.error(data.message);
          }
        })
      }
    },
    components: {

    },
    mounted:function () {
      this.getList();
      this.$nextTick(function () {
        quicker.returnTop();
      })
    }
  }
</script>


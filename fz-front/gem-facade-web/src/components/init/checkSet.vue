<!--头部组件-->
<template>
  <div class="checkSet" v-if="!secondStep">
    <p class="set_title">审核设置</p>
    <div class="set_content">
      <div class="mt20 clearfix">
        <span class="gray-text fl">工作目标</span>
        <el-checkbox-group v-model="workList.list" class="fl">
          <el-checkbox label="直接主管"></el-checkbox>
          <el-checkbox label="间接主管"></el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="mt20 clearfix">
        <span class="gray-text fl">工作计划表</span>
        <el-checkbox-group v-model="planList.list" class="fl" >
          <el-checkbox label="直接主管"></el-checkbox>
          <el-checkbox label="间接主管"></el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="mt20 clearfix">
        <span class="gray-text fl">考核表</span>
        <el-checkbox-group v-model="checkList.list" class="fl">
          <el-checkbox label="直接主管"></el-checkbox>
          <el-checkbox label="间接主管"></el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div class="btns clearfix" style="width: 320px;margin: 40px auto">
      <div class="btn btn-light fl" @click="childFun('3','2-2','prev')">上一步</div>
      <div class="btn btn-primary fr" @click="nextStep()">下一步</div>
    </div>
  </div>
</template>

<script>
  module.exports = {
    data: function () {
      return {
        workList:[],
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
            _com.childFun('3','4','next');
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


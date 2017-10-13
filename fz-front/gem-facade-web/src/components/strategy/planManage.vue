<!— ***模板  Created by limin on 2017/9/4—>
<template xmlns="http://www.w3.org/1999/html">
    <div class="indicator_box planManage strategyManage">
      <p class="clearfix bold_font">
        <span class="fl">{{planDetail.name}}</span>
        <span class="fr blue-text cursor_pointer return_top" @click="return_last"><i class="fa fa-arrow-circle-left fa-lg "></i> 返回上一级</span>
      </p>
      <p class="gray-text f12 mt5 mb10">版本号：<span class="ml10">V{{planDetail.version}}</span></p>
      <div class="clearfix" style="position: relative;width:100%;">
        <div class="transition_wrapper" style="height: 550px;position: relative;overflow: hidden;" :class="{transitioned:transitioned}">
          <div class="plan_detail">
            <div class="add_plan mb10">
              <div class="blue-text cursor_pointer"  @click="addPlan()"><i class="fa fa-plus-circle fa-lg "></i> 添加行动计划</div>
            </div>
            <div v-for="i in planList">
              <div class="plan_content" :class="{'no_padding':i.type==='gs'}">
                <div class="clearfix" >
                    <span class="">{{i.name}}
                      <span class="warn_tag mt5 ml10" v-if="i.isGs" style="background-color: #82C0EA;">GS</span>
                      <span class="warn_tag mt5 ml5" v-if="i.type==='gs'">上级分解</span>
                    </span>
                  <div class="btn btn-primary fr" v-if="i.type==='gs'&&i.planSteps.length===0" @click="addPlan('typeGs',i)">点此制定计划</div>
                  <span v-else class="arrow_circle fr cursor_pointer" @click="planToggle(i)"><i class="fa icon_color" v-bind:class="{'fa-angle-down': i.arrowControl, 'fa-angle-up': !i.arrowControl}"></i></span>
                </div>
                <div v-if="i.arrowControl">
                  <div class="clearfix mt10 pb10 mb10" style="border-bottom: 1px solid #F0F0F0">
                    <span class="gray-text fl">工作目标：</span>
                    <span class="fl" v-text="i.target">增加5家原辅材料的供应商</span>
                  </div>
                  <p class="gray-text mb10">实施步骤：</p>
                  <el-steps :space="100" direction="vertical">
                    <el-step style="height: 36px" v-for="p in i.planSteps">
                      <div slot="description">{{p.content}} <span class="gray-text ml30">{{p.endTime | short_time}}<span class="ml10" v-text="p.employeeName">周峰</span></span></div>
                    </el-step>
                  </el-steps>
                  <div class="btns clearfix" style="width: 260px;margin: 0px auto">
                    <div class="btn btn-light fl" @click="editPlan(i.id,i.type)">编辑行动计划</div>
                    <div class="btn btn-primary fr" @click="cancelPlan(i.id)">取消此行动计划</div>
                  </div>
                </div>

              </div>
              <div class="gray_content" v-if="i.arrowControl &&i.type==='target'">
                <div class="clearfix mb10">
                  <span class="gray-text fl">我的目标：</span>
                  <span class="fl" v-text="i.objectiveFormDetailValueText">增加5家原辅材料的供应商</span>
                </div>
                <div class="clearfix">
                  <span class="gray-text fl">策略名称：</span>
                  <span class="fl" v-text="i.indicatorMethodSelectedName">增加5家原辅材料的供应商</span>
                </div>
              </div>
            </div>
            <p class="no_data_tip gray_bg mt10" v-if="planList.length==0">暂无工作计划</p>
          </div>
          <div class="transition_button" @click="transitioned=!transitioned" :transitioned="transition">
            <span v-if="!transitioned" @click="initTable()">查看工作计划表</span>
            <span v-if="transitioned">编辑工作计划表</span>
          </div>
          <el-table class="plan_map" height="100%" :data="tableData" border style="width: 100%;">
            <el-table-column prop="typeText" align="center" label="事项类型" width="240"></el-table-column>
            <el-table-column prop="objectiveFormDetailValueText" align="center" label="目标" width="240">
              <template scope="scope">
                <div class="ml10 mr10" v-text="scope.row.objectiveFormDetailValueText"></div>
              </template>
            </el-table-column>
            <el-table-column prop="indicatorMethodSelectedName" align="center" label="策略" width="240">
              <template scope="scope">
                <div class="ml10 mr10" v-text="scope.row.indicatorMethodSelectedName"></div>
              </template>
            </el-table-column>
            <el-table-column prop="name" align="center" label="计划事项" width="240">
              <template scope="scope">
                <div class="ml10 mr10" v-text="scope.row.name"></div>
              </template>
            </el-table-column>
            <el-table-column prop="target" align="center" label="工作目标" width="240">
              <template scope="scope">
                <div class="ml10 mr10" v-text="scope.row.target"></div>
              </template>
            </el-table-column>
            <el-table-column prop="GS" align="center" label="是否列入GS" width="120">
              <template scope="scope">
                <div v-html="scope.row.GS"></div>
              </template>
            </el-table-column>
            <el-table-column prop="planSteps" align="center" label="计划内容" width="300">
              <template scope="scope">
                <div class="p10 borderDiv" style="text-align: left;" v-for="(item ,index) in scope.row.planSteps" v-text="index+1+'、'+item.content"></div>
              </template>
            </el-table-column>
            <el-table-column prop="planSteps" align="center" label="完成时间节点" width="150">
              <template scope="scope">
                <div class="p10 borderDiv" v-for="(item ,index) in scope.row.planSteps">{{item.endTime | short_time}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="planSteps" align="center" label="完成情况" width="200" v-if="show.chooseVersion">
              <template scope="scope">
                <div class="p10 borderDiv" v-for="(item ,index) in scope.row.planSteps">{{item.complete | short_time}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="planSteps" align="center" label="实际完成日期" width="150" v-if="show.chooseVersion">
              <template scope="scope">
                <div class="p10 borderDiv" v-for="(item ,index) in scope.row.planSteps">{{item.completeDate | short_time}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="planSteps" align="center" label="附件" width="100" v-if="show.chooseVersion">
              <template scope="scope">
                <div class="p10 blue-text cursor_pointer return_top" v-for="(item ,index) in scope.row.planSteps" v-if="item.attachment">点击下载</div>
                <div class="p10 borderDiv" v-for="(item ,index) in scope.row.planSteps" v-if="!item.attachment">{{item.attachment | short_time}}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!---添加或编辑行动计划-->
      <el-dialog v-model="plan_modal" :title="plan_title" size="large" :close-on-click-modal="false">
        <el-form ref="planForm" :model="planForm" :rules="plan_rule"  label-width="96px" label-position="left">
          <el-form-item style="position: relative;" label="计划名称：" prop="name">
            <el-input :disabled="disabledText" v-model="planForm.name"  placeholder="请输入计划名称"></el-input>
            <el-checkbox style="position: absolute; right: 0;top:0;" v-model="planForm.isGs" :disabled="disabledText">GS</el-checkbox>
          </el-form-item>
          <el-form-item label="工作目标：" prop="target">
            <el-input type="textarea" v-model="planForm.target"  placeholder="请输入工作目标"></el-input>
          </el-form-item>
          <el-form-item label="实施步骤：" prop="target">
          </el-form-item>
        </el-form>
        <!--<p class="gray-text mb10 mt20">实施步骤：</p>-->
        <el-steps :space="100" direction="vertical">
          <el-step style="height: 36px" v-for="(x,index) in steps">
            <div slot="description" >
              <el-input style="width: 480px;" :class="{mr10:true, 'red-border':(!x.content&&unfilled)}" v-model="x.content" placeholder="请输入具体步骤内容"></el-input>
              <el-date-picker
                v-model="x.endTime"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerOptions" :class="{'red-border':(!x.endTime&&unfilled)}">
              </el-date-picker>
              <el-select style=""  v-model="x.employeeId" size="small" filterable remote clearable
                         placeholder="请指派人员" :remote-method="remoteMethod" :loading="loading" :class="{'red-border':(!x.employeeId&&unfilled)}">
                <el-option v-for="item in personList" :key="item.id" :label="item.realName" :value="item.id">
                </el-option>
              </el-select>
              <div class="operate_btn">
                <el-button v-if="steps.length!==1" type="text" class="p0" size="large" style="padding: 0" @click="clearStep(x,index)"> <i class="fa fa-trash fa-lg" aria-hidden="true"></i></el-button>
              </div>
              <el-button v-if="index==steps.length-1" type="text" style="padding: 0" size="large" @click="addStep()"> <i class="fa fa-plus-circle fa-lg" style="color: #3DA8F5" aria-hidden="true"></i></el-button>
            </div>
          </el-step>
        </el-steps>
        <div slot="footer">
          <div class="btns clearfix" style="width: 260px;margin: 40px auto;">
            <div class="btn btn-light fl" @click="plan_modal=false">取消</div>
            <div class="btn btn-primary fr" @click="savePlan()">确定</div>
          </div>
        </div>
      </el-dialog>
      <div v-if="!transitioned" class="btn btn-primary" @click="toCheck()" style="width: 155px;margin: 20px auto 0;display: block;">提交</div>
    </div>
</template>
<script>
  module.exports = {
    data: function () {
      return {
        pickerOptions: {},
        planId:'',
        unfilled:false,
        personList:[],//
        transitioned:false,
        planDetail:{},//当前计划表
        steps:[
          {
            content:'',
            endTime:'',
            employeeId:'',
            step:1
          }
        ],//行动计划对话框里面的步骤
        plan_rule:{
          name: [
            {required: true, message: '请填写计划名称', trigger: 'blur'}
          ],
          target: [
            {required: true, message: '请填写工作目标', trigger: 'blur'}
          ],
          steps: [
            {required: true, message: '请填写实施步骤'}
          ]
        },
        tableData: [],//计划表格
        plan_modal:false,//添加或者编辑行动计划对话框
        plan_title:'制定行动计划',//添加或者编辑策略对话框的标题
        planForm:{
          name:'',
          target:'',
          isGs:false
        },//添加或者编辑行动计划对话框的内容
        stepForm:{
          name:'接洽不低于8家此类材料供应商，获取供应商',
          date:'2017-09-07',
          person:'郑少飞'
        },//步骤
        planList:[],//计划列表
        disabledText:false,
        planType:'',

      }
    },
    props:['show'],
    computed: {
      transition:function () {
        if(this.transitioned){
          $('.plan_map').css({display:'block',right:'0px'});
          $('.transition_button').css({right:($('.transition_wrapper').width()-40)+'px'});
          if(this.show.chooseVersion){
            $('.transition_button').css('display','none');
            $('.plan_map').css('padding',0);
          }
        }
        else{
          $('.plan_map').css({display:'block',right:'-'+($('.transition_wrapper').width())+'px'});
          $('.transition_button').css({right:(0)+'px'});
        }
        return this.transitioned;
      },
      year: function () {
        return this.$store.state.year;
      },
      text: function () {
        return this.$store.state.text;
      },
    },
    methods: {

      initTable:function () {
        var c=$('tbody tr').length;
        for(var i=0;i<c;i++){
          var h=$('tbody tr').eq(i).find('td').length;
          var j=$('tbody tr').eq(i).find('td').eq(h-1).find('.borderDiv').length;
          for(var key =0;key<j;key++){
            var m=$('tbody tr').eq(i).find('td').eq(h-1).find('.borderDiv').eq(key)[0].clientHeight
            var q=$('tbody tr').eq(i).find('td').eq(h-2).find('.borderDiv').eq(key)[0].clientHeight;
            var s=m>q?m:q;
            if(s>45){
              $('tbody tr').eq(i).find('td').eq(h-1).find('.borderDiv').eq(key).css({'line-height':(s-20)+'px'})
              $('tbody tr').eq(i).find('td').eq(h).find('.borderDiv').eq(key).css({'line-height':(s-20)+'px'})
            }
          }
        }
      },
      /**
       * select的远程搜索方法
       */
      remoteMethod(query) {
        var _com = this;
        if (query !== '') {
          _com.loading = true;
          setTimeout(function () {
            _com.loading = false;
            _com.getChildList(query)
            if (_com.personList) {
              _com.personList = _com.personList.filter(function (item) {
                return item.realName.toLowerCase()
                    .indexOf(query.toLowerCase()) > -1;
              });
            }
          }, 200);
        } else {

          _com.indicators = [];
        }

      },
      /**
       * 编辑行动计划
       */
      editPlan:function (id,type) {
        var _com=this;
        _com.planId=id;
        _com.planType=type;
        _com.plan_title='编辑行动计划';
        _com.unfilled=false;
        _com.plan_modal=true;
        _com.steps=[];
        _com.$http.get(common.projectPath + 'sys/plan/detail/'+id,{
          params:{}
        }).then(function (data) {
          data=data.body;
          if(data.code==='SUCCESS'){
            if(data.data){
              _com.planForm=data.data;
              _com.steps=data.data.planSteps;
              for(var i=0;i<_com.steps.length;i++){
                var time=_com.steps[i].endTime.substring(0,10).replace(/-/g,  "/")
                _com.steps[i].endTime=new Date(time)
              }
            }
            _com.initStep();
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      /**
       * 查看行动计划表
       */
      showPlanTable:function () {
        var _com=this;
        _com.tableData=[];
        _com.$http.get(common.projectPath + 'sys/planform/viewAll/'+_com.planDetail.id,{
          params:{}
        }).then(function (data) {
          data=data.body;
          if(data.code==='SUCCESS'){
            if(data.data){
              if(data.data.plans)
              _com.tableData=data.data.plans;
              if(_com.tableData.length){
                _com.changeType();
              }
            }
            _com.initTable();
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      changeType:function () {
        var _com=this;
        for(var i=0;i<_com.tableData.length;i++){
          if(_com.tableData[i].isGs){
            _com.tableData[i].GS='&radic;';
          }else{
            _com.tableData[i].GS='';
          }
          if(_com.tableData[i].type==='other'){
            _com.tableData[i].typeText='其他';
            _com.tableData[i].objectiveFormDetailValueText='-';
            _com.tableData[i].indicatorMethodSelectedName='-';
          }else if(_com.tableData[i].type==='target'){
            _com.tableData[i].typeText='目标相关';
          }else if(_com.tableData[i].type==='gs'){
            _com.tableData[i].typeText='上级指派GS';
            _com.tableData[i].objectiveFormDetailValueText='-';
            _com.tableData[i].indicatorMethodSelectedName='-';
          }
        }
      },
      /**
       * 保存行动计划
       */
      savePlan:function () {
        var _com=this;
        for(var i=0;i<_com.steps.length;i++){
          for(var key in _com.steps[i]){
            if(_com.steps[i][key]==''){
              _com.unfilled=true;
            }
          }
          var time='';
          if(_com.steps[i].endTime){
            time=_com.steps[i].endTime.getFullYear()+"-"+(_com.steps[i].endTime.getMonth()+1)+"-"+_com.steps[i].endTime.getDate();
            _com.steps[i].endTime=time+' '+'00:00:00';
          }
        }
        var data={
          content:_com.planForm.content,
          isGs:_com.planForm.isGs,
          target:_com.planForm.target,
          name:_com.planForm.name,
          steps:_com.steps,
          planType:_com.planType,
          text:_com.text,
          year:_com.year,
        },url='';
        if(_com.plan_title === '添加行动计划'){
          url='sys/plan/add';
          if(_com.planType==='gs'){
            url='sys/plan/update';
            data.id=_com.planId;
          }
        }else{
          url='sys/plan/update';
          data.id=_com.planId;
        }
        _com.$refs['planForm'].validate(function (valid) {
          if(valid&&!_com.unfilled){
            _com.$http.post(common.projectPath + url,data,{

            }).then(function (data) {
              data=data.body;
              if(data.code==='SUCCESS'){
                _com.$message.success('保存成功!');
                _com.plan_modal = false;
                _com.getPlanList();
              }else{
                _com.$message.error(data.message);
              }
            })
          }
        })

      },
      /**
       * 取消行动计划
       */
      cancelPlan:function (id) {
        var _com = this;
        _com.$confirm('确定要取消此行动计划?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          _com.$http.get(common.projectPath + 'sys/plan/delete/' + id, {
            params: {}
          }).then(function (data) {
            data = data.body;
            if (data.code!=='SUCCESS') {
              _com.$message.error(data.message);
            } else {
              _com.$message.success('取消成功!');
              _com.getPlanList();
            }
          })
        }).catch(function () {

        })
      },
      /**
       * 添加行动计划
       */
      addPlan:function (type,item) {
        var _com=this;
        _com.plan_modal=true;
        _com.clearForm('planForm');
        _com.plan_title='添加行动计划';
        _com.unfilled=false;
        _com.steps=[ {
          content:'',
          endTime:'',
          employeeId:'',
          step:1
        }];
        if(type==='typeGs'){
//          _com.plan_title='编辑行动计划';
          _com.disabledText=true;
          _com.planForm.name=item.name;
          _com.planForm.isGs=item.isGs;
          _com.planType='gs';
          _com.planId=item.id;
        }else{
          _com.planType='other';
          _com.planForm.isGs=false;
        }
        _com.initStep();
      },
      /**
       * 提交
       */
      toCheck:function () {
        var _com=this;
        _com.$confirm('确定要提交此行动计划表?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          _com.$http.get(common.projectPath + 'sys/planform/toCheck/'+_com.planDetail.id,{
            params:{}
          }).then(function (data) {
            data=data.body;
            if(data.code==='SUCCESS'){
              _com.$message.success('提交成功!');
              _com.return_last();
            }else{
              _com.$message.error(data.message);
            }
          })
        }).catch(function () {

        })
      },
      transition:function () {
        this.transitioned=!this.transitioned;
        if(this.transitioned){
          $('.plan_map').css({display:'block',right:'0px'});
          $('.transition_button').css({right:($('.transition_wrapper').width()-40)+'px'});
        }
        else{
          $('.plan_map').css({display:'block',right:'0px'});
          $('.transition_button').css({right:($('.transition_wrapper').width()-40)+'px'});
        }
      },
      //点击返回上一级
      return_last:function () {
        this.$emit('return',1);
      },
      planToggle:function (val) {
        val.arrowControl = !val.arrowControl
      },
      /**
       * 获得自己以及自己的下级
       */
      getChildList:function (name) {
        var _com=this;
        name=name?name:''
        _com.$http.get(common.projectPath + 'usr/employee/meAndAllChildren',{
          params:{
            name:name
          }
        }).then(function (data) {
          data=data.body;
          if(data.code==='SUCCESS'){
            if(data.data){
              var personList = data.data;
              for (var i = 0; i < personList.length; i++) {
                personList[i].value = personList[i].id;
                personList[i].label = personList[i].realName;
              }
              _com.personList=personList;
            }
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      /**增加步骤
       * @param val
       */
      addStep:function () {
        var _com=this;
        this.steps.push(
          {
            content:'',
            endTime:'',
            employeeId:'',
            step:this.steps.length+1
          }
        )
        _com.initStep();
      },
      initStep:function () {
        var _com=this;
        _com.$nextTick(function () {
          for(var i=0;i<=_com.steps.length;i++){
            var k=$('.el-dialog__body .el-step').eq(i).find('.el-step__icon>div').html(i+1)
          }
        })
      },
      /**
       * 获得计划列表
       */
      getPlanList:function () {
        var _com=this;
        _com.$http.get(common.projectPath + 'sys/planform/toAdd',{
          params:{
            year:_com.year,
            text:_com.text
          }
        }).then(function (data) {
          data=data.body;
          if(data.code==='SUCCESS'){
            if(data.data){
              for(var i=0;i<data.data.plans.length;i++){
                  data.data.plans[i].arrowControl=false;
              }
              _com.planDetail=data.data;
              _com.planList=data.data.plans;
              _com.showPlanTable();
              console.log('ggggg')
              console.log(_com.planList)
            }
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      /**
       * 获得开始和截止时间
       */
      getEndTime:function () {
        var _com=this;
        _com.$http.get(common.projectPath + 'sys/plan/dates',{
          params:{
            year:_com.year,
            text:_com.text,
          }
        }).then(function (data) {
          data=data.body;
          if(data.code==='SUCCESS'){
            if(data.data){
              _com.pickerOptions.disabledDate=function (time){
                return ((time.getTime() > data.data[1]- 8.64e7)||(time.getTime() < data.data[0]));
              }
            }
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      /**清除已选中的步骤
       * @param val 选中步骤的内容
       */
      clearStep:function (val,index) {
        this.steps.splice(index,1)
      },
      /**
       * 清空对应的表单模型
       * @param formName 表单的模型名字
       */
      clearForm:function (formName) {
        if(this.$refs[formName]){
          this.$refs[formName].resetFields();
        }
      }
    },
    mounted: function () {
      //获取当时日期，填入head
      var _com = this;
      if(this.show.chooseVersion){
        $('.transition_button').click();
        _com.tableData=this.show.plans;
        _com.changeType();
      }else {
        _com.getChildList();
        _com.getEndTime();
        if(_com.show.operate==='edit'){
        _com.planList=_com.show.plans;
        _com.tableData=_com.show.plans;
        _com.changeType();
        }else{
          _com.getPlanList();
        }
      }
      if(this.show){
        _com.planDetail=this.show;
      }
      this.$nextTick(function () {
        quicker.returnTop();
      })
    },
    components: {
    }
  }
</script>
<style lang='scss'>

</style>

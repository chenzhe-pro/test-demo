<!— ***模板  Created by limin on 2017/7/11—>
<template>
  <div class="unchecked filled ">
    <div class="state mb10">
      <span class="thin_font">状态：</span>
      <span class="blue_font">已提交待审核</span>
    </div>
    <div class="table mb10">
      <el-table class="KPI" border :data="KPIData" style="width: 100%">
        <el-table-column prop="project" align="center" label="考核项目" width="104">
        </el-table-column>
        <el-table-column prop="name" align="center" label="指标名称" width="180">
        </el-table-column>
        <el-table-column prop="weights" align="center" label="权重" width="80">
        </el-table-column>
        <el-table-column prop="targetValue" align="center" label="目标值" width="90">
        </el-table-column>
        <el-table-column prop="challengeValue" align="center" label="挑战值" width="90">
        </el-table-column>
        <el-table-column prop="scoreType" align="center" label="评分标准" >
          <template scope="scope" >
            <el-popover trigger="hover" placement="top" v-if="scope.row.scoreType!=='-'">
              <p style="max-width: 300px">{{ scope.row.scoreType }}</p>
              <div slot="reference" class="name-wrapper score_content" style="">
                <div>{{ scope.row.scoreType }}</div>
              </div>
            </el-popover>
            <div v-else>{{ scope.row.scoreType }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作" align="center" width="110">
          <template scope="scope">
            <div style="font-size: 12px" v-if="KPIData[scope.$index].status=='ASSIGNED'">已指派</div>
            <el-button v-else type="text" size="small" @click="editKPI(scope.$index,scope.row)">指派填报人</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table">
      <el-table border class="GS" :data="GSData" style="width: 100%">
        <el-table-column prop="project" align="center" label="考核项目" width="104">
        </el-table-column>
        <el-table-column prop="name" align="center" label="GS任务名称" width="180">
        </el-table-column>
        <el-table-column prop="weights" align="center" label="权重" width="80">
        </el-table-column>
        <el-table-column prop="finishTime" align="center" label="完成时间" width="180">
        </el-table-column>
        <el-table-column prop="scoringStandard" align="center" label="评分标准" >
          <template scope="scope">
            <el-popover trigger="hover" placement="top" v-if="scope.row.scoringStandard!=='-'">
              <p style="max-width: 300px">{{ scope.row.scoringStandard }}</p>
              <div slot="reference" class="name-wrapper score_content" style="">
                <div>{{ scope.row.scoringStandard }}</div>
              </div>
            </el-popover>
            <div v-else>{{ scope.row.scoringStandard }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作" align="center" width="110">
          <template scope="scope">
            -
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="btns clearfix" style="width: 320px;margin: 40px auto">
      <el-button style="width: 150px;height: 40px;" class="fl" type="primary" :disabled="disBtn" @click="agree()" >同意</el-button>
      <el-button style="width: 150px;height: 40px;" class="fr" type="primary" @click="modal_refuse=true">拒绝</el-button>
    </div>
    <!---填报GS任务模态框--->
    <el-dialog v-model="modal_GS" :title="model_type">
      <el-form label-width="95px">
        <el-form-item label="指标名称：" prop="name">
          {{KPIDetail.name}}
        </el-form-item>
        <el-form-item style="border-bottom: 1px solid #ddd;padding-bottom: 10px;margin-bottom: 20px" label="考核时间：" >
          {{tableList.shortTime}}
        </el-form-item>
      </el-form>
      <el-form  ref="formKPI" :model="formKPI" :rules="ruleKPI" label-width="95px" :inline="true">
        <el-form-item label="目标值：" >
          {{KPIDetail.targetValue}}
        </el-form-item>
        <el-form-item label="挑战值：" >
          {{KPIDetail.challengeValue}}
        </el-form-item>
        <el-form-item label="权重：" >
          {{KPIDetail.weights}}
        </el-form-item>
        <br>
        <el-form-item label="填报部门：" class="pb20" prop="departmentId">
          <el-select v-model="formKPI.departmentId" placeholder="请选择填报部门" @change="getPerson">
            <el-option
              v-for="item in department"
              :label="item.name"
              :value="item.id" >
            </el-option >
          </el-select>
        </el-form-item>
        <el-form-item label="填报人：" class="pb20" prop="personId">
          <el-select v-model="formKPI.personId" placeholder="请选择填报人">
            <el-option
              v-for="item in person"
              :label="item.realName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="完成时间：" prop="time">
          <el-date-picker
            v-model="formKPI.time"
            type="date" format
            placeholder="请选择时间"
            :picker-options="pickerOptions0">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="任务类型：" >
          KPI
        </el-form-item>
      </el-form>

      <div slot="footer">
        <div class="btns clearfix" style="width: 320px;margin: 0px auto">
          <div class="btn btn-light fl" @click="operateModal(false)">取消</div>
          <div class="btn btn-primary fr" @click="saveKPI()">确认</div>
        </div>
      </div>
    </el-dialog>
    <!--拒绝模态框-->
    <el-dialog v-model="modal_refuse" title="拒绝通过"  size="tiny">
        <div class="mb10">您是否确认拒绝通过绩效考核方案</div>
      <el-form label-width="95px" :model="formRefuse" ref="formRefuse" :rules="ruleRefuse">
        <el-form-item label="拒绝理由：" prop="refuseReason">
          <el-input type="textarea" placeholder="请输入拒绝理由" v-model="formRefuse.refuseReason"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <div class="btns clearfix" style="width: 320px;margin: 0px auto">
          <div class="btn btn-light fl" @click="operateModal(false)">取消</div>
          <div class="btn btn-primary fr" @click="refuse()">确认</div>
        </div>
      </div>
    </el-dialog>
    <!--同意模态框-->
    <!--<el-dialog v-model="modal_leave" title="留言" size="tiny">-->
      <!--<el-form label-width="85px">-->
        <!--<el-form-item label="接收方：">-->
          <!--王密-->
        <!--</el-form-item>-->
        <!--<el-form-item label="内容：">-->
          <!--<el-input type="textarea" placeholder="请输入留言内容" v-model="leaveWord"></el-input>-->
        <!--</el-form-item>-->
      <!--</el-form>-->

      <!--<div slot="footer">-->
        <!--<div class="btns clearfix" style="width: 320px;margin: 0px auto">-->
          <!--<div class="btn btn-light fl" @click="operateModal(false)">取消</div>-->
          <!--<div class="btn btn-primary fr" @click="agree()">确认</div>-->
        <!--</div>-->
      <!--</div>-->
    <!--</el-dialog>-->

  </div>
  <!--<div class="wrapper initSet">-->
  <!--</div>-->
</template>
<script>
  module.exports = {
    data: function () {
      return {
        add:false,
        modal_GS:false,//增加或者编辑GS模态框
        modal_refuse:false,//删除KPI模态框
        modal_leave:false,//删除KPI模态框
        formKPI:{
          departmentId:'',
          personId:'',
          time:'',
        },
        disBtn:false,
        department:[],
        person:[],
        KPIDetail:'',
        formRefuse:{
          refuseReason:'',//拒绝理由
        },
        leaveWord:'',//留言
        model_type:'指派填报人',
        KPIData: [],
        GSData: [],
        currentId:'',//目前选择的id
        ruleKPI: {
          departmentId: [
            {required: true, message: '请选择填报部门', trigger: 'change'}
          ],
          personId: [
            {required: true, message: '请选择填报人', trigger: 'change'},
          ],
          time: [
            {required: true,type:'date', message: '请选择完成时间', trigger: 'change'},
          ]
        },
        ruleRefuse:{
          refuseReason: [
            {required: true, message: '请填写拒绝理由', trigger: 'blur'},
          ],
        }
      }
    },
    computed:{
      userInfo:function () {
        return this.$store.state.userInfo;
      }
    },
    props: ['tableList','currentLevel'],
    watch:{
      tableList:function () {
        this.getData();
      }
    },
    methods:{
      /**
       * 操作膜态框
       * @param type bool型,打开或者关闭膜态框
       */
      operateModal:function (operateType) {
          this.modal_GS=operateType;
          this.modal_refuse=operateType;
          this.modal_leave=operateType;

      },
      init:function (len) {
        var _com=this;
        this.$nextTick(function () {
          $(".el-table__row:first-child td:first-child").attr('rowspan',len+1);
          $(".KPI .el-table__row:first-child td:first-child").html('KPI指标（权重'+_com.tableList.kpiWeights+'%)');
          $(".GS .el-table__row:first-child td:first-child").html('GS任务（权重'+_com.tableList.gsWeights+'%)');
          $(".el-table__row:not(:first-child) td:first-child").css('display','none');
        })
//        var RL=$('.right_line')[0].clientHeight;
//        var H=$('.right_table')[0].clientHeight;
//        H=H>RL?H:RL;
//        $('.right_table').clientHeight=H;
      },
      /**
       * 获得部门列表
       */
      getDepartment:function () {
        var _com=this,data={
          term:''
        };
        _com.$http.post(common.projectPath+'usr/department/getDepByName',data,{

        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.department=data.data;

          }else{
            _com.$message.error(data.message);
          }
        })
      },
      /**
       * 根据部门选择人员
       */
      getPerson:function () {
        var _com=this,data={
          id:_com.formKPI.departmentId,
          name:''
        };
        _com.formKPI.personId='';
        if(_com.formKPI.departmentId){
          _com.$http.post(common.projectPath+'sys/employee/queryEmpByNameAndDepId',data,{

          }).then(function (data) {
            data=data.body;
            if(data.code=='SUCCESS'){
              _com.person=data.data;
            }else{
              _com.$message.error(data.message);
            }
          })
        }
      },
      /**
       * 拒绝
       */
      refuse:function () {
        var _com=this,data={
          id:_com.tableList.id,
          message:_com.formRefuse.refuseReason
        };
        _com.$refs.formRefuse.validate(function (valid){
          if (valid) {
            _com.$http.post(common.projectPath+'usr/evaluationForm/plan-verify-refuse',data,{

            }).then(function (data) {
              data=data.body;
              if(data.code=='SUCCESS'){
                _com.$message.success(data.message);
                _com.formRefuse.refuseReason='';
                _com.modal_refuse=false;
                _com.$emit('upup');
              }else {
                _com.$message.error(data.message);
              }
            })
          }
        })
      },
      /**
       * 同意
       */
      agree:function () {
        var _com=this,data={
          id:this.tableList.id
        };
        _com.$http.post(common.projectPath+'usr/evaluationForm/plan-verify',data,{
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.$message.success('提交成功!');
            _com.$emit('upup');
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      /**点击打开指定填报人
       */
      editKPI:function (index,row) {
        var _com=this;
        _com.KPIDetail=row;
        _com.modal_GS=true;
        _com.$nextTick(function () {
          _com.clearForm('formKPI')
                })
        _com.currentId=_com.KPIData[index].id;
        this.getDepartment();
      },
      /**
       * 获得表格数据
       */
      getData:function () {
        var _com=this;
        _com.KPIData=[];
        _com.GSData=[];
        _com.disBtn=false;
        _com.KPIData=this.tableList.kpis;
        for(var i=0;i<_com.KPIData.length;i++){
          if(_com.KPIData[i].status=='INIT'){
            _com.disBtn=true;
          }
        }
        _com.GSData=this.tableList.gss;
        var len=0;
        len=this.tableList.kpis.length>this.tableList.gss.length?this.tableList.kpis.length:this.tableList.gss.length;
        this.init(len);
      },
      /**
       * 确认指派
       */
      saveKPI:function () {
        var _com=this;
        var data={
          id:_com.currentId,
          fillerEmployeeId:_com.formKPI.personId,
          fillerDepartmentId:_com.formKPI.departmentId,
//          time:_com.formKPI.time,
          evaluationFormId:this.tableList.id
        };
        _com.$refs.formKPI.validate(function (valid){
          if (valid) {
            if(_com.formKPI.time){
              var month='',day='';
              if(_com.formKPI.time.getMonth()+1<10){
                month='-0'+(_com.formKPI.time.getMonth()+1)
              }else{
                month='-'+(_com.formKPI.time.getMonth()+1)
              }
              if(_com.formKPI.time.getDate()<10){
                day='-0'+_com.formKPI.time.getDate()
              }else{
                day='-'+_com.formKPI.time.getDate()
              }
            }
            var time=_com.formKPI.time.getFullYear()+month+day
            data.finishTime=time+' '+'00:00:00';
            _com.$http.post(common.projectPath+'usr/evaluationForm/assign',data,{
            }).then(function (data) {
              data=data.body;
              if(data.code=='SUCCESS'){
                _com.$message.success('指派成功!');
                _com.$emit('upup');
                _com.modal_GS=false;
              }else{
                _com.$message.error(data.message);
              }
            })
          }
        })
      },
      /**
       * 清空对应的表单模型
       * @param formName 表单的模型名字
       */
      clearForm:function (formName) {
        if(this.$refs[formName]){
          this.$refs[formName].resetFields();
        }
      },
    },
    components: {
//      'page-head': head,
//      'content_head':content_head,
    },
    mounted:function () {
      this.getData();

      this.$nextTick(function () {
        quicker.returnTop();
      })
    }
  }
</script>

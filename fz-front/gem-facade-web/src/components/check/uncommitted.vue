<!— ***模板  Created by limin on 2017/7/11—>
<template>
  <div class="uncommitted">
    <div class="state mb10">
      <span class="thin_font">状态：</span>
      <span class="red_font">未提交</span>
    </div>
    <div class="table mb10">
      <el-table class="KPI" border :data="KPIData" style="width: 100%" @cell-mouse-enter="pointer()">
        <el-table-column prop="project" align="center" label="考核项目" width="104">
        </el-table-column>
        <el-table-column prop="name" align="center" label="指标名称" width="180">
        </el-table-column>
        <el-table-column prop="weights" align="center" width="80" label="权重">
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
          label="操作" align="center" width="105">
          <template scope="scope">
            <div v-if="userInfo.ruleId=='BOSS'">-</div>
            <div v-else>
              <div style="font-size: 12px" v-if="KPIData[scope.$index].source==='FROM_SENIOR'">上级指派</div>
              <div v-else>
                <el-button  type="text" size="small" v-if="!scope.row.add" @click="showDeleteKPI(scope.$index,scope.row)">删除</el-button>
                <el-button type="text" size="small" v-if="!scope.row.add" @click="editKPI(scope.$index)">编辑</el-button>
                <el-button type="text" size="small" v-if="scope.row.add" @click="operateModal(true,'新增KPI指标','KPI')">新增</el-button>
              </div>
            </div>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table">
      <el-table class="GS" border :data="GSData" style="width: 100%">
        <el-table-column prop="project" align="center" label="考核项目" width="104" >
        </el-table-column>
        <el-table-column prop="name" align="center" label="GS任务名称" width="180">
        </el-table-column>
        <el-table-column prop="weights" width="80" align="center" label="权重">
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
          label="操作" align="center" width="105">
          <template scope="scope">
            <div v-if="userInfo.ruleId=='BOSS'">-</div>
            <div v-else>
              <el-button  type="text" size="small" v-if="!scope.row.add" @click="showDeleteGS(scope.$index,scope.row)">删除</el-button>
              <el-button type="text" size="small" v-if="!scope.row.add" @click="editGS(scope.$index)">编辑</el-button>
              <el-button type="text" size="small" v-if="scope.row.add" @click="operateModal(true,'新增GS任务','GS')">新增</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="btns clearfix" style="width: 320px;margin: 40px auto" v-if="userInfo.ruleId!=='BOSS'">
      <div class="btn btn-primary fl" @click="useLast_modal=true">延用上月</div>
      <div class="btn btn-primary fr" @click="toCheck()">提交审核</div>
    </div>
    <!---新增或者编辑KPI模态框--->
    <el-dialog v-model="modal_KPI" :title="model_type" size="tiny" :close-on-click-modal="false">
      <el-form ref="formKPI" :model="formKPI" :rules="ruleKPI"  label-width="95px">
        <el-form-item label="选择指标：" prop="departmentIndicatorId">
          <!--<el-input v-model="formKPI.departmentIndicatorId"  placeholder="请选择指标名称"></el-input>-->
          <el-select v-model="formKPI.departmentIndicatorId" placeholder="请选择指标名称" @change="selectIndicator">
            <el-option v-for="i in indicators" :label="i.name" :value="i.id+','+i.scoreType"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="border-bottom: 1px solid #ddd;padding-bottom: 10px;margin-bottom: 20px" label="考核时间：" >
          {{tableList.shortTime}}
        </el-form-item>
        <el-form-item label="目标值：" prop="targetValue" >
          <el-input v-model="formKPI.targetValue"  placeholder="请输入目标值"></el-input>
        </el-form-item>
        <el-form-item label="挑战值：" prop="challengeValue" >
          <el-input v-model="formKPI.challengeValue" :disabled="scoreType=='VETO_SINGLE'||scoreType=='VETO_ALL'"  placeholder="请输入挑战值"></el-input>
          <div class="thin_font" v-if="scoreType=='POSITIVE'" style="font-size: 12px">输入挑战值必须大于目标值!</div>
          <div v-if="scoreType=='NEGATIVE'" style="font-size: 12px">输入挑战值必须小于目标值!</div>
        </el-form-item>
        <el-form-item label="权重：" prop="weights">
          <el-input v-model="formKPI.weights"  placeholder="请输入权重"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <div class="btns clearfix" style="width: 320px;margin: 0px auto">
          <div class="btn btn-light fl" @click="operateModal(false)">取消</div>
          <div class="btn btn-primary fr" @click="saveKPI()">确认</div>
        </div>
      </div>
    </el-dialog>
    <!---删除KPI模态框--->
    <el-dialog v-model="delete_KPI" title="删除KPI指标" size="tiny">
      <el-form  label-width="85px">
        <el-form-item label="指标名称：" prop="name">
          {{indicatorName}}
        </el-form-item>
        <el-form-item style="border-bottom: 1px solid #ddd;padding-bottom: 10px;margin-bottom: 20px" label="考核时间：" >
          {{tableList.shortTime}}
        </el-form-item>
        您是否确认删除这条KPI指标
      </el-form>
      <div slot="footer">
        <div class="btns clearfix" style="width: 320px;margin: 0px auto">
          <div class="btn btn-light fl" @click="operateModal(false)">取消</div>
          <div class="btn btn-primary fr" @click="deleteKPI()">删除</div>
        </div>
      </div>
    </el-dialog>
    <!---新增或者编辑GS模态框--->
    <el-dialog v-model="modal_GS" :title="modelGS_type" size="tiny" :close-on-click-modal="false">
      <el-form ref="formGS" :model="formGS" :rules="ruleGS"  label-width="95px">
        <el-form-item label="任务名称：" prop="name">
          <el-input v-model="formGS.name"  placeholder="请输入任务名称"></el-input>
        </el-form-item>
        <el-form-item style="border-bottom: 1px solid #ddd;padding-bottom: 10px;margin-bottom: 20px" label="完成时间：" prop="finishTime">
          <el-date-picker prop="finishTime"
            v-model="formGS.finishTime"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions0">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="权重：" prop="weights">
          <el-input v-model="formGS.weights"  placeholder="请输入权重"></el-input>
        </el-form-item>
        <el-form-item label="描述：" prop="remark">
          <el-input type="textarea" v-model="formGS.remark"  placeholder="请输入描述"></el-input>
        </el-form-item>
        <el-form-item label="评分标准：" prop="scoringStandard">
          <el-input type="textarea" v-model="formGS.scoringStandard"  placeholder="请输入评分标准"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <div class="btns clearfix" style="width: 320px;margin: 0px auto">
          <div class="btn btn-light fl" @click="operateModal(false)">取消</div>
          <div class="btn btn-primary fr" @click="saveGS()">确认</div>
        </div>
      </div>
    </el-dialog>
    <!---删除GS模态框--->
    <el-dialog v-model="delete_GS" title="删除GS任务" size="tiny">
      <el-form  label-width="85px">
        <el-form-item label="任务名称：" prop="name">
          {{GSName}}
        </el-form-item>
        <el-form-item style="border-bottom: 1px solid #ddd;padding-bottom: 10px;margin-bottom: 20px" label="完成时间：" >
          2017-07
        </el-form-item>
        您是否确认删除这条GS任务
      </el-form>
      <div slot="footer">
        <div class="btns clearfix" style="width: 320px;margin: 0px auto">
          <div class="btn btn-light fl" @click="operateModal(false)">取消</div>
          <div class="btn btn-primary fr" @click="deleteGS()">删除</div>
        </div>
      </div>
    </el-dialog>
    <!---是否沿用上月--->
    <el-dialog v-model="useLast_modal" title="沿用上月" size="tiny">
        您是否确认沿用上月(若上月为空沿用后也会为空)?
      <div slot="footer">
        <div class="btns clearfix" style="width: 320px;margin: 0px auto">
          <div class="btn btn-light fl" @click="useLast_modal=false">取消</div>
          <div class="btn btn-primary fr" @click="useLast()">确认</div>
        </div>
      </div>
    </el-dialog>
  </div>
  <!--<div class="wrapper initSet">-->
  <!--</div>-->
</template>
<script>
  module.exports = {
    data: function () {
      return {
        add:false,
        modal_KPI:false,//增加或者编辑KPI模态框
        modal_GS:false,//增加或者编辑GS模态框
        delete_KPI:false,//删除KPI模态框
        delete_GS:false,//删除KPI模态框
        useLast_modal:false,//是否沿用上月
        currentId:'',//目前选择的id
        indicators:[],//指报列表
        scoreType:'',//选中指标对应分数类型
        formKPI:{
          departmentIndicatorId:'',
          targetValue:'',
          challengeValue:'',
          weights:'',
        },
        formGS:{
          name:'',
          remark:'',
          weights:'',
          finishTime:'',
          scoringStandard:''
        },
        indicatorName:'',//选中的指标名称
        GSName:'',//选中的GS名称
        model_type:'新增KPI指标',
        modelGS_type:'新增GS任务',
        KPIData: [],
        GSData:[],
        ruleKPI: {
          departmentIndicatorId: [
            {required: true, message: '请选择指标名称', trigger: 'change'}
          ],
          targetValue: [
            {required: true, message: '请填写目标值', trigger: 'blur'},
            {message: '填写正确的目标值', trigger: 'blur',pattern:/^\d*\.{0,1}\d{0,2}$/}
          ],
          challengeValue: [
            {required: true, message: '请填写挑战值', trigger: 'blur'},
            {message: '填写正确的挑战值', trigger: 'blur',pattern:/^\d*\.{0,1}\d{0,2}$/}
          ],
          weights: [
            {required: true, message: '请输入权重(0-100之间)', trigger: 'blur',pattern:/^(?:0|[1-9][0-9]?|100)$/},
          ]
        },
        ruleGS: {
          name: [
            {required: true, message: '请输入任务名称', trigger: 'change'}
          ],
          remark: [
            {required: true, message: '请填写描述', trigger: 'blur'},
          ],
          finishTime: [
            {type:'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          scoringStandard: [
            {required: true, message: '请填写评分标准', trigger: 'blur'},
          ],
          weights: [
            {required: true, message: '请输入权重(0-100之间)', trigger: 'blur',pattern:/^(?:0|[1-9][0-9]?|100)$/},
          ]
        },

      }
    },
    computed:{
      userInfo:function () {
        return this.$store.state.userInfo;
      }
    },
    watch:{
      tableList:function () {
        this.getData();
      }
    },
    props: ['tableList'],
    methods:{
      pointer:function (a,b,c,d) {
        $('.el-table__row').hover(function () {
          $('.el-table__row').css('cursor','pointer')
        })
      },
      selectIndicator:function (val) {
//        this.formKPI.challengeValue='';
        this.scoreType=val.split(',')[1];
        if(this.scoreType=='VETO_SINGLE'||this.scoreType=='VETO_ALL'){
          this.formKPI.challengeValue='0';
        }
      },
      /**
       * 操作膜态框
       * @param type bool型,打开或者关闭膜态框
       */
      operateModal:function (operateType,modalType,type) {
        if(operateType)//打开
        {
          if(type=='KPI'){
            this.model_type=modalType;
            this.modal_KPI=operateType;
            if(this.model_type==='新增KPI指标'){
              this.$nextTick(function () {
                this.clearForm('formKPI');
                this.formKPI.departmentIndicatorId='';
                this.formKPI.challengeValue='';
              });
            }
          }else{
            this.modelGS_type=modalType;
            this.modal_GS=operateType;
            if(this.modelGS_type==='新增GS任务'){
              this.$nextTick(function () {
                this.clearForm('formGS');
              });
              this.formGS.finishTime='';
              this.formGS.scoringStandard='';
            }
          }
        }
        else{
          this.modal_KPI=operateType;
          this.modal_GS=operateType;
          this.delete_KPI=operateType;
          this.delete_GS=operateType;
        }
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
//        $('.right_table').css('height',H);
      },
      /**编辑GS指标
       */
      editKPI:function (index) {
        var _com=this;
        _com.operateModal(true,'编辑KPI指标','KPI');
        _com.currentId=_com.KPIData[index].id;
        _com.$http.get(common.projectPath+'usr/evaluationForm/kpi/detail/'+_com.currentId,{
          params:{}
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            if(data.data){
            _com.formKPI=data.data;
              _com.formKPI.weights=_com.formKPI.weights.toString();
              _com.formKPI.targetValue=_com.formKPI.targetValue.toString();
              _com.formKPI.challengeValue=_com.formKPI.challengeValue.toString();
              for(var i=0;i<_com.indicators.length;i++){
                if(_com.indicators[i].id==_com.formKPI.departmentIndicatorId){
                  _com.formKPI.departmentIndicatorId=_com.formKPI.departmentIndicatorId+','+_com.indicators[i].scoreType
                }
              }
            }
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      /**编辑GS指标
       */
      editGS:function (index) {
        var _com=this;
        _com.operateModal(true,'编辑GS任务','GS');
        _com.currentId=_com.GSData[index].id;
        _com.$http.get(common.projectPath+'usr/evaluationForm/gs/detail/'+_com.currentId,{
          params:{}
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            if(data.data){
              _com.formGS=data.data;
              var arr=_com.formGS.finishTime.substring(0,10).split('-')
              _com.formGS.finishTime=new Date(arr[0],arr[1],arr[2])
            }
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      /**点击打开删除KPI指标模态框
       */
      showDeleteKPI:function (index,row) {
        var _com=this;
        _com.currentId=_com.KPIData[index].id;
        _com.delete_KPI=true;
        _com.indicatorName=row.name;
      },
      /**点击打开删除GS模态框
       */
      showDeleteGS:function (index,row) {
        var _com=this;
        _com.currentId=_com.GSData[index].id;
        _com.delete_GS=true;
        _com.GSName=row.name;
      },
      /**删除KPI指标
       */
      deleteKPI:function () {
        var _com=this;
        _com.$http.post(common.projectPath+'usr/evaluationForm/deleteKpi/'+_com.currentId,{

        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.$message.success(data.message);
            _com.operateModal(false);
            _com.$emit('upup');
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      /**删除GS任务
       */
      deleteGS:function () {
        var _com=this;
        _com.$http.post(common.projectPath+'usr/evaluationForm/deleteGs/'+_com.currentId,{

        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.$message.success(data.message);
            _com.operateModal(false);
            _com.$emit('upup');
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      /**
       * 获得表格数据
       */
      getData:function () {
        var _com=this;
        _com.KPIData=[];
        _com.GSData=[];
        _com.KPIData=this.tableList.kpis;
        _com.KPIData.push({
          weights:'-',
          targetValue:'-',
          challengeValue:'-',
          scoreType:'-',
          name: '-',
          add:true});
        _com.GSData=this.tableList.gss;
        _com.GSData.push({
          weights:'-',
          finishTime:'-',
          name:'-',
          scoringStandard:'-',
          add:true});
        var len=0;
        len=this.tableList.kpis.length>this.tableList.gss.length?this.tableList.kpis.length:this.tableList.gss.length;
        this.init(len);
      },
      /**
       * 保存新增或者修改的KPI指标
       */
      saveKPI:function () {
        var _com=this, data={
          challengeValue:this.formKPI.challengeValue,
          weights:this.formKPI.weights,
          targetValue:this.formKPI.targetValue,
          evaluationFormId:this.tableList.id,
          departmentIndicatorId:this.formKPI.departmentIndicatorId.split(',')[0]
        },url;
        if(_com.model_type==='新增KPI指标')
        {
          url='usr/evaluationForm/addKpi';

        }else{
          url='usr/evaluationForm/updateKpi';
          data.id=_com.currentId;
        }

        _com.$refs.formKPI.validate(function (valid){
          if (valid) {
            _com.$http.post(common.projectPath + url, data,{
              emulateJSON: false
            }).then(function (data) {
              data=data.body;
              if(data.code=='SUCCESS'){
                _com.$message.success(data.message);
                _com.operateModal(false);
                _com.$emit('upup');
//                _com.getData();
//            window.location.reload();
              }else{
                _com.$message.error(data.message);
              }
            })
          }
        })
      },
      /**
       * 保存新增或者修改的GS指标
       */
      saveGS:function () {
        var _com=this,
          data={
          remark:this.formGS.remark,
          weights:this.formGS.weights,
          name:this.formGS.name,
          scoringStandard:this.formGS.scoringStandard,
          evaluationFormId:this.tableList.id,
        },url;

        if(_com.modelGS_type==='新增GS任务')
        {
          url='usr/evaluationForm/addGs';
        }else{
          url='usr/evaluationForm/updateGs';
          data.id=_com.currentId;
        }
        _com.$refs.formGS.validate(function (valid){
          if (valid) {
            _com.formGS.finishTime=_com.formGS.finishTime.getFullYear()+"-"+(_com.formGS.finishTime.getMonth()+1)+"-"+_com.formGS.finishTime.getDate();
            data.finishTime=_com.formGS.finishTime+' '+'23:59:59';
            _com.$http.post(common.projectPath + url, data,{
              emulateJSON: false
            }).then(function (data) {
              data=data.body;
              if(data.code=='SUCCESS'){
                _com.$message.success(data.message);
                _com.operateModal(false);
                _com.$emit('upup');
              }else{
                _com.$message.error(data.message);
              }
            })
          }
        })

      },
      /**
       * 获得部门指标列表
       */
      getIndicatorList:function () {
        var _com=this;
        if(_com.userInfo.ruleId==='EMPLOYEE'){
          _com.$http.get(common.projectPath+'sys/indicator/queryDepIndicator/emp-kpiIndicator',{
            params:{

            }
          }).then(function (data) {
            data=data.body;
            if(data.code=='SUCCESS'){
              _com.indicators=data.data
            }else{
              _com.$message.error(data.message);
            }
          })
        }else{
          _com.$http.get(common.projectPath+'sys/indicator/queryDepIndicator/kpiIndicator',{
            params:{

            }
          }).then(function (data) {
            data=data.body;
            if(data.code=='SUCCESS'){
              _com.indicators=data.data
            }else{
              _com.$message.error(data.message);
            }
          })
        }

      },
      /**
       * 提交
       */
      toCheck:function () {
        var _com=this,data={
          id:this.tableList.id
        };
        var weightKPI=0,weightGS=0;
       for(var i=0;i<_com.KPIData.length-1;i++){
          weightKPI+=(parseInt(_com.KPIData[i].weights));
        }
        for(var i=0;i<_com.GSData.length-1;i++){
          weightGS+=(parseInt(_com.GSData[i].weights));
        }
       if(weightKPI===100&&weightGS===100){
         _com.$http.post(common.projectPath+'usr/evaluationForm/plan-confirm',data,{
//
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.$message.success('提交成功!');
            _com.$emit('upup');
          }else{
            _com.$message.error(data.message);
          }
        })
       }else{
         _com.$message.error('KPI和GS权重分别累计为100%才可以提交!');
       }
      },
      /**
       * 沿用上月
       */
      useLast:function () {
        var _com=this;
        _com.$http.get(common.projectPath+'usr/evaluationForm/copyLast',{
          params:{
            time:this.tableList.startTime.substring(0,10)
          }
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.$message.success(data.message);
//            this.tableList=data.data;
            this.useLast_modal=false;
            _com.$emit('upup');
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      /**
       * 清空对应的表单模型
       * @param formName 表单的模型名字
       */
      clearForm:function (formName) {
        this.$refs[formName].resetFields();
      },
    },
    components: {
//      'page-head': head,
//      'content_head':content_head,
    },
    mounted:function () {
       this.getData();
      this.getIndicatorList();
      this.$nextTick(function () {
        quicker.returnTop();
      })
    }
  }
</script>

<!— ***模板  Created by limin on 2017/7/11—>
<template>
  <div class="filled">
    <div class="state mb10">
      <span class="thin_font">状态：</span>
      <span class="blue_font" v-if="tableList.status=='RESULT_TO_APPROVE'">已填报待审批</span>
      <span class="blue_font" v-if="tableList.status=='RESULT_TO_VERIFY'">已填报待审核</span>
      <span class="blue_font"v-if="tableList.status=='RESULT_APPROVED'">已填报已审批</span>
      <span v-if="tableList.status=='RESULT_TO_APPROVE'">
         <span class="thin_font ml30 mr15">{{tableList.resultVerifyTime}}</span>
         <span class="mr15">{{tableList&&tableList.superiorEmployeeName?tableList.superiorEmployeeName:'暂无'}}</span>
         <span class="thin_font">审核通过</span>
      </span>
    </div>
    <div class="table mb10">
      <el-table border class="KPI" :data="KPIData" style="width: 100%" @cell-click="checkKPI">
        <el-table-column prop="project" align="center" label="考核项目" width="104">
        </el-table-column>
        <el-table-column prop="name" align="center" label="指标名称" width="160">
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
        <el-table-column prop="actualValue" align="center" label="实际值" width="90">
        </el-table-column>
        <el-table-column prop="score" align="center" label="得分" width="90">
        </el-table-column>
      </el-table>
    </div>
    <div class="table">
      <el-table class="GS" border :data="GSData" style="width: 100%"  @cell-click="checkGS">
        <el-table-column prop="project" align="center" label="考核项目" width="104">
        </el-table-column>
        <el-table-column prop="name" align="center" label="GS任务名称" width="160">
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
        <el-table-column prop="score" align="center" label="得分" width="180">
        </el-table-column>
      </el-table>
      <div class="clearfix last_line">
        <div style="width: 107px;" class="fl" >考核结果</div>
        <div class="fl pl20" v-if="tableList.voteAll">因整体否决项目得分为0分，综合绩效得分为0分</div>
        <div class="" style="margin-left: 107px;" v-else>KPI折算分为{{tableList.kpiScore}}分，GS折算分为{{tableList.gsScore}}分，综合绩效得分为{{tableList.score}}分</div>
      </div>
    </div>
    <div class="btns clearfix" style="width: 320px;margin: 40px auto 20px" v-if="(tableList.status=='RESULT_TO_VERIFY'&&currentLevel===1)||(tableList.status=='RESULT_TO_APPROVE'&&currentLevel===2)">
      <div class="btn btn-primary fl" @click="modal_leave=true" >同意</div>
      <div class="btn btn-primary fr" @click="modal_refuse=true">拒绝</div>
    </div>
    <div style="text-align: center;color: #999;" v-if="tableList.status=='RESULT_TO_VERIFY'&&currentLevel===1">同意将转发给考核人员直属上级审批</div>
    <!---查看KPI指标详情模态框--->
    <el-dialog v-model="modal_KPI" :title="model_type" size="tiny">
      <el-form ref="formGS" :model="formGS" :rules="rule"  label-width="85px">
        <el-form-item label="指标名称：" prop="name" class="mb0">
          {{KPIDetail.name}}
        </el-form-item>
        <el-form-item  style="border-bottom: 1px solid #ddd;padding-bottom: 0px;margin-bottom: 20px" label="考核时间：" >
          {{tableList.shortTime}}
        </el-form-item>
        <el-form-item label="实际值：">
          {{KPIDetail.actualValue}}
        </el-form-item>
        <el-form-item label="填报人：">
          {{KPIFillPerson}}
        </el-form-item>
        <el-form-item label="填报时间：">
          {{KPIFillTime}}
        </el-form-item>
        <el-form-item label="得分：">
          {{KPIDetail.score}}
        </el-form-item>
      </el-form>
      <div slot="footer">
        <div class="btns clearfix" style="width: 150px;margin: 0px auto">
          <div class="btn btn-primary fr" @click="operateModal(false)">确认</div>
        </div>
      </div>
    </el-dialog>
    <!---查看GS任务详情模态框--->
    <el-dialog v-model="modal_GS" title="GS任务" size="tiny">
      <el-form label-width="85px">
        <el-form-item label="任务名称：" prop="name" class="mb0">
          {{GSDetail.name}}
        </el-form-item>
        <el-form-item  style="border-bottom: 1px solid #ddd;padding-bottom: 0px;margin-bottom: 20px" label="考核时间：" >
          {{tableList.shortTime}}
        </el-form-item>
        <el-form-item label="GS得分：">
          {{GSDetail.score}}
        </el-form-item>
        <el-form-item label="评分人：">
          {{GSScorePerson}}
        </el-form-item>
        <el-form-item label="填报时间：">
          {{GSFillTime}}
        </el-form-item>
        <el-form-item label="完成情况：">
          {{GSFinishState}}
        </el-form-item>
        <el-form-item label="评分标准：">
          {{GSScoringStandard}}
        </el-form-item>
      </el-form>
      <div slot="footer">
        <div class="btns clearfix" style="width: 150px;margin: 0px auto">
          <div class="btn btn-primary fr" @click="operateModal(false)">确认</div>
        </div>
      </div>
    </el-dialog>
    <!--拒绝模态框-->
    <el-dialog v-model="modal_refuse" title="拒绝通过" size="tiny" >
      <div class="mb10">您是否确认拒绝通过绩效考核方案</div>
      <el-form label-width="95px" :model="formRefuse" ref="formRefuse" :rules="ruleRefuse">
        <el-form-item  label="拒绝理由：" prop="refuseReason">
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
    <el-dialog v-model="modal_leave" title="留言" size="tiny">
      <el-form label-width="85px" :model="formAgree" ref="formAgree" :rules="ruleAgree">
        <el-form-item label="接收方：">
          {{tableList.employeeName}}
        </el-form-item>
        <el-form-item label="内容：">
          <el-input type="textarea" placeholder="请输入留言内容" v-model="formAgree.agreeReason"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <div class="btns clearfix" style="width: 320px;margin: 0px auto">
          <div class="btn btn-light fl" @click="operateModal(false)">取消</div>
          <div class="btn btn-primary fr" @click="leaveMessage()">确认</div>
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
        modal_KPI:false,//模态框
        modal_GS:false,//模态框
        modal_refuse:false,//模态框
        modal_leave:false,//模态框
        formGS:{
          name:'',
          target:'',
          challenge:'',
          percent:'',
        },
        KPIDetail:'',//KPI详情
        GSDetail:'',//GS详情
        formRefuse:{
          refuseReason:'',//拒绝理由
        },
        formAgree:{
          agreeReason:'',//留言
        },
        model_type:'KPI指标',
        KPIData:[],
        GSData:[],
        KPIcompleteTime:'',
        KPIFillPerson:'',//KPI填报人
        KPIFillTime:'',//KPI填报人
        GSFillTime:'',//KPI填报时间
        GSFinishState:'',//
        GSScoringStandard:'',//
        GSScorePerson:'',//GS评分人
        ruleRefuse:{
          refuseReason: [
            {required: true, message: '请填写拒绝理由', trigger: 'blur'},
          ],
        },
        ruleAgree:{
          agreeReason: [
            {required: true, message: '请填写留言', trigger: 'blur'},
          ],
        }
      }
    },
    props: ['tableList','currentLevel'],
    watch:{
      tableList:function () {
        this.getData();
      }
    },
    methods:{
      checkKPI:function (val,row) {
        var _com=this;
        this.modal_KPI=true;
        this.KPIDetail=val;
        _com.$nextTick(function () {
          _com.$http.get(common.projectPath+'usr/evaluationForm/kpi/detail/'+this.KPIDetail.id,{
            params:{}
          }).then(function (data) {
            data=data.body;
            if(data.code=='SUCCESS'){
              if(data.data.fillTime){
                _com.KPIFillTime=data.data.fillTime.substring(0,10);
              }else {
                _com.KPIFillTime='--'
              }
              if(data.data.job){
                if(data.data.job.liabilityManView){
                  _com.KPIFillPerson=data.data.job.liabilityManView.realName
                }
              }else{
                _com.KPIFillPerson='--';
              }
            }else{
              _com.$message.error(data.message);
            }
          })
        })

      },
      checkGS:function (val) {
        var _com=this;
        this.modal_GS=true;
        this.GSDetail=val;
        _com.$nextTick(function () {
          _com.$http.get(common.projectPath+'usr/evaluationForm/gs/detail/'+_com.GSDetail.id,{
            params:{}
          }).then(function (data) {
            data=data.body;
            if(data.code=='SUCCESS'){
              _com.GSScoringStandard=data.data.scoringStandard?data.data.scoringStandard:'--';
              _com.GSFinishState=data.data.finishState?data.data.finishState:'--';
              if(data.data.fillTime){
                _com.GSFillTime=data.data.fillTime.substring(0,10);
              }else{
                _com.GSFillTime='--'
              }
              if(data.data.job){
                if(data.data.job.liabilityManView){
                  _com.GSScorePerson=data.data.job.liabilityManView.realName
                }
              }else{
                _com.GSScorePerson='--';
              }
            }else{
              _com.$message.error(data.message);
            }
          })
        })
      },
      /**
       * 操作膜态框
       * @param type bool型,打开或者关闭膜态框
       */
      operateModal:function (operateType) {
          this.modal_KPI=operateType;
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
          $('.el-table__row').hover(function () {
            $('.el-table__row').css('cursor','pointer')
          })
        })
//        var RL=$('.right_line')[0].clientHeight;
//        var H=$('.right_table')[0].clientHeight;
//        H=H>RL?H:RL;
//        $('.right_table').css('height',H);

      },
      /**
       * 拒绝
       */
      refuse:function () {
        var _com=this,data={
          id:_com.tableList.id,
          message:_com.formRefuse.refuseReason
        },url;
        if(_com.tableList.status=='RESULT_TO_VERIFY'){
          url='usr/evaluationForm/result-verify-refuse';
        }else{
          url='usr/evaluationForm/result-approve-refuse';
        }
        _com.$refs.formRefuse.validate(function (valid){
          if (valid) {
            _com.$http.post(common.projectPath+url,data,{

            }).then(function (data) {
              data=data.body;
              if(data.code=='SUCCESS'){
                _com.$message.success(data.message);
                _com.formRefuse.refuseReason='';
                _com.$emit('upup');
                _com.modal_refuse=false;
              }else {
                _com.$message.error(data.message);
              }
            })
          }
        })

      },
      /**
       * 同意并留言
       */
      leaveMessage:function () {
        var _com=this,url,data={
          id:_com.tableList.id,
          message:_com.formAgree.agreeReason
        };
        if(_com.tableList.status=='RESULT_TO_VERIFY'){
          url='usr/evaluationForm/result-verify';
        }else{
          url='usr/evaluationForm/result-approve';
        }
//        _com.$refs.formAgree.validate(function (valid){
//          if (valid) {
            _com.$http.post(common.projectPath+url,data,{
            }).then(function (data) {
              data=data.body;
              if(data.code=='SUCCESS'){
                _com.$message.success('提交成功!');
                _com.formAgree.agreeReason='';
                _com.modal_leave=false;
                _com.$emit('upup');
              }else{
                _com.$message.error(data.message);
              }
            })
//          }
//        })

      },
      getData:function () {
        var _com=this;
        _com.KPIData=[];
        _com.GSData=[];
        _com.KPIData=this.tableList.kpis;
        _com.GSData=this.tableList.gss;
        var len=0;
        len=this.tableList.kpis.length>this.tableList.gss.length?this.tableList.kpis.length:this.tableList.gss.length;
        this.init(len);
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

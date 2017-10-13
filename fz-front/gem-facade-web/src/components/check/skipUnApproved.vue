<!— ***模板  Created by limin on 2017/7/11—>
<template>
  <div class="filled">
    <div class="state mb10">
      <span class="thin_font">状态：</span>
      <span class="blue_font">已审核待审批</span>
      <span class="thin_font ml30 mr15">2017-07-03 14:40</span>
      <span class="mr15">岳云鹏</span>
      <span class="thin_font">审核通过</span>
    </div>
    <div class="table mb10">
      <el-table border class="KPI" :data="KPIData" style="width: 100%" @cell-click="checkKPI">
        <el-table-column prop="project" align="center" label="考核项目" >
        </el-table-column>
        <el-table-column prop="name" align="center" label="指标名称" width="180">
        </el-table-column>
        <el-table-column prop="weights" align="center" label="权重">
        </el-table-column>
        <el-table-column prop="targetValue" align="center" label="目标值">
        </el-table-column>
        <el-table-column prop="challengeValue" align="center" label="挑战值">
        </el-table-column>
        <el-table-column prop="scoreType" align="center" label="评分标准" width="160">
        </el-table-column>
        <el-table-column prop="actualValue" align="center" label="实际值" >
        </el-table-column>
        <el-table-column prop="score" align="center" label="得分">
        </el-table-column>
      </el-table>
    </div>
    <div class="table">
      <el-table class="GS" border :data="GSData" style="width: 100%"  @cell-click="checkGS">
        <el-table-column prop="project" align="center" label="考核项目" width="126">
        </el-table-column>
        <el-table-column prop="name" align="center" label="GS任务名称" width="180">
        </el-table-column>
        <el-table-column prop="weights" align="center" label="权重">
        </el-table-column>
        <el-table-column prop="finishTime" align="center" label="完成时间">
        </el-table-column>
        <el-table-column prop="scoringStandard" align="center" label="评分标准" width="160">
        </el-table-column>
        <el-table-column prop="score" align="center" label="得分">
        </el-table-column>
      </el-table>
      <!--<div class="clearfix last_line">-->
        <!--<div class="fl">考核结果</div>-->
        <!--<div class="fl pl20">KPI折算分为90分，GS折算分为90分，综合绩效得分为90分</div>-->
      <!--</div>-->
    </div>
    <div class="btns clearfix" style="width: 320px;margin: 40px auto">
      <div class="btn btn-primary fl" @click="modal_leave=true" >同意</div>
      <div class="btn btn-primary fr" @click="modal_refuse=true">拒绝</div>
    </div>
    <!---查看KPI指标详情模态框--->
    <el-dialog v-model="modal_KPI" :title="model_type" size="tiny">
      <el-form ref="formGS" :model="formGS" :rules="rule"  label-width="85px">
        <el-form-item label="指标名称：" prop="name" class="mb0">
          {{KPIDetail.name}}
        </el-form-item>
        <el-form-item  style="border-bottom: 1px solid #ddd;padding-bottom: 0px;margin-bottom: 20px" label="考核时间：" >
          2017-07
        </el-form-item>
        <el-form-item label="实际值：">
          --
          <!--{{KPIDetail.}}-->
        </el-form-item>
        <el-form-item label="填报人：">
          --
        </el-form-item>
        <el-form-item label="填报时间：">
          --
        </el-form-item>
        <el-form-item label="得分：">
          --
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
          2017-07
        </el-form-item>
        <el-form-item label="GS得分：">
          --
        </el-form-item>
        <el-form-item label="评分人：">
          --
        </el-form-item>
        <el-form-item label="填报时间：">
          --
        </el-form-item>
      </el-form>
      <div slot="footer">
        <div class="btns clearfix" style="width: 150px;margin: 0px auto">
          <div class="btn btn-primary fr" @click="operateModal(false)">确认</div>
        </div>
      </div>
    </el-dialog>
    <!--拒绝模态框-->
    <el-dialog v-model="modal_refuse" title="拒绝通过" size="tiny">
      <div class="mb10">您是否确认拒绝通过绩效考核方案</div>
      <el-form label-width="85px">
        <el-form-item label="拒绝理由：">
          <el-input type="textarea" placeholder="请输入拒绝理由" v-model="refuseReason"></el-input>
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
      <el-form label-width="85px">
        <el-form-item label="接收方：">
          王密
        </el-form-item>
        <el-form-item label="内容：">
          <el-input type="textarea" placeholder="请输入留言内容" v-model="leaveWord"></el-input>
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
        KPIDetail:{},//点击查看KPI
        GSDetail:{},//点击查看GS
        formGS:{
          name:'',
          targetValue:'',
          challengeValue:'',
          weights:'',
        },
        refuseReason:'',//拒绝理由
        leaveWord:'',//留言
        model_type:'KPI指标',
        KPIData: [
          {
            weights:'20%',
            targetValue:'95%',
            challengeValue:'98%',
            scoreType:'标准内容',
            name: '技术方案采用率',
            actualValue:'97%',
            score:90
          },
          {
            weights:'20%',
            targetValue:'95%',
            challengeValue:'98%',
            scoreType:'标准内容',
            name: '技术方案采用率',
            actualValue:'97%',
            score:90
//            add:false
          },
          {
            weights:'20%',
            targetValue:'95%',
            challengeValue:'98%',
            scoreType:'标准内容',
            name: '技术方案采用率',
            actualValue:'97%',
            score:90
//            add:false
          },
        ],
        GSData: [
          {
            weights:'20%',
            finishTime:'2017-09',
            scoringStandard:'标准内容',
            name: '技术方案采用率',
            score:90
//            add:false
          },
          {
            weights:'20%',
            finishTime:'2017-09',
            scoringStandard:'标准内容',
            name: '技术方案采用率',
            score:90
//            add:false
          },

        ]
      }
    },
    props: ['tableList'],
    methods:{
      checkKPI:function (a,b,c,d) {
        this.KPIDetail=a;
        this.modal_KPI=true;
      },
      checkGS:function (a,b,c,d) {
        this.GSDetail=a;
        this.modal_GS=true;
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
      init:function () {
        var _com=this;
        var lis=$(".el-table__row");
        for(var i=0;i<lis.length;i++){
          if(i==lis.length-1){
            this.tableData[i].add=true;
          }else{
            this.tableData[i].add=false;
          }
        }
        this.$nextTick(function () {
          $(".el-table__row:first-child td:first-child").attr('rowspan',5);
          $(".KPI .el-table__row:first-child td:first-child").html('KPI指标（权重'+_com.tableList.kpiWeights+'%)');
          $(".GS .el-table__row:first-child td:first-child").html('GS任务（权重'+_com.tableList.gsWeights+'%)');
          $(".el-table__row:not(:first-child) td:first-child").css('display','none');
        })
      },
      /**
       * 拒绝
       */
      refuse:function () {
        var _com=this,data={
          id:_com.tableList.id,
          failReason:_com.refuseReason
        };
        _com.$http.post(common.projectPath+'usr/evaluationForm/result-approve-refuse',data,{

        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.$message.success(data.message);
            _com.refuseReason=''
          }else {
            _com.$message.error(data.message);
          }
        })
      },
    },
    components: {
//      'page-head': head,
//      'content_head':content_head,
    },
    mounted:function () {
//      this.init();
      this.$nextTick(function () {
        quicker.returnTop();
      })
    }
  }
</script>

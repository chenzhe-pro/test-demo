<!— ***模板  Created by limin on 2017/7/11—>
<template>
  <div class="filled">
    <div class="state mb10">
      <span class="thin_font">状态：</span>
      <span class="blue_font">已填报</span>
    </div>
    <div class="table mb10">
      <el-table class="KPI" border :data="KPIData" style="width: 100%" @cell-click="checkKPI" >
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
        <el-table-column prop="scoringStandard" align="center" label="评分标准">
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
      <!--<div class="clearfix last_line">-->
        <!--<div class="fl">考核结果</div>-->
        <!--<div class="fl pl20">KPI折算分为90分，GS折算分为90分，综合绩效得分为90分</div>-->
      <!--</div>-->
    </div>
    <div class="btns clearfix" style="width: 150px;margin: 40px auto" v-if="currentLevel===0">
      <div class="btn btn-primary fl" @click="toCheck()">提交审核</div>
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
          {{KPIDetail.actualValue}}
        </el-form-item>
        <el-form-item label="填报人：">
          --
        </el-form-item>
        <el-form-item label="填报时间：">
          --
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
          2017-07
        </el-form-item>
        <el-form-item label="GS得分：">
          {{GSDetail.score}}
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
        formGS:{
          name:'',
          targetValue:'',
          challengeValue:'',
          weights:'',
        },
        KPIDetail:{},
        GSDetail:{},
        model_type:'KPI指标',
        KPIData: [
        ],
        GSData:[
        ]
      }
    },
    props: ['tableList','currentLevel'],
    watch:{
      tableList:function () {
        this.getData();
      }
    },
    methods:{
      checkKPI:function (a) {
        this.KPIDetail=a;
        this.modal_KPI=true;
      },
      checkGS:function (a) {
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
      /**
       * 提交审核
       */
      toCheck:function () {
        var _com=this,data={
          id:this.tableList.id
        };
        _com.$http.post(common.projectPath+'usr/evaluationForm/result-confirm',data,{

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

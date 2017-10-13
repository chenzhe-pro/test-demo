<!— ***模板  Created by limin on 2017/7/11—>
<template>
  <div class="uncommitted">
    <div class="state mb10">
      <span class="thin_font">状态：</span>
      <span class="blue_font" v-if="tableList.status=='PLAN_APPROVED'">已审批待填报</span>
      <span class="blue_font" v-else>已审核待填报</span>
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
        <el-table-column prop="scoreType" align="center" label="评分标准">
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
          label="操作" align="center" width="80">
          <template scope="scope">
            <div>-</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table">
      <el-table class="GS" border :data="GSData" style="width: 100%">
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
          label="操作" align="center" width="80">
          <template scope="scope">
            <div v-if="currentLevel===0">
              <div style="font-size: 12px" v-if="GSData[scope.$index].status!=='INIT'">已填报</div>
              <el-button type="text" size="small" @click="fill(scope.$index)" v-else>填报</el-button>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--<div class="btns clearfix" style="width: 150px;margin: 40px auto">-->
      <!--<div class="btn btn-primary fl" style="background-color: #ccc;cursor: no-drop;" @click="toCheck()">提交审核</div>-->
    <!--</div>-->
    <!---填报GS任务模态框--->
    <el-dialog v-model="modal_GS" :title="model_type" size="tiny">
      <el-form ref="formGS" :model="formGS" :rules="ruleGS"  label-width="95px">
        <el-form-item label="任务名称：" prop="name">
          {{GSName}}
        </el-form-item>
        <el-form-item style="border-bottom: 1px solid #ddd;padding-bottom: 10px;margin-bottom: 20px" label="考核时间：" >
          {{tableList.shortTime}}

        </el-form-item>
        <el-form-item label="完成情况：" prop="finishState">
          <el-input type="textarea" v-model="formGS.finishState"  placeholder="请输入完成情况"></el-input>
        </el-form-item>
        <el-form-item label="自评得分：" prop="selfScore">
          <el-input v-model="formGS.selfScore"  placeholder="请输入自评得分"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <div class="btns clearfix" style="width: 320px;margin: 0px auto">
          <div class="btn btn-light fl" @click="operateModal(false)">取消</div>
          <div class="btn btn-primary fr" @click="saveGS()">确认</div>
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
        GSName:'',
        formGS:{
          name:'',
          finishState:'',
          selfScore:'',
        },
        model_type:'填报GS指标',
        KPIData: [],
        GSData: [],
        ruleGS: {
          finishState: [
            {required: true, message: '请填写完成情况', trigger: 'blur' }
          ],
          selfScore: [
            {required: true, message: '请填写自评得分', trigger: 'blur'},
            {message: '填写正确的自评得分', trigger: 'blur',pattern:/^\d*\.{0,1}\d{0,2}$/}
          ]
        },
      }
    },
    props: ['tableList','currentLevel'],
    watch:{
      tableList:function () {
        this.getData();
      }
    },
    currentId:'',//目前选择的任务的id
    computed:{
      userInfo:function () {
        return this.$store.state.userInfo;
      }
    },
    methods:{
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
          }else{
            this.modelGS_type=modalType;
            this.modal_GS=operateType;
          }

          this.$nextTick(function () {
//            this.clearForm('formGS');
          });
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
      fill:function (index) {
        var _com=this;
        _com.currentId=_com.GSData[index].id;
        _com.GSName=_com.GSData[index].name;
        _com.operateModal(true,'填报GS指标','GS');
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
      toCheck:function () {
        var _com=this;
        _com.$http.get(common.projectPath+'usr/evaluationForm/result-confirm',{
          params:{
            formId:this.tableList.id
          }
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
      /**
       * 填报提交
       */
      saveGS:function () {
        var _com=this,data={
          id:_com.currentId,
          selfScore:_com.formGS.selfScore,
          finishState:_com.formGS.finishState,
          evaluationFormId:_com.tableList.id
        };
        _com.$refs.formGS.validate(function (valid){
          if (valid) {
            _com.$http.post(common.projectPath+'usr/evaluationForm/fillGsScore',data,{
            }).then(function (data) {
              data=data.body;
              if(data.code=='SUCCESS'){
                _com.$message.success('填报成功!');
                _com.formGS.selfScore='';
                _com.formGS.finishState='';
                _com.$emit('upup');
                _com.modal_GS=false;
              }else{
                _com.$message.error(data.message);
              }
            })
          }
        })
      }
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

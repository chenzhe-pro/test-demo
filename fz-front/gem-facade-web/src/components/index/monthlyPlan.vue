<!--月度考核计划-->
<template>
  <div class="monthlyPlan task">
    <p class="part_title">考核目标</p>
    <p class="gray-text mt15 mb10">KPI指标</p>
    <div class="task_node" v-for="k in KPIData" @click="getKPI(k.id)">
      <div class="task_type clearfix">
        <!--<span class="vertical_bar animated" ></span>-->
        <span v-text="k.departmentIndicator?k.departmentIndicator.name:'暂无名称'">日清表</span>
      </div>
      <div class="task_content">
        <div class="">
          <p class="gray-text mb5">目标值：<span class="black-text" v-text="k.targetValue">300万</span></p>
          <p class="gray-text mb5" >挑战值：<span class="black-text" v-text="k.challengeValue">300万</span></p>
          <p class="gray-text mb5" >权重：<span class="black-text" v-text="k.weights+'%'">30%</span></p>
        </div>
        <div class="task_time">
          <img src="../../assets/img/time.svg" alt="">
          <span v-text="monthEnd">2017-09-09</span>
        </div>
      </div>
    </div>
    <p class="no_data_tip" v-if="KPIData.length===0">暂无指标</p>
    <p class="gray-text mt15 mb10">GS任务</p>
    <div class="task_node" v-for="g in GSData"  @click="getGS(g.id)">
      <div class="task_type clearfix">
        <!--<span class="vertical_bar" ></span>-->
        <span v-text="g.name">日清表</span>
      </div>
      <div class="task_content">
        <div class="">
          <p class="black-text mb5" v-text="g.remark">确保不发生安全事故</p>
          <p class="gray-text mb5" >权重：<span class="black-text" v-text="g.weights+'%'">30%</span></p>
        </div>
        <div class="task_time">
          <img src="../../assets/img/time.svg" alt="">
          <span v-text="monthEnd">2017-09-09</span>
        </div>
      </div>
    </div>
    <p class="no_data_tip" v-if="GSData.length===0">暂无任务</p>
    <!---查看KPI指标详情模态框--->
    <el-dialog v-model="modal_KPI" title="KPI指标" size="tiny">
      <el-form ref="formGS" :model="formGS" :rules="rule"  label-width="85px">
        <el-form-item label="指标名称：" prop="name" class="mb0">
          {{KPIDetail.name}}
        </el-form-item>
        <el-form-item  style="border-bottom: 1px solid #ddd;padding-bottom: 0px;margin-bottom: 20px" label="考核时间：" >
          {{shortTime}}
        </el-form-item>
        <el-form-item label="实际值：">
          {{KPIDetail.actualValue}}
        </el-form-item>
        <el-form-item label="填报人：">
          {{KPIDetail.KPIFillPerson}}
        </el-form-item>
        <el-form-item label="填报时间：">
          {{KPIDetail.KPIFillTime}}
        </el-form-item>
        <el-form-item label="得分：">
          {{KPIDetail.score}}
        </el-form-item>
      </el-form>
      <div slot="footer">
        <div class="btns clearfix" style="width: 150px;margin: 0px auto">
          <div class="btn btn-primary fr" @click="modal_KPI=false">确认</div>
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
          {{shortTime}}
        </el-form-item>
        <el-form-item label="GS得分：">
          {{GSDetail.score}}
        </el-form-item>
        <el-form-item label="评分人：">
          {{GSDetail.GSScorePerson}}
        </el-form-item>
        <el-form-item label="填报时间：">
          {{GSDetail.GSFillTime}}
        </el-form-item>
        <el-form-item label="完成情况：">
          {{GSDetail.GSFinishState}}
        </el-form-item>
        <el-form-item label="评分标准：">
          {{GSDetail.GSScoringStandard}}
        </el-form-item>
      </el-form>
      <div slot="footer">
        <div class="btns clearfix" style="width: 150px;margin: 0px auto">
          <div class="btn btn-primary fr" @click="modal_GS=false">确认</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  module.exports = {
    data: function () {
      return {
        KPIData:[],//KPI指标数据
        GSData:[],//GS任务数据
        monthEnd:'',//当月最后一天
        shortTime:'',
        modal_KPI:false,
        modal_GS:false,
        KPIDetail:{},//KPI详情
        GSDetail:{},//GS详情
      }
    },
    computed: {

    },
    methods: {
      getKPI:function (id) {
        var _com=this;
        _com.modal_KPI=true;
        _com.$http.get(common.projectPath+'usr/evaluationForm/kpi/detail/'+id,{
          params:{}
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.KPIDetail=data.data;
            _com.KPIDetail.actualValue=_com.KPIDetail.actualValue?_com.KPIDetail.actualValue:'--';
            if(_com.KPIDetail.score===0) {
              _com.KPIDetail.score=0;
            }else{
              _com.KPIDetail.score=_com.KPIDetail.score?_com.KPIDetail.score:'--';
            }
            if(data.data.fillTime){
              _com.KPIDetail.KPIFillTime=data.data.fillTime.substring(0,10);
            }else {
              _com.KPIDetail.KPIFillTime='--'
            }
            if(data.data.job){
              if(data.data.job.liabilityManView){
                _com.KPIDetail.KPIFillPerson=data.data.job.liabilityManView.realName
              }
            }else{
              _com.KPIDetail.KPIFillPerson='--';
            }
            if(data.data.departmentIndicator){
              _com.KPIDetail.name=data.data.departmentIndicator.name
            }else{
              _com.KPIDetail.name='--'
            }
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      getGS:function (id) {
        var _com=this;
        _com.modal_GS=true;
        _com.$http.get(common.projectPath+'usr/evaluationForm/gs/detail/'+id,{
          params:{}
        }).then(function (data) {
          data=data.body;
          _com.GSDetail=data.data;
          if(data.code=='SUCCESS'){
            _com.GSDetail.GSScoringStandard=data.data.scoringStandard?data.data.scoringStandard:'--';
            _com.GSDetail.GSFinishState=data.data.finishState?data.data.finishState:'--';
            _com.GSDetail.score=data.data.score?data.data.score:'--';
            if(_com.GSDetail.score===0) _com.GSDetail.score=0;
            if(data.data.fillTime){
              _com.GSDetail.GSFillTime=data.data.fillTime.substring(0,10);
            }else{
              _com.GSDetail.GSFillTime='--'
            }
            if(data.data.job){
              if(data.data.job.liabilityManView){
                _com.GSDetail.GSScorePerson=data.data.job.liabilityManView.realName
              }
            }else{
              _com.GSDetail.GSScorePerson='--';
            }
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      /**
       * 获得当月的天数
       */
      getDays:function (year,month) {
        month = parseInt(month, 10);
        var d= new Date(year, month, 0);
        return d.getDate();
      },
      /**
       * 把日期转化为2017-07形式
       */
      FormatDate:function (date) {
        if(date.getMonth()+1>9){
          return date.getFullYear()+"-"+(date.getMonth()+1);
        }else {
          return date.getFullYear()+"-0"+(date.getMonth()+1);
        }
      },
      /**
       * 仅根据月份获得自己的考核表数据
       */
      getDatas:function () {
        var _com=this;
        _com.monthEnd=_com.FormatDate(new Date());
        var days=_com.getDays(new Date().getFullYear(),new Date().getMonth()+1);
        if(days<10){
          days='-0'+days;
        }else{
          days='-'+days;
        }
        _com.monthEnd=_com.monthEnd+days;
        _com.shortTime=_com.monthEnd.substring(0,7)

        _com.$http.get(common.projectPath+'usr/evaluationForm/detail',{
          params:{
            time:_com.monthEnd
          }
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            if(data.data){
              if(data.data.status==='INIT'||data.data.status==='PLAN_TO_VERIFY'||data.data.status==='PLAN_TO_APPROVE'){
                _com.KPIData=[];
                _com.GSData=[];
              }else{
                if(data.data.kpis){
                  _com.KPIData=data.data.kpis;
                  for(var i=0;i<_com.KPIData.length;i++){
                    if(_com.KPIData[i].departmentIndicator){
                      if(_com.KPIData[i].departmentIndicator.percentage){
                        _com.KPIData[i].targetValue=_com.KPIData[i].targetValue+'%';
                        _com.KPIData[i].challengeValue=_com.KPIData[i].challengeValue+'%';
                      }
                    }
                  }
                }else{
                  _com.KPIData=[];
                }
                if(data.data.gss){
                  _com.GSData=data.data.gss;
                }else{
                  _com.GSData=[];
                }
              }

            }
          }else{
            _com.$message.error(data.message);
          }
        })
      },

    },
    mounted: function () {
      this.getDatas();
      this.$nextTick(function () {
        quicker.returnTop();
      })
    }
  }
</script>

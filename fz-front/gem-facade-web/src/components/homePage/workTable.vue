<!— ***模板  Created by limin on 2017/9/16—>
<template>
    <div class="planManage daliyTable">
      <div class="head_time_select">
        <el-popover ref="popover" popper-class="head_time time_control" placement="bottom" title="" width="300" trigger="click" @hide="dateHide" v-model="dateSelectVisible">
            <span slot="reference" class="el-dropdown-link cursor_pointer">
              <i class="fa fa-angle-double-left mr20" aria-hidden="true"></i>
              <span >{{ headDate.originYear }}</span><span :class="{ pl30: headDate.originPeriod }">{{ headDate.originPeriod }}</span>
              <i class="fa fa-angle-double-right ml20" aria-hidden="true"></i>
            </span>
          <div class="date_year clearfix mb10">
            <i class="fa fa-angle-double-left mr20 fl" aria-hidden="true" @click="headDate.year--;"></i>
            <span>{{ headDate.year }} </span>
            <i class="fa fa-angle-double-right fr" aria-hidden="true" @click="headDate.year++;"></i>
          </div>
          <div class="divide_line divide_st"></div>
          <div class="date_quarter clearfix mt20 mb10">
            <span class="date_label fl">季度</span>
            <el-radio-group v-model="headDate.radioValue">
              <el-radio-button label="Q1"></el-radio-button>
              <el-radio-button label="Q2"></el-radio-button>
              <el-radio-button label="Q3"></el-radio-button>
              <el-radio-button label="Q4"></el-radio-button>
            </el-radio-group>
          </div>
          <div class="divide_line"></div>
          <div class="date_months clearfix mt20 mb20">
            <span class="date_label fl">月份</span>
            <el-radio-group v-model="headDate.radioValue">
              <el-radio-button label="1月"></el-radio-button>
              <el-radio-button label="2月"></el-radio-button>
              <el-radio-button label="3月"></el-radio-button>
              <el-radio-button label="4月"></el-radio-button>
              <el-radio-button label="5月"></el-radio-button>
              <el-radio-button label="6月"></el-radio-button>
              <el-radio-button label="7月"></el-radio-button>
              <el-radio-button label="8月"></el-radio-button>
              <el-radio-button label="9月"></el-radio-button>
              <el-radio-button label="10月"></el-radio-button>
              <el-radio-button label="11月"></el-radio-button>
              <el-radio-button label="12月"></el-radio-button>
            </el-radio-group>
          </div>
          <div class="btns clearfix" style="width: 260px;margin: 0px auto">
            <div class="btn btn-light fl" @click="clearSelect()">取消</div>
            <div class="btn btn-primary fr" @click="saveMonth()">确认</div>
          </div>
        </el-popover>
      </div>
      <el-table class="plan_map" height="100%" :data="tableData" border style="width: 100%;">
        <el-table-column prop="typeText" align="center" label="事项类型" width="140"></el-table-column>
        <el-table-column prop="objectiveFormDetailValueText" align="center" label="目标" width="150">
          <template scope="scope">
            <div class="ml10 mr10" v-text="scope.row.objectiveFormDetailValueText"></div>
          </template>
        </el-table-column>
        <el-table-column prop="indicatorMethodSelectedName" align="center" label="策略" width="200">
          <template scope="scope">
            <div class="ml10 mr10" v-text="scope.row.indicatorMethodSelectedName"></div>
          </template>
        </el-table-column>
        <el-table-column prop="name" align="center" label="计划事项" width="200">
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
        <el-table-column prop="planSteps" align="center" label="完成情况" width="150">
          <template scope="scope">
            <div class="p10 borderDiv" v-for="(item ,index) in scope.row.planSteps">{{item.endTime | short_time}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="planSteps" align="center" label="实际完成时间" width="150">
          <template scope="scope">
            <div class="p10 borderDiv" v-for="(item ,index) in scope.row.planSteps">{{item.endTime | short_time}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="planSteps" align="center" label="操作" width="100">
          <template scope="scope">
            <div class="p10 borderDiv" v-for="(item ,index) in scope.row.planSteps">{{item.endTime | short_time}}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>
<script>
  module.exports = {
    data: function () {
      return {
        headDate: {
          year: '',
          period: '',
          originYear: '',
          originPeriod: '',
          radioValue:''
        },//顶部日期
        dateSelectVisible:false,//日期控件的显示与隐藏
        date: '',//要查看的日清表的日期
        kpiWeights: '',
        gsWeights: '',
        tableData: [],//计划表格
      }
    },
    computed: {
      year: function () {
        return this.$store.state.year;
      },
      text: function () {
        return this.$store.state.text;
      },
    },
    methods: {
      /**
       * 清空对应的表单模型
       * @param formName 表单的模型名字
       */
      clearForm:function (formName) {
        if(this.$refs[formName]){
          this.$refs[formName].resetFields();

        }
      },
      //设置查询的季度或月份
      setPeriod: function (val) {
        var _com = this;
        _com.headDate.period = val;
      },
      //日期控件隐藏事件
      dateHide: function () {
        var _com = this;
        _com.headDate.year = _com.headDate.originYear;
        _com.headDate.period = _com.headDate.originPeriod;
      },
      //日期控件确认事件
      getIndicatorList: function () {
        var _com = this;
        _com.headDate.originYear = _com.headDate.year;
        _com.headDate.originPeriod = _com.headDate.period;
        _com.dateSelectVisible = false;
      },
      //清除日期选择
      clearSelect:function () {
        this.headDate.radioValue='';
        this.dateSelectVisible=false;
      },
      //保存日期选择
      saveMonth:function () {
        this.headDate.originYear=this.headDate.year;
        this.headDate.originPeriod=this.headDate.radioValue;
        this.dateSelectVisible=false;
        this.$store.commit('setYear',this.headDate.year);
        this.$store.commit('setText',this.headDate.radioValue);
        this.headDate.radioValue='';
      },
    },
    mounted: function () {
      var _com=this;
      if(!_com.year){
        _com.$store.commit('setYear',new Date().getFullYear());
      }
      if(!_com.text){
        _com.$store.commit('setText',new Date().getMonth() + 1 + '月');
      }
      _com.headDate.originYear=_com.year;
      _com.headDate.originPeriod=_com.text;
      _com.headDate.year = _com.headDate.originYear;
      _com.headDate.period = _com.headDate.originPeriod;
//      _com.createAnimation();
      this.$nextTick(function () {
        quicker.returnTop();
      })
    },
    components: {
//      'page_head': head,
//      'content_head': content_head
    }
  }
</script>
<style lang='scss'>

</style>

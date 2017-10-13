<!--目标系统图组件-->
<template>
  <div class="strategy">
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
        <div class="btns clearfix" style="width: 260px;margin: 0px auto;">
          <div class="btn btn-light fl" @click="clearSelect()">取消</div>
          <div class="btn btn-primary fr" @click="saveMonth()">确认</div>
        </div>
      </el-popover>
    </div>
    <div class="system_map">
      <div class="map_center">
        <div class="mb10" v-if="strategyList.length">为以下目标定制行动策略</div>
        <div class="map_card strategy_card map" v-if="strategyList.length==0">
          <p class="no_data_tip white_tip mb10 mt60">暂无对应目标!</p>
        </div>
        <div  class="map_card strategy_card map mr30" v-for="s in strategyList">
          <div class="strategy_des clearfix">
            <div class="clearfix title">
              <span class="fl" v-text="s.indicatorName">直通率</span>
              <span class="unover_text over_text fl" v-if="s.hasPlans">已完成</span>
              <span class="unover_text fl" v-else>待完成</span>
            </div>
            <span class="strategy_tag mr10" v-for="b in s.indicator.businessDomains" v-text="b.name">产品品质</span>
            <div class="clearfix mt5 mb5 number">
              <p class="fl" style="width: 50%;">目标值：<span v-text="s.targetValue">58.60%</span></p>
              <p class="fl">挑战值：<span v-text="s.challengeValue">62.60%</span></p>

            </div>
            <p class="f12">来源：{{s.origin}}</p>
            <!--<div class="f12" >来源：<span v-text="s.source">2017年市场部目标系统图</span></div>-->
          </div>
          <div class="strategy_bottom" @click="go(s.objectiveFormDetailValueText,s.id)" @mouseenter="s.showArrow=!s.showArrow" @mouseleave="s.showArrow=!s.showArrow">
            <span v-if="s.hasPlans">查看或编辑为达成此目标制定的行动策略</span>
            <span v-else>为达成此目标制定行动策略</span>
            <i class="fa fa-arrow-circle-o-right fa-lg" v-show="s.showArrow" ></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import head from '../common/head.vue'
  import content_head from '../common/content_head.vue'


  module.exports = {
    data: function () {
      return {
        dateSelectVisible:false,//日期控件的显示与隐藏
        strategyList:[],//策略列表
        form:{
          name:''
        },
        headDate: {
          year: '',
          period: '',
          originYear: '',
          originPeriod: '',
          radioValue:''
        },//顶部日期
        currentValue:''
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
        this.strategyList=[];
        this.getStrategyList();
        this.$store.commit('setYear',this.headDate.year);
        this.$store.commit('setText',this.headDate.radioValue);
        this.headDate.radioValue='';
      },
      go:function (text,id) {
        var str=text+'+'+id
//        this.$emit('getStep',text+';'+id);
        this.$emit('getStep',str);
//        this.$emit('getStep',id);
      },
      /**
       * 获得策略列表
       */
      getStrategyList:function () {
        var _com=this;
        _com.$http.get(common.projectPath + 'sys/objective/listMineObjectiveFormDetail',{
          params:{
            year:_com.headDate.year?_com.headDate.year:_com.headDate.originYear,
            text:_com.headDate.radioValue?_com.headDate.radioValue:_com.headDate.originPeriod,
          }
        }).then(function (data) {
          data=data.body;
          if(data.code==='SUCCESS'){
            if(data.data){
              for(var i=0;i<data.data.length;i++){
                data.data[i].showArrow=false;
                if(data.data[i].indicator.percentage){
                  data.data[i].challengeValue=data.data[i].challengeValue+'%';
                  data.data[i].targetValue=data.data[i].targetValue+'%';
                }
              }
              _com.strategyList=data.data;
            }
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
        if(this.$refs[formName]){
          this.$refs[formName].resetFields();
        }
      },
      //日期控件隐藏事件
      dateHide: function () {
        var _com = this;
        _com.headDate.year = _com.headDate.originYear;
        _com.headDate.period = _com.headDate.originPeriod;
      },
    },
    mounted: function () {
      //获取当时日期，填入head
      var _com = this;
      if(_com.year){
        _com.headDate.originYear = _com.year
      }else{
        _com.headDate.originYear =new Date().getFullYear();
        _com.$store.commit('setYear',_com.headDate.originYear);
      }
      if(_com.text){
        _com.headDate.originPeriod = _com.text
      }else{
        _com.headDate.originPeriod =new Date().getMonth() + 1 + '月';
        _com.$store.commit('setText',_com.headDate.originPeriod);
      }
//      _com.headDate.originYear = _com.year?_com.year:new Date().getFullYear();
//      _com.headDate.originPeriod = _com.text?_com.text:new Date().getMonth() + 1 + '月';
      _com.headDate.year = _com.headDate.originYear;
      _com.headDate.period = _com.headDate.originPeriod;
      _com.getStrategyList();
    },
    components: {
      'page_head': head,
      'content_head': content_head
    }
  }
</script>

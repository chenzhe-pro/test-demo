<!--目标系统图组件-->
<template>
  <div class="">
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
    <div class="system_map">
      <div class="map_center">
        <div class="map_card new_map" @click="jumpNext">
          <img src="../../assets/img/plus.png" alt="">
          <p>创建考核表</p>
        </div>
        <div class="map_card map" v-if="strategyList.id">
          <div class="map_des">
            <div class="title">2017年考核表</div>
            <p>版本号：<span>V1.0</span></p>
            <p>制表人：<span>V1.0</span></p>
            <p>制表时间：<span>V1.0</span></p>
          </div>
          <div class="map_op">
            <i class="fa fa-pencil-square-o" ></i>
            <i class="fa fa-history" @click="historyVisible = true"></i>
            <i class="fa fa-thumbs-o-up" ></i>
            <span class="warn_tag fr mt5"><i class="fa fa-info-circle"></i>已生效</span>
          </div>
        </div>
        <!--<div class="map_card map">-->
          <!--<div class="map_des">-->
            <!--<div class="title">2017年考核表</div>-->
            <!--<p>版本号：<span>V1.0</span></p>-->
            <!--<p>制表人：<span>V1.0</span></p>-->
            <!--<p>制表时间：<span>V1.0</span></p>-->
          <!--</div>-->
          <!--<div class="map_op">-->
            <!--<i class="fa fa-pencil-square-o" ></i>-->
            <!--<i class="fa fa-history" @click="historyVisible = true"></i>-->
            <!--<i class="fa fa-thumbs-o-up" ></i>-->
            <!--<span class="warn_tag fr mt5"><i class="fa fa-info-circle"></i>已生效</span>-->
          <!--</div>-->
        <!--</div>-->
      </div>
    </div>
    <el-dialog class="history_dialog" title="历史版本" :visible.sync="historyVisible">
      <div class="dialog_title_line"></div>
      <div class="history_content clearfix">
        <el-steps :space="86" direction="vertical" :active="historyTarget.length - 1">
          <el-step v-for="step in historyTarget">
            <div slot="description" class="history_card cursor_pointer">
              <p class="card_title clearfix">
                版本号：<span class="pl5">{{ step.version }}</span>
                <span class="warn_tag fr" v-if="step.isUse"><i class="fa fa-info-circle"></i>已生效</span>
                <span class="stopuse_tag fr" v-else><i class="fa fa-info-circle"></i>未生效</span>
              </p>
              <p class="card_date">制表时间：<span class="pl5">{{ step.time1 }}</span></p>
              <p class="card_date">生效时间：<span class="pl5">{{ step.time2 }}</span></p>
            </div>
          </el-step>
        </el-steps>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import head from '../common/head.vue'
  import content_head from '../common/content_head.vue'


  module.exports = {
    data: function () {
      return {
        headDate: {
          year: '',
          periodValue: '',
          originYear: '',
          originPeriod: '',
          radioValue:'',
          periodType:''
        },//顶部日期
        strategyList:{},//考核表
        show_modal:false,
        model_type:'2017年度公司目标系统图',
        dateSelectVisible:false,//日期控件的显示与隐藏
        historyVisible: false,//控制历史版本对话框显隐
        form:{
          name:''
        },
        currentValue:'',
        indicatorList: [
          {}
        ],
        historyTarget: [
          { version: 'V1.0', time1: '2017-02-01', time2: '2017-02-28', isUse: true },
          { version: 'V2.0', time1: '2017-03-01', time2: '2017-03-31', isUse: true },
          { version: 'V3.0', time1: '2017-04-01', time2: '2017-04-30', isUse: true },
          { version: 'V4.0', time1: '2017-05-01', time2: '2017-05-31', isUse: false },
        ],
      }
    },
    computed: {
      year: function () {
        return this.$store.state.year;
      },
      text: function () {
        return this.$store.state.text;
      }
    },
    methods: {
      jumpNext:function () {
        var _com=this,data={
          time:_com.headDate.year,
          periodType:_com.headDate.periodType,
          periodValue:_com.headDate.periodValue,
        };
        _com.$http.post(common.projectPath + 'usr/evaluation/add',data).then(function (data) {
          data=data.body;
          if(data.code==='SUCCESS'){
            if(data.data){

            }
          }else{
            _com.$message.error(data.message);
          }
        })
//        this.$emit('step',2);
      },
      /**
       * 获得考核表列表
       */
      getCheckList:function () {
        var _com=this,data={
          time:_com.headDate.year,
          periodType:_com.headDate.periodType,
          periodValue:_com.headDate.periodValue,
        };
        _com.$http.post(common.projectPath + 'usr/evaluation/current',data).then(function (data) {
          data=data.body;
          if(data.code==='SUCCESS'){
            if(data.data){
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
      //设置查询的季度或月份
      setPeriod: function (val) {
        var _com = this;
        _com.headDate.periodValue = val;
      },
      //日期控件隐藏事件
      dateHide: function () {
        var _com = this;
        _com.headDate.year = _com.headDate.originYear;
        _com.headDate.periodValue = _com.headDate.originPeriod;
      },
      //日期控件确认事件
      getIndicatorList: function () {
        var _com = this;
        console.log('点击了确认');
        _com.headDate.originYear = _com.headDate.year;
        _com.headDate.originPeriod = _com.headDate.periodValue;
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
        this.getCheckList();
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
      _com.headDate.periodType = 'By_month';
      _com.headDate.periodValue = _com.headDate.originPeriod.slice(0,_com.headDate.originPeriod.length-1);
      _com.getCheckList();
      this.$nextTick(function () {
        quicker.returnTop();
      })
    },
    components: {
      'page_head': head,
      'content_head': content_head
    }
  }
</script>

<!--目标系统图组件-->
<template>
  <div class="strategyManage">
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
        <!--<div class="date_footer clearfix">-->
        <!--<el-button class="pr10 pl10 fl" @click="clearSelect()">取消</el-button>-->
        <!--<el-button class="pr10 pl10 fr" type="primary" @click="saveMonth()">确认</el-button>-->
        <!--</div>-->
      </el-popover>
    </div>
    <div class="system_map">
      <div class="map_center">
        <div class="map_card new_map" @click="jumpNext">
          <img src="../../assets/img/plus.png" alt="">
          <p>创建行动计划表</p>
        </div>
        <div v-for="p in planList" class="map_card map" >
          <div class="map_des" @click="jumpTo(p.id,true)">
            <div class="title" v-text="p.name">2017年计划表</div>
            <p>版本号：<span >V{{p.version}}</span></p>
            <p>制表人：<span>{{p.createdByName}}</span></p>
            <p>制表时间：<span>{{p.createdAt | short_time}}</span></p>
          </div>
          <div class="map_op">
            <i class="fa fa-pencil-square-o" @click="jumpTo(p.id,false,'edit')"></i>
            <i class="fa fa-history" @click="checkHistory()"></i>
            <i class="fa fa-thumbs-o-up" ></i>
            <span class="warn_tag fr mt5" v-if="p.status==='s3_pass'"><i class="fa fa-info-circle"></i>已生效</span>
            <span class="stopuse_tag fr mt5" v-else><i class="fa fa-info-circle"></i>未生效</span>
          </div>
        </div>
      </div>
    </div>
    <el-dialog class="history_dialog" title="历史版本" :visible.sync="historyVisible">
      <div class="dialog_title_line"></div>
      <div class="history_content clearfix">
        <el-steps :space="86" direction="vertical" >
          <el-step v-for="step in historyTarget">
            <div slot="description" class="history_card cursor_pointer" @click="jumpTo(step.id,true)">
              <p class="card_title clearfix">
                版本号：<span class="pl5">V{{ step.version }}</span>
                <span class="warn_tag fr" v-if="step.status==='s3_pass'"><i class="fa fa-info-circle"></i>已生效</span>
                <span class="stopuse_tag fr" v-else><i class="fa fa-info-circle"></i>未生效</span>
              </p>
              <p class="card_date">制表时间：<span class="pl5">{{ step.createdAt | short_time }}</span></p>
              <p class="card_date">生效时间：<span class="pl5">{{ step.effectiveTime | short_time }}</span></p>
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
          period: '',
          originYear: '',
          originPeriod: '',
          radioValue:''
        },//顶部日期
        planList:[],//计划列表
        show_modal:false,
        model_type:'2017年度公司目标系统图',
        dateSelectVisible:false,//日期控件的显示与隐藏
        historyVisible: false,//控制历史版本对话框显隐
        form:{
          name:''
        },
        historyTarget: [],
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
    watch:{
    },
    methods: {
      checkHistory:function () {
        var _com=this;
        _com.historyVisible = true;
        _com.$http.get(common.projectPath + 'sys/planform/viewAllHistory/'+_com.planList[0].id,{

        }).then(function (data) {
          data=data.body;
          if(data.code==='SUCCESS'){
            if(data.data){
              _com.historyTarget=data.data;
            }
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      jumpTo:function (id,type,operate) {
        var _com=this;
        _com.$http.get(common.projectPath + 'sys/planform/detail/'+id,{
        }).then(function (data) {
          data=data.body;
          if(data.code==='SUCCESS'){
            if(data.data){
              _com.historyVisible = false;
              for(var i=0;i<data.data.plans.length;i++){
                data.data.plans[i].arrowControl=false;
              }
              data.data.chooseVersion=type;
              operate=operate?operate:'other';
              data.data.operate=operate;
              _com.jumpNext();
              this.$emit('version',data.data);
            }
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      jumpNext:function () {
        this.$emit('step',2);
        this.$emit('version','');
      },
      go:function (step) {

      },
      /**
       * 获得计划列表
       */
      getPlanList:function () {
        var _com=this;
        _com.$http.get(common.projectPath + 'sys/planform/list',{
          params:{
            year:_com.headDate.year?_com.headDate.year:_com.headDate.originYear,
            text:_com.headDate.radioValue?_com.headDate.radioValue:_com.headDate.originPeriod,
          }
        }).then(function (data) {
          data=data.body;
          if(data.code==='SUCCESS'){
            if(data.data){
              _com.planList=data.data;
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
        this.getPlanList();
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
      _com.getPlanList();
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

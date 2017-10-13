<template>
  <div class="wrapper myTarget">
    <page_head></page_head>
    <div class="content_wrapper">
      <content_head show-menu="true"></content_head>
      <div class="content_content clearfix">
        <div class="head_title pl20 clearfix" v-if="!show_add">
          <span>{{ headDate.originYear }}年{{ headDate.originPeriod }}，设置我的目标如下：</span>
          <span class="fr mr20 cursor_pointer go_back" @click="goBack"><i class="fa fa-arrow-circle-left mr10" aria-hidden="true"></i>返回</span>
        </div>
        <div class="head_time_select" v-else>
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
        <!--主页-->
        <div class="target_main" v-if="show_add">
          <div class="system_map">
            <div class="map_center">
              <div class="map_card new_map" @click="createGoal">
                <img src="../../assets/img/plus.png" alt="">
                <p>创建我的目标</p>
              </div>
              <div class="map_card map" v-if="currentGoal.visible">
                <div class="map_des">
                  <div class="title">{{ currentGoal.time }}我的目标</div>
                  <p>版本号：<span>V{{ currentGoal.version }}</span></p>
                  <p>制图人：<span>{{ currentGoal.author }}</span></p>
                  <p>制图时间：<span>{{ currentGoal.createdAt }}</span></p>
                </div>
                <div class="map_op">
                  <i class="fa fa-pencil-square-o" @click="getGoalDetail"></i>
                  <i class="fa fa-history" @click="getGoalHistory"></i>
                  <!--<i class="fa fa-thumbs-o-up"></i>-->
                  <span class="warn_tag fr mt5" v-if="currentGoal.use"><i class="fa fa-info-circle"></i>已生效</span>
                  <span class="stopuse_tag fr mt5" v-else><i class="fa fa-info-circle"></i>未生效</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--详情-->
        <div class="target_main" v-else>
          <el-row>
            <el-col :span="7">
              <indicator-will :url-obj="urlObj" :reload="reload" :dialogSize="large" @checkIndicator="selectIndicator"></indicator-will>
            </el-col>
            <el-col :span="17" v-loading="indicator_checked_loading">
              <div class="indicator_checked ml20 p20">
                <div class="checked_title mb20">
                  <span class="fl">已选择指标</span>
                </div>
                <p class="no_data_tip" v-if="indicatorCheckedList.length === 0">暂无数据</p>
                <indicator_box v-for="item in indicatorCheckedList" :btn-show="false" :item="item" @saveGoal="saveGoal" @unCheckIndicator="deleteIndicator"></indicator_box>
                <div class="submit">
                  <el-button class="mt30" type="primary" @click="commitGoal" v-if="indicatorCheckedList.length != 0">提交</el-button>
                </div>
              </div>
            </el-col>
          </el-row>

        </div>
      </div>
    </div>
    <el-dialog class="history_dialog" title="历史版本" :visible.sync="historyVisible">
      <div class="dialog_title_line"></div>
      <div class="history_content clearfix">
        <el-steps :space="86" direction="vertical" :active="historyTarget.length - 1">
          <!--<el-step v-for="step in historyTarget" @click="historyDetailVisible = true">-->
          <el-step v-for="step in historyTarget">
            <div slot="description" class="history_card cursor_pointer" @click="getHistoryDetail(step)">
              <p class="card_title clearfix">
                版本号：<span class="pl5">{{ step.version }}</span>
                <span class="warn_tag fr" v-if="step.isUse"><i class="fa fa-info-circle"></i>已生效</span>
                <span class="stopuse_tag fr" v-else><i class="fa fa-info-circle"></i>未生效</span>
              </p>
              <p class="card_date">制图时间：<span class="pl5">{{ step.createdAt }}</span></p>
              <p class="card_date">生效时间：<span class="pl5">{{ step.committedAt }}</span></p>
            </div>
          </el-step>
        </el-steps>
      </div>
    </el-dialog>
    <el-dialog class="history_detail" :title="historyDiaTitle" size="full" :visible.sync="historyDetailVisible">
      <div class="dialog_title_line"></div>
      <div class="detail_content p20">
        <p class="no_data_tip" v-if="indicatorHisList.length === 0">暂无数据</p>
        <indicator-his v-for="item in indicatorHisList" :item="item"></indicator-his>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import head from '../common/head.vue'
  import content_head from '../common/content_head.vue'
  import indicator_box from  './indicator.vue'
  import indicator_dia from './addDialog.vue'
  import indicatorHis from './indicatorHis.vue'
  import indicatorWill from  './indicatorWill.vue'

  module.exports = {
    data: function () {
      return {
        indicator_checked_loading: false,
        urlObj:{
          url:'sys/indicator/list-by-goal',
          params:{"objectiveFormId":"06f72c5365cc4be5bdf0d67c72ca867a"}
        },
        show_add: true,//创建我的目标
        addDialogContorl: false,//添加指标对话框显隐
        dateSelectVisible: false,//日期控件显隐
        indicatorCheckedList: [],//已选择指标
        indicatorHisList: [],//已选择指标
        keyword: '',//指标搜索关键字
        toggle: false,//搜索框默认不显示
        headDate: {
          year: '',
          originYear: '',
          originPeriod: '',
          radioValue: ''
        },//顶部日期
        handleDate: {
          time: '',
          periodType: '',
          periodValue: ''
        },//处理后的日期，做请求时用
        historyVisible: false,//控制历史版本对话框显隐
        historyDiaTitle: '',//历史版本详情对话框标题
        historyTarget: [],
        historyDetailVisible: false,//历史版本详情
        currentGoalId: '',//当前操作的目标的id
        currentGoal: {
          id: '',
          time: '',
          version: '',
          author: '',
          createdAt: '',
          use: true,
          visible: false
        },//当前操作的目标
        myGoal: {},//current接口获取得
        reload: [false]
      }
    },
    computed: {

    },
    methods: {
      haha: function () {

      },
      //控制指标搜索框显隐
      toggleControl: function () {
        this.toggle = !this.toggle;
      },
      //日期控件取消按钮
      clearSelect: function () {
        this.headDate.radioValue = this.headDate.originPeriod;
        this.dateSelectVisible = false;
      },
      //日期控件确认按钮
      saveMonth: function () {
        var _com = this;
        _com.headDate.originYear = _com.headDate.year;
        _com.headDate.originPeriod = _com.headDate.radioValue;
        _com.dateSelectVisible = false;
        _com.handleDate.time = _com.headDate.originYear;
        if (_com.headDate.originPeriod.length === 2) {
          if (_com.headDate.originPeriod.substr(0,1) === 'Q') {
            _com.handleDate.periodType = 'By_quarter';
            _com.handleDate.periodValue = _com.headDate.originPeriod.substr(1,1);
          } else {
            _com.handleDate.periodType = 'By_month';
            _com.handleDate.periodValue = _com.headDate.originPeriod.substr(0,1);
          }
        } else if (_com.headDate.originPeriod.length === 3) {
          _com.handleDate.periodType = 'By_month';
          _com.handleDate.periodValue = _com.headDate.originPeriod.substr(0,2);
        } else {
          _com.handleDate.periodType = 'By_year';
          _com.handleDate.periodValue = '';
        }
        _com.getNewGoal();
      },
      //日期控件隐藏回调事件
      dateHide: function () {
        this.headDate.radioValue = this.headDate.originPeriod;
//        this.headDate.radioValue = '';//取消日期控件里的单选按钮
//        this.handleDate.periodType = 'By_year';
//        console.log('dateHide');

        console.log('qian-handleDate:', this.handleDate);

        console.log('hou-handleDate:', this.handleDate);
      },
      //保存指标的目标值和挑战值
      saveGoal: function (val) {
        var _com = this;
        _com.$http.post(common.projectPath+'sys/goal/set-indicator', val).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.$message.success('保存成功');
          }else {
            _com.$message.error(data.message);
          }
        })
      },
      //获取最新的我的目标
      getNewGoal: function () {
        var _com = this;
        _com.$http.post(common.projectPath+'sys/goal/current', _com.handleDate).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            if (data.data) {
              _com.currentGoal.id = data.data.id;
              _com.currentGoalId = data.data.id;
              if (data.data.periodType === 'By_year') {
                _com.currentGoal.time = data.data.time + '年';
              } else if (data.data.periodType === 'By_month') {
                _com.currentGoal.time = data.data.time + '年' + data.data.periodValue + '月';
              } else {
                _com.currentGoal.time = data.data.time + '年第' + data.data.periodValue + '季度';
              }
              _com.currentGoal.version = data.data.version;
              _com.currentGoal.author = data.data.createdName;
              _com.currentGoal.createdAt = data.data.updatedAt.slice(0,10);
              if (data.data.status === 'COMMITTED') {
                _com.currentGoal.use = true;
              } else {
                _com.currentGoal.use = false;
              }
              _com.currentGoal.visible = true;
            } else {
              _com.currentGoal.visible = false;
            }
          }else {
            _com.$message.error(data.message);
          }
        })
      },
      //创建我的目标
      createGoal: function () {
        var _com = this;
        _com.$http.post(common.projectPath+'sys/goal/add', _com.handleDate).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.show_add=false;
            _com.currentGoalId = data.data;
          }else {
            _com.$message.error(data.message);
          }
        })
      },
      //获取目标详情
      getGoalDetail: function () {
        var _com = this;
        _com.indicator_checked_loading = true;
        _com.$http.post(common.projectPath+'sys/goal/detail/'+_com.currentGoalId).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.urlObj.params.objectiveFormId = data.data.id;
            if (data.data.details === null) {
              _com.indicatorCheckedList = [];
            } else {
              _com.indicatorCheckedList = [];
              for (var i = 0; i < data.data.details.length; i++) {
                data.data.details[i].indicator.newId = data.data.details[i].id;
                data.data.details[i].indicator.challengeValue = data.data.details[i].challengeValue;
                data.data.details[i].indicator.targetValue = data.data.details[i].targetValue;
                data.data.details[i].indicator.source = data.data.details[i].source;
                data.data.details[i].indicator.type = data.data.details[i].type;
                data.data.details[i].indicator.spread = false;
                _com.indicatorCheckedList.push(data.data.details[i].indicator);
              }
            }
            _com.show_add = false;
            setTimeout(function () {
              _com.indicator_checked_loading=false;
            },300);
          }else {
            _com.$message.error(data.message);
          }
        })
      },
      //获取我的目标版本记录
      getGoalHistory: function () {
        var _com = this;
        _com.$http.post(common.projectPath+'sys/goal/version/list',_com.handleDate).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            if (data.data) {
              for (var i = 0; i < data.data.length; i++) {
                if (data.data[i].status === 'COMMITTED') {
                  data.data.isUse = true;
                } else {
                  data.data.isUse = false;
                }
              }
            }
            _com.historyTarget = data.data;
            _com.historyVisible = true;
          }else {
            _com.$message.error(data.message);
          }
        })
      },
      //查询历史版本详情
      getHistoryDetail: function (val) {
        var _com = this;
        _com.$http.post(common.projectPath+'sys/goal/history/' + val.id).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            if (data.data) {
              _com.historyDiaTitle = data.data.name + '，V' + data.data.version + '版本：'
            }
            if (data.data.details === null) {
              _com.indicatorHisList = [];
            } else {
              _com.indicatorHisList = [];
              for (var i = 0; i < data.data.details.length; i++) {
                data.data.details[i].indicator.challengeValue = data.data.details[i].challengeValue;
                data.data.details[i].indicator.targetValue = data.data.details[i].targetValue;
                data.data.details[i].indicator.source = data.data.details[i].source;
                data.data.details[i].indicator.spread = false;
                _com.indicatorHisList.push(data.data.details[i].indicator);
              }
            }
            this.historyDetailVisible = true;
          }else {
            _com.$message.error(data.message);
          }
        })
      },
      //向我的目标添加指标
      selectIndicator: function (val) {
        var _com = this,data = {};
        data.indicatorId = val.id;
        data.goalFormId = _com.currentGoalId;
        _com.$http.post(common.projectPath+'sys/goal/add-indicator', data, {
          params: {}
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.getGoalDetail();
            _com.$set(_com.reload, 0, true);
          }else {
            _com.$message.error(data.message);
          }
        })
      },
      //从我的目标移除指标
      deleteIndicator: function (val) {
        var _com = this,data = {};
        data.id = val.newId;
//        data.goalFormId = _com.currentGoalId;
        _com.$http.post(common.projectPath+'sys/goal/del-indicator', data, {
          params: {}
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.getGoalDetail();
            _com.$set(_com.reload, 0, true);
          }else {
            _com.$message.error(data.message);
          }
        })
      },
      //提交我的目标
      commitGoal: function () {
        var _com = this;
        _com.$http.get(common.projectPath+'sys/goal/commit/' + _com.currentGoalId, {}).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.getNewGoal();
            _com.show_add=true;
          }else {
            _com.$message.error(data.message);
          }
        })
      },
      //返回，还要对已选择的指标进行处理
      goBack: function () {
        var _com = this;
        _com.show_add = true;
        _com.getNewGoal();
      }

    },
    mounted: function () {
      var _com = this;
      //处理当前日期
      _com.headDate.originYear = new Date().getFullYear();
      _com.headDate.year = _com.headDate.originYear;
      _com.headDate.originPeriod = new Date().getMonth() + 1 + '月';
      _com.handleDate.time = _com.headDate.originYear;
      _com.handleDate.periodType = 'By_month';
      _com.handleDate.periodValue = _com.headDate.originPeriod.slice(0,_com.headDate.originPeriod.length-1);
      _com.getNewGoal();
    },
    components: {
      'page_head': head,
      'content_head': content_head,
      'indicator_box': indicator_box,
      'indicator_dia': indicator_dia,
      'indicator-his': indicatorHis,
      'indicator-will': indicatorWill
    }
  }
</script>

<!--日清表-->
<template>
  <div class="task dailySheet">
    <p class="list_title">日清表填报</p>
    <div class="task_node" @click="openDaily(x,1)">
      <div class="task_type clearfix">
        <span class="vertical_bar"></span><span>日清表</span>
      </div>
      <div class="task_content">
        <div class="task_des">日清表填报</div>
        <div class="task_man">
          <p class="">发布人：<span>{{ userInfo.realName }}</span></p>
        </div>
        <div class="task_time">
          <img src="../../assets/img/time.svg" alt="">
          <span>{{ dailyForm.time }}</span>
          <!--<span class="fr" :class="{task_uncompleted:x.status==='unover',task_completed:x.status==='over',task_delay:x.status==='delay'}">{{x.statusText}}</span>-->
          <span class="fr task_completed">{{ dailyForm.status | dailyForm_status }}</span>
        </div>
      </div>
    </div>
    <!--日清表填写模态框-->
    <el-dialog  :title="dailyDiaTitle" :visible.sync="dailyDiaShow" @close="clearForm">
      <div class="dialog_title_line"></div>
      <div class="datePick" v-if="dailyForm.status == 'APPROVED'">
        <el-date-picker type="date" v-model="date" :picker-options="pickerOption" format placeholder="选择日期" @change="getDailyByDate"></el-date-picker>
      </div>
      <el-table class="kpi_table mb10" :data="kpiList" border style="width: 100%">
        <el-table-column prop="name" label="考核项目" align="center" rowspan="3"></el-table-column>
        <el-table-column prop="departmentIndicator.name" label="指标名称" align="center"></el-table-column>
        <el-table-column prop="targetValue" label="目标值" align="center"></el-table-column>
      </el-table>
      <el-table class="gs_table mb10" :data="gsList" border :gutter="0">
        <el-table-column prop="name" label="考核项目" align="center"></el-table-column>
        <el-table-column prop="name" label="GS任务名称" align="center"></el-table-column>
        <el-table-column prop="remark" label="任务内容" align="center"></el-table-column>
        <el-table-column prop="finishTime" label="完成时间" align="center"></el-table-column>
        <el-table-column prop="finishState" label="完成情况" align="center"></el-table-column>
      </el-table>
      <el-form ref="dailyForm" :model="dailyForm">
        <el-table class="todayPlan" :data="dailyForm.todayPlan" border :gutter="0">
        <!--<el-table class="todayPlan" border >-->
          <el-table-column prop="name" label="任务" align="center" min-width="14%">今日工作计划</el-table-column>
          <el-table-column label="序号" align="center" min-width="8%">
            <template scope="scope">
              <span v-if="dailyForm.todayPlan[scope.$index].type == 'TODAY'">{{ scope.$index + 1 }}</span>
              <el-button type="text" v-else @click="addTodayPlan">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column label="工作计划" align="center" min-width="34%">
            <template scope="scope">
              <el-input class="validate" v-if="dailyForm.todayPlan[scope.$index].type == 'TODAY' && dailyForm.status != 'APPROVED'" v-model="dailyForm.todayPlan[scope.$index].plan" placeholder="请输入..."></el-input>
              <span v-else-if="dailyForm.status == 'APPROVED'">{{ dailyForm.todayPlan[scope.$index].plan }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="完成情况" align="center" min-width="17%">
            <template scope="scope" class="no_border_parent">
              <el-input class="validate" v-if="dailyForm.todayPlan[scope.$index].type == 'TODAY' && dailyForm.status != 'APPROVED'" v-model="dailyForm.todayPlan[scope.$index].result" placeholder="请输入..."></el-input>
              <span v-else-if="dailyForm.status == 'APPROVED'">{{ dailyForm.todayPlan[scope.$index].result }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="相关类型" align="center" min-width="18%">
            <template scope="scope" class="no_border_parent">
              <el-select class="validate" v-if="dailyForm.todayPlan[scope.$index].type == 'TODAY' && dailyForm.status != 'APPROVED'" v-model="dailyForm.todayPlan[scope.$index].matterType" placeholder="请选择">
                <el-option v-for="p in matterTypes" :value="p.id" :key="p.id" :label="p.name">{{ p.name }}</el-option>
              </el-select>
              <span v-else-if="dailyForm.status == 'APPROVED'">{{ dailyForm.todayPlan[scope.$index].matterType | matters_type }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="9%">
            <template scope="scope">
              <el-button type="text" v-if="dailyForm.todayPlan[scope.$index].type == 'TODAY'" @click="removepPlan('today',scope.$index)" :disabled="dailyForm.status == 'APPROVED'">移除</el-button>
              <span v-else>-</span>
            </template>
          </el-table-column>
        </el-table>
        <el-table class="tomrrowPlan" :data="dailyForm.tomrrowPlan" border style="width: 100%">
          <el-table-column prop="name" label="任务" align="center" min-width="14%">明日工作计划</el-table-column>
          <el-table-column label="序号" align="center" min-width="8%">
            <template scope="scope">
              <span v-if="dailyForm.tomrrowPlan[scope.$index].type == 'TOMRROW'">{{ scope.$index + 1 }}</span>
              <el-button type="text" v-else @click="addtomrrowPlan">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column label="工作计划" align="center" min-width="34%">
            <template scope="scope">
              <el-input class="validate" v-if="dailyForm.tomrrowPlan[scope.$index].type == 'TOMRROW' && dailyForm.status != 'APPROVED'" v-model="dailyForm.tomrrowPlan[scope.$index].plan" placeholder="请输入..."></el-input>
              <span v-else-if="dailyForm.status == 'APPROVED'">{{ dailyForm.tomrrowPlan[scope.$index].plan }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="需要资源" align="center" min-width="17%">
            <template scope="scope">
              <el-form-item :rules="{required: true, message: '请填写...', trigger: 'blur'}">
                <el-input v-if="dailyForm.tomrrowPlan[scope.$index].type == 'TOMRROW' && dailyForm.status != 'APPROVED'" v-model="dailyForm.tomrrowPlan[scope.$index].result" placeholder="请输入..."></el-input>
                <span v-else-if="dailyForm.status == 'APPROVED'">{{ dailyForm.tomrrowPlan[scope.$index].result }}</span>
                <span v-else>-</span>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="相关类型" align="center" min-width="18%">
            <template scope="scope">
              <el-select class="validate" v-if="dailyForm.tomrrowPlan[scope.$index].type == 'TOMRROW' && dailyForm.status != 'APPROVED'" v-model="dailyForm.tomrrowPlan[scope.$index].matterType" placeholder="请选择">
                <el-option v-for="p in matterTypes" :value="p.id" :key="p.id" :label="p.name">{{ p.name }}</el-option>
              </el-select>
              <span v-else-if="dailyForm.status == 'APPROVED'">{{ dailyForm.tomrrowPlan[scope.$index].matterType | matters_type }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="9%">
            <template scope="scope">
              <el-button type="text" v-if="dailyForm.tomrrowPlan[scope.$index].type == 'TOMRROW'" @click="removepPlan('TOMRROW',scope.$index)" :disabled="dailyForm.status == 'APPROVED'">移除</el-button>
              <span v-else>-</span>
            </template>
          </el-table-column>
        </el-table>
        <el-table class="matters_table" :data="matters" border :show-header=false style="width: 100%;">
          <el-table-column label-class-name="bg_gray" label="需要协调事项" prop="name" align="center" min-width="14%"></el-table-column>
          <el-table-column label="填写内容" min-width="85%">
            <template scope="scope">
              <el-input type="textarea" v-model="scope.row.matters" placeholder="请输入..." v-if="dailyForm.status != 'APPROVED'" ></el-input>
              <span v-else class="span_textarea">{{ scope.row.matters }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-table class="mood_table" :data="mood" border :show-header=false style="width: 100%">
          <el-table-column label-class-name="bg_gray" label="今日心情" prop="name" align="center" min-width="14%"></el-table-column>
          <el-table-column label="选择内容" min-width="85%">
            <template scope="scope" class="clearfix">
              <span class="mood_item clearfix" @click="moodCheck('HAPPY')">
                <span class="fl mood_img" :class="{happy_img_unchecked: isHappy,happy_img_checked: !isHappy}"></span>
                <span class="fl mood_font" :class="{mood_des: isHappy,mood_des_checked: !isHappy}">开心</span>
              </span>
              <span class="mood_item clearfix" @click="moodCheck('COMMON')">
                <span class="fl mood_img" :class="{commonly_img_unchecked: isCommonly,commonly_img_checked: !isCommonly}"></span>
                <span class="fl mood_font" :class="{mood_des: isCommonly,mood_des_checked: !isCommonly}">一般</span>
              </span>
              <span class="mood_item clearfix" @click="moodCheck('SAD')">
                <span class="fl mood_img" :class="{sad_img_unchecked: isSad,sad_img_checked: !isSad}"></span>
                <span class="fl mood_font" :class="{mood_des: isSad,mood_des_checked: !isSad}">难过</span>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <el-table class="ud_table mb10" :data="understand" border :show-header=false height="80px" style="width: 100%">
          <el-table-column label="工作心得" prop="name" align="center" min-width="14%"></el-table-column>
          <el-table-column label="填写内容" min-width="85%">
            <template scope="scope">
              <el-input type="textarea" v-model="understand[0].understand" placeholder="请输入..." v-if="dailyForm.status != 'APPROVED'"></el-input>
              <span v-else class="span_textarea">{{ understand[0].understand }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-form-item class="comment_item clearfix" label="点评：" v-if="dailyForm.status == 'APPROVED'">
          <el-input class="fr" type="textarea" v-model="dailyForm.comment" :disabled="dailyForm.status == 'APPROVED'" placeholder="请输入点评..."></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dailyDiaShow = false">取消</el-button>
        <el-button type="primary" @click="addDailySheet" v-if="dailyForm.status != 'APPROVED'">提交</el-button>
        <!--<el-button type="primary" @click="evaluateDaily" v-if="userInfo.ruleId != 'EMPLOYEE' && dailyForm.status == 'TO_APPROVED'">发送</el-button>-->
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import "../../filter/commonFilter.js"
  module.exports = {
    data: function () {
      return {
        dailyDiaShow: false,//控制日清表对话框显示
        dailyDiaTitle: '日清表填报',//日清表对话框标题
        dailyForm: {
          todayPlan: [
            { name: '今日工作计划', plan: '', result: '', matterType: '', type: 'TODAY' },
            { name: '今日工作计划', plan: '', result: '', matterType: '', type: 'OTHER' },
          ],
          tomrrowPlan: [
            { name: '明日工作计划', plan: '', result: '', matterType: '', type: 'TOMRROW' },
            { name: '明日工作计划', plan: '', result: '', matterType: '', type: 'OTHER' },
          ],
          status: '',
          employeeId: '',//登录用户id
          id: '',//日清表id
          evaluationFormId: '',//考核表id
          time: '',//当天日期
          details: [],//今日工作计划和明日工作计划
          comment: ''
        },
        matters: [{ name: '需要协调事项', matters: '' }],//需要协调事项
        mood: [{ name: '今日心情', mood: 'HAPPY' }],//今日心情
        understand: [{ name: '工作心得', understand: '' }],//工作心得
        kpiList: [],
        gsList: [],
        matterTypes: [
          { id: 'KPI', name: 'KPI相关' },
          { id: 'GS', name: 'GS相关' },
          { id: 'OTHER', name: '其他任务' }
        ],
        isHappy: true,//今日心情
        isCommonly: true,//今日心情
        isSad: true,//今日心情
        pickerOption: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        date: '',//要查看的日清表的日期
        kpiWeights: '',
        gsWeights: '',
        num: '',//表单中未填写的数量
      }
    },
    computed: {
      userInfo:function () {
        return this.$store.state.userInfo;
      },
    },
    methods: {
      init: function () {
        var _com = this;
        this.$nextTick(function () {
          $(".el-table__row:first-child td:first-child").attr('rowspan',30);
          $(".kpi_table .el-table__row:first-child td:first-child").html('KPI指标（权重' + _com.kpiWeights + '%）');
          $(".gs_table .el-table__row:first-child td:first-child").html('GS任务（权重' + _com.gsWeights + '%）');
          $(".tomrrowPlan .el-table__row:first-child td:first-child").html('明日工作计划');
          $(".todayPlan .el-table__row:first-child td:first-child").html('今日工作计划');
          $(".el-table__row:not(:first-child) td:first-child").css('display','none');
        });
      },
      openDaily: function () {
        var _com = this;
        _com.init();
        _com.getToday();
        _com.dailyDiaShow = true;
        _com.date = _com.dailyForm.time;
      },
      //清除表格
      clearForm: function () {
        var _com = this;
        if (_com.dailyForm.status == "INIT") {
          var _com = this,ipts = $(".el-input__inner");
          for (var i = 0; i < ipts.length; i++) {
            $(ipts[i]).css("border-color","white");
          }
          _com.matters = [{ name: '需要协调事项', matters: '' }];
          _com.mood = [{ name: '今日心情', mood: 'HAPPY' }];
          _com.understand = [{ name: '工作心得', understand: '' }];
          _com.dailyForm.todayPlan = [{ name: '今日工作计划', plan: '', result: '', matterType: '', type: 'TODAY' },{ name: '今日工作计划', plan: '', result: '', matterType: '', type: 'OTHER' }];
          _com.dailyForm.tomrrowPlan = [{ name: '明日工作计划', plan: '', result: '', matterType: '', type: 'TOMRROW' },{ name: '明日工作计划', plan: '', result: '', matterType: '', type: 'OTHER' }];
        }
      },
      //查询用户自己当天的日清表
      getToday: function () {
        var _com = this;
        _com.$http.get(common.projectPath+'usr/dailyForm/today').then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
             _com.mood = [];
            _com.understand = [];
            _com.matters = [];
            if(data.data) {
             _com.dailyForm.status = data.data.status;
              if (_com.dailyForm.status == "APPROVED") {
                _com.dailyForm.todayPlan = [];
                _com.dailyForm.tomrrowPlan = [];
              } else if (_com.dailyForm.status == "TO_APPROVE") {
                _com.dailyForm.todayPlan.splice(0,_com.dailyForm.todayPlan.length - 1);
                _com.dailyForm.tomrrowPlan.splice(0,_com.dailyForm.tomrrowPlan.length - 1);
              } else {

              }
              _com.dailyForm.id = data.data.id;
              _com.dailyForm.time = data.data.time;
              _com.dailyForm.evaluationFormId = data.data.evaluationFormId;
              _com.dailyForm.comment = data.data.comment;
              if (data.data.status == "APPROVED") {
                _com.dailyForm.todayPlan.splice(-1,1);
                _com.dailyForm.tomrrowPlan.splice(-1,1);
              }
              for (var i = 0; i < data.data.details.length; i++) {//将今日工作计划和明日工作计划分开
                if (data.data.details[i].type == "TODAY") {
                  data.data.details[i].name = "今日工作计划";
                  _com.dailyForm.todayPlan.splice(-1,0,data.data.details[i]);
                } else if (data.data.details[i].type == "TOMRROW") {
                  data.data.details[i].name = "明日工作计划";
                  _com.dailyForm.tomrrowPlan.splice(-1,0,data.data.details[i]);
                } else {

                }
              }
//              _com.kpiList = data.data.evaluationForm.kpis;
//              _com.gsList = data.data.evaluationForm.gss;
//              _com.kpiWeights = data.data.evaluationForm.kpiWeights;
//              _com.gsWeights = data.data.evaluationForm.gsWeights;
              if(data.data.evaluationForm){
                if(data.data.evaluationForm.status==='INIT'||data.data.evaluationForm.status==='PLAN_TO_VERIFY'||data.data.evaluationForm.status==='PLAN_TO_APPROVE'){
                  _com.kpiList=[];
                  _com.gsList=[];
                }else{
                  _com.kpiList = data.data.evaluationForm.kpis;
                  _com.gsList = data.data.evaluationForm.gss;
                }
                _com.kpiWeights = data.data.evaluationForm.kpiWeights;
                _com.gsWeights = data.data.evaluationForm.gsWeights;
              }
              if (data.data.mood) {
                _com.mood.push({ name: '今日心情', mood: data.data.mood });
              } else {
                _com.mood.push({ name: '今日心情', mood: 'HAPPY' });
              }
              _com.understand.push({ name: '工作心得', understand: data.data.understand });
              _com.matters.push({ name: '需要协调事项', matters: data.data.matters });
              _com.init();
              _com.moodStyle();
            }else{
              _com.$message.error(data.message);
            }
          }
        });
      },
      //查询用户指定日期日清表
      getDailyByDate: function () {
        var _com = this;
        var y = _com.date.getFullYear(), m = _com.date.getMonth() + 1, d = _com.date.getDate(),FinalDate;
        m = m > 9 ? m : '0' + m;
        d = d > 9 ? d : '0' + d;
        FinalDate = y + "-" + m + "-" + d;
        var infos = {
          employeeId: this.$store.state.userInfo.id,
          date: FinalDate
        };
        _com.$http.post(common.projectPath+'usr/dailyForm/getDailyByDate/', infos,{}).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.mood= [];
            _com.understand = [];
            _com.matters = [];
            _com.dailyForm.todayPlan = [];
            _com.dailyForm.tomrrowPlan = [];
            _com.gsList = [];
            _com.kpiList = [];
            _com.dailyForm.comment = '';
            if(data.data.length > 0) {
              _com.dailyForm.status = data.data[0].status;
              _com.dailyForm.id = data.data[0].id;//发送评语时需要
              _com.dailyForm.evaluationFormId = data.data[0].evaluationFormId;
              for (var i = 0; i < data.data[0].details.length; i++) {//将今日工作计划和明日工作计划分开
                if (data.data[0].details[i].type == "TODAY") {
                  data.data[0].details[i].name = "今日工作计划";
                  _com.dailyForm.todayPlan.splice(-1,0,data.data[0].details[i]);
                } else if (data.data[0].details[i].type == "TOMRROW") {
                  data.data[0].details[i].name = "明日工作计划";
                  _com.dailyForm.tomrrowPlan.splice(-1,0,data.data[0].details[i]);
                } else {

                }
              }
              _com.moodStyle();
              // _com.mood.push({ name: '今日心情', mood: data.data[0].mood });
              _com.understand.push({ name: '工作心得', understand: data.data[0].understand });
              _com.matters.push({ name: '需要协调事项', matters: data.data[0].matters });
            }else{
              _com.$message.success(data.message);
              _com.$message.error('该员工未填写当日日清表！');
            }
          }
        });
      },
      //修改当天日清表
      addDailySheet: function () {
        var _com = this;
        _com.formValidate();
        if (_com.num >= 1) {
          _com.$message.error('请将表单填写完整！');
          return false;
        }
        _com.dailyForm.mood = _com.mood[0].mood;
        _com.dailyForm.matters = _com.matters[0].matters;
        _com.dailyForm.understand = _com.understand[0].understand;
        _com.dailyForm.employeeId = this.$store.state.userInfo.id;
        _com.dailyForm.status = "TO_APPROVE";
        _com.dailyForm.details = [];
        for (var i = 0; i < _com.dailyForm.todayPlan.length; i++) {//将今日工作计划合并到details中去
          if (_com.dailyForm.todayPlan[i].type == "TODAY") {
            _com.dailyForm.details.push(_com.dailyForm.todayPlan[i]);
          }
          for (var prop in _com.dailyForm.todayPlan[i]) {
            if (prop == "") {
              _com.$message.error('请将今日工作计划填写完整');
              return false;
            }
          }
        }
        for (var i = 0; i < _com.dailyForm.tomrrowPlan.length; i++) {//将明日工作计划合并到details中去
          if (_com.dailyForm.tomrrowPlan[i].type == "TOMRROW") {
            _com.dailyForm.details.push(_com.dailyForm.tomrrowPlan[i]);
          }
          for (var prop in _com.dailyForm.tomrrowPlan[i]) {
            if (prop == "") {
              _com.$message.error('请将明日工作计划填写完整');
              return false;
            }
          }
        }
        _com.$http.post(common.projectPath + 'usr/dailyForm/update',_com.dailyForm,{}).then(function (data) {
          data = data.body;
          if (data.code == 'SUCCESS') {
            _com.$message.success('保存成功');
            _com.dailyDiaShow = false;
            _com.getToday();
          } else {
            _com.$message.error(data.message);
          }
        });
      },
      //评价员工日清表
      evaluateDaily: function () {
        var _com = this;
        var args = {
          dailyFormId: _com.dailyForm.id,
           comment: _com.dailyForm.comment
//          comment: '这里是评语'
        }
        _com.$http.post(common.projectPath + 'usr/dailyForm/verify',args,{}).then(function (data) {
          data = data.body;
          if (data.code == 'SUCCESS') {
            _com.getToday();
          } else {
            _com.$message.error(data.message);
          }
        });
      },
      //添加今日工作计划
      addTodayPlan: function () {
        var _com = this;
        _com.dailyForm.todayPlan.splice(-1,0,{
          name: '今日工作计划',
          plan: '',
          result: '',
          matterType: '',
          type: 'TODAY'
        });
        _com.init();
      },
      //添加明日工作计划
      addtomrrowPlan: function () {
        var _com = this;
        _com.dailyForm.tomrrowPlan.splice(-1,0,{
          name: '明日工作计划',
          plan: '',
          result: '',
          matterType: '',
          type: 'TOMRROW'
        });
        _com.init();
      },
      //移除工作计划
      removepPlan: function (val,ind) {
        var _com = this;
        if (val == 'today') {
          _com.dailyForm.todayPlan.splice(ind,1);
          if (_com.dailyForm.todayPlan.length == 1) {
            _com.addTodayPlan();
          }
        } else if (val == 'TOMRROW') {
          _com.dailyForm.tomrrowPlan.splice(ind,1);
          if (_com.dailyForm.tomrrowPlan.length == 1) {
            _com.addtomrrowPlan();
          }
        } else {

        }
      },
      //选择心情
      moodCheck: function (val) {
        var _com = this;
        if (_com.dailyForm.status != 'APPROVED') {
          _com.mood[0].mood = val;
        }
        _com.moodStyle();
      },
      //选择心情控制class绑定
      moodStyle: function () {
        var _com = this;
        if (_com.mood[0].mood == 'SAD') {
          _com.isHappy = true;
          _com.isCommonly = true;
          _com.isSad = false;
        } else if (_com.mood[0].mood == 'COMMON') {
          _com.isHappy = true;
          _com.isCommonly = false;
          _com.isSad = true;
        } else {
          _com.isHappy = false;
          _com.isCommonly = true;
          _com.isSad = true;
        }
      },
      formValidate: function () {
        var _com = this,ipts = $(".validate .el-input__inner");
        _com.num = 0;
        for (var i = 0; i < ipts.length; i++) {
          if (ipts[i].value == "") {
            _com.num++;
            $(ipts[i]).css("border-color","red");
          } else {
            $(ipts[i]).css("border-color","white");
          }
        }
      },
      createAnimation:function () {
        $('.task_node').hover(function () {
          $(this).addClass('').find('.vertical_bar').addClass('animated wobble');
        },function () {
          $(this).removeClass('').find('.vertical_bar').removeClass('animated wobble');
        })
      }
    },
    mounted: function () {
      var _com = this;
      _com.getToday();
      _com.createAnimation();
    }
  }
</script>

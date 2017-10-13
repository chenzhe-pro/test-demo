<!--员工考核-->
<template>
  <div class="employeeCheck dailySheet">
    <p class="part_title">员工管理</p>
    <div class="employee">
      <ul class="">
        <li v-for="c in childData">
          <div class="card_node">
            <div class="name">
              <div class="head_list" >
                <span v-text="c.realName">asdas</span>
              </div>
              <div class="inline-block">
                <p><span class="node_label">部门：</span><span class="node_value" v-text="c.departmentName">黄鹤</span></p>
                <p><span class="node_label">岗位：</span><span class="node_value" v-text="c.postionName">制造部经理</span></p>
              </div>
            </div>
            <div class="task_time ml10 mr10" @click="openDaily(c.dailyForm,c.id)">
              <img src="../../assets/img/note.svg" alt="">
              <span v-text="fullDate+' 日清表'">2017-07-24 日清表</span>
              <span class="fr task_delay" :class="{task_delay:c.dailyForm.red_text,task_read:!c.dailyForm.red_text}" v-text="c.dailyForm?c.dailyForm.statusText:'未提交'">未提交</span>
            </div>
            <p class="check_task clearfix" style="margin: 10px;margin-bottom: 0;">
              <span class="node_label">本月有<span class="node_value" v-text="c.jobCount?c.jobCount:'0'">40</span>项任务，<span class="node_value" v-text="c.finishCount?c.finishCount:'0'">12</span>项已经完成，<span class="node_value" v-text="c.delayCount?c.delayCount:'0'">6</span>项已经延期</span>
              <span class="fr ch" style="" @click="init(c.id,c.realName)">查看详情</span>
            </p>

          </div>
        </li>
        <p class="no_data_tip mb10" v-if="childData.length===0">暂无直属下属</p>
        <a href="javascript:;" class="load_more mb10" @click="addMore()"  v-show="personLoadMore">加载更多员工</a>
      </ul>
      <el-dialog v-model="modal_detail" :title="modal_title" size="small">
        <div class="check_month clearfix">
          <img class="fl mr10" src="../../assets/img/calendar.svg" alt="">
          <p>
            <span class="gray-text mr10 select_month" @click="clickMonth('last')">上一月 </span>
            <span class="mr10" v-text="date">2017-07</span>
            <span class="gray-text mr20 select_month" @click="clickMonth('next')">下一月</span>
            <span class="gray-text">本月一共有<span class="black-text" v-text="taskDetail.all">40</span>项任务，<span class="black-text" v-text="taskDetail.outTime">12</span>项已经过期，<span class="black-text" v-text="taskDetail.over">6</span>项已经完成</span>
          </p>
        </div>
        <div class="task">
          <div class="set_content task_list">
            <ul class="clearfix">
              <li>
                <p class="list_title mb10"><span class="gray-text">状态：</span>待完成({{taskDetail.unover}})</p>
                <div class="task_node" v-for="t in taskUnOverList" >
                  <div class="task_type clearfix">
                    <span class="vertical_bar animated"></span><span v-text="t.typeText">日清表</span>
                  </div>
                  <div class="task_content">
                    <div class="task_des" v-text="t.description">日清表adsas</div>
                    <div class="task_man clearfix">
                      <p class="fl gray-text">发布人：<span class="black-text" v-text="t.releaseMan?t.releaseMan.realName:'暂无'">111</span></p>
                    </div>
                    <div class="task_time">
                      <img src="../../assets/img/time.svg" alt="">
                      <span v-text="t.completeTime">2017-07-07</span>
                      <span class="fr"></span>
                    </div>
                  </div>
                </div>
                <p class="no_data_tip" v-if="taskUnOverList.length==0">暂无待完成任务</p>
                <a href="javascript:;" class="load_more" @click="getMore('unover')" v-show="addMoreUnover&&taskUnOverList.length">加载更多待完成任务</a>
              </li>
              <li>
                <p class="list_title mb10"><span class="gray-text">状态：</span>已完成({{taskDetail.over}})</p>
                <div class="task_node" v-for="t in taskOverList">
                  <div class="task_type clearfix">
                    <span class="vertical_bar" ></span><span v-text="t.typeText">日清表</span>
                  </div>
                  <div class="task_content">
                    <div class="task_des" v-text="t.description">日清表adsas</div>
                    <div class="task_man clearfix">
                      <p class="fl gray-text">发布人：<span class="black-text" v-text="t.releaseMan?t.releaseMan.realName:'暂无'">111</span></p>
                      <!--任务类型为事项或者填报则显示转发人-->
                      <!--<p class="fl" >转发人：<span>{{x.forwardMan|null_to_text('暂无')}}</span></p>-->
                    </div>
                    <div class="task_time">
                      <img src="../../assets/img/time.svg" alt="">
                      <span class="mr5" v-text="t.completeTime">2017-07-07</span>
                      <span>已完成</span>
                    </div>
                  </div>
                </div>
                <p class="no_data_tip" v-if="taskOverList.length==0">暂无完成任务</p>
                <a href="javascript:;" class="load_more" @click="getMore('over')" v-show="addMoreOver&&taskOverList.length">加载更多已完成任务</a>
              </li>
              <li>
                <p class="list_title mb10"><span class="gray-text">状态：</span><span class="task_delay">已延期({{taskDetail.outTime}})</span></p>
                <div class="task_node"  v-for="t in taskOutTimeList">
                  <div class="task_type clearfix">
                    <span class="vertical_bar"></span><span v-text="t.typeText">日清表</span>
                  </div>
                  <div class="task_content">
                    <div class="task_des" v-text="t.description">日清表adsas</div>
                    <div class="task_man clearfix">
                      <p class="fl gray-text">发布人：<span class="black-text" v-text="t.releaseMan?t.releaseMan.realName:'暂无'">111</span></p>
                      <!--任务类型为事项或者填报则显示转发人-->
                      <!--<p class="fl" >转发人：<span>{{x.forwardMan|null_to_text('暂无')}}</span></p>-->
                    </div>
                    <div class="task_time">
                      <img src="../../assets/img/time.svg" alt="">
                      <span class="task_delay mr5" v-text="t.completeTime">2017-07-07</span>
                      <span class="task_delay">已延期</span>
                    </div>
                  </div>
                </div>
                <p class="no_data_tip" v-if="taskOutTimeList.length==0">暂无延期任务</p>
                <a href="javascript:;" class="load_more" @click="getMore('outTime')" v-show="addMoreOutTime&&taskOutTimeList.length">加载更多延期任务</a>
              </li>
            </ul>
          </div>
        </div>
        <div slot="footer">
          <div class="btns clearfix" style="width: 150px;margin: 0px auto">
            <div class="btn btn-primary fr" @click="modal_detail=false">确定</div>
          </div>
        </div>
      </el-dialog>
      <!--日清表填写模态框-->
      <el-dialog  title="日清表查阅" v-model="dailyDiaShow" >
        <div class="dialog_title_line"></div>
        <div class="check_month clearfix mb10">
          <img class="fl mr10" src="../../assets/img/calendar.svg" alt="">
          <p>
            <span class="gray-text mr10 select_month" @click="clickDay()">上一天</span>
            <span class="mr10" v-text="lastDay">2017-07-06</span>
            <span class="gray-text mr10 select_month" @click="clickNextDay()">下一天</span>
          </p>
        </div>
        <el-table class="kpi_table mb10" :data="kpiList" border>
          <el-table-column prop="name" label="考核项目" align="center" rowspan="3"></el-table-column>
          <el-table-column prop="departmentIndicator.name" label="指标名称" align="center"></el-table-column>
          <el-table-column prop="targetValue" label="目标值" align="center"></el-table-column>
        </el-table>
        <el-table class="gs_table mb10" :data="gsList" border>
          <el-table-column prop="name" label="考核项目" align="center"></el-table-column>
          <el-table-column prop="name" label="GS任务名称" align="center"></el-table-column>
          <el-table-column prop="remark" label="任务内容" align="center"></el-table-column>
          <el-table-column prop="finishTime" label="完成时间" align="center"></el-table-column>
          <el-table-column prop="finishState" label="完成情况" align="center"></el-table-column>
        </el-table>
        <el-form ref="dailyForm" :model="dailyForm">
          <el-table class="todayPlan" :data="dailyForm.todayPlan" border>
            <el-table-column prop="name" label="任务" align="center" min-width="14%">今日工作计划</el-table-column>
            <el-table-column label="序号" align="center" min-width="8%">
              <template scope="scope">
                <span >{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column label="工作计划" align="center" min-width="34%">
              <template scope="scope">
                <span>{{ dailyForm.todayPlan[scope.$index].plan }}</span>
              </template>
            </el-table-column>
            <el-table-column label="完成情况" align="center" min-width="17%">
              <template scope="scope" class="no_border_parent">
                <span>{{ dailyForm.todayPlan[scope.$index].result }}</span>
              </template>
            </el-table-column>
            <el-table-column label="相关类型" align="center" min-width="18%">
              <template scope="scope" class="no_border_parent">
                <span>{{ dailyForm.todayPlan[scope.$index].matterType | matters_type }}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-table class="tomrrowPlan" :data="dailyForm.tomorrowPlan" border>
            <el-table-column prop="name" label="任务" align="center" min-width="14%">明日工作计划</el-table-column>
            <el-table-column label="序号" align="center" min-width="8%">
              <template scope="scope">
                <span >{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column label="工作计划" align="center" min-width="34%">
              <template scope="scope">
                <span>{{ dailyForm.tomorrowPlan[scope.$index].plan }}</span>
              </template>
            </el-table-column>
            <el-table-column label="需要资源" align="center" min-width="17%">
              <template scope="scope">
                <el-form-item >
                  <span>{{ dailyForm.tomorrowPlan[scope.$index].result }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="相关类型" align="center" min-width="18%">
              <template scope="scope">
                <span>{{ dailyForm.tomorrowPlan[scope.$index].matterType | matters_type }}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-table class="matters_table" :data="matters" border :show-header=false style="width: 100%;">
            <el-table-column label-class-name="bg_gray" label="需要协调事项" prop="name" align="center" min-width="14%"></el-table-column>
            <el-table-column label="填写内容" min-width="85%">
              <template scope="scope">
                <span class="span_textarea">{{ matters[0].matters }}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-table class="mood_table" :data="mood" border :show-header=false>
            <el-table-column label-class-name="bg_gray" label="今日心情" prop="name" align="center" min-width="14%"></el-table-column>
            <el-table-column label="选择内容" min-width="85%">
              <template scope="scope" class="clearfix">
              <span class="mood_item clearfix">
                <span class="fl mood_img" :class="{happy_img_unchecked: isHappy,happy_img_checked: !isHappy}"></span>
                <span class="fl mood_font" :class="{mood_des: isHappy,mood_des_checked: !isHappy}">开心</span>
              </span>
                <span class="mood_item clearfix">
                <span class="fl mood_img" :class="{commonly_img_unchecked: isCommonly,commonly_img_checked: !isCommonly}"></span>
                <span class="fl mood_font" :class="{mood_des: isCommonly,mood_des_checked: !isCommonly}">一般</span>
              </span>
                <span class="mood_item clearfix">
                <span class="fl mood_img" :class="{sad_img_unchecked: isSad,sad_img_checked: !isSad}"></span>
                <span class="fl mood_font" :class="{mood_des: isSad,mood_des_checked: !isSad}">难过</span>
              </span>
              </template>
            </el-table-column>
          </el-table>
          <el-table class="matters_table mb10" :data="understand" border :show-header=false style="width: 100%;">
            <el-table-column label-class-name="bg_gray" label="需要协调事项" prop="name" align="center" min-width="14%"></el-table-column>
            <el-table-column label="填写内容" min-width="85%">
              <template scope="scope">
                <span class="span_textarea">{{ understand[0].understand }}</span>
              </template>
            </el-table-column>
          </el-table>
          <!--<el-table class="ud_table mb10" :data="understand" border :show-header=false height="80px">-->
            <!--<el-table-column label-class-name="bg_gray" label="工作心得" prop="name" align="center" min-width="14%"></el-table-column>-->
            <!--<el-table-column label="填写内容" min-width="85%">-->
              <!--<template scope="scope">-->
                <!--<span class="span_textarea">{{ understand[0].understand }}</span>-->
              <!--</template>-->
            <!--</el-table-column>-->
          <!--</el-table>-->
          <el-form-item class="comment_item clearfix" label="点评：">
            <span  v-text="dailyForm.comment" v-if="dailyForm.status=='APPROVED'"></span>
            <el-input class="fr" type="textarea" v-model="dailyForm.comment" v-else  placeholder="请输入点评..."></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" style="width: 320px;margin: 40px auto" v-if="dailyForm.status!=='APPROVED'">
          <el-button style="width: 150px;height: 40px"  @click="dailyDiaShow = false">取消</el-button>
          <!--<el-button style="width: 150px;height: 40px" type="primary" :disabled="ifHasData"  @click="evaluateDaily">发送</el-button>-->
          <el-button style="width: 150px;height: 40px" type="primary" :disabled="dailyForm.status==='INIT'||ifHasData"  @click="evaluateDaily">发送</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  module.exports = {
    data: function () {
      return {
        modal_detail:false,
        childData:[],//直属下级的数据
        taskDetail:{},
        taskOverList:[],
        taskUnOverList:[],
        taskOutTimeList:[],
        addMoreOutTime:false,
        addMoreOver:false,
        addMoreUnover:false,
        date:'',
        fullDate:'',
        currentId:'',
        personLoadMore:false,
        currentTaskPage:1,
        modal_title:'',
        dailyDiaShow:false,
        dailyForm:{todayPlan:[],tomorrowPlan:[]},
        matters: [],//需要协调事项
        understand:[],
        mood: [],//今日心情
        kpiList: [],
        gsList: [],
        kpiWeights: '',
        gsWeights: '',
        isHappy: true,//今日心情
        isCommonly: true,//今日心情
        isSad: true,//今日心情
        currentPersonId:'',
        AddDayCount:0,
        ifHasData:false,
        red_text:false,
        lastDay:'',
        statusType:'',
        pageSize:5,
        currentPage:1
      }
    },
    computed: {

    },
    methods: {
      getMore:function (type) {
        var _com=this;
//        _com.pageSize+=6;
        if(_com.statusType){
          if(_com.statusType!==type){
            _com.currentTaskPage=1;
//            _com.currentTaskPage++;
          }
        }
        _com.statusType=type;
        _com.currentTaskPage++;
//        _com.init();
        _com.checkDetail(_com.currentId,_com.date,_com.statusType)
      },
      GetDateStr:function (AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = dd.getMonth()+1;//获取当前月份的日期
        var d = dd.getDate();
        m=m>9?m:('0'+m);
        d=d>9?d:('0'+d);
        return y+"-"+m+"-"+d;
      },
      changeDays:function () {
        var _com=this;
//        _com.AddDayCount--;
        _com.dailyForm={};
        _com.ifHasData=false;
        _com.matters=[];
        _com.mood=[];
        _com.understand=[];
        _com.kpiList=[];
        _com.gsList=[];
        _com.lastDay=this.GetDateStr(_com.AddDayCount);
        var infos = {
          employeeId: _com.currentPersonId,
          date: _com.lastDay
        };
        _com.$http.post(common.projectPath+'usr/dailyForm/getDailyByDate/', infos,{})
          .then(function (data) {
            data=data.body;
            if(data.code=='SUCCESS'){
              if(data.data.length){
                _com.dailyForm=data.data[0];
                _com.changeType();
                _com.initForm();
                _com.ifHasData=false;
              }else{
                _com.ifHasData=true;
              }
            }else{
              _com.$message.error(data.message);
            }
          })
      },
      /**
       * 点击上一天
       */
      clickDay:function () {
        var _com=this;
        _com.AddDayCount--;
        _com.changeDays();
      },
      /**
       * 点击下一天
       */
      clickNextDay:function () {
        var _com=this;
        _com.AddDayCount++;
        _com.changeDays();
      },
      /**
       * 打开日清表
       */
      openDaily: function (form,id) {
        var _com = this;
        _com.currentPersonId=id;
        _com.ifHasData=false;
        _com.AddDayCount=0;
        _com.lastDay=_com.fullDate;
        _com.dailyForm=form?form:{};

        _com.changeType();
        _com.initForm();
        _com.dailyDiaShow = true;
//          if(_com.dailyForm.status!=='INIT'){
//            _com.dailyDiaShow = true;
//          }else{
//            _com.dailyDiaShow = false;
//          }
      },
      changeType:function () {
        var _com=this;
        _com.matters=[];
        _com.mood=[];
        _com.understand=[];
        if(_com.dailyForm){
          _com.dailyForm.todayPlan=[];
          _com.dailyForm.tomorrowPlan=[];
          if(_com.dailyForm.evaluationForm){
            if(_com.dailyForm.evaluationForm.status==='INIT'||_com.dailyForm.evaluationForm.status==='PLAN_TO_VERIFY'||_com.dailyForm.evaluationForm.status==='PLAN_TO_APPROVE'){
              _com.kpiList=[];
              _com.gsList=[];
            }else{
              _com.kpiList = _com.dailyForm.evaluationForm.kpis;
              _com.gsList = _com.dailyForm.evaluationForm.gss;
            }
            _com.kpiWeights = _com.dailyForm.evaluationForm.kpiWeights;
            _com.gsWeights = _com.dailyForm.evaluationForm.gsWeights;
          }
          if(_com.dailyForm.details)
            for(var i=0;i<_com.dailyForm.details.length;i++){
              if(_com.dailyForm.details[i].type=='TODAY'){
                _com.dailyForm.todayPlan.push(_com.dailyForm.details[i])
              }else{
                _com.dailyForm.tomorrowPlan.push(_com.dailyForm.details[i])
              }
            }
          _com.matters[0]={ name: '需要协调事项', matters: _com.dailyForm.matters };
          _com.mood[0]={ name: '今日心情', mood: _com.dailyForm.mood };
          _com.understand[0]={ name: '工作心得', understand: _com.dailyForm.understand };
          if (_com.dailyForm.mood == 'SAD') {
            _com.isHappy = true;
            _com.isCommonly = true;
            _com.isSad = false;
          } else if (_com.dailyForm.mood == 'COMMON') {
            _com.isHappy = true;
            _com.isCommonly = false;
            _com.isSad = true;
          } else {
            _com.isHappy = false;
            _com.isCommonly = true;
            _com.isSad = true;
          }
        }else{
          _com.dailyForm={};
          _com.matters[0]={ name: '需要协调事项', matters: '无' };
          _com.mood[0]={ name: '今日心情', mood: '' };
          _com.understand[0]={ name: '工作心得', understand: '无' };
        }
      },
      /**
       * 计算获得上个月
       */
      initLastMonth:function (date) {
        var arr = date.split('-');
        var year = arr[0]; //获取当前日期的年份
        var month = arr[1]; //获取当前日期的月份
        var day = arr[2]; //获取当前日期的日
        var days = new Date(year, month, 0);
        days = days.getDate(); //获取当前日期中月的天数
        var year2 = year;
        var month2 = parseInt(month) - 1;
        if (month2 == 0) {
          year2 = parseInt(year2) - 1;
          month2 = 12;
        }
        var day2 = day;
        var days2 = new Date(year2, month2, 0);
        days2 = days2.getDate();
        if (day2 > days2) {
          day2 = days2;
        }
        if (month2 < 10) {
          month2 = '0' + month2;
        }
//        var t2 = year2 + '-' + month2 + '-' + day2;
        var t2 = year2 + '-' + month2;
        return t2;
      },
      /**
       * 计算获得下个月
       */
      initNextMonth:function (date) {
        var arr = date.split('-');
        var year = arr[0]; //获取当前日期的年份
        var month = arr[1]; //获取当前日期的月份
        var day = arr[2]; //获取当前日期的日
        var days = new Date(year, month, 0);
        days = days.getDate(); //获取当前日期中的月的天数
        var year2 = year;
        var month2 = parseInt(month) + 1;
        if (month2 == 13) {
          year2 = parseInt(year2) + 1;
          month2 = 1;
        }
        var day2 = day;
        var days2 = new Date(year2, month2, 0);
        days2 = days2.getDate();
        if (day2 > days2) {
          day2 = days2;
        }
        if (month2 < 10) {
          month2 = '0' + month2;
        }
//        var t2 = year2 + '-' + month2 + '-' + day2;
        var t2 = year2 + '-' + month2;
        return t2;
      },
      /**
       * 点击上月下月
       */
      clickMonth:function (type) {
        var _com=this;
        if(type=='last'){
          _com.date=this.initLastMonth(_com.date);
        }else if(type=='next'){
          _com.date=this.initNextMonth(_com.date);
        }
        _com.taskOverList=[];
        _com.taskUnOverList=[];
        _com.taskOutTimeList=[];
          _com.checkDetail(_com.currentId,_com.date,'over')
          _com.checkDetail(_com.currentId,_com.date,'unover')
          _com.checkDetail(_com.currentId,_com.date,'outTime')
      },
      initForm:function () {
        var _com=this;
        this.$nextTick(function () {
          $(".el-table__row:first-child td:first-child").attr('rowspan',30);
          $(".kpi_table .el-table__row:first-child td:first-child").html('KPI指标（权重' + _com.kpiWeights + '%）');
          $(".gs_table .el-table__row:first-child td:first-child").html('GS任务（权重' + _com.gsWeights + '%）');
          $(".tomrrowPlan .el-table__row:first-child td:first-child").html('明日工作计划');
          $(".todayPlan .el-table__row:first-child td:first-child").html('今日工作计划');
          $(".el-table__row:not(:first-child) td:first-child").css('display','none');
        });
      },
      /**
       * 查看详情
       */
      init:function (id,name) {
        var _com=this;
        _com.pageSize=5;
        _com.currentTaskPage=1;
        _com.taskOverList=[];
        _com.taskUnOverList=[];
        _com.taskOutTimeList=[];
        _com.statusType='';
        _com.currentId=id;
        _com.modal_title=name+'的任务列表';
        var month=new Date().getMonth()+1;
        month=month>9?month:'0'+month;
        _com.date=(new Date().getFullYear())+'-'+month;
        _com.checkDetail(id,_com.date,'over');
        _com.checkDetail(id,_com.date,'unover');
        _com.checkDetail(id,_com.date,'outTime');


      },
      //评价员工日清表
      evaluateDaily: function () {
        var _com = this;
        var args = {
          dailyFormId: _com.dailyForm.id,
          employeeId:_com.currentPersonId,
          comment: _com.dailyForm.comment
        }
        _com.$http.post(common.projectPath + 'usr/dailyForm/verify',args,{}).then(function (data) {
          data = data.body;
          if (data.code == 'SUCCESS') {
            _com.dailyDiaShow=false;
            _com.childData=[];
            this.currentPage=1;
            _com.getChildDatas();
//            this.$router.replace({name:'index'});
          } else {
            _com.$message.error(data.message);
          }
        });
      },
      addMore:function () {
        this.currentPage++;
        this.getChildDatas();
      },
      /**
       * 点击查看详情
       */
      checkDetail:function (id,clickDate,type) {
        var _com=this;
        var data={
          data:{
            statusTerm:_com.statusType?_com.statusType:type,
            liabilityMan:id,
            time:clickDate,
          },
          pageSize:5,
          page:_com.currentTaskPage
        };
        _com.modal_detail=true;
        _com.$http.post(common.projectPath+'usr/job/queryByLiabilityMan',data,{
        }).then(function (data) {
          data=data.body;
          _com.taskDetail=data;
          if(data.pageDate.code=='SUCCESS'){
            if(data.pageDate.data.length){
              for(var i=0;i<data.pageDate.data.length;i++){
                data.pageDate.data[i].completeTime=data.pageDate.data[i].completeTime.substring(0,10)
              }
            }

            if(_com.statusType=='over'||type=='over'){
              if(data.pageDate.data.length){
                _com.taskOverList=_com.taskOverList.concat(data.pageDate.data);
                if(_com.pagination(data.pageDate.page,data.pageDate.pageSize,data.pageDate.total))
                {
                  _com.addMoreOver=true;
                }
                else _com.addMoreOver=false;
              }else{
//                _com.taskOverList=_com.taskOverList.concat([])
              }

            }else if(_com.statusType=='unover'||type=='unover'){
              if(data.pageDate.data.length){
                _com.taskUnOverList= _com.taskUnOverList.concat(data.pageDate.data);
                if(_com.pagination(data.pageDate.page,data.pageDate.pageSize,data.pageDate.total))
                {
                  _com.addMoreUnover=true;
                }
                else _com.addMoreUnover=false;
              }else{
//                _com.taskUnOverList= _com.taskUnOverList.concat([])
              }

            }else if(_com.statusType=='outTime'||type=='outTime'){
              if(data.pageDate.data){
                _com.taskOutTimeList=_com.taskOutTimeList.concat(data.pageDate.data);
                if(_com.pagination(data.pageDate.page,data.pageDate.pageSize,data.pageDate.total))
                {
                  _com.addMoreOutTime=true;
                }
                else _com.addMoreOutTime=false;
              }else{
//                _com.taskOutTimeList=_com.taskOutTimeList.concat([])
              }

            }
          }else{
            _com.$message.error(data.pageDate.message);
          }
          _com.$nextTick(function () {
            _com.createAnimation();
          })
        })
      },
      /**
       * 加载更多的分页判断
       * @param page
       * @param pageSize
       * @param total
       * @returns {boolean}
       */
      pagination:function (page, pageSize, total) {
        if(Math.ceil(total/pageSize)>page)
        {
          return true;
        }
        else return false;
      },
      /**
       * 获得直属下属的数据
       */
      getChildDatas:function () {
        var _com=this,data={
          page:this.currentPage,
          pageSize:6
        };
        _com.fullDate=_com.GetDateStr(0);
        _com.$http.post(common.projectPath+'sys/employee/queryChildDaily',data,{
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            if(data.data){
              _com.childData=_com.childData.concat(data.data);
              for(var i=0;i<_com.childData.length;i++){
                if(_com.childData[i].dailyForm){
                  if(_com.childData[i].dailyForm.status=='APPROVED'){
                    _com.childData[i].dailyForm.red_text=false;
                    _com.childData[i].dailyForm.statusText='已阅'
                  }else if(_com.childData[i].dailyForm.status=='INIT'){
                    _com.childData[i].dailyForm.red_text=true;
                    _com.childData[i].dailyForm.statusText='未提交'
                  }else{
                    _com.childData[i].dailyForm.red_text=true;
                    _com.childData[i].dailyForm.statusText='未阅'
                  }
                }else{
                  _com.childData[i].dailyForm={};
                  _com.childData[i].dailyForm.red_text=true;
                  _com.childData[i].dailyForm.statusText='未提交'
                }
              }
            }else{
              _com.childData=_com.childData.concat([]);
            }
            if(_com.pagination(data.page,data.pageSize,data.total))
            {
              _com.personLoadMore=true;
            }
            else _com.personLoadMore=false;
          }else{
            _com.$message.error(data.message);
          }
        })
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
      this.getChildDatas();
      this.$nextTick(function () {
        quicker.returnTop();
      })
    }
  }
</script>

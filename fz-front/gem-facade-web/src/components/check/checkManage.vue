<!— ***模板  Created by limin on 2017/7/11—>
<template>
  <div class="wrapper initSet" v-loading.fullscreen="pageLoading">
  <!--<div class="wrapper initSet" >-->
    <page-head></page-head>
    <div class="content_wrapper">
      <content_head show-menu="true"></content_head>
      <div class="content_content p20">
        <div class="checkManage clearfix">
          <div class="left_list">
            <div class="list_title line_bottom">
              人员列表
            </div>
            <div :class="{manager:true,line_bottom:true,selfChecked:selected}" @click="toggleChecked()">
            <!--<div class="manager line_bottom selfChecked" @click="toggleChecked()">-->
              <!--<div class="gray_circle "  v-text="userInfo.realName"></div>-->
              <div class="gray_circle " >{{ userInfo.realName | chooseName }}</div>
              <span v-text="userInfo.postion?userInfo.postion.name:'暂无'">部门经理</span>
            </div>
            <div :class="{shape_select:showRanking,clearfix:true,shape:true}" @click="getRanking()">
              <img class="fl mr10" src="../../assets/img/Shape.svg" alt="">
              <span class="fl">员工绩效排名</span>
            </div>
            <div class="all_branch">全部下属列表</div>
            <div class="checkTree">
              <el-tree ref="personTree"  auto-expand-parent :expand-on-click-node="checkIf" accordion :data="positionList"  node-key="id" @node-click="handleNodeClick" highlight-current></el-tree>
            </div>
            <!--<div class="all_branch" v-if="personList.length">成员</div>-->
            <!--<div>-->
              <!--<el-menu :default-active="activeIndex" class="el-menu-vertical-demo" @select="showTable" >-->
                <!--<el-menu-item v-for="(p,index) in personList" :index="p.id" >-->
                  <!--<div class="manager left_position">-->
                    <!--<div class="gray_circle " v-text="p.realName" >周峰</div>-->
                    <!--<span>{{p.postion.name}}</span>-->
                  <!--</div>-->
                <!--</el-menu-item>-->
              <!--</el-menu>-->
            <!--</div>-->
          </div>
          <div class="right_line"></div>
          <!--<div class="right_bg"></div>-->
          <div class="right_table">
            <div class="list_title right_title">
              考核表
            </div>
            <div class="check_month clearfix">
              <img class="fl mr10" src="../../assets/img/calendar.svg" alt="">
              <span class="fl">
                <span class="thin_font mr15 selectMonth" @click="clickMonth('last')">上一月</span>
                <span class="mr15" v-text="dateShort">2017-07</span>
                <span class="thin_font mr15 selectMonth" @click="clickMonth('next')">下一月</span>
                <span class="thin_font">被考核人员：</span>
                <span class="mr15" v-text="monthDetail&&monthDetail.employeeName?monthDetail.employeeName:'暂无'"></span>
                <span class="thin_font">考核人员：</span>
                <span class="" v-text="monthDetail&&monthDetail.superiorEmployeeName?monthDetail.superiorEmployeeName:'暂无'"></span>
              </span>
            </div>
            <div v-if="monthDetail">
              <uncommitted v-if="monthDetail.status=='INIT'&&!showRanking&&(level===0)" @upup="init" :current-level="level" :table-list="monthDetail"></uncommitted>
              <committed v-if="monthDetail.status=='PLAN_TO_VERIFY'&&!showRanking&&level!==1" @upup="init" :current-level="level" :table-list="monthDetail"></committed>
              <unfill v-if="(monthDetail.status=='PLAN_APPROVED')&&!showRanking" @upup="init" :current-level="level" :table-list="monthDetail"></unfill>
              <filled v-if="(monthDetail.status=='PLAN_FILLED')&&!showRanking" @upup="init" :current-level="level" :table-list="monthDetail"></filled>
              <unchecked v-if="monthDetail.status=='PLAN_TO_VERIFY'&&level===1&&!showRanking" @upup="init" :table-list="monthDetail"></unchecked>
              <checked :table-list="monthDetail" :current-level="level" @upup="init" v-if="!showRanking&&(monthDetail.status=='RESULT_TO_APPROVE'||monthDetail.status=='RESULT_TO_VERIFY'||monthDetail.status=='RESULT_APPROVED')"></checked>
              <juniorUncommitted v-if="monthDetail.status=='INIT'&&!showRanking&&(level>0)" @upup="init" :current-level="level" :table-list="monthDetail"></juniorUncommitted>
              <skipChecked v-if="monthDetail.status=='PLAN_TO_APPROVE'&&!showRanking" @upup="init" :current-level="level" :table-list="monthDetail"></skipChecked>
              <!--<skipUnApproved  v-if="monthDetail.status=='RESULT_APPROVE'&&!showRanking&&level===2" :table-list="monthDetail"></skipUnApproved>-->
              <ranking v-if="showRanking" :rank-table="rankingList"></ranking>
            </div>
            <p class="no_data_tip" v-else>暂无数据</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import head from '../common/head.vue'
  import content_head from '../common/content_head.vue'
  import uncommitted from '../check/uncommitted.vue'
  import committed from '../check/committed.vue'
  import unfill from '../check/unfill.vue'
  import filled from '../check/filled.vue'
  import unchecked from '../check/unchecked.vue'
  import checked from '../check/checked.vue'
  import juniorUncommitted from '../check/juniorUncommitted.vue'
  import skipChecked from '../check/skipChecked.vue'
  import skipUnApproved from '../check/skipUnApproved.vue'
  import ranking from '../check/ranking.vue'
  module.exports = {
    data: function () {
      return {
        pageLoading:true,
        add:false,
        activeIndex:'',//选中的人员
        selected:true,
        showRanking:false,//是否显示绩效排名
        selectPerson:false,//是否选择人员
        currentPersonId:false,//选择人员的id
        statusText:'',
        monthDetail:{},//
        date:'',
        dateShort:'',
        level:0,
        selectedLevel:null,
        tableData: [],
        positionList:[],//岗位列表
        personList:[],//人员列表
        rankingList:[],//绩效排名
        checkIf:true
      }
    },
    watch:{
    },
    computed:{
      userInfo:function () {
        return this.$store.state.userInfo;
      },
      helpList:function () {
        return this.$store.state.helpList;
      },
      personId:function () {
        return this.$store.state.personId;
      },
      createTime:function () {
        return this.$store.state.createTime;
      }
    },
    methods:{
      /**
       * 点击切换是否选择已有标签
       */
      toggleChecked:function () {
        this.selected=!this.selected;
        this.activeIndex='';
        this.selectPerson=false;
        if(this.selected){
          this.activeIndex='';
          window.location.reload();
//          this.getDatas();
          this.showRanking=false;
        }
      },
      /**
       * 点击人员查看考核表
       */
      showTable:function (id) {
        var _com=this;
        _com.selected=false;
        _com.showRanking=false;
        _com.currentPersonId=id;
        _com.$http.get(common.projectPath+'usr/evaluationForm/detail-by-employeeId',{
          params:{
            time:_com.date,
            employeeId:id
          }
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.monthDetail=data.data;
//            _com.selectPerson=true;
            _com.level=_com.level?_com.level:_com.selectedLevel;
            if(data.data)
            _com.changeType();
          }else{
//            _com.selectPerson=false;
            _com.$message.error(data.message);
          }
        })
      },
      /**
       * 点击选择岗位
       */
      handleNodeClick:function (selectedNode) {
        var _com=this;
//        _com.level=0;
        this.selectedLevel=selectedNode.level;
        _com.level=_com.selectedLevel;
        if(selectedNode.realName){
          _com.showTable(selectedNode.id);
          _com.selectPerson=true;
        }else{
          _com.init();
        }
//        else{
//          var position=selectedNode.title;
//          this.selectedLevel=selectedNode.level;
//          if(!selectedNode.children) selectedNode.children=[];
//          if(!selectedNode.objects){
//            selectedNode.objects=[]
//          }else{
//            for(var i=0;i<selectedNode.objects.length;i++){
//              selectedNode.objects[i].label=selectedNode.objects[i].realName+'('+position+')';
//            }
//          }
//          selectedNode.children=selectedNode.children.concat(selectedNode.objects);
//        }
      },
      init:function () {
        var _com=this;
//        this.$nextTick(function () {
//          $(".el-table__row:first-child td:first-child").attr('rowspan',5);
//          $(".el-table__row:first-child td:first-child").html('KPI指标（权重80%）');
//          $(".el-table__row:not(:first-child) td:first-child").css('display','none');
////          $('.right_bg').css('width',width-337)
////          $('.left_list').css('width',335)
//        });
        if(_com.currentPersonId ||_com.personId){
          if(_com.currentPersonId){
            this.showTable(_com.currentPersonId)
          }
        }else {
          this.getDatas();
        }
//        this.getDatas();
      },
      /**
       * 把日期转化为2017-07形式
       */
      FormatDate:function (date) {
        if(date.getMonth()+1>9){
          return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
        }else {
          return date.getFullYear()+"-0"+(date.getMonth()+1)+"-"+date.getDate();
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
        var t2 = year2 + '-' + month2 + '-' + day2;
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
        var t2 = year2 + '-' + month2 + '-' + day2;
        return t2;
      },
      clickMonth:function (type) {
        var _com=this;
        if(type=='last'){
          _com.date=this.initLastMonth(_com.date);
        }else if(type=='next'){
          _com.date=this.initNextMonth(_com.date);
        }
        this.dateShort=this.date.split('-')[0]+'-'+this.date.split('-')[1];
        this.monthDetail={};
//        this.showRanking=false;
        window.sessionStorage.date=this.date;
        if(this.showRanking){
          this.getRanking();
        }else{
          if(_com.selectPerson){
            _com.showTable(_com.currentPersonId);
          }else{
            this.getDatas();
          }
        }
      },
      /**
       * 仅根据月份获得自己的考核表数据
       */
      getDatas:function () {
        var _com=this;
        if(_com.createTime){
          _com.date=_com.createTime;
        }else{
          if(!window.sessionStorage.date){
            _com.date=_com.FormatDate(new Date());
          }else{
            _com.date=window.sessionStorage.date;
          }
        }

        if(_com.userInfo.ruleId=='BOSS'){
          _com.getRanking();
        }else{
          _com.selected=true;
          _com.showRanking=false;
        }
        _com.dateShort=_com.date.split('-')[0]+'-'+_com.date.split('-')[1];
        _com.$http.get(common.projectPath+'usr/evaluationForm/detail',{
          params:{
            time:_com.date,
          }
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.monthDetail=data.data;
            if(data.data)
            _com.changeType();
            switch (data.data.status){
              case 'INIT':
                _com.statusText='未提交';
                break;
              case 'PLAN_TO_VERIFY':
                _com.statusText='已提交待审核';
                break;
              case 'PLAN_TO_APPROVE':
                _com.statusText='已审核待审批';
                break;
              case 'PLAN_APPROVED':
                _com.statusText='已审批待填报';
                break;
              case 'RESULT_TO_VERIFY':
                _com.statusText='已填报待审核';
                break;
              case 'RESULT_APPROVE':
                _com.statusText='已填报待审批';
                break;
              case 'RESULT_APPROVED':
                _com.statusText='已填报已审批';
                break;
            }
            setTimeout(function () {
              _com.pageLoading=false;
//              $('body').css('overflow','auto');
            },500);
//            console.log($('.right_table').height())
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      /**
       * 给表格数据加上%
       */
      changeType:function () {
        var _com=this;
        _com.monthDetail.shortTime=_com.monthDetail.startTime.substring(0,7);
        var kpis=_com.monthDetail.kpis;
        for(var i in kpis){
          kpis[i].weights=kpis[i].weights+'%';
          if(kpis[i].departmentIndicator){
            if(kpis[i].departmentIndicator.percentage){
              kpis[i].challengeValue=kpis[i].challengeValue+'%';
              kpis[i].targetValue=kpis[i].targetValue+'%';
              kpis[i].actualValue=kpis[i].actualValue?kpis[i].actualValue+'%':'暂无';
            }
            switch (kpis[i].departmentIndicator.scoreType){
              case 'VETO_SINGLE':
                kpis[i].scoreType='未发生，得100分；发生，得0分。';
                break;
              case 'POSITIVE':
                kpis[i].scoreType='实际值等于必保值得100分；实际值等于挑战值得110分；最低0分，最高120分；1、实际值大于必保值且小于挑战值，在100分的基础上线性加分；2、实际值大于挑战值，在得110分的基础上双倍加分，最高120分；3、实际值小于必保值，在100分的基础上双倍减分，直至0分。';
                break;
              case 'NEGATIVE':
                kpis[i].scoreType='实际值等于必保值得100分；实际值等于挑战值得110分；最低0分，最高120分；1、实际值小于必保值且大于挑战值，在100分的基础上线性加分；2、实际值小于挑战值，在得110分的基础上双倍加分，最高120分；3、实际值大于必保值，在100分的基础上双倍减分，直至0分。';
                break;
              case 'VETO_ALL':
                kpis[i].scoreType='未发生，得100分；发生，该项得0分，当期绩效得分为0分。';
                break;
            }
            kpis[i].name=kpis[i].departmentIndicator.name;
          }else{
//            kpis[i].name='暂无';
//            kpis[i].scoringStandard='暂无';
          }
        }
        var gss=_com.monthDetail.gss;
        for(var j=0;j<gss.length;j++){
          gss[j].weights=gss[j].weights+'%';
          gss[j].score=gss[j].score?gss[j].score:'暂无';
          if(gss[j].finishTime){
            gss[j].finishTime=gss[j].finishTime.substring(5,10)
          }
        }
      },
      /**
       * 根据人员和月份获得考核表数据
       */
      getDatasById:function () {
        var _com=this;
        _com.$http.get(common.projectPath+'usr/evaluationForm/detail',{
          params:{
            employeeId:'',
            time:_com.date
          }
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.monthDetail=data.data;
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      handleOpen(key, keyPath) {
        var LH=0;
        this.$nextTick(function () {
          var divs=$('.left_list>div')
          for(var i=0;i<divs.length;i++){
            LH+=$(divs[i]).height();
            LH=LH+60
          }
          var RH=$('.right_table').height();
          if(LH<RH){
            $('.left_list').css('height',RH+20);
          }else{
            $('.left_list').css('height',LH);
          }
        })

      },
      /**
       * 获得人员和岗位数据
       */
      getEmployeeList:function () {
        var _com=this;
        _com.pageLoading=true;
        _com.$http.get(common.projectPath+'sys/employee/list-branch',{
          params:{}
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            var list=data.data;
            common.eachTree(list, function (e) {
              e.label = e.title;
              if(!e.children) e.children=[];
              if(!e.objects) e.objects=[];
              if(e.objects){
                for(var i=0;i<e.objects.length;i++){
                  e.objects[i].realName=e.objects[i].realName+'('+e.title+')';
                  e.objects[i].level=e.level;
                }
              }
              e.children=e.children.concat(e.objects);
            });
            _com.positionList.push(list);

            common.eachTree(_com.positionList,function (m) {
              if(m.realName){
                m.label = m.realName;
              }
            })
            if(_com.personId){
              _com.$nextTick(function () {
                var count=0,delf=true;
                common.eachTree(_com.positionList,function (l) {
                  if(l.id==_com.personId){
//                  _com.$refs['personTree'].setChecked(l.id,true);
                    _com.level=l.level;
                    $($('.el-tree-node')[count]).click();
                    delf=null;
                  }else{
                    if(delf){
                      if(l.children.length)
                      $($('.el-tree-node')[count]).click();
                      count++;
                    }
                  }
                })
              })
            }
            setTimeout(function () {
              _com.pageLoading=false;
            },500);

          }else{
            _com.$message.error(data.message);
          }
        })

      },
      /**
       * 点击查看员工绩效排名
       */
      getRanking:function () {
        var _com=this;
        _com.showRanking=true;
        _com.selected=false;
//        this.activeIndex='';
        _com.$http.post(common.projectPath+'sys/employee/branch/rank?time='+_com.date,{

        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            if(data.data)
            _com.rankingList=data.data;
            for(var i=0;i<_com.rankingList.length;i++){
              _com.rankingList[i].number=i+1;
              if(_com.rankingList[i].department){
                _com.rankingList[i].departmentName=_com.rankingList[i].department.name
              }
              if(_com.rankingList[i].postion){
                _com.rankingList[i].positionName=_com.rankingList[i].postion.name
              }
              if(!_com.rankingList[i].score){
                _com.rankingList[i].score='-'
              }
            }
          }else{
            _com.$message.error(data.message);
          }
        })
      },
    },
    components: {
      'page-head': head,
      'content_head':content_head,
      'uncommitted':uncommitted,
      'committed':committed,
      'unfill':unfill,
      'filled':filled,
      'unchecked':unchecked,
      'checked':checked,
      'juniorUncommitted':juniorUncommitted,
      'skipChecked':skipChecked,
      'skipUnApproved':skipUnApproved,
      'ranking':ranking,
    },
    mounted:function () {
      if(this.personId){
        this.date=this.createTime;
        this.monthDetail={};
        this.dateShort=this.date.split('-')[0]+'-'+this.date.split('-')[1];
        this.getEmployeeList();
      }
      else {this.init();this.getEmployeeList();}
//      this.init();
//      this.getEmployeeList();
//      this.getRanking();
//      this.getDatas();
      this.$nextTick(function () {
        quicker.returnTop();
      })
    }
  }
</script>

<template>
  <div class="strategyManage myTarget planManage">
    <div class="target_main">
      <div class="top_head">{{year}}年{{text}}，<span class="gray-text">为达成此目标</span>【{{fromText[0]}}】 <span class="gray-text">而制定的行动策略如下：</span></div>
      <el-row>
        <p class="clearfix mb20">
          <span class="fr blue-text cursor_pointer return_top" @click="return_last"><i class="fa fa-arrow-circle-left fa-lg "></i> 返回上一级</span>
        </p>
        <el-col :span="7">
          <div class="indicator_will p20">
            <div class="will_title clearfix mb15">
              <span class="fl">待选策略</span>
              <i class="fa fa-plus-circle fa-lg fr cursor_pointer" @click="addStrategy()"></i>
            </div>
            <div class="indicator_box mb10" v-for="d in strategyDefList">
              <p class="clearfix">
                <span class="">{{d.name}}
                  <span class="unover_text over_text" >自定义</span>
                </span>
              </p>
              <div class="operate_btn operate_btns">
                  <el-button type="text" size="large" @click="editStrategy(d.id)"> <i class="fa fa-edit" aria-hidden="true"></i></el-button>
                  <el-button type="text" size="large" @click="removeStrategy(d.id)"> <i class="fa fa-trash" aria-hidden="true"></i></el-button>
              </div>

              <div class="gray-text mt10 mb10" v-text="d.remark">
                将策略移入已选择策略区域
              </div>
              <!--移入-->
              <p class="indicator_btn pt5 pb5 cursor_pointer" @click="moveToSelect(d.id)" @mouseenter="d.showArrow=!d.showArrow" @mouseleave="d.showArrow=!d.showArrow">
                将策略移入已选择策略区域
                <i class="fa fa-arrow-circle-o-right fa-lg" v-if="d.showArrow" ></i>
              </p>
            </div>
            <p class="no_data_tip white_tip mb10" v-if="strategyDefList.length===0">暂无自定义策略</p>
            <div class="indicator_box mb10" v-for="s in strategyRecList">
              <p class="clearfix">
                <span class="">{{s.name}}
                  <span class="unover_text" >推荐</span>
                </span>
              </p>
              <div class="gray-text mt10 mb10" v-text="s.remark">
                将策略移入已选择策略区域
              </div>
              <!--移入-->
              <p class="indicator_btn pt5 pb5 cursor_pointer" @click="moveToSelect(s.id)" @mouseenter="s.showArrow=!s.showArrow" @mouseleave="s.showArrow=!s.showArrow">
                将策略移入已选择策略区域
                <i class="fa fa-arrow-circle-o-right fa-lg" v-if="s.showArrow" ></i>
              </p>
            </div>
            <p class="no_data_tip white_tip" v-if="strategyRecList.length===0">暂无推荐策略</p>
          </div>
        </el-col>
        <el-col :span="17">
          <div class="indicator_checked ml20 p20" >
            <div class="checked_title mb20">
              <span class="fl">已选策略</span>
            </div>
            <div v-for="(item,key) in strategyCheckedList" :class="{ indicator_box: true, mb10:key!==strategyCheckedList.length-1}" >
              <p class="clearfix">
                <span class="">{{item.name}}
                  <span class="unover_text " v-if="item.isInit">推荐</span>
                  <span class="unover_text over_text" v-else>自定义</span>
                </span>
                <span class="arrow_circle fr cursor_pointer" @click="arrowToggle(item,key)"><i class="fa icon_color" v-bind:class="{'fa-angle-down': item.arrowControl, 'fa-angle-up': !item.arrowControl}"></i></span>
              </p>
              <div class="gray-text mt10 mb10" v-if="item.arrowControl" v-text="item.remark">
                将策略移入已选择策略区域
              </div>
              <div >
                <div class="blue-text cursor_pointer" v-if="item.arrowControl" @click="addPlan(item)"><i class="fa fa-plus-circle fa-lg "></i> 添加行动计划</div>
                <div class="plan_content" v-for="i in item.plans">
                  <p class="clearfix" >
                    <span class="">{{i.name}}
                      <span class="warn_tag mt5 ml10" style="background-color: #82C0EA;" v-if="i.isGs">GS</span>
                    </span>
                    <span class="arrow_circle fr cursor_pointer" @click="planToggle(i)"><i class="fa icon_color" v-bind:class="{'fa-angle-down': i.arrowControl, 'fa-angle-up': !i.arrowControl}"></i></span>
                  </p>
                  <div v-if="i.arrowControl">
                    <div class="clearfix mt10 pb10 mb10" style="border-bottom: 1px solid #F0F0F0">
                      <span class="gray-text fl">工作目标：</span>
                      <span class="fl" v-text="i.target">增加5家原辅材料的供应商</span>
                    </div>
                    <p class="gray-text mb10">实施步骤：</p>
                    <el-steps :space="100" direction="vertical">
                      <el-step style="height: 36px" v-for="p in i.planSteps">
                        <div slot="description" >{{p.content}} <span class="gray-text ml30">{{p.endTime | short_time}}<span class="ml10" v-text="p.employeeName">周峰</span></span></div>
                      </el-step>
                    </el-steps>
                    <div class="btns clearfix" style="width: 260px;margin: 0px auto">
                      <div class="btn btn-light fl" @click="editPlan(i)">编辑行动计划</div>
                      <div class="btn btn-primary fr" @click="cancelPlan(i.id)">取消此行动计划</div>
                    </div>
                  </div>

                </div>
              </div>
              <!--移入-->
              <p class="indicator_btn pt5 pb5 cursor_pointer" @click="moveOutSelect(item.id)" @mouseenter="item.showArrow=!item.showArrow" @mouseleave="item.showArrow=!item.showArrow">
                <i class="fa fa-arrow-circle-o-left fa-lg" v-if="item.showArrow"></i>
                将策略移出已选择策略区域
              </p>
            </div>
            <p class="no_data_tip white_tip" v-if="strategyCheckedList.length===0">暂无已选策略</p>
          </div>
        </el-col>
      </el-row>
    </div>
    <!---增加或者编辑策略-->
    <el-dialog v-model="strategy_modal" :title="strategy_title" size="tiny">
      <el-form ref="strategyForm" :model="strategyForm" :rules="strategy_rule"  label-width="100px">
        <el-form-item label="策略名称：" prop="name">
          <el-input v-model="strategyForm.name"  placeholder="请输入策略名称"></el-input>
        </el-form-item>
        <el-form-item label="策略描述：">
          <el-input type="textarea" v-model="strategyForm.remark"  placeholder="请输入策略描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <div class="btns clearfix" style="width: 260px;margin: 0px auto">
          <div class="btn btn-light fl" @click="strategy_modal=false">取消</div>
          <div class="btn btn-primary fr" @click="saveStrategy()">保存</div>
        </div>
      </div>
    </el-dialog>
    <!---添加或编辑行动计划-->
    <el-dialog v-model="plan_modal" size="large" :close-on-click-modal="false">
      <span slot="title" >为<span class="bold_font" v-text="strategyName">提高原辅材料的合格率</span>{{plan_title}}</span>
      <el-form ref="planForm" :model="planForm" :rules="plan_rule"  label-width="96px" label-position="left">
        <el-form-item style="position: relative;" label="计划名称：" prop="name">
          <el-input v-model="planForm.name"  placeholder="请输入计划名称"></el-input>
          <el-checkbox style="position: absolute; right: 0;top:0;" v-model="planForm.isGs">GS</el-checkbox>
        </el-form-item>
        <el-form-item label="工作目标：" prop="target">
          <el-input type="textarea" v-model="planForm.target"  placeholder="请输入工作目标"></el-input>
        </el-form-item>
        <el-form-item label="实施步骤：" prop="target">
        </el-form-item>
      </el-form>
      <!--<p class="gray-text mb10 mt20">实施步骤：</p>-->
      <el-steps :space="100" direction="vertical">
        <el-step style="height: 36px" v-for="(x,index) in steps">
          <div slot="description" >
            <el-form></el-form>
              <el-input style="width: 480px;" :class="{mr10:true, 'red-border':(!x.content&&unfilled)}" v-model="x.content" placeholder="请输入具体步骤内容"></el-input>
            <el-date-picker v-model="x.endTime" type="date" placeholder="选择日期"
                            :picker-options="pickerOptions" :class="{'red-border':(!x.endTime&&unfilled)}">
            </el-date-picker>
            <el-select style=""  v-model="x.employeeId" size="small" filterable remote clearable
                       placeholder="请指派人员" :remote-method="remoteMethod" :loading="loading" :class="{'red-border':(!x.employeeId&&unfilled)}">
              <el-option v-for="item in personList" :key="item.id" :label="item.realName" :value="item.id">
              </el-option>
            </el-select>
            <div class="operate_btn">
              <!--<el-button v-if="index==steps.length-1" type="text" class="p0" size="large" @click="addStep()"> <i class="fa fa-plus-circle fa-lg" style="color: #3DA8F5" aria-hidden="true"></i></el-button>-->
              <el-button v-if="steps.length!==1" type="text" class="p0" size="large" @click="clearStep(x,index)"> <i class="fa fa-trash fa-lg" aria-hidden="true"></i></el-button>
            </div>
            <el-button v-if="index==steps.length-1" type="text" style="padding: 0" size="large" @click="addStep()"> <i class="fa fa-plus-circle fa-lg" style="color: #3DA8F5" aria-hidden="true"></i></el-button>
          </div>
        </el-step>
      </el-steps>
      <div slot="footer">
        <div class="btns clearfix" style="width: 260px;margin: 40px auto;">
          <div class="btn btn-light fl" @click="plan_modal=false">取消</div>
          <div class="btn btn-primary fr" @click="savePlan()">确定</div>
        </div>
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
        pickerOptions: {},
        unfilled:false,//
        personList:[],//
        strategy_modal:false,//添加或者编辑策略对话框
        plan_modal:false,//添加或者编辑行动计划对话框
        strategy_title:'添加策略',//添加或者编辑策略对话框的标题
        plan_title:'制定行动计划',//添加或者编辑策略对话框的标题
        strategyForm:{
          name:'',
          remark:'',
        },//添加或者编辑策略对话框的内容
        planForm:{
          name:'',
          target:'',
          isGs:false,
        },//添加或者编辑行动计划对话框的内容
        steps:[
          {
            content:'',
            endTime:'',
            employeeId:'',
            step:1
          }
        ],//行动计划对话框里面的步骤
        strategyId:'',//目前正在编辑策略的id
        planId:'',//目前正在编辑计划的id
        strategyName:'',//目前正在编辑策略的name
        strategy_rule:{
          name: [
            {required: true, message: '请填写策略名称', trigger: 'blur'}
          ]
        },
        plan_rule:{
          name: [
            {required: true, message: '请填写计划名称', trigger: 'blur'}
          ],
          target: [
            {required: true, message: '请填写工作目标', trigger: 'blur'}
          ],
          steps: [
            {required: true, message: '请填写实施步骤'}
          ]
        },
        strategyRecList: [],//推荐策略
        strategyDefList: [],//自定义策略
        strategyCheckedList: [],//已选策略
        fromText:[]
      }
    },
    props:['sourceText'],
    computed: {
      year: function () {
        return this.$store.state.year;
      },
      text: function () {
        return this.$store.state.text;
      },
    },
    methods: {
      //点击返回上一级
      return_last:function () {
        this.$emit('return',1);
      },
      /**
       * 编辑行动计划
       */
      editPlan:function (item) {
        var _com=this;
        _com.strategyName=item.name;
        _com.planId=item.id;
        _com.plan_title='编辑行动计划';
        _com.unfilled=false;
        _com.plan_modal=true;
        _com.$http.get(common.projectPath + 'sys/plan/detail/'+item.id,{
          params:{}
        }).then(function (data) {
          data=data.body;
          if(data.code==='SUCCESS'){
            if(data.data){
              _com.planForm=data.data;
              _com.steps=data.data.planSteps;
              for(var i=0;i<_com.steps.length;i++){
                var time=_com.steps[i].endTime.substring(0,10).replace(/-/g,  "/")
                _com.steps[i].endTime=new Date(time)
              }
            }
            _com.initStep();
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      /**
       * 保存行动计划
       */
      savePlan:function () {
        var _com=this;
        _com.unfilled=false;
        for(var i=0;i<_com.steps.length;i++){
          for(var key in _com.steps[i]){
            if(_com.steps[i][key]==''){
                _com.unfilled=true;
            }
          }
          var time='';
          if(_com.steps[i].endTime&&(typeof _com.steps[i].endTime!=='string')){
            time=_com.steps[i].endTime.getFullYear()+"-"+(_com.steps[i].endTime.getMonth()+1)+"-"+_com.steps[i].endTime.getDate();
            _com.steps[i].endTime=time+' '+'00:00:00';
          }
        }
        var data={
          content:_com.planForm.content,
          isGs:_com.planForm.isGs,
          target:_com.planForm.target,
          name:_com.planForm.name,
          steps:_com.steps,
          objectiveFormDetailId:_com.fromText[1],
          objectiveFormDetailValueText:_com.fromText[0],
          indicatorMethodSelected:_com.strategyId,
          indicatorMethodSelectedName:_com.strategyName,
          text:_com.text,
          year:_com.year,
          planType:'target',
        },url='';
        if(_com.plan_title === '制定行动计划'){
          url='sys/plan/add';
        }else{
          url='sys/plan/update';
          data.id=_com.planId;
        }
        _com.$refs['planForm'].validate(function (valid) {
          if(valid&&!_com.unfilled){
            _com.$http.post(common.projectPath + url,data,{

            }).then(function (data) {
              data=data.body;
              if(data.code==='SUCCESS'){
                _com.$message.success('保存成功!');
                _com.plan_modal = false;
                _com.getSelectedList();
              }else{
                _com.$message.error(data.message);
              }
            })
          }
        })

      },
      /**
       * 添加行动计划
       */
      addPlan:function (item) {
        var _com=this;
        _com.plan_modal=true;
        _com.strategyId=item.id;
        _com.strategyName=item.name;
        _com.plan_title='制定行动计划';
        _com.clearForm('planForm');
        _com.planForm.isGs=false;
        _com.unfilled=false;
        _com.steps=[ {
          content:'',
          endTime:'',
          employeeId:'',
          step:1
        }];
        _com.initStep();
      },
      /**
       * 添加自定义策略
       */
      addStrategy:function () {
        var _com=this;
        _com.strategy_modal = true;
        _com.strategy_title = '添加策略';
        _com.clearForm('strategyForm');
        _com.strategyForm.remark='';
      },
      /**
       * 编辑自定义策略
       */
      editStrategy:function (id) {
        var _com=this;
        _com.strategy_modal = true;
        _com.strategy_title = '编辑策略';
        _com.strategyId=id;
        _com.$http.get(common.projectPath + 'sys/indicatorMethod/unRecommend/detail/'+id,{
          params:{}
        }).then(function (data) {
          data=data.body;
          if(data.code==='SUCCESS'){
            if(data.data){
              _com.strategyForm=data.data;
            }
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      /**
       * 保存自定义策略
       */
      saveStrategy:function () {
        var _com=this,data={
          name:_com.strategyForm.name,
          remark:_com.strategyForm.remark
        },url='';
        if(_com.strategy_title === '添加策略'){
          url='sys/indicatorMethod/unRecommend/add';
          data.objectiveFormDetailId=_com.fromText[1]
        }else{
          url='sys/indicatorMethod/unRecommend/update';
          data.id=_com.strategyId;
        }
        _com.$refs['strategyForm'].validate(function (valid) {
          if(valid){
            _com.$http.post(common.projectPath + url,data,{

            }).then(function (data) {
              data=data.body;
              if(data.code==='SUCCESS'){
                _com.$message.success('保存成功!');
                _com.strategy_modal = false;
                _com.getStrategyDefList();

              }else{
                _com.$message.error(data.message);
              }
            })
          }
        })

      },
      /**
       * 删除自定义策略
       * @param id 选中删除自定义策略
       */
      removeStrategy: function (id) {
        var _com = this, data;
        _com.$confirm('此操作将删除该策略, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          _com.$http.get(common.projectPath + 'sys/indicatorMethod/unRecommend/delete/'+id, {
            params: {}
          }).then(function (data) {
            data = data.body;
            if (data.code!=='SUCCESS') {
              _com.$message.error(data.message);
            } else {
              _com.$message.success('删除成功!');
              _com.getStrategyDefList();
            }
          })
        }).catch(function () {

        })
      },
      /**
       * 将指标移入已选择指标区域
       */
      moveToSelect:function (id) {
        var _com=this;
        _com.$confirm('确定要将该策略移入已选择策略区域?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
         _com.$http.get(common.projectPath + 'sys/indicatorMethodSelected/on/indicatorMethodId/'+id+'/objectiveFormDetailId/'+_com.fromText[1],{
          params:{
          }
        }).then(function (data) {
          data=data.body;
          if(data.code==='SUCCESS'){
            _com.getSelectedList();
            _com.getStrategyRecList();
            _com.getStrategyDefList();
          }else{
            _com.$message.error(data.message);
          }
        })
        }).catch(function () {

        })
      },
      /**
       * 将指标移出已选择指标区域
       */
      moveOutSelect:function (id) {
        var _com=this;
        _com.$confirm('确定要将该策略移出已选择策略区域?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          _com.$http.get(common.projectPath + 'sys/indicatorMethodSelected/off/'+id,{
            params:{
            }
          }).then(function (data) {
            data=data.body;
            if(data.code==='SUCCESS'){
              _com.getSelectedList();
              _com.getStrategyRecList();
              _com.getStrategyDefList();
            }else{
              _com.$message.error(data.message);
            }
          })
        }).catch(function () {

        })

      },
      /**
       * 获得推荐策略列表
       */
      getStrategyRecList:function () {
        var _com=this;
        _com.fromText=_com.sourceText.split('+')
        var data={
          objectiveFormDetailId:_com.fromText[1]
        };
        _com.$http.post(common.projectPath + 'sys/indicatorMethod/recommend',data,{

        }).then(function (data) {
          data=data.body;
          if(data.code==='SUCCESS'){
            if(data.data){
              for(var i=0;i<data.data.length;i++){
                data.data[i].showArrow=false;
              }
              _com.strategyRecList=data.data;
            }
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      /**
       * 获得自定义策略列表
       */
      getStrategyDefList:function () {
        var _com=this;
        _com.fromText=_com.sourceText.split('+')
        var data={
          objectiveFormDetailId:_com.fromText[1]
        };
        _com.$http.post(common.projectPath + 'sys/indicatorMethod/unRecommend',data,{

        }).then(function (data) {
          data=data.body;
          if(data.code==='SUCCESS'){
            if(data.data){
              for(var i=0;i<data.data.length;i++){
                data.data[i].showArrow=false;
              }
              _com.strategyDefList=data.data;
            }
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      /**
       * 获得已选策略列表
       */
      getSelectedList:function () {
        var _com=this;
        _com.fromText=_com.sourceText.split('+')
        _com.$http.get(common.projectPath + 'sys/indicatorMethodSelected/selectedList/'+_com.fromText[1],{
          params:{
          }
        }).then(function (data) {
          data=data.body;
          if(data.code==='SUCCESS'){
            if(data.data){
              for(var i=0;i<data.data.length;i++){
                data.data[i].arrowControl=false;
                data.data[i].showArrow=false;
//                data.data[i].plan_list=[];
              }
              _com.strategyCheckedList=data.data;
            }
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      /**
       * 取消行动计划
       */
      cancelPlan:function (id) {
        var _com = this;
        _com.$confirm('确定要取消此行动计划?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          _com.$http.get(common.projectPath + 'sys/plan/delete/' + id, {
            params: {}
          }).then(function (data) {
            data = data.body;
            if (data.code!=='SUCCESS') {
              _com.$message.error(data.message);
            } else {
              _com.$message.success('取消成功!');
              _com.getSelectedList();
            }
          })
        }).catch(function () {

        })
      },
      /**增加步骤
       * @param val
       */
      addStep:function () {
        var _com=this;
        this.steps.push(
        {
          content:'',
          endTime:'',
          employeeId:'',
          step:this.steps.length+1
        }
        )
       _com.initStep();
      },
      initStep:function () {
        var _com=this;
        _com.$nextTick(function () {
          for(var i=0;i<=_com.steps.length;i++){
            var k=$('.el-dialog__body .el-step').eq(i).find('.el-step__icon>div').html(i+1)
          }
        })
      },
      /**清除已选中的步骤
       * @param val 选中步骤的内容
       */
      clearStep:function (val,index) {
        this.steps.splice(index,1);
//        for(var key in val){
//          val[key]='';
//        }
      },
      /**
       * 获得自己以及自己的下级
       */
      getChildList:function (name) {
        var _com=this;
        name=name?name:'';
        _com.$http.get(common.projectPath + 'usr/employee/meAndAllChildren',{
          params:{
            name:name
          }
        }).then(function (data) {
          data=data.body;
          if(data.code==='SUCCESS'){
            if(data.data){
              var personList = data.data;
              for (var i = 0; i < personList.length; i++) {
                personList[i].value = personList[i].id;
                personList[i].label = personList[i].realName;
              }
              _com.personList=personList;
            }
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      /**
       * select的远程搜索方法
       */
      remoteMethod(query) {
        var _com = this;
        if (query !== '') {
          _com.loading = true;
          setTimeout(function () {
            _com.loading = false;
            _com.getChildList(query)
            if (_com.personList) {
              _com.personList = _com.personList.filter(function (item) {
                return item.realName.toLowerCase()
                    .indexOf(query.toLowerCase()) > -1;
              });
            }
          }, 200);
        } else {

          _com.indicators = [];
        }

      },
      //控制指标收起和展开
      arrowToggle: function (val,index) {
        var _com=this;
        val.arrowControl = !val.arrowControl;
        _com.strategyId=val.id;
        if(val.arrowControl){
          _com.$http.get(common.projectPath + 'sys/plan/planList/indicatorMethodSelectedId/'+val.id+'/objectiveFormDetailId/'+_com.fromText[1],{
            params:{}
          }).then(function (data) {
            data=data.body;
            if(data.code==='SUCCESS'){
              if(data.data){
                for(var i=0;i<data.data.length;i++){
                  data.data[i].arrowControl=false;
                }
                _com.strategyCheckedList[index].plans=data.data;
              }
            }else{
              _com.$message.error(data.message);
            }
          })
          _com.getEndTime()
        }
      },
      /**
       * 获得开始和截止时间
       */
      getEndTime:function () {
        var _com=this;
        _com.$http.get(common.projectPath + 'sys/plan/dates',{
          params:{
            objectiveFormDetailId:_com.fromText[1],
            year:_com.year,
            text:_com.text,
          }
        }).then(function (data) {
          data=data.body;
          if(data.code==='SUCCESS'){
            if(data.data){
              _com.pickerOptions.disabledDate=function (time){
                return ((time.getTime() > data.data[1]- 8.64e7)||(time.getTime() < data.data[0]));
              }
            }
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      planToggle:function (val) {
        val.arrowControl = !val.arrowControl
      },
      /**
       * 清空对应的表单模型
       * @param formName 表单的模型名字
       */
      clearForm:function (formName) {
        if(this.$refs[formName]){
          this.$refs[formName].resetFields();

        }
      }
    },
    mounted: function () {
      //获取当时日期，填入head
      var _com = this;
      this.getStrategyRecList();
      this.getSelectedList();
      this.getStrategyDefList();
      this.getChildList();
      this.$nextTick(function () {
        quicker.returnTop();
      })
    },
    components: {
      'page_head': head,
      'content_head': content_head,
    }
  }
</script>

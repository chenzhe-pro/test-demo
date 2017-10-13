<!--hr岗位职责组件-->
<template>
  <div class="wrapper post stationSet" v-loading.fullscreen="pageLoading">
    <page-head></page-head>
    <div class="content_wrapper ">
      <content_head show-menu="true"></content_head>
      <div class="content_content ">
        <div class="">
          <p class="set_title">岗位管理</p>
          <div class="set_content">
            <div class="left_content">
              <el-tree :data="data" @node-click="showNodeDetail" highlight-current></el-tree>
            </div>
            <div class="right_content">
              <div class="card_area">
                <!--<p v-if="stationList.length===0" class="text-center">暂无相应岗位</p>-->
                <ul class="clearfix">
                  <li v-for="s in stationList">
                    <div class="card_node" :class="{stop_status:s.status==='N'}">
                      <div class="des">
                        <p><span class="node_label">岗位编号：</span><span class="node_value" v-text="s.number">1</span></p>
                        <p><span class="node_label">岗位名称：</span><span class="node_value" v-text="s.name">总经理</span></p>
                        <p><span class="node_label">上级岗位：</span><span class="node_value">{{s.parentName|null_to_text('无上级岗位')}}</span></p>
                        <p><span class="node_label">岗位序列：</span><span class="node_value" v-text="s.sequence"></span></p>
                        <p>
                          <span class="node_label">绩效周期：</span>
                          <span class="tag_list" style="display: inline-block;">
                            <span v-for="p in s.postionJxPeriods" v-text="p.period"></span>
                          </span>
                          <!--<span v-if="s.period">暂无职责</span>-->
                        </p>
                        <p><span class="node_label">考核项目权重：</span><span class="node_value">KPI-{{s.kpiWeight}} GS-{{s.gsWeight}}</span></p>
                        <p><span class="node_label">最近{{s.dayFix}}天日清表可以补填</span></p>
                        <p>
                          <span class="node_label">职责标签：</span>
                          <span class="tag_list" style="display: inline-block;">
                          <span v-for="y in s.labels" v-text="y.name">asdsad</span>
                          </span>
                          <span v-if="s.labels.length===0">暂无职责</span>
                        </p>
                        <p><span class="node_label">职责描述：</span>
                          <span class="node_value">{{s.remark|null_to_text('暂无职责描述')}}</span>
                        </p>
                        <span class="node_label">成员：</span>
                        <span class="head_list">
                      <span v-for="e in s.employees">{{ e.realName | chooseName }}</span>
                    </span>
                        <span v-if="s.employees.length===0">暂无成员</span>

                      </div>
                      <div class="op">
                        <a href="javascript:;" @click="edit(s.id)" v-if="s.status==='Y'"><i class="fa fa-edit"></i> 编辑</a>
                        <a href="javascript:;" @click="openPosition(s.id)" v-else>启用</a>
                      </div>
                    </div>
                  </li>
                  <li class="add_node" v-if="currentPartment.id"><a href="javascript:;" @click="add"><i class="fa fa-plus"></i> 新增岗位</a></li>
                </ul>
                <!--<p v-if="!currentPartment.id">请先在左边选择部门!</p>-->
                <p v-if="stationList.length===0" class="no_data_tip">暂无相应岗位</p>
              </div>
            </div>
            <div class="line_"></div>
          </div>
        </div>
      </div>
      <el-dialog v-model="show_modal" :title="model_type" @open="clearForm('form')" :close-on-click-modal="false">
        <div class="dialog_title_line"></div>
        <el-form ref="form" :model="form"  :rules="rule" label-width="100px" label-position="right">
          <el-form-item label="岗位编号" class="mb10" v-if="model_type==='编辑岗位卡片'">
            <div v-text="form.number"></div>
          </el-form-item>
          <el-form-item label="岗位名称" prop="name" >
            <el-input v-model="form.name"  placeholder="请输入岗位名称"></el-input>
          </el-form-item>
          <el-form-item label="上级岗位" prop="parentId" v-if="isShowParentPost" :rules="{required: true, message: '请选择上级岗位', trigger: 'change'}" >
            <el-select v-model="form.parentId" placeholder="请选择上级岗位" >
              <el-option v-for="item in options" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="岗位序列" prop="sequence"  :rules="{required: true, message: '请选择岗位序列', trigger: 'change'}" >
            <el-select v-model="form.sequence" placeholder="请选择岗位序列" >
              <el-option v-for="item in sequences" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="绩效周期" prop="periods">
            <el-checkbox-group v-model="form.periods">
              <el-checkbox label="年度"></el-checkbox>
              <el-checkbox label="季度"></el-checkbox>
              <el-checkbox label="月度"></el-checkbox>
            </el-checkbox-group>
            <!--<el-radio-group v-model="form.period">-->
              <!--<el-radio label="年度"></el-radio>-->
              <!--<el-radio label="季度"></el-radio>-->
              <!--<el-radio label="月度"></el-radio>-->
            <!--</el-radio-group>-->
          </el-form-item>
          <el-form-item label="考核项目权重" >
            <el-col :span="7">
              <el-form-item prop="kpiWeight" class="check_weight">
                KPI：<el-input v-model="form.kpiWeight" style="width: 100px;" placeholder=""></el-input>%
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item prop="gsWeight" class="check_weight"   >
                GS：<el-input v-model="form.gsWeight" style="width: 100px;" placeholder=""></el-input>%
              </el-form-item>
            </el-col>
            <!--<el-form :inline="true">-->

              <!--<el-form-item label="GS:"   :rules="{required: true, message: '请选择岗位序列', trigger: 'blur'}" >-->
                <!--<el-input v-model="form.gsWeight" style="width: 100px;" placeholder=""></el-input>%-->
              <!--</el-form-item>-->
            <!--</el-form>-->
            <!--KPI：<el-input v-model="form.kpiWeight" :max=100 :min=0 style="width: 80px;" placeholder=""></el-input><span class="mr30">%</span>-->
            <!--GS：<el-input v-model="form.gsWeight" :max=100 :min=0 style="width: 80px;" placeholder=""></el-input><span>%</span>-->
          </el-form-item>
          <el-form-item label="日清填报设置">
            最近 <el-input-number :min="1" :max="31" v-model="form.dayFix"></el-input-number> 天日清表可以补填
          </el-form-item>
          <el-form-item label="职责标签" class="mb10"></el-form-item>
          <div class="gray_bg mb20">
            <el-tabs v-model="activeName" @tab-click="clickTab(activeName)">
              <el-tab-pane v-for="d in parentLabels" :name="d.id">
                <span slot="label" v-text="d.name">我的行程</span>
                <el-form class="ml15 mb15">
                  <el-form-item label="一级标签：" prop="" class="mb10">
                    <span class="tag_list all_tag " @click="toggleChecked(d)"><span :class="{active_tag:d.checked}">{{d.name}}</span></span>
                  </el-form-item>
                  <el-form-item label="二级标签：" prop="">
                  <span class="tag_list child_tag ">
                    <span :class="{active_tag:x.checked}" v-for="x in positionLabels" @click="toggleChecked(x)">{{x.name}}</span>
                  </span>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </div>
          <el-form-item label="已选标签" v-if="checkedLabels.length>0">
            <el-tag type="gray" v-for="x in checkedLabels" class="mr5">{{x.name}}</el-tag>
          </el-form-item>
          <el-form-item label="职责描述"  >
            <el-input v-model="form.remark" type="textarea"  placeholder="请输入职责描述"></el-input>
          </el-form-item>
          <!--<div class="clearfix mt25">-->
            <!--<a href="javascript:;" v-if="!show_add_label" @click="showSelf"><i style="color: #3DA8F5;" class="fa fa-plus-circle" aria-hidden="true"> 自定义职能标签</i></a>-->
            <!--<el-row :gutter="15" v-if="show_add_label">-->
              <!--<el-col :span="7">-->
                <!--<el-form ref="form_self" :model="form_self" :rules="form_self_rule">-->
                  <!--<el-form-item label="" prop="name" >-->
                    <!--<el-input v-model="form_self.name"  placeholder="请输入自定义标签名字"></el-input>-->
                  <!--</el-form-item>-->
                <!--</el-form>-->
              <!--</el-col>-->
              <!--<el-col :span="10">-->
                <!--<el-button type="primary" @click="addSelfLabel">添加</el-button>-->
                <!--<el-button type="text" @click="show_add_label=false">取消</el-button>-->
              <!--</el-col>-->
            <!--</el-row>-->
          <!--</div>-->
        </el-form>
        <div slot="footer">
          <div class="btns clearfix" style="width: 320px;margin: 0px auto">
            <div class="btn btn-light fl" @click="stopPosition()" v-if="model_type == '编辑岗位卡片'">冻结岗位</div>
            <div class="btn btn-light fl" @click="operateModal(false)" v-else>取消</div>
            <div class="btn btn-primary fr" @click="savePosition">保存卡片</div>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import head from '../common/head.vue'
  import content_head from '../common/content_head.vue'
  module.exports = {
    data: function () {
      return {
        pageLoading:false,
        show_modal:false,
        show_add_label:false,
        model_type:'',
        currentPartment:{},//当前选择的部门
        currentPositionId:{},//当前选中的岗位卡片的id
        parentLabels:[],//所有一级标签
        positionLabels:[],//所有子标签
        checkedLabels:[],//选中的标签
        form:{
          name:'',
          parentId:'',
          departmentId:'',
          labelIds:[],
          sequence:'',
          periods:[],
          dayFix:0,
          gsWeight:'',
          kpiWeight:'',
          remark:''
        },
        rule:{
          name: [
            {required: true, message: '请填写岗位名称', trigger: 'blur'}
          ],
          gsWeight: [
            {required: true, message: '请填写KPI权重', trigger: 'blur'}
          ],
          kpiWeight: [
            {required: true, message: '请填写GS权重', trigger: 'blur'}
          ],
          periods: [
            {required: true,type: 'array', message: '请至少选择一个绩效周期', trigger: 'change'}
          ],
//          parentId: [
//            {required: true, message: '请填写上级岗位', trigger: 'change'}
//          ]
        },
        form_self:{
          "name": "",
          "parentId": ""
        },
//        form_self_rule:{
//          name: [
//            {required: true, message: '请填写自定义标签', trigger: 'blur'}
//          ],
//        },
        activeName: '',//选中的父级标签啊
        stationList:[],
        options: [],
        sequences: [],
        value: '',
        data: [],
        oldParentId:'',
        periodEnum:{
          year:'年度',
          month:'月度',
          quarterly:'季度'
        },
      }
    },
    computed:{
      isShowParentPost:function () {
        var is=false;
        if(this.model_type==='编辑岗位卡片') {
          if(this.options.length>0&&this.form.parentId){
            is=true;
          }
        }
        else{
          if(this.options.length>0){
            is=true;
          }
        }
        return is;
      }
    },
    props:{
      childFun:{}
    },
    methods:{
      toggleChecked:function (label) {
        label.checked=!label.checked;
        var f=false;
        if(label.checked){
          for(var i=0;i<this.checkedLabels.length;i++)
          {
            if(this.checkedLabels[i].id===label.id)//无重复
            {
              f=true;
              break;
            }
          }
          if(!f)
            this.checkedLabels.push(label);
        }
        else {
          for(var i=0;i<this.checkedLabels.length;i++)
          {
            if(this.checkedLabels[i].id===label.id)
            {
              this.checkedLabels.splice(i,1);
              break;
            }
          }
        }
      },
      /**
       * 操作膜态框
       * @param type bool型,打开或者关闭膜态框
       */
      operateModal:function (operateType,modalType) {
        var _com=this;
        if(operateType)//打开
        {
          this.model_type=modalType;
          this.show_modal=operateType;

          //每次打开模态框都先隐藏自定义标签form
          this.show_add_label=false;
        }
        else{
          this.show_modal=operateType;
        }
      },
      showSelf:function () {
        var _com=this;
        this.show_add_label=true;
        this.$nextTick(function () {
          _com.clearForm('form_self');
        });
        this.form_self.name='';
      },
      /**
       * 点击编辑岗位信息
       * @param id 选中的岗位id
       */
      edit:function (id) {
        var _com=this;
        _com.operateModal(true,'编辑岗位卡片');
        _com.currentPositionId=id;
        _com.$http.get(common.projectPath+'usr/postion/detail/'+id,{
          params:{}
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            var list=[];
            for(var j=0;j<data.data.postionJxPeriods.length;j++){
              data.data.postionJxPeriods[j].period=_com.periodEnum[data.data.postionJxPeriods[j].period];
              list.push(data.data.postionJxPeriods[j].period)
              data.data.periods=list;
            }
            data.data.gsWeight=data.data.gsWeight.toString();
            data.data.kpiWeight=data.data.kpiWeight.toString();
            _com.form=data.data;
            _com.form.parentId=data.data.parentId;
            _com.oldParentId=data.data.parentId;
            _com.checkedLabels=data.data.labels;
            //重置部门(父级)标签
            for(var k=0;k<_com.parentLabels.length;k++)
            {
              _com.parentLabels[k].checked=false;
            }
            //渲染已经选中的标签
            for(var i=0;i<data.data.labels.length;i++)
            {
              if(!data.data.labels[i].parent)//找到第一个父标签
              {
                _com.clickTab(data.data.labels[i].id);
                break;
              }
              else {//找到第一个有父标签的子标签
                _com.clickTab(data.data.labels[i].parent.id);
                break;
              }
            }
            if(data.data.labels.length===0){
              _com.clickTab(_com.parentLabels[0].id);
            }
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      add:function () {
        this.operateModal(true,'新增岗位卡片');
        //重置部门(父级)标签
        for(var k=0;k<this.parentLabels.length;k++)
        {
          this.parentLabels[k].checked=false;
        }
        this.checkedLabels=[];
        this.clickTab(this.parentLabels[0].id);//新增初始化默认选中第一个tab
      },
      getParentLabel:function () {
        var _com=this;
        _com.$http.get(common.projectPath+'sys/label/getParentLabel',{
          parmas:{}
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            for(var i=0;i<data.data.length;i++)
            {
              data.data[i].checked=false;
            }
            _com.parentLabels=data.data;
          }else {
            _com.$message.error(data.message);
          }
        })
      },
      clickTab:function (id) {
        for(var i=0;i<this.checkedLabels.length;i++)
        {
          if(id===this.checkedLabels[i].id)
          {
            for (var j = 0; j < this.parentLabels.length; j++)
            {
              if (id === this.parentLabels[j].id) {
                //渲染选中的部门标签
                this.parentLabels[j].checked = true;
                break;
              }
            }
          }
        }
        this.getChildLabel(id);
      },
      getChildLabel:function (id) {
        var _com=this;
        _com.activeName=id;
        _com.$http.get(common.projectPath+'sys/label/getChilDByParentId/'+id,{
          parmas:{}
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            for(var i=0;i<data.data.length;i++)
            {
              data.data[i].checked=false;
            }
            //如果有checkedIds,表示要初始化已选中的标签
            if(_com.checkedLabels.length>0)
            {
              for(var j=0;j<_com.checkedLabels.length;j++)
              {
                for(i=0;i<data.data.length;i++)
                {
                  if(data.data[i].id===_com.checkedLabels[j].id)
                    data.data[i].checked=true;
                }
              }
            }
            _com.positionLabels=data.data;
          }else {
            _com.$message.error(data.message);
          }
        })
      },
      /**
       *  获得所有上级岗位
       * @param id 选中的岗位id
       */
      getSequences:function () {
        var _com=this;
        _com.sequences=[];
        _com.$http.get(common.projectPath+'usr/postion/sequences',{

        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            if(data.data){
              for(var key in data.data){
                _com.sequences.push({'label':key,'value':data.data[key]})
              }
            }
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      /**
       *  获得所有上级岗位
       * @param id 选中的岗位id
       */
      getParentPosition:function (id) {
        var _com=this,data={
          id:id
        };
        _com.$http.get(common.projectPath+'sys/label/findHigherPostion/'+id,{

        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            if(data.data){
              for(var i=0;i<data.data.length;i++){
                data.data[i].label=data.data[i].name;
                data.data[i].value=data.data[i].id;
              }
            }
            _com.options=data.data;
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      /**
       * 点击选中结点后展示结点详情
       * @param selectedNodes 选中的结点
       */
      showNodeDetail:function (selectedNodes) {
        var _com=this;
        _com.pageLoading=false;
        _com.currentPartment=selectedNodes;
        _com.$http.get(common.projectPath+'usr/department/queryAllByDepId/'+selectedNodes.id,{
          params:{}
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            if(data.data){
              if(data.data.postions){
                for(var i=0;i<data.data.postions.length;i++){
                  for(var k=0;k<data.data.postions[i].postionJxPeriods.length;k++){
                    data.data.postions[i].postionJxPeriods[k].period=_com.periodEnum[data.data.postions[i].postionJxPeriods[k].period];
                  }
                }
                _com.stationList=data.data.postions;
                _com.getParentPosition(selectedNodes.id);
                _com.getSequences();
                _com.$nextTick(function () {
                  _com.resetHeight();
                  setTimeout(function () {
                    _com.pageLoading=false;
                  },500);
                });
              }
              else {
                this.stationList=[];
              }
            }
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      addSelfLabel:function () {
        var _com=this;
        _com.form_self.parentId=_com.activeName;
        _com.$refs['form_self'].validate(function(valid){
          if(valid){
            _com.$http.post(common.projectPath + 'sys/label/addCustomLabel', _com.form_self, {
              emulateJSON: false
            }).then(function (data) {
              data = data.body;
              if (data.code==='SUCCESS') {
                _com.$message.success('自定义标签添加成功!');
                _com.show_add_label=false;
                _com.getChildLabel(_com.activeName);
              } else {
                _com.$message.error(data.message);
              }
            })
          }
          else {
//            _com.$message.error('请填写!');
          }

        });
      },
      savePosition:function () {
        var _com=this,url,data={};
        this.form.labelIds=[];
        for(var i=0;i<_com.form.periods.length;i++){
          for(var key in _com.periodEnum){
            if(_com.form.periods[i]===_com.periodEnum[key]){
              _com.form.periods[i]=key;
            }
          }
        }
        for(var i=0;i<this.checkedLabels.length;i++)
        {
          this.form.labelIds.push(this.checkedLabels[i].id);
        }
        if(this.model_type==='新增岗位卡片')
        {
          url='usr/postion/addNewPostion';
          data={
            parentId:this.form.parentId,
            name:this.form.name,
            departmentId:this.currentPartment.id,
            labelIds:this.form.labelIds,
            sequence:this.form.sequence,
            periods:this.form.periods,
            remark:this.form.remark,
            dayFix:this.form.dayFix,
            gsWeight:parseFloat(this.form.gsWeight),
            kpiWeight:parseFloat(this.form.kpiWeight),
          }
        }
        else {
          url='usr/postion/updatePos';
          data={
            parentId:this.form.parentId,
            name:this.form.name,
            id:this.currentPositionId,
            labelIds:this.form.labelIds,
            sequence:this.form.sequence,
            periods:this.form.periods,
            remark:this.form.remark,
            dayFix:this.form.dayFix,
            gsWeight:parseFloat(this.form.gsWeight),
            kpiWeight:parseFloat(this.form.kpiWeight),
          }
        }
        _com.$refs['form'].validate(function(valid){
          if(valid){
            if(parseFloat(_com.form.gsWeight)+parseFloat(_com.form.kpiWeight)===100){
              if(_com.checkedLabels.length===0){
                _com.$message.error('请选择职责标签!');
                return;
              }
              if(_com.oldParentId!==_com.form.parentId)//判断是否换了部门
              {
                _com.$confirm('岗位内人员将一并调整, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(function(){
                  _com.ajaxSavePosition(url,data);
                }).catch(function() {

                });
              }
              else {
                _com.ajaxSavePosition(url,data);
              }
            }else{
              _com.$message.error('KPI与GS权重和必须为100%!');
            }

          }
          else {
            _com.$message.error('请填写完整数据!');
          }
        });

      },
      ajaxSavePosition:function (url,data) {
        var _com=this;
        _com.$http.post(common.projectPath + url, data, {
          emulateJSON: false
        }).then(function (data) {
          data = data.body;
          if (data.code==='SUCCESS') {
            _com.operateModal(false);
            _com.$message.success('保存成功!');
            _com.showNodeDetail(_com.currentPartment);
          } else {
            _com.$message.error(data.message);
          }
        })
      },
      /**
       * 冻结岗位
       */
      stopPosition:function () {
        var _com=this;
        _com.$http.get(common.projectPath+'usr/postion/stopPos/'+_com.currentPositionId,{

        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.$message.success('该岗位已冻结!');
            _com.operateModal(false);
            _com.showNodeDetail(_com.currentPartment);
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      /**
       * 启用岗位
       */
      openPosition:function (id) {
        var _com=this;
        _com.$http.get(common.projectPath+'usr/postion/openPos/'+id,{

        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.$message.success('该岗位已启用!');
            _com.operateModal(false);
            _com.showNodeDetail(_com.currentPartment);
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      /**
       * 获取所有部门列表的数据
       */
      getList:function (click) {
        var _com=this;
        _com.$http.get(common.projectPath+'usr/department/queryAllDepName',{
          params:{}
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
//            this.options=data.data;
            var list = data.data;
            common.eachTree(list, function (e) {
              e.label = e.title;
            });
            _com.data = list;
            if(click)
            {
              _com.$nextTick(function () {
                $($('.el-tree-node')[0]).click();//自动选中第一个节点
              })
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
          if(formName==='form'){
            this.form.parentId='';
          }
        }
      },
      resetHeight:function () {
        var content_width=$('.stationSet .right_content').width(),li=$('.card_area li'),
          col=Math.floor(content_width/260),row=Math.ceil(li.length/col);
        for(var i=0;i<row;i++)
        {
          var arr=[];
          for(var j=col*i;j<col*(i+1);j++)
          {
            arr.push($(li[j]).children().height());
          }
          var max=Math.max.apply(Math,arr);
          for(var j=col*i;j<col*(i+1);j++)
          {
            arr.push($(li[j]).height(max+'px'));
          }
        }
      }
    },
    components: {
      'content_head':content_head,
      'page-head': head
    },
    mounted:function () {
      this.getList(true);
      this.getParentLabel();
      this.$nextTick(function () {
        quicker.returnTop();
      })
    }
  }
</script>


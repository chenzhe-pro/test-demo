<!--岗位职责设置组件-->
<template>
  <div class="stationSet full_content">
    <div class="set_content clearfix">
      <div class="left_content">
        <el-tree :data="data" @node-click="showNodeDetail" highlight-current></el-tree>
      </div>
      <div class="right_content">
        <div class="card_area">
          <ul class="clearfix">
            <li v-for="p in personInfo">
              <div class="card_node">
                <div class="des">
                  <p><span class="node_label">姓名：</span><span class="node_value" v-text="p.realName">黄鹤</span></p>
                  <p><span class="node_label">岗位：</span><span class="node_value"  v-text="p.postion.name">制造部经理</span></p>
                  <p>
                    <span class="node_label">职责：</span>
                    <span class="tag_list">
                      <span v-for="y in p.postion.labels" v-text="y.name">asdsad</span>
                    </span>
                    <span v-if="p.postion.labels.length==0">暂无职责标签</span>
                  </p>
                  <p>
                    <span class="node_label">考核指标：</span>
                  </p>
                  <p >
                    <span>
                      <span v-for="s in p.indicators" class="node_value indicators" v-text="s.name">直接生产成本</span>
                    </span>
                    <span v-if="p.indicators.length==0">暂无考核指标</span>
                  </p>
                  <p>
                  </p>
                  <!--<p>-->
                    <!--<span class="node_value">人均生产量</span>-->
                  <!--</p>-->
                </div>
                <div class="op clearfix">
                  <a href="javascript:;" @click="editIndicators(p.id)" style="margin-right: 85px;"><i class="fa fa-edit"></i> 编辑</a>
                </div>
              </div>
            </li>
          </ul>
          <!--<p v-if="!currentDep.id">请先在左边选择部门!</p>-->
          <p v-if="personInfo.length===0" class="no_data_tip">暂无相应人员</p>
        </div>
      </div>
      <div class="line_"></div>
    </div>

    <div class="btns clearfix" style="width: 320px;margin: 40px auto">
      <div class="btn btn-light fl" @click="childFun('3','2-2','prev')">上一步</div>
      <div class="btn btn-primary fr" @click="childFun('3','4','next')">下一步</div>
    </div>
    <el-dialog v-model="show_modal" :title="model_type" size="small" :close-on-click-modal="false">
      <div class="dialog_title_line"></div>
      <div>
        <span class="indicator_text mr10">人员:</span>
        <span v-text="personDetail.realName">岳云鹏</span>
        <p class="indicator_text mt10">职责:</p>
        <span class="tag_list">
          <span v-for="l in labels" v-text="l.name">技术研发</span>
        </span>
        <span v-if="labels.length==0">暂无职责</span>
        <p class="indicator_text mt10">指标:</p>
        <div v-for="(i,index) in allIndicators">
          <span v-text="i.name" :class="{select_box:true,active_box:i.checkIndicator}" @click="toggleChecked(i.id,index)">人均生产量</span><br>
        </div>
        <span v-if="allIndicators.length==0">暂无指标</span>
        <div class="clearfix mt20">
          <a href="javascript:;" v-if="!show_add_indicator" @click="showSelf"><i style="color: #3DA8F5;" class="fa fa-plus-circle" aria-hidden="true"> 自定义指标</i></a>
          <el-row :gutter="15" v-if="show_add_indicator">
            <el-col :span="13">
              <el-form ref="form_self" :model="form_self" :rules="form_self_rule">
                <el-form-item label="" prop="name" >
                  <el-input placeholder="请输入指标名称" v-model="form_self.name" :disabled="!form_self.labelId">
                    <el-select v-model="form_self.labelId" slot="prepend" placeholder="请选择职责" style="width:120px;">
                      <el-option v-for="l in labels" :label="l.name" :value="l.id"></el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="10">
              <el-button type="primary" @click="addSelfIndicator">添加</el-button>
              <el-button type="text" @click="show_add_indicator=false">取消</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
      <div slot="footer">
        <div class="btns clearfix" style="width: 320px;margin: 0px auto">
          <div class="btn btn-light fl" @click="operateModal(false)">取消</div>
          <div class="btn btn-primary fr" @click="saveUpdate()">确定</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  module.exports = {
    data: function () {
      return {
        pageLoading:false,
        checkIndicator:true,
        show_modal:false,
        model_type:'',
        personInfo:[],//部门对应的人员
        personDetail:[],//人员卡片信息
        currentId:'',//正在编辑人员的id
        currentDep:'',//选中的部门
        labels:[],//部门对应的人员的职责
        indicators:[],//部门对应的人员的指标
        allIndicators:[],//人员对应岗位的所有指标
        form:{
        },
        value: '',
        data: [],//树数据
        show_add_indicator:false,//是否显示自定义指标输入框,
        form_self:{
          name:'',
          labelId:''
        },
        form_self_rule:{
          name: [
            {required: true, message: '请填写指标名称', trigger: 'change'}
          ]
        }
      }
    },
    computed:{
      userInfo:function () {
        return this.$store.state.userInfo;
      }
    },
    props:['childFun'],
    methods:{
      /**
       * 点击切换是否选择已有标签
       */
      toggleChecked:function (id,index) {
        this.allIndicators[index].checkIndicator=!this.allIndicators[index].checkIndicator;
      },
      /**
       * 保存编辑过的指标
       */
      saveUpdate:function () {
        var _com=this,data={
          empId:_com.currentId,
          indicatorIds:[]
        };
        for(var i=0;i<_com.allIndicators.length;i++){
          if(_com.allIndicators[i].checkIndicator===true){
            data.indicatorIds.push(_com.allIndicators[i].id);
          }
        }
        _com.$http.post(common.projectPath+'usr/department/saveEmpWithIndicator',data,{

        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.$message.success('保存成功!');
            _com.operateModal(false);
            _com.showNodeDetail(_com.currentDep);
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      /**
       * 点击编辑人员的指标信息
       */
      editIndicators:function (id) {
        var _com=this;
        _com.currentId=id;
//        _com.labels=[];
//        _com.indicators=[];
        _com.operateModal(true,'编辑人员指标卡片');
        _com.$http.get(common.projectPath+'usr/department/queryEmployeeByEmpId/'+id,{

        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.personDetail=data.data;
            if(_com.personDetail.postion){
              if(_com.personDetail.postion.labels){
                _com.labels=_com.personDetail.postion.labels;
              }else{
                _com.labels=[];
              }
            }
            if(_com.personDetail.indicators){
              _com.indicators=_com.personDetail.indicators;
            }
            else {//如果没有指标
              _com.indicators=[];
            }
            //已经得到选中的指标
            _com.getAllIndicators();
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      /**
       * 获取人员对应岗位的所有指标
       * */
      getAllIndicators:function () {
        var _com=this;
        _com.$http.get(common.projectPath+'sys/indicator/getIndsByEmpId/'+_com.currentId,{
          params:{}
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            if(data.data){
              for(var l=0;l<data.data.indicators.length;l++){
                data.data.indicators[l].checkIndicator=false;
              }
              for(var i=0;i<_com.indicators.length;i++)
              {
                for(l=0;l<data.data.indicators.length;l++){
                  if(_com.indicators[i].id===data.data.indicators[l].id)
                    data.data.indicators[l].checkIndicator=true;
                }
              }
              if(_com.indicators.length===0)//初始化的时候如果没有任何选中指标,则默认全部选中
              {
                for(var l=0;l<data.data.indicators.length;l++){
                  data.data.indicators[l].checkIndicator=true;
                }
              }
              _com.allIndicators=data.data.indicators;
            }
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
        _com.pageLoading=true;
        _com.currentDep=selectedNodes;
        _com.$http.get(common.projectPath+'usr/department/queryEmployeeByDepId/'+_com.currentDep.id,{
          params:{}
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            if(data.data){
              _com.personInfo=data.data;
              _com.$nextTick(function () {
                _com.resetHeight();
                setTimeout(function () {
                  _com.pageLoading=false;
                },500);
              });
            }
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      /**
       * 获取所有部门列表的数据
       */
      getAllList:function (click) {
        var _com=this;
        _com.$http.get(common.projectPath+'usr/department/queryAllDepName',{
          params:{}
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
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
       * 操作膜态框
       * @param operateType bool型,打开或者关闭膜态框
       */
      operateModal:function (operateType,modalType) {
        if(operateType)//打开
        {
          this.model_type=modalType;
          this.show_modal=operateType;
          this.$nextTick(function () {
//            this.clearForm('form');
          });

          this.show_add_indicator=false;
        }
        else{
//          this.clearForm('form');
          this.show_modal=operateType;
        }
      },
      /**
       * 清空对应的表单模型
       * @param formName 表单的模型名字
       */
      clearForm:function (formName) {
        this.$refs[formName].resetFields();
      },
      showSelf:function () {
        var _com=this;
        this.show_add_indicator=true;
        this.$nextTick(function () {
          _com.clearForm('form_self');
        });
        this.form_self.name='';
        this.form_self.labelId='';
      },
      addSelfIndicator:function () {
        var _com=this;
        _com.$refs['form_self'].validate(function (valid) {
          if(valid)
          {
            _com.form_self.empId=_com.currentId;
            _com.$http.post(common.projectPath+'sys/indicator/addCustomIndicator',_com.form_self,{

            }).then(function (data) {
              data=data.body;
              if(data.code=='SUCCESS'){
                _com.$message.success('指标添加成功!');
                _com.show_add_indicator=false;
                _com.getAllIndicators();
              }else{
                _com.$message.error(data.message);
              }
            })
          }
          else
          {
            _com.$message.error('请填写指标名称!');
          }
        });
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

    },
    mounted:function () {
      this.getAllList(true);
      this.$nextTick(function () {
        quicker.returnTop();
      })
    }
  }
</script>


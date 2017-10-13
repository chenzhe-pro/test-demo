<!--岗位职责设置组件-->
<template>
  <div class="wrapper stationSet personSet" v-loading.fullscreen="pageLoading">
    <page-head></page-head>
    <div class="content_wrapper ">
      <content_head show-menu="true"></content_head>
      <div class="content_content ">
        <div class="">
          <p class="set_title">人员管理</p>
          <div class="set_content clearfix">
            <div class="left_content">
              <el-tree :data="data" @node-click="showNodeDetail" highlight-current></el-tree>
            </div>
            <div class="right_content">
              <div class="search_area">
                <el-input
                  placeholder="请输入工号或姓名搜索"
                  icon="circle-close"
                  v-model="search_key" :on-icon-click="clearKey" style='width:270px;'>
                </el-input>
                <el-button type="primary" icon="search" @click="search"></el-button>
              </div>
              <div class="card_area">
                <ul class="clearfix">
                  <li v-for="p in personInfo">
                    <div class="card_node" :class="{stop_status:p.status==='N'}">
                      <div class="name">
                        <div class="head_list" >
                          <span>{{ p.realName | chooseName }}</span>
                        </div>
                        <div class="inline-block">
                          <p><span class="node_label">部门：</span><span class="node_value" v-text="p.departmentName">黄鹤</span></p>
                          <p><span class="node_label">岗位：</span><span class="node_value"  v-text="p.postion.name">制造部经理</span></p>
                        </div>
                      </div>
                      <div class="des ">
                        <p><span class="node_label label_70">员工工号：</span><span class="node_value" v-text="p.jobNumber">黄鹤</span><span v-if="p.status==='N'">（已冻结）</span></p>
                        <p><span class="node_label label_70">性别：</span><span class="node_value" v-text="p.gender=='M'?'男':'女'">黄鹤</span></p>
                        <p><span class="node_label label_70">联系方式：</span><span class="node_value" v-text="p.mobilePhone">黄鹤</span></p>
                        <p><span class="node_label label_70">邮箱：</span><span class="node_value"  >{{p.mail|null_to_text('无邮箱')}}</span></p>
                        <p>
                          <span class="node_label">考核指标：</span>
                        </p>
                        <p >
                          <span>
                            <span v-for="s in p.indicators" class="node_value indicators" v-text="s.name">直接生产成本</span>
                          </span>
                          <span v-if="p.indicators.length==0">暂无考核指标</span>
                        </p>
                        <!--<p>-->
                        <!--<span class="node_value">人均生产量</span>-->
                        <!--</p>-->
                      </div>
                      <div class="op clearfix" v-if="p.status!=='N'">
                        <a href="javascript:;" @click="editInfo(p.id)" >编辑信息</a>
                        <a href="javascript:;" @click="editIndicators(p.id)" style="margin-left: 22px;">编辑指标</a>
                        <a href="javascript:;" @click="resetPsd(p)"><span v-if="p.sendPsdLoading"><i class="el-icon-loading"></i> 发送中</span><span v-if="!p.sendPsdLoading">重置密码</span></a>
                      </div>
                      <div class="op clearfix" v-else>
                        <span>已经冻结该账号</span>
                        <a href="javascript:;" @click="openPerson(p.id)">启用</a>
                      </div>
                    </div>
                  </li>
                  <li class="add_node" v-if="currentDep.id"><a href="javascript:;" @click="addInfo"><i class="fa fa-plus"></i> 新增人员</a></li>
                  <!--<li v-if="personInfo.length===0">没有数据了~</li>-->
                </ul>
                <!--<p v-if="!currentDep.id||" >请先在左边选择部门或者搜索!</p>-->
                <p v-if="personInfo.length===0" class="no_data_tip">暂无相应人员</p>
              </div>
            </div>
            <div class="line_"></div>
          </div>
        </div>
      </div>
      <!--指标弹窗-->
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
      <!--人员信息弹窗-->
      <el-dialog v-model="show_info_modal" :title="info_model_type" size="tiny" :close-on-click-modal="false">
        <div class="dialog_title_line"></div>
        <el-form ref="form" :model="form" :rules="rule"  label-width="85px">
          <el-form-item label="姓名:" prop="realName">
            <el-input v-model="form.realName"  placeholder="请输入员工姓名"></el-input>
          </el-form-item>
          <el-form-item label="性别:" prop="gender">
            <el-select v-model="form.gender" placeholder="请选择性别">
              <el-option label="男" value="M"></el-option>
              <el-option label="女" value="F"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工号:" prop="jobNumber">
            <el-input v-model="form.jobNumber"  placeholder="请输入员工工号" :disabled="info_model_type==='编辑人员信息'&&form_.jobNumber_"></el-input>
          </el-form-item>
          <el-form-item label="联系方式:" prop="mobilePhone">
            <el-input v-model="form.mobilePhone"  placeholder="请输入员工联系方式" :disabled="info_model_type==='编辑人员信息'&&form_.mobilePhone_"></el-input>
          </el-form-item>
          <el-form-item label="邮箱:" prop="mail">
            <el-input v-model="form.mail"  placeholder="请输入员工邮箱" :disabled="info_model_type==='编辑人员信息'&&form_.mail_"></el-input>
          </el-form-item>
          <el-form-item label="所属部门:" prop="departmentId" v-if="info_model_type==='编辑人员信息'">
            <el-select v-model="form.departmentId" placeholder="请选择所属部门" @change="changeDep">
              <el-option v-for="item in departments" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属部门:" v-else>
            <span>{{currentDep.title}}</span>
          </el-form-item>
          <el-form-item label="所属岗位:" prop="postionId">
            <el-select v-model="form.postionId" placeholder="请选择所属岗位">
              <el-option v-for="item in postions" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <div class="btns clearfix" style="width: 320px;margin: 0px auto">
            <div class="btn btn-light fl" @click="stopPerson()" v-if="info_model_type == '编辑人员信息'">冻结账号</div>
            <div class="btn btn-light fl" @click="operateModalInfo(false)" v-if="info_model_type == '添加人员信息'">取消</div>
            <div class="btn btn-primary fr" @click="saveInfo">确认</div>
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
        search_key:'',//搜索
        checkIndicator:true,
        show_modal:false,
        model_type:'',
        show_info_modal:false,
        info_model_type:'',
        personInfo:[],//部门对应的人员
        personDetail:[],//人员卡片信息
        currentId:'',//正在编辑的人员id
        currentDep:'',//选中的部门
        labels:[],//部门对应的单个人员的职责
        indicators:[],//部门对应的单个人员的指标
        allIndicators:[],//人员对应岗位的所有指标
        form:{
          "departmentId": "",
          "gender": "",
          "jobNumber": "",
          "mail": "",
          "mobilePhone": "",
          "postionId": "",
          "realName": ""
        },
        form_:{//用于判断哪些字断不能修改
          jobNumber_:'',
          mail_:'',
          mobilePhone_:''
        },
        rule:{
          departmentId: [
            {required: true, message: '请选择所属部门'}
          ],
          gender: [
            {required: true, message: '请选择人员性别',trigger: 'change'}
          ],
          jobNumber: [
            {required: true, message: '请填写人员工号', trigger: 'blur'}
          ],
          mail: [
//            {required: true, message: '请填写人员邮箱', trigger: 'blur'},
            {type:'email',message: '邮箱格式错误', trigger: 'blur'}
          ],
          mobilePhone: [
            {required: true, message: '请填写联系方式', trigger: 'blur'},
            { message: '联系方式格式错误',pattern: /^1[0-9]{10}$|^[569][0-9]{7}$/, trigger: 'blur'}
          ],
          postionId: [
            {required: true, message: '请选择所属岗位'}
          ],
          realName: [
            {required: true, message: '请填写人员名称', trigger: 'blur'}
          ],
        },
        postions:[],//岗位数据
        departments:[],//部门数据
        value: '',
        data: [],
        show_add_indicator:false,//是否显示自定义指标输入框,
        form_self:{
          name:'',
          labelId:'',
          //empId:''
        },
        form_self_rule:{
          name: [
            {required: true, message: '请填写指标名称', trigger: 'change'}
          ]
        },
      }
    },
    computed:{
      userInfo:function () {
        return this.$store.state.userInfo;
      }
    },
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
       * 保存人员信息
       */
      saveInfo:function () {
        var _com=this,url;
        if(_com.info_model_type==='添加人员信息')
        {
          url='usr/employee/addEmp';
        }
        else {
          url='usr/employee/updateEmp';
          _com.form.empId=_com.currentId;
        }
        if(!_com.form.mail)
          delete _com.form.mail;
        _com.$refs['form'].validate(function (valid) {
          if(valid)
          {
            _com.$http.post(common.projectPath+url,_com.form,{

            }).then(function (data) {
              data=data.body;
              if(data.code=='SUCCESS'){
                _com.$message.success('保存成功!');
                _com.operateModalInfo(false);
                _com.showNodeDetail(_com.currentDep);
              }else{
                _com.$message.error(data.message);
              }
            })
          }
          else
          {
            _com.$message.error('请填写正确数据!');
          }
        });

      },
      /**
       * 编辑人员的指标信息
       */
      editIndicators:function (id) {
        var _com=this;
        _com.currentId=id;
//        _com.labels=[];
//        _com.indicators=[];
        _com.operateModal(true,'编辑人员指标');
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
              _com.allIndicators=data.data.indicators;
            }
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      /**
       * 点击编辑人员信息
       */
      editInfo:function (id) {
        var _com=this;
        _com.currentId=id;
        _com.getAllDepartments();
        _com.operateModalInfo(true,'编辑人员信息');
        _com.$http.get(common.projectPath+'usr/department/queryEmployeeByEmpId/'+id,{

        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.form.departmentId=data.data.department.id;
            _com.form.postionId=data.data.postion.id;
            _com.form.gender=data.data.gender;
            _com.form.jobNumber=data.data.jobNumber;
            _com.form.mail=data.data.mail;
            _com.form.mobilePhone=data.data.mobilePhone;

            _com.form_.jobNumber_=data.data.jobNumber;
            _com.form_.mail_=data.data.mail;
            _com.form_.mobilePhone_=data.data.mobilePhone;

            _com.form.realName=data.data.realName;
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
        _com.$http.get(common.projectPath+'usr/department/queryEmployeeByDepId/'+selectedNodes.id,{
          params:{}
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            if(data.data){
              for(var i=0;i<data.data.length;i++)
              {
                data.data[i].sendPsdLoading=false;//发送重置密码的loading
              }
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
      search:function () {
        var _com=this;
        _com.getAllList();
        _com.currentDep={};
        _com.$http.post(common.projectPath+'sys/employee/queryEmpByNameOrJob',{term :_com.search_key},{

        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.personInfo=data.data;
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      clearKey:function () {
        this.search_key='';
//        this.search();
        this.getAllList(true);
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
       * 获取所有部门数组
       * */
      getAllDepartments:function () {
        var _com=this;
        _com.$http.get(common.projectPath+'sys/department/getOnlyDepartments',{
          params:{}
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.departments=data.data;
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      /**
       * 改变部门,根据部门id获取岗位数据
       * */
      changeDep:function () {
        var _com=this;
        _com.postions=[];
        _com.$http.get(common.projectPath+'sys/postion/queryPosByDepId',{
          params:{depId:_com.form.departmentId}
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.postions=data.data;
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      /**
       * 点击添加人员
       * */
      addInfo:function () {
        this.getAllDepartments();
        this.form.departmentId=this.currentDep.id;
        this.changeDep();
        this.operateModalInfo(true,'添加人员信息');
      },
      /**
       * 冻结人员
       * */
      stopPerson:function () {
        var _com=this;
        _com.$http.get(common.projectPath+'usr/employee/stopEmp/'+_com.currentId,{

        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.$message.success('该人员已冻结!');
            _com.operateModalInfo(false);
            _com.showNodeDetail(_com.currentDep);
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      /**
       * 启用人员
       * */
      openPerson:function (id) {
        var _com=this;
        _com.$http.get(common.projectPath+'usr/employee/openEmp/'+id,{

        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.$message.success('该人员已启用!');
            _com.showNodeDetail(_com.currentDep);
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      resetPsd:function (person) {
        var _com=this;
        person.sendPsdLoading=true;
        _com.$http.get(common.projectPath+'usr/employee/resetPwdById',{
          params:{employeeId:person.id}
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.$message.success('该人员重置密码已发至手机。');
            person.sendPsdLoading=false;
          }else{
            _com.$message.error(data.message);
            person.sendPsdLoading=false;
          }
        })
      },
      /**
       * 操作膜态框
       * @param type bool型,打开或者关闭膜态框
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
      operateModalInfo:function (operateType,modalType) {
        if(operateType)//打开
        {
          this.info_model_type=modalType;
          this.show_info_modal=operateType;
          this.$nextTick(function () {
            this.clearForm('form');
          });
        }
        else{
          this.clearForm('form');
          this.show_info_modal=operateType;
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
      'content_head':content_head,
      'page-head': head
    },
    mounted:function () {
      this.getAllList(true);
      this.$nextTick(function () {
        quicker.returnTop();
      })
    }
  }
</script>


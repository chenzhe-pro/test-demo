<template>
  <div class="wrapper indicators_his">
    <page_head></page_head>
    <div class="content_wrapper">
      <content_head show-menu="true"></content_head>
      <div class="content_content clearfix">
        <el-row style="min-height: 580px;">
          <el-col :span="6" class="indicators_menu pt5">
            <!--<el-menu theme="primary" :active-key="active_key" mode="vertical" width="auto" @select="select_area">-->
            <el-menu theme="light" :default-active="active" mode="vertical" width="auto" @select="select_area">
              <el-menu-item-group>
                <div slot="title">业务领域</div>
                <el-menu-item v-for="x in businessAreas" :index="x.id" class="font_color_666">
                  <i class="fa ml20 mr10 icon_color" :class="x.icon" aria-hidden="true"></i>{{ x.name }}
                </el-menu-item>
                <el-menu-item v-if="businessAreas.length === 0" index="-1">暂无标签类型</el-menu-item>
              </el-menu-item-group>
            </el-menu>
          </el-col>
          <el-col :offset="6" class="line_down"></el-col>
          <el-col :span="18">
            <div class="indicators_com clearfix" v-loading="indicator_loading">
              <div class="indicators_search clearfix mb15">
                <el-input placeholder="请输入关键词" icon="search" v-model.trim="keyword" :on-icon-click="getComIndicators"></el-input>
              </div>
              <div class="indicators_add mb10">
                <p class="clearfix cursor_pointer" @click="openAddDia">
                  <img src="../../assets/img/plus.png" alt="" class="fl">
                  <span class="fl">添加指标</span>
                </p>
              </div>
              <p class="no_data_tip mt10" v-if="indicatorList.length===0">暂无数据</p>
              <indicator-his v-for="item in indicatorList" :item="item" :history="false" @openModifyDia="openModifyDia"></indicator-his>
              <el-pagination v-show="pagination.total>pagination.pageSize" class="fr page" ref="page" :total="pagination.total" :page-size="pagination.pageSize"
                             size="small" show-total show-elevator :current-page="pagination.currentPage"
                             @current-change='handleCurrentChange'></el-pagination>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <!--添加、编辑指标对话框-->
    <!--<el-dialog :title="dialogTitle" :visible.sync="indicatorAddDia" :close-on-click-modal="false" :close-on-press-escape="false" @close="addDiaClose">-->
    <el-dialog :title="dialogTitle" :visible.sync="addDialogContorl" @close="indicatorReset" @open="getLabelsOne">
      <div class="dialog_title_line"></div>
      <!--<indicator-dia @closeDia="closeAddDia" :item="indicatorForm"></indicator-dia>-->
      <div class="dialog_content">
        <el-form :model="indicatorForm" :rules="indicatorRules" ref="indicatorForm" :labelWidth="labelWidth">
          <el-form-item label="指标名称：" prop="name" class="mb10">
            <el-input v-model="indicatorForm.name" placeholder="请输入指标名称"></el-input>
          </el-form-item>
          <el-form-item label="指标定义：" prop="description" class="mb10">
            <el-input type="textarea" :rows="2" v-model="indicatorForm.description" placeholder="请输入指标定义"></el-input>
          </el-form-item>
          <el-form-item label="对应标签：" prop="labels" class="reletive_labels mb10">
            <div>
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane v-for="x in labels_one" :label="x.name" :name="x.id"></el-tab-pane>
              </el-tabs>
              <div class="labels_two pr10 pb10">
                <span v-for="y in labels_two" class="ml10 mb10 cursor_pointer" :class="{labels_selected: y.checked}" @click="toggleSelect(y)">{{ y.name }}</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="数据公式：" prop="expression" class="mb10 expression">
            <div class="expression_string">
              <p v-if="!performanceDataList" class="pl10">请从下方选择数据公式的运算符号及绩效数据</p>
              <!--<p  v-if="performanceDataList" class="pt5 pb5">-->
              <p class="p5">
                <el-tag class="mr5" :key="tag" v-for="tag in expressionList" :closable="true" @close="handleClose(tag)">{{ tag }}</el-tag>
              </p>
              <el-checkbox class="switch" v-model="indicatorForm.percentage">百分比显示</el-checkbox>
            </div>
            <el-row class="expression_handle pt10">
              <el-col :span="9" class="expression_operator">
                <span v-for="z in operators" class="mr10 cursor_pointer" @click="createExpression(z)">{{ z }}</span>
              </el-col>
              <el-col :offset="9" class="line_down"></el-col>
              <el-col :span="15" class="expression_factor pl10">
                <p class="mb10">
                  <el-popover width="300" popper-class="border_radius" v-model="performanceVisible" @hide="performanceReset">
                <span slot="reference" class="cursor_pointer">
                  <i class="fa fa-plus-circle" aria-hidden="true"></i>
                  <span>添加绩效数据</span>
                </span>
                    <el-form :model="performanceData" :rules="performanceRules" ref="performanceData" class="mb20">
                      <el-form-item class="mb20" prop="name">
                        <el-input v-model="performanceData.name" placeholder="请输入绩效数据名称"></el-input>
                      </el-form-item>
                      <el-form-item class="mb20" prop="liabilityMan">
                        <el-select style="width: 100%;" v-model="performanceData.liabilityMan" filterable remote placeholder="请输入提供人姓名" :remote-method="remoteMethod" :loading="select_loading">
                          <el-option v-for="item in employee_options" :key="item.id" :label="item.realName" :value="item.realName"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item class="mb20" prop="revieweMan">
                        <el-select style="width: 100%;" v-model="performanceData.revieweMan" filterable remote placeholder="请输入数据复核人姓名" :remote-method="remoteMethod" :loading="select_loading">
                          <el-option v-for="item in employee_options" :key="item.id" :label="item.realName" :value="item.realName"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-form>
                    <div class="">
                      <el-button type="primary" class="btn-primary" style="width: 100%; height: 32px; padding: 6px 0;" :disabled="performanceBtn" @click="createPerformance">添加</el-button>
                    </div>
                  </el-popover>
                  <i class="fa fa-question-circle-o icon_color cursor_pointer" aria-hidden="true"></i>
                </p>
                <div class="">
                  <div class="performance_tag mb5" v-for="(tag,index) in performanceDataList">
                    <p class="tag_title">{{ tag.name }}</p>
                    <p class="tag_man mt5">
                      <span class="mr40">提供人：{{ tag.liabilityMan   }}</span>
                      <span>复核人：{{ tag.revieweMan }}</span>
                    </p>
                    <i class="fa fa-times-circle cursor_pointer" aria-hidden="true" @click="deletePerformance(tag.name,index)"></i>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="场景描述：" prop="remark" class="mb10">
            <el-input type="textarea" :rows="2" v-model="indicatorForm.remark" placeholder="请输入指标场景描述"></el-input>
          </el-form-item>
          <el-form-item label="业务领域：" prop="businessDomains" class="mb10">
            <el-select style="width:100%;" v-model="indicatorForm.businessDomains" multiple placeholder="请选择业务领域">
              <el-option v-for="x in businessAreas" :key="x.id" :label="x.name" :value="x.name"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="dialog_handle mt50">
          <el-button class="dialog_btn" @click="addDialogContorl = false">取消</el-button>
          <el-button class="dialog_btn" type="primary" @click="stopUse('停用')" v-if="indicatorForm.status === 'Y'">停用</el-button>
          <el-button class="dialog_btn" type="primary" @click="stopUse('启用')" v-else>启用</el-button>
          <el-button class="dialog_btn" type="primary" @click="saveIndicator">保存</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import head from '../common/head.vue'
  import contnent_head from '../common/content_head.vue'
  import indicator_box from '../target/indicator.vue'
  import indicatorHis from '../target/indicatorHis.vue'
  import indicatorAdd from '../target/addDialog.vue'

  module.exports = {
    data: function () {
      return {
        select_loading: false,//select框loading
        employeeList: [],//员工列表
        employee_options: [],//过滤后的员工列表
        active:'',
        indicator_loading:false,//指标加载loading
        keyword: '',//指标搜索关键词
        indicatorAddDia: false,//默认添加指标对话框关闭
        dialogTitle: '添加指标',//对话框标题——添加指标或编辑指标
        pagination: {//分页
          totalPage: 0,
          currentPage: 1,
          pageSize: 5,
          total: 0
        },
        indicatorList: [],
        businessAreas: [],
        isAdd: true,//区分是新增指标还是编辑指标，默认新增指标
        addDialogContorl: false,//添加指标对话框显隐
        //以下为编辑指标弹框相关参数
        performanceDataList: [],//绩效数据列表
        expressionList: [],//公式组成标签列表
        labelWidth: '100px',
        indicatorForm: {
          id: '',
          name: '',
          description: '',
          expression: '',
          indicatorFactors: '',
          indicatorFactorsStr: '',
          businessDomains: [],
          labels: [],
          remark: '',//使用场景描述
          percentage: true,//是否使用百分比
        },
        indicatorRules: {
          name: [
            { required: true, message: ' ', trigger: 'blur' },
            { max: 20, message: '长度不超过20个字符', trigger: 'blur' }
          ],
          description: [
            { required: true, message: ' ', trigger: 'blur' }
          ],
          expression: [
            { required: true, message: '', trigger: 'blur' }
          ],
          businessDomains: [
            { required: true, message: '', trigger: 'blur' }
          ],
          labels: [
            { required: true, message: '', trigger: 'blur' }
          ],
          remark: [
            { required: true, message: ' ', trigger: 'blur' }
          ]
        },
        labels_one: [],//一级标签
        labels_two: [],//二级标签
//        labels_checked: [],//被选中的标签列表
        operators: ['+','-','*','/','(',')'],
        activeName: '',
        performanceData: {
          name: '',
          revieweMan: '',
          liabilityMan  : ''
        },
        performanceRules: {
          name: [
            { required: true, message: '请输入绩效数据名称', trigger: 'blur' },
            { max: 10, message: '长度不超过10个字符', trigger: 'blur' }
          ],
          revieweMan: [
            { required: true, message: '请输入审核人姓名', trigger: 'blur' },
            { max: 5, message: '长度不超过5个字符', trigger: 'blur' }
          ],
          liabilityMan  : [
            { required: true, message: '请输入提供人姓名', trigger: 'blur' },
            { max: 5, message: '长度不超过5个字符', trigger: 'blur' }
          ]
        },
        performanceVisible: false,//添加绩效数据popover显隐
        indicatorUrl: '',//值为添加指标或编辑指标接口的url
      }
    },
    computed: {
      performanceBtn: function () {
        if (this.performanceData.name && this.performanceData.revieweMan && this.performanceData.liabilityMan  ) {
          return false;
        } else {
          return true;
        }
      },
    },
    methods: {
      //获取业务领域列表
      getDomainList: function () {
        var _com = this;
        _com.$http.post(common.projectPath + 'sys/domain/list', {}, {}).then(function (data) {
          data = data.body;
          if (data.code !== 'SUCCESS') {
            _com.$message.error(data.message);
          } else {
            if (!data.data)
              data.data = [];
            _com.businessAreas = data.data;
            _com.$nextTick(function () {
              _com.select_area(_com.businessAreas[0].id);
            });
          }
        })
      },
      closeAddDia: function () {
        this.indicatorAddDia = false;
      },
      //添加指标按钮
      addIndicator: function () {
        var _com = this;
        _com.dialogTitle = '添加指标';
        _com.indicatorAddDia = true;
        _com.isAdd = true;
      },
      //左侧菜单栏方法
      select_area: function (key) {
        var _com = this;
        _com.active = key;
        _com.pagination.currentPage = 1;
        _com.getComIndicators();
      },
      //添加绩效数据模糊搜索
      remoteMethod: function (query) {
        if (query !== '') {
          this.select_loading = true;
          setTimeout(() => {
            this.select_loading = false;
            this.employee_options = this.employeeList.filter(item => {
              return item.realName.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.employee_options = [];
        }
      },
      //根据姓名模糊搜索用户
      searchUserByName: function () {
        var _com = this;
        var data = {
          name: 'haha'
        };
        _com.$http.post(common.projectPath+'usr/employee/queryByName', {
          parmas:{}
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            if (data.data) {
              _com.employeeList = data.data;
            }
          }else {
            _com.$message.error(data.message);
          }
        })
      },
      //获取指标
      getComIndicators:function () {
        var _com=this,
          data={
            "data": {
              "businessDomainById": _com.active,
              "indicatorName": _com.keyword
            },
            page: this.pagination.currentPage,
            pageSize:this.pagination.pageSize
          };
        _com.indicator_loading=true;
        _com.$http.post(common.projectPath+'sys/indicator/queryIndicatorByBusId',data,{
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            if (data.data) {
              for (var i = 0; i < data.data.length; i++) {
                data.data[i].spread = false;
              }
              _com.indicatorList = data.data;
              _com.pagination.total = data.total;
            }
            setTimeout(function () {
              _com.indicator_loading=false;
            },300);
          }else {
            _com.$message.error(data.message);
          }
        })
      },
      //点击分页回调
      handleCurrentChange: function (val) {
        var _com = this;
        _com.pagination.currentPage = val;
        _com.getComIndicators();
      },
      //编辑指标弹框关闭时的回调函数，清空indicatorForm
      addDiaClose: function () {
        this.$refs.addDialog.clearForm('indicatorForm');
      },
      //打开新增指标对话框
      openAddDia: function () {
        var _com = this;
        _com.dialogTitle = "添加指标";
        _com.addDialogContorl = true;
        _com.searchUserByName();
      },
      //打开编辑指标对话框
      openModifyDia: function (val) {
        var _com = this;
        _com.dialogTitle = "编辑指标";
        _com.searchUserByName();
        _com.addDialogContorl = true;
        _com.$http.get(common.projectPath+'sys/indicator/detail/' + val.id,{
          parmas:{}
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            if (data.data) {
              if (data.data.labels) {
                for (var i = 0; i < _com.labels_two.length; i++) {
                  for (var j = 0; j < data.data.labels.length; j++) {
                    if (_com.labels_two[i].id == data.data.labels[j].id) {
                      _com.labels_two[i].checked = true;
                    }
                  }
                }
              }
              if (data.data.businessDomains) {
                //将businessDomans中的对象元素转化为字符串元素
                var businessDomainList = [];
                for (var i = 0; i < data.data.businessDomains.length; i++) {
                  businessDomainList.push(data.data.businessDomains[i].name);
                }
                data.data.businessDomains = businessDomainList;
              }
              if (data.data.indicatorFactors) {
                _com.performanceDataList = data.data.indicatorFactors;
              }
              _com.indicatorForm = data.data;
              _com.expressionList = data.data.expressionList;
            }
            _com.addDialogContorl = true;
          }else {
            _com.$message.error(data.message);
          }
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
      //添加指标事件传递函数
      checkIndicator: function (data) {
        this.$emit('checkIndicator',data);
      },
      //移除指标事件传递函数
      unCheckIndicator: function (data) {
        this.$emit('unCheckIndicator',data);
      },
      //标签公式中的tag关闭事件
      handleClose: function (tag) {
        this.expressionList.splice(this.expressionList.lastIndexOf(tag),1);
        for (var i = 0; i < this.performanceDataList.length; i++) {
          if (tag === this.performanceDataList[i].name) {
            this.performanceDataList.splice(i,1);
          }
        }
      },
      //计算符号按钮点击事件
      createExpression: function (val) {
        var _com = this;
        _com.expressionList.push(val);
      },
      //添加绩效数据
      createPerformance: function () {
        var _com = this,data = {};
        data.name = _com.performanceData.name;
        data.revieweMan = _com.performanceData.revieweMan;
        data.liabilityMan   = _com.performanceData.liabilityMan  ;
        _com.performanceDataList.push(data);
        _com.expressionList.push(data.name);
        _com.performanceVisible = false;
      },
      //popover关闭后重置performanceData
      performanceReset: function () {
        this.$refs['performanceData'].resetFields();
      },
      //添加指标对话框关闭后回调
      indicatorReset: function () {
        this.$refs['indicatorForm'].resetFields();
        this.expressionList = [];
        this.performanceDataList = [];
      },
      //删除绩效数据
      deletePerformance: function (val,index) {
        this.performanceDataList.splice(index,1);
        this.expressionList.splice(this.expressionList.indexOf(val),1);
      },
      //一级标签点击事件
      handleClick: function () {
        var _com = this;
        //点击后获取对应的二级标签
        _com.getLabelsTwo(_com.activeName);
      },
      //二级标签点击事件
      toggleSelect: function (label) {
        var _com = this;
        label.checked = !label.checked;
        if (label.checked === true) {
          _com.indicatorForm.labels.push(label);
        } else {
          for(var i = 0; i < _com.indicatorForm.labels.length; i++) {
            if (_com.indicatorForm.labels[i].id === label.id) {
              var index = _com.indicatorForm.labels.indexOf(_com.indicatorForm.labels[i]);
              _com.indicatorForm.labels.splice(index,1);
            }
          }
        }
      },
      //获取一级标签
      getLabelsOne: function () {
        var _com = this;
        _com.$http.get(common.projectPath+'sys/label/getParentLabel',{
          parmas:{}
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            if (data.data) {
              _com.activeName = data.data[0].id;
            }
            _com.labels_one=data.data;
            _com.getLabelsTwo(_com.activeName);
          }else {
            _com.$message.error(data.message);
          }
        })
      },
      //获取二级标签
      getLabelsTwo: function () {
        var _com = this;
        _com.$http.get(common.projectPath+'sys/label/getChilDByParentId/'+_com.activeName,{
          parmas:{}
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.labels_two = [];
            for(var i=0;i<data.data.length;i++){
              data.data[i].checked=false;
            }
            if (_com.indicatorForm.labels) {
              for (var i = 0; i < _com.indicatorForm.labels.length; i++) {
                for (var j = 0; j < data.data.length; j++) {
                  if (_com.indicatorForm.labels[i].id == data.data[j].id) {
                    data.data[j].checked = true;
                  }
                }
              }
            }
            _com.labels_two=data.data;
          }else {
            _com.$message.error(data.message);
          }
        })
      },
      //停用、启用指标
      stopUse: function (val) {
        var _com = this, url, msg;
        if (val === '停用') {
          url = 'sys/indicator/stopIndicator/';
          msg = '指标停用成功';
        } else {
          url = 'sys/indicator/openIndicator/';
          msg = '指标启用成功';
        }
        _com.$http.get(common.projectPath+ url + _com.indicatorForm.id,{
          parmas:{}
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.$message.success(msg);
            _com.addDialogContorl = false;
            _com.getComIndicators();
          }else {
            _com.$message.error(data.message);
          }
        })
      },
      //保存按钮方法——添加修改指标
      saveIndicator: function () {
        var _com = this,expressionStr,validateResult,data = {};
        expressionStr = _com.expressionList.join('');
        validateResult = _com.expressionValidate(expressionStr,_com.expressionList);
        if (validateResult) {
          data.name = _com.indicatorForm.name;//well
          data.description = _com.indicatorForm.description;//well
          data.percentage = _com.indicatorForm.percentage;//well
          data.expressionList = _com.expressionList;//well
          data.expression = _com.expressionList.join('');//此处应加以验证//well
          data.indicatorFactors = _com.performanceDataList;//well
          data.labels = _com.indicatorForm.labels;//well
          data.remark = _com.indicatorForm.remark;//well
          data.businessDomains = [];
          for (var i = 0; i < _com.businessAreas.length; i++) {
            for (var j = 0; j < _com.indicatorForm.businessDomains.length; j++) {
              if (_com.businessAreas[i].name === _com.indicatorForm.businessDomains[j]) {
                data.businessDomains.push(_com.businessAreas[i]);
              }
            }
          }
          if (data.name && data.description && data.expression && data.indicatorFactors.length > 0 && data.labels.length > 0 && data.remark && data.businessDomains.length > 0) {
            //此处做添加、编辑请求
            if (_com.dialogTitle === '添加指标') {
              _com.indicatorUrl = 'sys/indicator/save';
            } else {
              _com.indicatorUrl = 'sys/indicator/update';
              data.id = _com.indicatorForm.id;
              data.status = _com.indicatorForm.status;
            }
            _com.$http.post(common.projectPath+_com.indicatorUrl, data, {
              parmas:{}
            }).then(function (data) {
              data=data.body;
              if(data.code=='SUCCESS'){
                _com.addDialogContorl = false;
                _com.getComIndicators();
              }else {
                _com.$message.error(data.message);
              }
            });
//            _com.$set(_com.reload, 0, true); //添加人工后刷新待选指标列表

          } else {
            _com.$message.error('请完整填写表单');
          }
        } else {
          _com.$message.error('请检查指标公式');
        }
      },
      //指标公式验证
      expressionValidate: function (string,arr) {
        // 剔除空白符
        string = string.replace(/\s/g, '');
        // 错误情况，空字符串
        if("" === string){
          return false;
        }
        // 错误情况，运算符连续
        if( /[\+\-\*\/]{2,}/.test(string) ){
          return false;
        }
        // 空括号
        if(/\(\)/.test(string)){
          return false;
        }
        // 错误情况，括号不配对
        var stack = [];
        for(var i = 0, item; i < string.length; i++){
          item = string.charAt(i);
          if('(' === item){
            stack.push('(');
          }else if(')' === item){
            if(stack.length > 0){
              stack.pop();
            }else{
              return false;
            }
          }
        }
        if(0 !== stack.length){
          return false;
        }
        // 错误情况，(后面是运算符
        if(/\([\+\-\*\/]/.test(string)){
          return false;
        }
        // 错误情况，)前面是运算符
        if(/[\+\-\*\/]\)/.test(string)){
          return false;
        }
        // 错误情况，(前面不是运算符
        if(/[^\+\-\*\/]\(/.test(string)){
          return false;
        }
        // 错误情况，)后面不是运算符
        if(/\)[^\+\-\*\/]/.test(string)){
          return false;
        }
        // 错误情况，变量没有来自“待选公式变量”
        var tmpStr = string.replace('(','').replace(')','').replace(/[\+\-\*\/]{1,}/g, '`');
        var array = tmpStr.split('`');
        for(var i = 0; i < array.length; i++){
          if (arr.indexOf(array[i]) === -1) {
            return false;
          }
        }
        return true;
      },
    },
    mounted: function () {
      this.getDomainList();
    },
    components: {
      'page_head': head,
      'content_head': contnent_head,
      'indicator_box': indicator_box,
      'indicator-his': indicatorHis,
      'indicator-add': indicatorAdd
    },
  }
</script>

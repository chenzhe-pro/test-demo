<!--待选指标通用组件-->
<template>
  <div class="indicator_will p20" v-loading="loading">
    <div class="will_title clearfix mb10">
      <span class="fl">待选指标</span>
      <i class="fa fa-plus-circle fa-lg fr cursor_pointer" @click="openAddDia"></i>
      <i class="fa fa-search fa-lg fr cursor_pointer" @click="searchIndicator"></i>
      <el-input class="search fr" type="text" placeholder="请输入关键字" v-model="keyword" icon="close"
                :on-icon-click="toggleControl" v-show="toggle"></el-input>
    </div>
    <p class="no_data_tip" v-if="indicatorWillList.length===0">暂无数据</p>
    <indicator-box v-for="item in indicatorWillList" :btn-show="true" :will-tag="true" :item="item" @openAddDia="openModifyDia(item)" @checkIndicator="checkIndicator"></indicator-box>
    <a href="javascript:;" class="load_more" @click="getWillList('')" v-show="willListLoadMore">加载更多</a>
    <div class="disabled_pop" v-if="disabled"><span>无法再移入指标,请先移除指标</span></div>
    <!--添加、编辑指标-->
    <el-dialog :title="dialogTitle" :visible.sync="addDialogContorl" :size="dialogSize" :modal="dialogSize!=='full'" @close="indicatorReset" @open="getBusinessDomainList">
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
              <el-option v-for="x in businessDomainList" :key="x.id" :label="x.name" :value="x.name"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="dialog_handle mt50">
          <el-button class="dialog_btn" @click="addDialogContorl = false">取消</el-button>
          <el-button class="dialog_btn" type="primary" @click="saveIndicator">保存</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import indicator_box from './indicator.vue'
  import indicator_dia from './addDialog.vue'
  module.exports = {
    data: function () {
      return {
        select_loading: false,//select框loading
        employeeList: [],//员工列表
        employee_options: [],//过滤后的员工列表
        businessAreas: [],
        dialogTitle: '',//添加指标对话框标题
        addDialogContorl: false,//添加指标对话框显隐
        dateSelectVisible: false,//日期控件显隐
        currentPage: 0,
        indicatorWillList: [],//推荐指标
        willListLoadMore: false,
        keyword: '',//指标搜索关键字
        toggle: false,//搜索框默认不显示,
        loading: false,
        //以下为编辑指标弹框相关参数
        businessDomainList: [],//业务领域列表
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
            { max: 10, message: '长度不超过10个字符', trigger: 'blur' }
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
            { max: 20, message: '长度不超过20个字符', trigger: 'blur' }
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
    props: {
      urlObj:{},
      reload:{
        type:Array
      },
      disabled:{
        type:Boolean,
        default:function () {
          return false;
        }
      },
      dialogSize:{
        default:function () {
          return '';
        }
      }
    },
    watch:{
      'reload':function () {
        if(this.reload[0])
        {
          this.init();
        }

      }
    },
    methods: {
      //打开新增指标对话框
      openAddDia: function () {
        var _com = this;
        _com.dialogTitle = "添加指标";
        _com.addDialogContorl = true;
        _com.searchUserByName();
      },
      //添加绩效数据模糊搜索
      remoteMethod: function (query) {//缺少一个获取员工列表的函数，等待蒋夏确认接口
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
      //打开编辑指标对话框
      openModifyDia: function (val) {
        var _com = this;
        _com.dialogTitle = "编辑指标";
        _com.searchUserByName();
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
              if (data.data.indicatorFactors) {
                _com.performanceDataList = data.data.indicatorFactors;
              }
              if (data.data.businessDomains) {
                //将businessDomans中的对象元素转化为字符串元素
                var businessDomains = [];
                for (var i = 0; i < data.data.businessDomains.length; i++) {
                  businessDomains.push(data.data.businessDomains[i].name);
                }
                data.data.businessDomains = businessDomains;
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
      //获取待选指标列表
      getWillList:function (val) {
        var _com = this;
        _com.loading=true;
        _com.currentPage++;
        var data = {
          "data":this.urlObj.params,
          "page":this.currentPage,
          "pageSize":4,
        };
        data.data.name= val;
        _com.$http.post(common.projectPath + this.urlObj.url , data , {}).then(function (data) {
          data = data.body;
          if (data.code !== 'SUCCESS') {
            _com.$message.error(data.message);
          } else {
            if(!data.data) data.data=[];

            for (var i = 0; i < data.data.length; i++) {
              data.data[i].spread = false;
            }
            _com.indicatorWillList = _com.indicatorWillList.concat(data.data);
            if(_com.pagination(data.page,data.pageSize,data.total))
            {
              _com.willListLoadMore=true;
            }
            else _com.willListLoadMore=false;
            setTimeout(function () {
              _com.loading=false;
            },300);
          }
          _com.$set(_com.reload, 0, false);
        })
      },
      init:function () {
        this.currentPage=0;
        this.willListLoadMore=false;
        this.indicatorWillList=[];
        this.getWillList('');
      },
      //控制指标搜索框显隐
      toggleControl: function () {
        var _com = this;
        _com.toggle = false;
        _com.currentPage = 0;
        _com.indicatorWillList = [];
        _com.getWillList();
      },
      //搜索指标
      searchIndicator:function () {
        var _com = this;
        if (_com.toggle === false) {
          _com.toggle = true;
        } else if (_com.toggle === true) {
          _com.loading = true;
          _com.indicatorWillList = [];
          _com.currentPage = 0;
          var data = {
            page: _com.currentPage,
            status: 'Y',
            pageSize: 4,
            term: _com.keyword
          }
          _com.$http.post(common.projectPath+'sys/indicator/queryIndicatorByName', data, {
            parmas:{}
          }).then(function (data) {
            data = data.body;
            if (data.code !== 'SUCCESS') {
              _com.$message.error(data.message);
            } else {
              if(!data.data) data.data=[];

              for (var i = 0; i < data.data.length; i++) {
                data.data[i].spread = false;
              }
              _com.indicatorWillList = _com.indicatorWillList.concat(data.data);
              if(_com.pagination(data.page,data.pageSize,data.total))
              {
                _com.willListLoadMore=true;
              }
              else _com.willListLoadMore=false;
              setTimeout(function () {
                _com.loading=false;
              },300);
            }
          })
        }
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
//        this.labels_two = [];
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
      //保存按钮方法——添加修改指标
      saveIndicator: function () {
        var _com = this,expressionStr,validateResult,data = {};
        expressionStr = _com.expressionList.join('');
        validateResult = _com.expressionValidate(expressionStr,_com.expressionList);
        if (validateResult) {
          data.name = _com.indicatorForm.name;
          data.description = _com.indicatorForm.description;
          data.percentage = _com.indicatorForm.percentage;
          data.expressionList = _com.expressionList;
          data.expression = _com.expressionList.join('');
          data.indicatorFactors = _com.performanceDataList;
          data.labels = _com.indicatorForm.labels;
          data.remark = _com.indicatorForm.remark;
          data.businessDomains = [];
          for (var i = 0; i < _com.businessDomainList.length; i++) {
            for (var j = 0; j < _com.indicatorForm.businessDomains.length; j++) {
              if (_com.businessDomainList[i].name === _com.indicatorForm.businessDomains[j]) {
                data.businessDomains.push(_com.businessDomainList[i]);
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
                _com.currentPage = 0;
                _com.indicatorWillList = [];
                _com.getWillList('');
              }else {
                _com.$message.error(data.message);
              }
            });
          } else {
            _com.$message.error('请完整填写表单');
            console.log('data',data);
          }
        } else {
          _com.$message.error('请检查指标公式');
        }
      },
      //获取业务领域
      getBusinessDomainList: function () {
        var _com = this;
        _com.$http.post(common.projectPath+'sys/domain/list',{
          parmas:{}
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.businessDomainList = data.data;
          }else {
            _com.$message.error(data.message);
          }
        })
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
      this.getWillList('');
      this.getLabelsOne();
//      this.getBusinessDomainList();
    },
    components:{
      'indicator-box': indicator_box,
      'indicator-dia': indicator_dia,

    }
  }
</script>

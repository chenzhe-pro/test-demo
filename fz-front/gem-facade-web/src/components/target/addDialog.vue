<template>
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
            <span v-for="y in labels_two" class="ml10 mb10 cursor_pointer" :class="{labels_selected: y.checked}" @click="toggleSelect(y.checked)">{{ y.name }}</span>
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
          <el-col :offset="4" style="width: 1px;"></el-col>
          <el-col :span="14" class="expression_factor pl10">
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
                  <!--<el-form-item class="divide_line mb10" style="margin-left: -10px;margin-right: -10px;height: 1px">-->
                  <!--</el-form-item>-->
                  <el-form-item class="mb20" prop="repeatReviewe">
                    <el-input v-model="performanceData.repeatReviewe" placeholder="请输入数据复核人姓名"></el-input>
                  </el-form-item>
                  <el-form-item class="mb20" prop="provide">
                    <el-input v-model="performanceData.provide" placeholder="请输入数据提供人姓名"></el-input>
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
                  <span class="mr40">提供人：{{ tag.provide }}</span>
                  <span>复核人：{{ tag.repeatReviewe }}</span>
                </p>
                <i class="fa fa-times-circle cursor_pointer" aria-hidden="true" @click="deletePerformance(tag.name,index)"></i>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="场景描述：" prop="scene" class="mb10">
        <el-input type="textarea" :rows="2" v-model="indicatorForm.scene" placeholder="请输入指标"></el-input>
      </el-form-item>
      <el-form-item label="业务领域：" prop="area" class="mb10">
        <el-select style="width:100%;" v-model="indicatorForm.area" multiple placeholder="请选择业务领域">
          <el-option v-for="x in areaList" :key="x.id" :label="x.name" :value="x.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="dialog_handle mt50">
      <el-button class="dialog_btn" @click="closeAddDia">取消</el-button>
      <el-button class="dialog_btn" type="primary" @click="saveIndicator">保存</el-button>
    </div>
  </div>

</template>

<script>
  module.exports = {
    data: function () {
      return {
        areaList: [
          { id: 'eyqdau7w6h', name: '市场领先' },
          { id: 'chau8nd87r', name: '产品品质' },
          { id: 'xiajef8ans', name: '人员配备' },
          { id: 'sa8cnr729d', name: '客户服务' },
          { id: 'sa84hf7fna', name: '利润增长' }
        ],//业务领域列表
        performanceDataList: [],//绩效数据列表
        expressionList: [],//公式组成标签列表
        labelWidth: '100px',
//        indicatorForm: {
//          name: '',
//          description: '',
//          expression: '',
//          indicatorFactors: '',
//          indicatorFactorsStr: '',
//          area: ['eyqdau7w6h'],
//          labels: '',
//          scene: '',//使用场景描述
//          percentage: true,//是否使用百分比
//        },
        indicatorForm:this.item,
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
          area: [
            { required: true, message: '', trigger: 'blur' }
          ],
          labels: [
            { required: true, message: '', trigger: 'blur' }
          ],
          scene: [
            { required: true, message: ' ', trigger: 'blur' }
          ]
        },
        labels_one: [],//一级标签
        labels_two: [],//二级标签
        labels_checked: [],//被选中的标签列表
        operators: ['+','-','*','/','(',')'],
        activeName: '',
        performanceData: {
          name: '',
          repeatReviewe: '',
          provide: ''
        },
        performanceRules: {
          name: [
            { required: true, message: '请输入绩效数据名称', trigger: 'blur' },
            { max: 10, message: '长度不超过10个字符', trigger: 'blur' }
          ],
          repeatReviewe: [
            { required: true, message: '请输入审核人姓名', trigger: 'blur' },
            { max: 5, message: '长度不超过5个字符', trigger: 'blur' }
          ],
          provide: [
            { required: true, message: '请输入提供人姓名', trigger: 'blur' },
            { max: 5, message: '长度不超过5个字符', trigger: 'blur' }
          ]
        },
        performanceVisible: false,//添加绩效数据popover显隐
      }
    },
    computed: {
      performanceBtn: function () {
        if (this.performanceData.name && this.performanceData.repeatReviewe && this.performanceData.provide) {
          return false;
        } else {
          return true;
        }
      },
//      indicatorForm:function () {
//        return this.item;
//      }
    },
    props: {
      item: {}
    },
    methods: {
      //关闭增加指标对话框
      closeAddDia: function () {
        this.$emit("closeAddDia");
      },
      //标签公式中的tag关闭事件
      handleClose: function (tag) {
        this.expressionList.splice(this.expressionList.indexOf(tag),1);
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
        data.repeatReviewe = _com.performanceData.repeatReviewe;
        data.provide = _com.performanceData.provide;
        _com.performanceDataList.push(data);
        _com.expressionList.push(data.name);
        _com.performanceVisible = false;
      },
      //popover关闭后重置performanceData
      performanceReset: function () {
        var _com = this;
        this.$refs['performanceData'].resetFields();
      },
      //删除绩效数据
      deletePerformance: function (val,index) {
        this.performanceDataList.splice(index,1);
        this.expressionList.splice(this.expressionList.indexOf(val),1);
      },
      //tab组件(一级标签)点击事件
      handleClick: function () {
        var _com = this;
        //点击后获取对应的二级标签
        _com.getLabelsTwo(_com.activeName);
      },
      //二级标签点击事件
      toggleSelect: function (val) {
        val = !val;
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
//            if (_com.checkedLabels) {
//              for (var i = 0; i < _com.checkedLabels.length; i++) {
//                for (var j = 0; j < data.data.length; j++) {
//                  if (_com.checkedLabels[i].id == data.data[j].id) {
//                    data.data[j].checked = true;
//                  }
//                }
//              }
//            }
            _com.labels_two=data.data;
          }else {
            _com.$message.error(data.message);
          }
        })
      },
      //保存按钮方法，将处理好的数据传给父组件，由父组件调用接口
      saveIndicator: function () {
        var _com = this,expressionStr,validateResult,data = {};
        expressionStr = _com.expressionList.join('');
        validateResult = _com.expressionValidate(expressionStr,_com.expressionList);
        if (validateResult) {
          data.name = _com.indicatorForm.name;//well
          data.description = _com.indicatorForm.description;//well
          data.percentage = _com.indicatorForm.percentage;//well
          data.expression = _com.expressionList.join('');//此处应加以验证//well
          data.indicatorFactors = _com.performanceDataList;//well
//          data.labels = _com.labels_checked;//待处理
          data.labels = ['1','2','3'];//待处理
          data.scene = _com.indicatorForm.scene;//well
          if (data.name && data.description && data.expression && data.indicatorFactors.length > 0 && data.labels.length > 0 && data.scene && data.area.length > 0) {
            this.$emit('indicatorDetail',data);
          } else {
            _com.$message.error('请完整填写表单');
          }
        } else {
          _com.$message.error('请检查指标公式');
        }
      },
      //清空对应的表单模型
      clearForm: function (formName) {
        this.$refs[formName].resetFields();
        this.expressionList = [];
        this.performanceDataList = [];
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
    created:function () {

    },
    mounted: function () {
      var _com = this;
      _com.getLabelsOne();

    }
  }
</script>

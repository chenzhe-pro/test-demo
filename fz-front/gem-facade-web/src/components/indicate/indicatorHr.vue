<template>
  <div class="wrapper indicateHr indicateManage">
    <page-head></page-head>
    <div class="contnet-wrapper">
      <!--<content_head></content_head>-->
      <content_head show-menu="true"></content_head>
      <div class="content_content clearfix" v-loading.fullscreen="pageLoading">
        <div class="fl default_box">
          <p class="default_title" v-text="leftTitle">停用指标库</p>
          <p class="no_data_tip" v-if="leftIndicatorList.length == 0">暂无数据</p>
          <div class="indicator_box" v-for="x in leftIndicatorList">
            <p class="indicator_title">{{ x.name }}</p>
            <hr>
            <div class="indicator_item clearfix">
              <div class="label_definition fl">定义：</div>
              <div class="content_definition fr">{{ x.description }}</div>
            </div>
            <div class="indicator_item clearfix">
              <div class="label_formula fl">公式：</div>
              <div class="content_formula fr">{{ x.expression }}</div>
            </div>
            <p class="indicator-btn">
              <a href="javascript: void(0)" v-if="x.hasAdded !== 1" @click="openEnableDia(x.name,x.id)">启用</a>
            </p>
          </div>
        </div>
        <div class="department_box clearfix" v-loading="elementLoading">
          <div class="department_box_head clearfix">
            <p class="department_title fl" v-text="rightTitle">公司考核指标库</p>
            <p class="fl search_input">
              <el-input
                placeholder="请输入指标名称"
                icon="circle-close"
                v-model.trim="keyword" :on-icon-click="clearSearch" style='width: 70%;'>
              </el-input>
              <el-button type="primary" icon="search" @click="indicatorSearch" style="'width: 30%;"></el-button>
            </p>
            <p class="clearfix fr add_icon" style="width: 120px;cursor: pointer;padding-right: 10px;" @click="openAddDia">
              <img src="../../assets/img/plus.png" alt="" class=" fl" width="20" height="20">
              <span class="fr">新增考核指标</span>
            </p>
          </div>
          <p class="no_data_tip" v-if="rightIndicatorList.length == 0">暂无数据</p>
          <div class="clearfix">
            <div class="fl indicator_box" v-for="y in rightIndicatorList">
              <div>
                <p class="indicator_title">{{ y.name }}</p>
                <hr>
                <div class="indicator_item clearfix">
                  <div class="label_definition fl">定义：</div>
                  <div class="content_definition fr">{{ y.description }}</div>
                </div>
                <div class="indicator_item clearfix">
                  <div class="label_formula fl">公式：</div>
                  <div class="content_formula fr">{{ y.expression }}</div>
                </div>
                <p class="indicator-btn">
                  <a href="javascript:void(0);"  @click="openModifyDia(y.id)">编辑</a>
                </p>
              </div>
            </div>
          </div>
          <div class="load_more mr10" @click="getMore()"  v-show="taskStoreLoadMore&&rightIndicatorList.length">加载更多指标</div>
        </div>
        <!--启用停用指标库里的指标模态框-->
        <el-dialog size="tiny" title="启用指标" :visible.sync="dialogStop">
          <div class="dialog_title_line"></div>
          <p><span style="color: #999999;">指标名称：</span>{{ indTitle }}</p>
          <p style="margin-top: 20px;" >您是否确认启用这个指标？</p>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogStop = false">取消</el-button>
            <el-button type="primary"  @click="reOpenIndicator">启用</el-button>
          </div>
        </el-dialog>
        <!--指标添加、确认模态框-->
        <el-dialog :title="addTitle" :visible.sync="dialogAdd" @close="reset">
          <div class="dialog_title_line"></div>
          <el-form :model="indicatorForm" :rules="rules" ref="indicatorForm" :labelWidth="formLabelWidth">
            <el-form-item label="指标名称：" prop="name">
              <el-col :span="10">
                <el-input v-model="indicatorForm.name" placeholder="请输入指标名称"></el-input>
              </el-col>
              <el-col class="line" :span="1">&nbsp;</el-col>
              <el-col :span="13">
                <span>例：返工率</span>
              </el-col>
            </el-form-item>
            <el-form-item label="定义：" prop="description">
              <el-col :span="10">
                <el-input v-model="indicatorForm.description" type="textarea" placeholder="请输入定义"></el-input>
              </el-col>
              <el-col class="line" :span="1">&nbsp;</el-col>
              <el-col :span="13" style="line-height: 18px;padding: 9px 0;">
                <span>例：返工产品数占全部产品数量的比例</span>
              </el-col>
            </el-form-item>
            <el-form-item label="公式：" prop="expression">
              <el-col :span="10">
                <el-input v-model="indicatorForm.expression"></el-input>
              </el-col>
              <el-col class="line" :span="1">&nbsp;</el-col>
              <!--<el-col :span="12" style="line-height: 18px">-->
              <el-col :span="13">
                <span>例：返工产品数量/产品数量</span>
              </el-col>
            </el-form-item>
            <el-form-item label="百分比表示：" prop="percentage">
              <el-switch v-model="indicatorForm.percentage" on-color="#13ce66" off-color="#ff4949" on-text="是" off-text="否" :disabled="addTitle == '确认指标'"></el-switch>
            </el-form-item>
            <el-form-item label="计算因子：" prop="indicatorFactorsStr">
              <el-col :span="10">
                <el-input v-model="indicatorForm.indicatorFactorsStr"></el-input>
              </el-col>
              <el-col class="line" :span="1">&nbsp;</el-col>
              <el-col :span="13" style="line-height: 18px;">
                <span>例：返工产品数量；产品数量（计算因子之间用分号分隔）</span>
              </el-col>
            </el-form-item>
            <el-form-item label="评分标准："  prop="scoringStandard" style="line-height: 20px;">
              <el-col :span="10">
                <el-radio-group v-model="indicatorForm.scoreType">
                  <el-radio label="POSITIVE" class="radio-style" style="line-height: 22px;margin: 7px 0 5px;">
                    正向：实际值等于必保值得100分；实际值等于挑战值得110分；最低0分，<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;最高120分；实际绩效数值越大越好；<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1、实际值大于必保值且小于挑战值，在100分的基础上线性加分；<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2、实际值大于挑战值，在得110分的基础上双倍加分，最高120分；<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3、实际值小于必保值，在100分的基础上双倍减分，直至0分。
                  </el-radio>
                  <el-radio label="NEGATIVE" class="radio-style" style="line-height: 22px;margin: 5px 0;">
                    逆向：实际值等于必保值得100分；实际值等于挑战值得110分；最低0分，<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;最高120分；实际绩效数据越小越好；<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1、实际值小于必保值且大于挑战值，在100分的基础上线性加分；<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2、实际值小于挑战值，在得110分的基础上双倍加分，最高120分；<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3、实际值大于必保值，在100分的基础上双倍减分，直至0分。
                  </el-radio>
                  <el-radio label="VETO_SINGLE" class="radio-style" style="line-height: 22px;margin: 5px 0;">
                    单项否决：未发生，得100分；发生，得0分。
                  </el-radio>
                  <el-radio label="VETO_ALL" class="radio-style" style="line-height: 22px;margin: 5px 0;">
                    整体否决：未发生，得100分；发生，该项得0分，当期绩效得分为0分。
                  </el-radio>
                </el-radio-group>
              </el-col>
            </el-form-item>
            <el-form-item  label="对应标签：">
              <el-col :span="23">
                <div class="gray_bg">
                  <el-tabs class="tab_div" v-model="activeName" @tab-click="getChildLabel(activeName)">
                    <el-tab-pane v-for="d in parentLabels" :name="d.id">
                      <span slot="label" class="tab_label" v-text="d.name">我的行程</span>
                      <el-form class="ml15 mb15">
                        <el-form-item label="部门标签：" prop="" class="mb10">
                          <el-col :span="20">
                            <span class="tag_list all_tag"><span :class="{active_tag:d.checked}" @click="toggleChecked(d)">{{d.name}}</span></span>
                          </el-col>
                        </el-form-item>
                        <el-form-item label="岗位标签：" prop="">
                          <el-col :span="20">
                            <span class="tag_list all_tag child_tag">
                              <span :class="{active_tag:x.checked}" v-for="x in positionLabels" @click="toggleChecked(x)">{{x.name}}</span>
                            </span>
                          </el-col>
                        </el-form-item>
                      </el-form>
                    </el-tab-pane>
                  </el-tabs>
                </div>
                <div class="label_checked" v-if="checkedLabels.length">
                  <el-col :span="4">
                    <span>已选标签：</span>
                  </el-col>
                  <el-col :span="20">
                    <span class="tag_list child_tag ">
                    <span class="active_tag" v-for="x in checkedLabels">{{x.name}}</span></span>
                  </el-col>
                </div>
              </el-col>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button v-if="addTitle == '添加指标'" @click="dialogAdd = false">取消</el-button>
            <el-button type="primary" v-if="addTitle == '编辑指标'" @click="stopIndicator">停用</el-button>
            <el-button type="primary" @click="closeAddDia" :disabled="disBtn">确认</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import head from '../common/head.vue'
  import contnent_head from '../common/content_head.vue'


  module.exports = {
    data: function () {
      return {
        pageLoading: false,
        elementLoading: false,
        leftTitle: '停用指标库',
        rightTitle: '公司考核指标库',
        parentLabels: [],//一级标签列表
        positionLabels: [],//二级标签列表
        checkedLabels: [],//选中标签列表
        activeName: '',//当前选中的一级标签
        leftIndicatorList: [],
        rightIndicatorList: [],
        dialogStop: false,//停用考核指标库模态框显示或关闭
        dialogAdd: false,//添加、确认指标模态框显示或关闭
        indTitle: '',//启用指标的名称
        addTitle: '',//添加确认模态框的标题
        indicatorForm: {
          name: '',
          description: '',
          expression: '',
          indicatorFactors: '',
          indicatorFactorsStr: '',
          scoringStandard: '',
          scoreType: "POSITIVE",
          percentage: true,
          labels: [],
          percentage: false
        },
        currentPage:1,
        pageSize:12,
        taskStoreLoadMore:false,
        formLabelWidth: '100px',
        rules: {
          name:[
            { required: true, message: '请输入指标名称', trigger: 'blur' }
          ],
          description:[
            { required: true, message: '请输入指标定义', trigger: 'blur' }
          ],
          expression:[
            { required: true, message: '请输入指标公式', trigger: 'blur' }
          ],
          indicatorFactorsStr:[
            { required: true, message: '请输入指标计算因子', trigger: 'blur' }
          ]
        },
        currentId: '',//当前操作的指标的id
        keyword: ''
      }
    },
    computed: {
      userInfo:function () {
        return this.$store.state.userInfo;
      },
      disBtn: function () {
        if(this.indicatorForm.name&&this.indicatorForm.description&&this.indicatorForm.expression&&this.indicatorForm.indicatorFactorsStr){
          return false;
        }else{
          return true;
        }
      }

    },
    methods: {
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
      getMore:function () {
//        this.pageSize+=12;
        this.elementLoading = true;
        this.currentPage++;
        this.getComIndicators();
      },
      //打开启用指标模态框
      openEnableDia: function (val,id) {
        var _com = this;
        _com.indTitle = val;
        _com.dialogStop = true;
        _com.currentId = id;
      },
      //打开添加指标模态框
      openAddDia: function () {
        var _com = this;
        _com.checkedLabels = [];
        for (var i = 0; i < _com.positionLabels.length; i++) {
            _com.positionLabels[i].checked = false;
        }
        _com.dialogAdd = true;
        _com.addTitle = '添加指标';
        _com.indicatorForm.name = '';
        _com.indicatorForm.description = '';
        _com.indicatorForm.expression = '';
        _com.indicatorForm.indicatorFactorsStr = '';
        _com.indicatorForm.scoringStandard = '';
      },
      //打开编辑指标模态框
      openModifyDia: function (id) {
        var _com = this;
        _com.checkedLabels = [];
        _com.dialogAdd = true;
        _com.addTitle = '编辑指标';
        _com.currentId = id;
        _com.getIndDetail();
        _com.getChildLabel(_com.activeName);
      },
      //关闭添加和编辑指标对话框
      closeAddDia: function () {
        var _com = this;
        if (_com.addTitle == "添加指标") {
            _com.addComIndicator();
        } else if (_com.addTitle == "编辑指标") {
          _com.modifyComIndicator();

        }
      },
      //搜索公司指标库里的指标
      indicatorSearch: function () {
        var _com = this;
        _com.currentPage = 1;
        _com.rightIndicatorList = [];
        _com.keyword = _com.keyword.replace(/[&\|\\\*^%$￥#@\-\/]/g,"");
        _com.getComIndicators();
      },
      //清空指标搜索框
      clearSearch: function () {
        var _com = this;
        _com.currentPage = 1;
        _com.keyword ='';
        _com.rightIndicatorList = [];
        _com.getComIndicators();
      },
      //获取公司考核指标库
      getComIndicators:function () {
        var _com=this,
          data={
            term: _com.keyword,
            page:this.currentPage,
            pageSize:12
          };
        if (_com.currentPage == 1) {
          _com.pageLoading=true;
        }
        _com.$http.post(common.projectPath+'sys/indicator/queryIndicatorByName',data,{
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            if (data.data) {
              _com.rightIndicatorList = _com.rightIndicatorList.concat(data.data);
              for (var i = 0; i < _com.rightIndicatorList.length; i++) {
                var list = _com.rightIndicatorList[i].indicatorFactors;
                var factorStr = '';
                for (var j = 0; j < list.length; j++) {
                  factorStr += list[j].name + ';';
                }
              }
            }
            if(_com.pagination(data.page,data.pageSize,data.total))
            {
              _com.taskStoreLoadMore=true;
            }
            else _com.taskStoreLoadMore=false;

            _com.$nextTick(function () {
              setTimeout(function () {
                _com.pageLoading=false;
                _com.elementLoading=false;
                _com.$nextTick(function () {
                  _com.resetHeight();
                });
              },500);
            });
          }else {
            _com.$message.error(data.message);
          }
        })
      },
      //获取hr停用指标库
      getStopUseIndicators:function () {
        var _com=this;
        _com.leftIndicatorList = [];
        _com.$http.get(common.projectPath+'sys/indicator/queryStopInds',{
          parmas:{}
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            if (data.data) {
              _com.leftIndicatorList = data.data;
            }
          }else {
            _com.$message.error(data.message);
          }
        })
      },
      //查询指标详情
      getIndDetail: function () {
        var _com = this;
        _com.checkedLabels = [];
        _com.$http.get(common.projectPath+'sys/indicator/detail/' + _com.currentId).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.checkedLabels = data.data.labels;
            for (var i = 0; i < _com.checkedLabels.length; i++) {
              for (var j = 0; j < _com.positionLabels.length; j++) {
                if (_com.checkedLabels[i].id == _com.positionLabels[j].id) {
                  _com.positionLabels[j].checked = true;
                }
              }
            }
            var arr = data.data.indicatorFactors,factorStr = '';
            for (var i = 0; i < arr.length; i++) {
              if (arr[i] !== "") {
                factorStr += arr[i].name + ';';
              }
            }
            data.data.indicatorFactorsStr = factorStr;
            _com.indicatorForm = data.data;
            _com.getParentLabel();
          }else {
            _com.$message.error(data.message);
          }
        })
      },
      //启用停用指标库里的指标
      reOpenIndicator: function () {
        var _com = this;
        _com.$http.get(common.projectPath+'sys/indicator/openIndicator/' + _com.currentId).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.dialogStop = false;
            _com.getStopUseIndicators();
            _com.getComIndicators();
          }else {
            _com.$message.error(data.message);
          }
        })
      },
      //停用公司考核指标库里的指标
      stopIndicator: function () {
        var _com = this;
        _com.$http.get(common.projectPath+'sys/indicator/stopIndicator/' + _com.currentId).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.dialogAdd = false;
            _com.getStopUseIndicators();
            _com.getComIndicators();
          }else {
            _com.$message.error(data.message);
          }
        })
      },
      //添加公司指标库里的指标
      addComIndicator: function () {
        var _com = this;
        _com.indicatorForm.name = _com.indicatorForm.name.replace(/[&\|\\\*^%$￥#@\/]/g,"");
        _com.indicatorForm.expression = _com.indicatorForm.expression.replace(/\s/g, "");
        _com.indicatorForm.labels = _com.checkedLabels;
        var factorArr = _com.indicatorForm.indicatorFactorsStr.split(/[;；]/);
        var factorJSONArr = [];
        for (var i = 0; i < factorArr.length; i++) {
          if (factorArr[i] !== "") {
            factorJSONArr.push({name: factorArr[i]});
          }
        }
        _com.indicatorForm.indicatorFactors = factorJSONArr;
        _com.$http.post(common.projectPath+'sys/indicator/save', _com.indicatorForm).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.dialogAdd = false;
            _com.getComIndicators();
          }else {
            _com.$message.error(data.message);
          }
        })
      },
      //编辑公司指标库里的指标
      modifyComIndicator: function () {
        var _com = this;
        _com.indicatorForm.name = _com.indicatorForm.name.replace(/[&\|\\\*^%$￥#@\/]/g,"");
        _com.indicatorForm.expression = _com.indicatorForm.expression.replace(/\s/g, "");
        _com.indicatorForm.labels = _com.checkedLabels;
        var factorArr = _com.indicatorForm.indicatorFactorsStr.split(/[;；]/);
        var factorJSONArr = [];
        for (var i = 0; i < factorArr.length; i++) {
          if (factorArr[i] !== "") {
            factorJSONArr.push({name: factorArr[i]});
          }
        }
        _com.indicatorForm.indicatorFactors = factorJSONArr;
        _com.indicatorForm.id = _com.currentId;
        _com.$http.post(common.projectPath+'sys/indicator/update', _com.indicatorForm).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.dialogAdd = false;
            _com.getComIndicators();
          }else {
            _com.$message.error(data.message);
          }
        })
      },
      //获取一级标签
      getParentLabel: function () {
        var _com=this;
        _com.$http.get(common.projectPath+'sys/label/getParentLabel',{
          parmas:{}
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            if (data.data) {
              _com.activeName = data.data[0].id;
            }
            for(var i=0;i<data.data.length;i++)
            {
              data.data[i].checked=false;
            }
            if (_com.checkedLabels) {
              for (var i = 0; i < _com.checkedLabels.length; i++) {
                for (var j = 0; j < data.data.length; j++) {
                  if (_com.checkedLabels[i].id == data.data[j].id) {
                    data.data[j].checked = true;
                  }
                }
              }
            }
            _com.parentLabels=data.data;
            _com.getChildLabel(_com.activeName);
          }else {
            _com.$message.error(data.message);
          }
        })
      },
      //获取二级标签
      getChildLabel: function (id,checkedIds) {
        var _com=this;
        _com.positionLabels = [];
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
            if (_com.checkedLabels) {
              for (var i = 0; i < _com.checkedLabels.length; i++) {
                for (var j = 0; j < data.data.length; j++) {
                  if (_com.checkedLabels[i].id == data.data[j].id) {
                    data.data[j].checked = true;
                  }
                }
              }
            }
            _com.positionLabels=data.data;
          }else {
            _com.$message.error(data.message);
          }
        })
      },
      //操作标签选中、取消
      toggleChecked:function (label) {
        var _com = this;
        label.checked = !label.checked;
        if (label.checked == true) {
          _com.checkedLabels.push(label);
        } else {
          for (var i = 0; i < _com.checkedLabels.length; i++) {
            if (_com.checkedLabels[i].id == label.id) {
              var index = _com.checkedLabels.indexOf(_com.checkedLabels[i]);
              _com.checkedLabels.splice(index,1);
            }
          }
        }

      },
      reset: function () {
      var _com = this;
        _com.$refs.indicatorForm.resetFields();
        for (var i = 0; i < _com.checkedLabels.length; i++) {
          _com.checkedLabels[i].checked = false;
        }
      },
      resetHeight:function () {
        var content_width=$('.department_box').width(),li=$('.department_box .indicator_box'),
          col=Math.floor(content_width/270),row=Math.ceil(li.length/col);
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
    mounted: function () {
      var _com = this;
      _com.pageLoading = true;
      if (this.$store.state.userInfo.id) {
//        _com.userId = this.$store.state.userInfo.id;
      }
      _com.getComIndicators();
      _com.getParentLabel();
      _com.getStopUseIndicators();
    },
    components: {
      'page-head': head,
      'content_head': contnent_head,
    }
  }
</script>

<style lang="scss">

</style>

<template>
  <div class="wrapper indicateManage" >
    <page-head></page-head>
    <div class="contnet-wrapper">
      <!--<content_head></content_head>-->
      <content_head show-menu="true"></content_head>
      <div class="content_content clearfix" v-loading.fullscreen="pageLoading" >
         <div class="fl default_box" v-if="userInfo.ruleId != 'EMPLOYEE'" v-loading="elementLoading" >
        <!-- <div class="fl default_box"> -->
          <p class="default_title" v-text="leftTitle">预设指标库</p>
          <el-input placeholder="请输入指标名称" icon="circle-close" v-model="keyword" :on-icon-click="clearSearch" style="width: 78%;"></el-input>
          <el-button type="primary" icon="search" @click="indicatorSearch" style="width: 20%;"></el-button>
          <p class="no_data_tip" v-if="leftIndicatorList.length == 0" style="margin-top: 10px">暂无数据</p>
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
              <a href="javascript: void(0)" v-if="x.hasAdded !== 1 && userInfo.ruleId != 'EMPLOYEE'" @click="openCheckDia(x.id)">移入部门考核指标库</a>
            </p>
          </div>
           <a href="javascript:;" class="load_more" @click="getMore()"  v-show="indicatorLoadMore&&leftIndicatorList.length">加载更多指标</a>
        </div>
        <div class="department_box clearfix">
          <div class="clearfix">
            <p class="department_title fl">
              <span v-if="userInfo.ruleId == 'EMPLOYEE'">我的考核指标库</span>
              <span v-else>部门考核指标库</span>
            </p>
            <p class="clearfix fr add_icon" style="width: 90px;cursor: pointer;padding-right: 10px;" @click="openAddDia" v-if="userInfo.ruleId != 'EMPLOYEE'">
              <img src="../../assets/img/plus.png" alt="" class=" fl" width="20" height="20">
              <span class="fr">添加指标</span>
            </p>
          </div>
          <p class="no_data_tip" v-if="rightIndicatorList.length == 0">暂无数据</p>
          <div class="fl indicator_box" v-for="y in rightIndicatorList">
            <div>
              <p class="indicator_title">{{ y.name }}</p>
              <hr>
              <div class="indicator_item clearfix">
                <div class="label_definition fl">定义：</div>
                <div class="content_formula fr" v-bind:class="{'font-gray': y.status == 'N' }">{{ y.description }}</div>
              </div>
              <div class="indicator_item clearfix">
                <div class="label_formula fl">公式：</div>
                <div class="content_formula fr" v-bind:class="{'font-gray': y.status == 'N' }">{{ y.expression }}</div>
              </div>
              <div class="indicator_item clearfix" v-if="userInfo.ruleId != 'EMPLOYEE' && userInfo.ruleId != 'HR' && y.revieweStatus != 'approved' && y.revieweStatus != 'fillin' && y.revieweStatus != 'fillover'">
                <div class="label_formula fl">状态：</div>
                <div class="content_formula fr" style="color: red;">{{ y.revieweStatus | indicator_status }}</div>
              </div>
              <p class="indicator-btn" v-if="userInfo.ruleId == 'EMPLOYEE'">
                <a href="javascript:void(0);" @click="openCheckDia(y.id)">查看详情</a>
              </p>
              <p class="indicator-btn" v-if="(userInfo.ruleId == 'HR' || userInfo.ruleId == 'MANAGER' || userInfo.ruleId == 'BOSS') && (y.revieweStatus == 'approved' || y.revieweStatus == 'fillin' || y.revieweStatus == 'fillover')">
                <a href="javascript:void(0);" v-if="y.status == 'Y'" @click="openStopDia(y.name,y.id)">停用考核指标</a>
                <span class="font-gray" v-if="y.status == 'N'">已冻结该指标</span>
                <a href="javascript:void(0);" v-if="y.status == 'N'" @click="openEnableDia(y.name,y.id)">启用</a>
              </p>
            </div>
          </div>
        </div>
        <!--停用考核指标库模态框-->
        <el-dialog size="tiny" :title="markSureTitle" :visible.sync="dialogStop">
          <div class="dialog_title_line"></div>
          <p><span style="color: #999999;">指标名称：</span>{{ stopTitle }}</p>
          <p style="margin-top: 20px;" v-if="makeSureDia" >您是否确认停用这个指标？</p>
          <p style="margin-top: 20px;" v-if="!makeSureDia" >您是否确认启用这个指标？</p>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogStop = false">取消</el-button>
            <el-button type="primary" v-if="makeSureDia" @click="closeStopDia">停用</el-button>
            <el-button type="primary" v-if="!makeSureDia" @click="closeEnableDia">启用</el-button>
          </div>
        </el-dialog>
        <!--指标添加、确认模态框-->
        <el-dialog :title="addTitle" :visible.sync="dialogAdd" @close="reset">
          <div class="dialog_title_line"></div>
          <el-form :model="indicatorForm" :rules="rules" ref="indicatorForm" :labelWidth="formLabelWidth">
            <el-form-item label="指标名称："  prop="name">
              <el-col :span="10" v-if="addTitle != '确认指标' && addTitle != '指标详情'">
                <el-input v-model="indicatorForm.name" placeholder="请输入指标名称"></el-input>
              </el-col>
              <span v-text="indicatorForm.name" v-if="addTitle == '确认指标' || addTitle == '指标详情'"></span>
              <el-col class="line" :span="1" v-if="addTitle != '确认指标' && addTitle != '指标详情'">&nbsp;</el-col>
              <el-col :span="13" v-if="addTitle != '确认指标' && addTitle != '指标详情'">
                <span>例：返工率</span>
              </el-col>
            </el-form-item>
            <el-form-item label="定义："  prop="description">
              <el-col :span="10" v-if="addTitle != '确认指标' && addTitle != '指标详情'">
                <el-input v-model="indicatorForm.description" type="textarea" placeholder="请输入定义"></el-input>
              </el-col>
              <span v-text="indicatorForm.description" v-if="addTitle == '确认指标' || addTitle == '指标详情'"></span>
              <el-col class="line" :span="1" v-if="addTitle != '确认指标' && addTitle != '指标详情'">&nbsp;</el-col>
              <el-col :span="13" style="line-height: 18px;padding: 9px 0;" v-if="addTitle != '确认指标' && addTitle != '指标详情'">
                <span>例：返工产品数占全部产品数量的比例</span>
              </el-col>
            </el-form-item>
            <el-form-item label="公式："  prop="expression">
              <el-col :span="10" v-if="addTitle != '确认指标' && addTitle != '指标详情'">
                <el-input v-model="indicatorForm.expression"></el-input>
              </el-col>
              <span v-text="indicatorForm.expression" v-if="addTitle == '确认指标' || addTitle == '指标详情'"></span>
              <el-col class="line" :span="1" v-if="addTitle != '确认指标' && addTitle != '指标详情'">&nbsp;</el-col>
              <!--<el-col :span="12" style="line-height: 18px">-->
              <el-col :span="13" v-if="addTitle != '确认指标' && addTitle != '指标详情'">
                <span>例：返工产品数量/产品数量</span>
              </el-col>
            </el-form-item>
            <el-form-item label="百分比表示：" prop="percentage">
              <el-switch v-model="indicatorForm.percentage" on-color="#13ce66" off-color="#ff4949" on-text="是" off-text="否" :disabled="addTitle == '确认指标' || addTitle == '指标详情'"></el-switch>
            </el-form-item>
            <el-form-item label="计算因子："  prop="indicatorFactorsStr">
              <el-col :span="10" v-if="addTitle != '确认指标' && addTitle != '指标详情'">
                <el-input v-model="indicatorForm.indicatorFactorsStr"></el-input>
              </el-col>
              <span v-text="indicatorForm.indicatorFactorsStr" v-if="addTitle == '确认指标' || addTitle == '指标详情'"></span>
              <el-col class="line" :span="1" v-if="addTitle != '确认指标' && addTitle != '指标详情'">&nbsp;</el-col>
              <el-col :span="13" style="line-height: 18px;" v-if="addTitle != '确认指标' && addTitle != '指标详情'">
                <span>例：返工产品数量；产品数量（计算因子之间用分号分隔）</span>
              </el-col>
            </el-form-item>
            <el-form-item label="评分标准："  prop="scoringStandard" style="line-height: 20px;">
              <!--<el-col :span="10">-->
                <el-radio-group v-model="indicatorForm.scoreType" v-if="addTitle == '添加指标'">
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
                <span v-if="(addTitle == '确认指标' || addTitle == '指标详情') && indicatorForm.scoreType == 'POSITIVE'">
                  正向：实际值等于必保值得100分；实际值等于挑战值得110分；最低0分，<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;最高120分；实际绩效数值越大越好；<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1、实际值大于必保值且小于挑战值，在100分的基础上线性加分；<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2、实际值大于挑战值，在得110分的基础上双倍加分，最高120分；<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3、实际值小于必保值，在100分的基础上双倍减分，直至0分。
                </span>
                <span v-if="(addTitle == '确认指标' || addTitle == '指标详情') && indicatorForm.scoreType == 'NEGATIVE'">
                  负向：实际值等于必保值得100分；实际值等于挑战值得110分；最低0分，<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;最高120分；实际绩效数据越小越好；<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1、实际值小于必保值且大于挑战值，在100分的基础上线性加分；<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2、实际值小于挑战值，在得110分的基础上双倍加分，最高120分；<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3、实际值大于必保值，在100分的基础上双倍减分，直至0分。
                </span>
                <span v-if="(addTitle == '确认指标' || addTitle == '指标详情') && indicatorForm.scoreType == 'VETO_SINGLE'">
                  单项否决：未发生，得100分；发生，得0分。
                </span>
                <span v-if="(addTitle == '确认指标' || addTitle == '指标详情') && indicatorForm.scoreType == 'VETO_ALL'">
                  整体否决：未发生，得100分；发生，该项得0分，当期绩效得分为0分。
                </span>
              <!--</el-col>-->
            </el-form-item>
            <!-- <el-form-item v-if="userInfo.ruleId == 'HR'" label="对应标签："> -->
            <el-form-item v-if='userInfo.ruleId == "HR" && addTitle != "确认指标" && addTitle != "指标详情"' label="对应标签：">
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
                            <span class="tag_list child_tag ">
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
              <span class="tag_list child_tag" v-if="addTitle == '确认指标' || addTitle == '指标详情'">
                <span class="active_tag" v-for="x in checkedLabels">{{x.name}}</span>
              </span>
            </el-form-item>
            <el-form-item label="对应标签：" v-if="addTitle == '确认指标' || addTitle == '指标详情'">
              <span class="tag_list child_tag" v-if="checkedLabels.length !== 0">
                <span class="active_tag" v-for="x in checkedLabels">{{x.name}}</span>
              </span>
              <span v-else>暂无标签</span>
            </el-form-item>
            <el-form-item v-if='userInfo.ruleId != "HR" && userInfo.ruleId != "BOSS" && addTitle == "添加指标"' label="审核人：" style="margin-bottom: 0;">
              <el-col :span="10">
                <span>{{ revieweManName }}</span>
                <!--王芈-->
              </el-col>
            </el-form-item>
            <el-form-item v-if='userInfo.ruleId != "HR" && addTitle == "添加指标"' label="复核人：" style="margin-bottom: 0;">
              <el-col :span="10">
                <span>{{ repeatRevieweManName }}</span>
                <!--HR-李灿-->
              </el-col>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogAdd = false">取消</el-button>
            <el-button type="primary" @click="closeAddDia" :disabled="disBtn" v-if="addTitle == '添加指标'">确认</el-button>
            <el-button type="primary" @click="closeAddDia" v-if="addTitle == '确认指标' || addTitle == '指标详情'">确认</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import "../../filter/commonFilter"
import head from '../common/head.vue'
import contnent_head from '../common/content_head.vue'


module.exports = {
    data: function () {
      return {
        keyword: '',//指标搜索关键字
        pageLoading: false,
        elementLoading: false,
        leftTitle: '预设指标库',
        // rightTitle: '部门考核指标库',
        parentLabels: [],//一级标签列表
        positionLabels: [],//二级标签列表
        checkedLabels: [],//选中标签列表
        activeName: '',//当前选中的一级标签
        leftIndicatorList: [],
        rightIndicatorList: [],
        makeSureDia: true,//控制确认模态框显示停用还是启用
        dialogStop: false,//停用考核指标库模态框显示或关闭
        dialogAdd: false,//添加、确认指标模态框显示或关闭
        detailMode: '',//指标新增-add、编辑-modify、审核-check
        markSureTitle: '',//确认模态框的标题
        stopTitle: '',//停用考核指标库模态框标题
        addTitle: '',//添加确认模态框的标题
        indicatorForm: {
          name: '',
          description: '',
          expression: '',
          indicatorFactors: '',
          indicatorFactorsStr: '',
          // scoringStandard: '',
          scoreType: 'POSITIVE',
          percentage: true,
          labels: '',
          percentage: false//是否使用百分比
        },
        currentPage:1,
        pageSize:9,
        indicatorLoadMore:false,
        revieweMan: '',
        revieweManName: '',
        repeatRevieweMan: '',
        repeatRevieweManName: '',
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
          indicatorFactors:[
            { required: true, message: '请输入指标计算因子', trigger: 'blur' }
          ]
        },
//        userId: '',
        currentId: '',//当前操作的指标的id
      }
    },
  computed: {
    userInfo:function () {
      var _com = this;
      if (this.$store.state.userInfo.id) {
        _com.getDepIndicators();
        if (this.$store.state.userInfo.ruleId != "HR") {
          _com.getReview();
          _com.getAudits();
        }
        if (this.$store.state.userInfo.ruleId == 'EMPLOYEE') {
          $("div.department_box").css('margin-left','0px');
        }
      } else {
          //刷新华computed先获取不到userInfo，所以会执行else，但是获取到之后因为computed监控userInfo，获取到之后就会执行if部分语句
      }
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
      this.elementLoading = true;
//      this.pageSize+=9;
      this.currentPage++;
      this.getPreIndicators();
    },
    //打开停用指标模态框
    openStopDia: function (val,id) {
      var _com = this;
      _com.stopTitle = val;
      _com.dialogStop = true;
      _com.makeSureDia = true;
      _com.currentId = id;
      _com.markSureTitle = '停用考核指标';
    },
    //关闭停用指标模态框
    closeStopDia: function () {
      var _com = this;
      _com.dialogStop = false;
      _com.stopDepIndicator(_com.currentId);
    },
    //打开启用指标模态框
    openEnableDia: function (val,id) {
      var _com = this;
      _com.stopTitle = val;
      _com.dialogStop = true;
      _com.makeSureDia = false;
      _com.currentId = id;
      _com.markSureTitle = '启用考核指标';
    },
    //关闭启用指标模态框
    closeEnableDia: function () {
      var _com = this;
      _com.dialogStop = false;
      _com.openDepIndicator(_com.currentId);
    },
    //打开添加指标模态框
    openAddDia: function () {
      var _com = this;
      _com.dialogAdd = true;
      _com.addTitle = '添加指标';
      _com.indicatorForm.name = '';
      _com.indicatorForm.description = '';
      _com.indicatorForm.expression = '';
      _com.indicatorForm.indicatorFactorsStr = '';
      _com.indicatorForm.scoringStandard = '';
      _com.checkedLabels = [];
    },
    //关闭添加指标模态框
    closeAddDia: function () {
      var _com = this;
      if (_com.addTitle == '添加指标') {
        _com.addDepIndicator();
      } else if (_com.addTitle == '指标详情') {
        _com.dialogAdd = false;
      } else{
        _com.moveToDepIndicators();
      }
    },
    //打开审核指标模态框
    openCheckDia: function (id) {
      var _com = this;
      _com.dialogAdd = true;
      _com.addTitle = '确认指标';
      if (this.$store.state.userInfo.ruleId === 'EMPLOYEE') {
        _com.addTitle = '指标详情';
      }
      _com.currentId = id;
      _com.disBtn = false;
      _com.getChildLabel(_com.activeName);
      _com.getIndDetail();
    },
    //搜索指标
    indicatorSearch: function () {
      var _com = this;
      _com.currentPage = 1;
      _com.leftIndicatorList = [];
      _com.keyword = _com.keyword.replace(/[&\|\\\*^%$￥#@\-\/]/g,"");
      _com.getPreIndicators();
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
            factorStr += arr[i].name + ';';
          }
          data.data.indicatorFactorsStr = factorStr;
          _com.indicatorForm = data.data;
          _com.getParentLabel();
        }else {
          _com.$message.error(data.message);
        }
      })
    },
    //清空搜索框
    clearSearch: function () {
      var _com = this;
      _com.currentPage = 1;
      _com.leftIndicatorList = [];
      _com.keyword = '';
      _com.getPreIndicators();
    },
    //获取预设指标库
    getPreIndicators:function () {
      var _com = this;
      var data={
        term: _com.keyword,
        page:this.currentPage,
        pageSize:9
      };
      _com.$http.post(common.projectPath+'sys/indicator/queryIndicatorByName',data,{
      }).then(function (data) {
        data=data.body;
        if(data.code=='SUCCESS'){
          if (data.data) {
            _com.leftIndicatorList = _com.leftIndicatorList.concat(data.data);
            for (var i = 0; i < _com.rightIndicatorList.length; i++) {
              for (var j = 0; j < _com.leftIndicatorList.length; j++) {
                if (_com.rightIndicatorList[i].originId == _com.leftIndicatorList[j].id) {
                  _com.leftIndicatorList[j].hasAdded = 1;
                }
              }
            }
          }
          _com.$nextTick(function () {
            setTimeout(function () {
              _com.elementLoading=false;
            },500);
          });
          if(_com.pagination(data.page,data.pageSize,data.total))
          {
            _com.indicatorLoadMore=true;
          }
          else _com.indicatorLoadMore=false;
        }else {
          _com.$message.error(data.message);
        }
      })
    },
    //获取部门考核指标库
    getDepIndicators:function () {
      var _com=this,url;
      if (this.$store.state.userInfo.ruleId == 'EMPLOYEE') {
        url = 'sys/indicator/queryEmpIndicator';
      } else {
        url = 'sys/indicator/queryDepIndicator/departmentIndicator';
      }
      _com.rightIndicatorList = [];
      _com.$http.get(common.projectPath+url,{
        parmas:{}
      }).then(function (data) {
        data=data.body;
        if(data.code=='SUCCESS'){
          if (data.data) {
            _com.rightIndicatorList = data.data;
            for (var i = 0; i < _com.rightIndicatorList.length; i++) {
              for (var j = 0; j < _com.leftIndicatorList.length; j++) {
                if (_com.rightIndicatorList[i].originId == _com.leftIndicatorList[j].id) {
                  _com.leftIndicatorList[j].hasAdded = 1;
                }
              }
            }
          }
          _com.$nextTick(function () {
            setTimeout(function () {
              _com.pageLoading=false;
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
    //预设指标库移入部门考核指标库
    moveToDepIndicators: function () {
      var _com = this;
      var idVo = {
          empId: _com.$store.state.userInfo.id,
          indId: _com.currentId
      };
      _com.$http.post(common.projectPath+'sys/indicator/moveToDepInd', idVo).then(function (data) {
        data=data.body;
        if(data.code=='SUCCESS'){
          _com.dialogAdd = false;
          _com.getDepIndicators();
        }else {
          _com.$message.error(data.message);
        }
      })
    },
    //部门考核指标库里的指标停用
    stopDepIndicator: function () {
      var _com = this;
      _com.$http.get(common.projectPath+'sys/indicator/stopDepInd/' + _com.currentId,{
        parmas:{}
      }).then(function (data) {
        data=data.body;
        if(data.code=='SUCCESS'){
          _com.getDepIndicators();
        }else {
          _com.$message.error(data.message);
        }
      })
    },
    //部门考核指标库里的指标启用
    openDepIndicator: function () {
      var _com = this;
      _com.$http.get(common.projectPath+'sys/indicator/openDepInd/' + _com.currentId,{
        parmas:{}
      }).then(function (data) {
        data=data.body;
        if(data.code=='SUCCESS'){
          _com.getDepIndicators();
        }else {
          _com.$message.error(data.message);
        }
      })
    },

    //新增指标
    addDepIndicator: function () {
      var _com = this;
      _com.indicatorForm.name = _com.indicatorForm.name.replace(/[&\|\\\*^%$￥#@\/]/g,"");
      _com.indicatorForm.revieweMan = _com.revieweMan;
      _com.indicatorForm.repeatRevieweMan = _com.repeatRevieweMan;
      if (this.$store.state.userInfo.ruleId != 'BOSS' && this.$store.state.userInfo.ruleId != 'HR') {
        if (_com.indicatorForm.revieweMan == '') {
          _com.$message.error('审核人不能为空！');
          return false;
        }
      } else {
        _com.indicatorForm.revieweMan = '';
      }
      if (this.$store.state.userInfo.ruleId != 'HR') {
        if (_com.indicatorForm.repeatRevieweMan == '') {
          _com.$message.error('复核人不能为空！');
          return false;
        }
      } else {
        _com.indicatorForm.revieweMan = '';
        _com.indicatorForm.repeatRevieweMan = '';
      }
      _com.indicatorForm.expression = _com.indicatorForm.expression.replace(/\s/g, "");
      var factorArr = _com.indicatorForm.indicatorFactorsStr.split(/[;；]/);
      var factorJSONArr = [];
      for (var i = 0; i < factorArr.length; i++) {
          if (factorArr[i] != "") {
            factorJSONArr.push({name: factorArr[i]});
          }
      }
      _com.indicatorForm.indicatorFactors = factorJSONArr;
      _com.indicatorForm.labels = _com.checkedLabels;
      _com.$http.post(common.projectPath+'sys/indicator/saveDepartmentInd', _com.indicatorForm).then(function (data) {
        data=data.body;
        if(data.code=='SUCCESS'){
          _com.dialogAdd = false;
          _com.getDepIndicators();
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
          for(var i=0;i<data.data.length;i++){
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
          for(var i=0;i<data.data.length;i++){
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
    //获取审核人
    getReview: function () {
      var _com = this;
      _com.$http.get(common.projectPath+'sys/employee/queryReviews/' + _com.$store.state.userInfo.id,{
        parmas:{}
      }).then(function (data) {
        data=data.body;
        if(data.code=='SUCCESS'){
          if (data.data.length != 0) {
            _com.revieweMan = data.data[0].id;
            _com.revieweManName = data.data[0].realName;
          } else {
            if (this.$store.state.userInfo.ruleId != "BOSS") {
              _com.$message.error('未获取审核人');
              _com.revieweMan = '';
              _com.revieweManName = '未获取审核人';
            } else {
              _com.revieweMan = '';
              _com.revieweManName = '无需审核';
            }
          }
        }else {
          _com.$message.error(data.message);
        }
      })
    },
    //获取复核人
    getAudits: function () {
      var _com = this;
      _com.$http.get(common.projectPath+'sys/employee/queryAudits',{
        parmas:{}
      }).then(function (data) {
        data=data.body;
        if(data.code=='SUCCESS'){
          if (data.data.length != 0) {
            _com.repeatRevieweMan = data.data[0].id;
            _com.repeatRevieweManName = data.data[0].realName;
          } else {
            _com.$message.error('未获取复核人');
            _com.repeatRevieweMan = '';
            _com.repeatRevieweManName = '未获取复核人';
          }
        }else {
          _com.$message.error(data.message);
        }
      })
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
    _com.getPreIndicators();
    if (this.$store.state.userInfo.id) {
      _com.getDepIndicators();
      if (this.$store.state.userInfo.ruleId != "HR") {
        _com.getReview();
        _com.getAudits();
      }
      if (this.$store.state.userInfo.ruleId == 'EMPLOYEE') {
        $("div.department_box").css('margin-left','0px');
      }
    }
    _com.getParentLabel();

  },
  components: {
    'page-head': head,
    'content_head': contnent_head,
  }
}
</script>

<style lang="scss">

</style>

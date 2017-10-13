<!--目标系统图编辑组件-->
<template>
  <div class="map_content">
    <p class="map_name">{{mapData.name}}<i class="fa fa-question-circle-o ml5 cursor_pointer icon_color"></i> <span
      class="return_prv" @click="goIndex">返回上一级<i
      class="fa fa-arrow-circle-right ml5"></i></span></p>
    <div class="map_table clearfix" :class="{transitioned:transitioned}">
      <div class="map_table_warpper edit_table">
        <div class="tt_" v-loading="edit_loading">
          <tree-grid-map-edit
            :columns="edit_columns" :tree-structure="true"
            :data-source="dataSource" tree-type="no"
            expand-icon="fa fa-angle-down" normal-icon="fa fa-angle-right"
            icon-color="" expand-icon-color="#3DA8F5"
            button-index="sex,age" :button-click="addIndicator" :map-type="mapData.type" @edit="editIndicator" @remove="removeIndicator"
          >
          </tree-grid-map-edit>
        </div>
      </div>
      <div class="map_table_warpper look_table">
        <div class="tt_">
          <div class="time_bar ">
            <div class="time_bar_warpper clearfix">
              <div class="year clearfix">
                <a href="javascript:;" :class="{active:active_time===x}" v-for="x in time_bar_data.year" v-text="x"
                   @click="clickTimeBar('year',null,x)">2017</a>
              </div>
              <div class="quarter clearfix">
                <span class="dot"></span>
                <a href="javascript:;" :class="{active:active_time===x}" v-for="x in time_bar_data.quarter" v-text="x"
                   @click="clickTimeBar('quarter',x.replace('Q',''),x)">Q1</a>
                <span class="dot"></span>
              </div>
              <div class="month clearfix">
                <span class="dot"></span>
                <a href="javascript:;" :class="{active:active_time===x}" v-for="x in time_bar_data.month" v-text="x"
                   @click="clickTimeBar('month',x,x)">01</a>
                <span class="dot"></span>
              </div>
            </div>

          </div>
          <tree-grid-map
            :columns="look_columns" :tree-structure="true"
            :data-source="dataSource" tree-type="no"
            expand-icon="fa fa-angle-down" normal-icon="fa fa-angle-right"
            icon-color="" expand-icon-color="#3DA8F5"
            button-index="sex,name,age" :button-click="add"
          >
          </tree-grid-map>
        </div>
      </div>
      <div class="transition_button" @click="transitioned=!transitioned;clickTimeBar('year', null ,mapData.time);" :transitioned="transition">
        <span v-if="!transitioned">查看目标系统图</span>
        <span v-if="transitioned">编辑目标系统图</span>
      </div>
    </div>
    <div class="btn btn-primary" style="width: 156px;margin: 20px auto;display: block;" @click="commitMap">提交</div>
    <el-dialog v-model="show_modal" title='' @open="clearForm('form')" size="large"
               :close-on-click-modal="false" :modal-append-to-body="true">
      <span slot="title">
        <span style="font-weight: bold">{{model_type}}</span>
        <span style="font-size: 13px;margin-left: 5px;">{{model_sub_type}}</span>
      </span>
      <div class="dialog_title_line"></div>
      <div class="edit_indicate_content clearfix">
        <indicator-will :url-obj="urlObj" :reload="reload" dialog-size='full' v-if="show_modal" :disabled="disabled_will"
                        @checkIndicator="checkIndicator"></indicator-will>
        <div class="indicator_checked ml20 p20">
          <div class="checked_title mb20">
            <span class="fl">已选择指标</span>
          </div>
          <div class="indicator_detail" v-if="indicatorChecked.id">
            <div class="indicator_detail_">
              <p class="clearfix">
              <span class="fl">{{indicatorChecked.name}}
                <el-popover placement="right" title="指标使用场景" width="200" trigger="hover" :content="indicatorChecked.remark">
                  <i class="fa fa-question-circle-o ml5 cursor_pointer icon_color" slot="reference"></i>
                </el-popover>
                <span v-if="btnShow" class="recommand ml10">推荐</span>
                <span v-if="btnShow" class="defined ml10">自定义</span>
              </span>
              </p>
              <p><span class="detail_label">标签：</span>
                <span class="warn_tag label_tag mr5" v-for="x in indicatorChecked.labels">{{ x.name }}</span>
              </p>
              <p><span class="detail_label">指标定义：</span><span v-text="indicatorChecked.description"></span></p>
              <p><span class="detail_label">数据公式：</span><span v-text="indicatorChecked.expression"></span></p>
              <div class="indicator_table">
                <!--单元格高度设置table_cell,宽度设置table_column-->
                <div class="table">
                  <div class="table_head">
                    <div class="table_column" style="width: 56px;">
                      <div class="table_cell">
                        <div class="cell">年度</div>
                      </div>
                    </div>
                    <div class="table_column" style="width: 85px;">
                      <div class="table_cell">
                        <div class="cell">目标值</div>
                      </div>
                    </div>
                    <div class="table_column" style="width: 85px;">
                      <div class="table_cell">
                        <div class="cell">挑战值</div>
                      </div>
                    </div>
                    <div class="table_column" style="width: 56px;">
                      <div class="table_cell">
                        <div class="cell">季度</div>
                      </div>
                    </div>
                    <div class="table_column" style="width: 85px;">
                      <div class="table_cell">
                        <div class="cell">目标值</div>
                      </div>
                    </div>
                    <div class="table_column" style="width: 85px;">
                      <div class="table_cell">
                        <div class="cell">挑战值</div>
                      </div>
                    </div>
                    <div class="table_column" style="width: 56px;">
                      <div class="table_cell">
                        <div class="cell">月度</div>
                      </div>
                    </div>
                    <div class="table_column" style="width: 85px;">
                      <div class="table_cell">
                        <div class="cell">目标值</div>
                      </div>
                    </div>
                    <div class="table_column" style="width: 86px;">
                      <div class="table_cell">
                        <div class="cell">挑战值</div>
                      </div>
                    </div>
                  </div>
                  <div class="table_body">
                    <!--年度-->
                    <div class="table_column" style="width: 56px;">
                      <div class="table_cell" style="height: 468px;">
                        <div class="cell" v-text="time_bar_data.year[0]">2017</div>
                      </div>
                    </div>
                    <div class="table_column" style="width: 85px;">
                      <div class="table_cell" style="height: 468px;">
                        <div class="cell"><input type="text" placeholder="请输入" v-model="year_values[0].targetValue">
                        </div>
                      </div>
                    </div>
                    <div class="table_column" style="width: 85px;">
                      <div class="table_cell" style="height: 468px;">
                        <div class="cell"><input type="text" placeholder="请输入" v-model="year_values[0].challengeValue">
                        </div>
                      </div>
                    </div>
                    <!--年度-->
                    <!--季度-->
                    <div class="table_column" style="width: 56px;">
                      <div class="table_cell" style="height: 117px;" v-for="x in time_bar_data.quarter">
                        <div class="cell">{{x}}</div>
                      </div>
                    </div>
                    <div class="table_column" style="width: 85px;">
                      <div class="table_cell" style="height: 117px;" v-for="x in quarter_values">
                        <div class="cell"><input type="text" placeholder="请输入" v-model="x.targetValue"></div>
                      </div>
                    </div>
                    <div class="table_column" style="width: 85px;">
                      <div class="table_cell" style="height: 117px;" v-for="x in quarter_values">
                        <div class="cell"><input type="text" placeholder="请输入" v-model="x.challengeValue"></div>
                      </div>
                    </div>
                    <!--季度-->
                    <!--月度-->
                    <div class="table_column" style="width: 56px;">
                      <div class="table_cell" style="height: 39px;" v-for="x in time_bar_data.month">
                        <div class="cell">{{x}}</div>
                      </div>
                    </div>
                    <div class="table_column" style="width: 85px;">
                      <div class="table_cell" style="height: 39px;" v-for="x in month_values">
                        <div class="cell"><input type="text" placeholder="请输入" v-model="x.targetValue"></div>
                      </div>
                    </div>
                    <div class="table_column" style="width: 86px;">
                      <div class="table_cell" style="height: 39px;" v-for="x in month_values">
                        <div class="cell"><input type="text" placeholder="请输入" v-model="x.challengeValue"></div>
                      </div>
                    </div>
                    <!--月度-->
                  </div>
                </div>
              </div>
            </div>
            <p class="indicator_btn cursor_pointer" @click="removeIndicator(addedIndicatorDetail.id,'modal')">
              将指标移出已选择指标区域
            </p>
          </div>
          <p v-else class="no_data_tip">无选择指标</p>
        </div>
      </div>
      <el-button type="primary" :disabled="!indicatorChecked.id" @click="setIndicator"
                 style="width: 156px;margin: 30px auto 0;display: block;">提交
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
  import head from '../common/head.vue'
  import content_head from '../common/content_head.vue'
  import TreeGridMapEdit from '../common/treeTable/vue/TreeGridMapEdit.vue'
  import TreeGridMap from '../common/treeTable/vue/TreeGridMap.vue'
  import indicator_box from  './indicator.vue'
  import indicatorWill from  './indicatorWill.vue'

  module.exports = {
    data: function () {
      return {
        transitioned: false,
        edit_loading:false,
        show_modal: false,
        model_type: '总经理室-总经理-周至',
        model_sub_type: '在市场领先业务领域的指标',

        urlObj: {
          url: 'sys/indicator/list-by-business-domain',
          params: {"businessDomainId": "",objectiveFormId:'',positionId:'',employeeId:''}
        },
        mapRowData: {},//点击到的系统图某一行数据
        addedIndicatorDetail: {},//刚刚添加的指标对应的detail对象
        addDialogContorl: false,//添加指标对话框显隐
        dateSelectVisible: false,//日期控件显隐
        indicatorChecked: {},//已选择指标
        currentDomain:{},//打开弹窗的当前领域

        form: {
          name: ''
        },
        rule: {},
        edit_columns: [],
        look_columns: [],
        dataSource: [],
        active_time:'',
//        time_bar_data: {
//          year: [this.mapData.time],
//          quarter: ['Q1', 'Q2', 'Q3', 'Q4'],
//          month: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
//        },
        year_values: [
          {
            "periodType": "By_year",
            "targetValue": '',
            "challengeValue": ''
          },
        ],
        quarter_values: [
          {
            "periodType": "By_quarter",
            "periodValue": 1,
            "targetValue": '',
            "challengeValue": ''
          },
          {
            "periodType": "By_quarter",
            "periodValue": 2,
            "targetValue": '',
            "challengeValue": ''
          },
          {
            "periodType": "By_quarter",
            "periodValue": 3,
            "targetValue": '',
            "challengeValue": ''
          },
          {
            "periodType": "By_quarter",
            "periodValue": 4,
            "targetValue": '',
            "challengeValue": ''
          }
        ],
        month_values: [
          {
            "periodType": "By_month",
            "periodValue": 1,
            "targetValue": '',
            "challengeValue": ''
          },
          {
            "periodType": "By_month",
            "periodValue": 2,
            "targetValue": '',
            "challengeValue": ''
          },
          {
            "periodType": "By_month",
            "periodValue": 3,
            "targetValue": '',
            "challengeValue": ''
          },
          {
            "periodType": "By_month",
            "periodValue": 4,
            "targetValue": '',
            "challengeValue": ''
          },
          {
            "periodType": "By_month",
            "periodValue": 5,
            "targetValue": '',
            "challengeValue": ''
          },
          {
            "periodType": "By_month",
            "periodValue": 6,
            "targetValue": '',
            "challengeValue": ''
          },
          {
            "periodType": "By_month",
            "periodValue": 7,
            "targetValue": '',
            "challengeValue": ''
          },
          {
            "periodType": "By_month",
            "periodValue": 8,
            "targetValue": '',
            "challengeValue": ''
          },
          {
            "periodType": "By_month",
            "periodValue": 9,
            "targetValue": '',
            "challengeValue": ''
          },
          {
            "periodType": "By_month",
            "periodValue": 10,
            "targetValue": '',
            "challengeValue": ''
          },
          {
            "periodType": "By_month",
            "periodValue": 11,
            "targetValue": '',
            "challengeValue": ''
          },
          {
            "periodType": "By_month",
            "periodValue": 12,
            "targetValue": '',
            "challengeValue": ''
          }
        ],
        reload: [false],
      }
    },
    computed: {
      time_bar_data: function(){
        return {
          year: [this.mapData.time],
          quarter: ['Q1', 'Q2', 'Q3', 'Q4'],
          month: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
        };
      },
      transition: function () {
        if (this.transitioned) {
          $('.look_table').css({display: 'block', right: '0px'});
          $('.transition_button').css({right: ($('.map_table').width() - 40) + 'px'});
//          this.clickTimeBar('year', null ,this.mapData.time);
        }
        else {
          $('.look_table').css({display: 'block', right: '-' + ($('.map_table').width()) + 'px'});
          $('.transition_button').css({right: (0) + 'px'});
        }
        return this.transitioned;
      },
      disabled_will:function () {
        if(this.indicatorChecked.id)
          return true;
        else return false;
      }
    },
    props: {
      mapData: {}//从index模块传来的系统图的大概数据(不是详细数据)
    },
    methods: {
      goIndex: function () {
        this.$emit('go_index')
      },
      getDomainList: function () {
        var _com = this;
        _com.$http.post(common.projectPath + 'sys/domain/list', {}, {}).then(function (data) {
          data = data.body;
          if (data.code !== 'SUCCESS') {
            _com.$message.error(data.message);
          } else {

            if (!data.data)
              data.data = [];
            _com.edit_columns = _com.initTableHead('edit', data.data);
            _com.look_columns = _com.initTableHead('look', data.data);
            _com.getMapDetail();
          }
        })
      },
      initTableHead: function (type, data) {
        var fixed_column = [
            {
              name: '部门',
              width: 220,
              fixed: true,
            },
            {
              name: '岗位',
              width: 150,
              fixed: true,
            },
            {
              name: '姓名',
              width: 120,
              fixed: true,
            }
          ], column = [],
          sub_column = [
            {
              name: '指标',
              width: 150,
            },
            {
              name: '目标值',
              width: 80,
            },
            {
              name: '挑战值',
              width: 80,
            }
          ];
        for (var i = 0; i < data.length; i++) {
          data[i].width = 310;
          if (type === 'look') {
            data[i].children = sub_column;
          }
        }
        column = fixed_column.concat(data);
        return column;
      },
      getMapDetail: function () {
        this.edit_loading=true;
        var _com = this, data = {
          formTime: '2017-08-01 00:00:00'
        };
        _com.$http.post(common.projectPath + 'sys/objective/detail/' + this.mapData.id, {}, {}).then(function (data) {
          data = data.body;
          if (data.code !== 'SUCCESS') {
            _com.$message.error(data.message);
          } else {
            _com.dataSource = data.data.grids;
            _com.mapData.id=data.data.id;
            setTimeout(function () {
              _com.edit_loading=false;
            },300);
          }
        })
      },
      setSameIndicator:function (data) {
//        for(var i=0;i<data.length;i++)
//        {
//
//        }
      },
      add: function () {

      },
      modify: function () {

      },
      /**
       * 点击新增指标
       * */
      addIndicator: function (rowData, index) {
        this.mapRowData = rowData;
        // 获取领域id
        this.currentDomain=this.edit_columns[index];
        this.urlObj.params.businessDomainId = this.edit_columns[index].id;
        this.urlObj.params.objectiveFormId = this.mapData.id;
        this.urlObj.params.positionId = rowData.objects[0].id;
        this.urlObj.params.employeeId = rowData.objects[0].employee.id;
        this.resetIndicator();
        this.setDialogTitle();
        this.show_modal = true;
      },
      /**
       * 点击指标编辑指标,渲染指标数据和对应的目标挑战值
       * */
      editIndicator: function (detail,rowData,index) {
        this.mapRowData = rowData;
        this.currentDomain=this.edit_columns[index];
        this.urlObj.params.businessDomainId = this.edit_columns[index].id;
        this.urlObj.params.objectiveFormId = this.mapData.id;
        this.urlObj.params.positionId = rowData.objects[0].id;
        this.urlObj.params.employeeId = rowData.objects[0].employee.id;
        this.resetIndicator();
        this.setDialogTitle();
        this.addedIndicatorDetail=detail;
        var values=detail.values?detail.values:[];
        this.indicatorChecked = detail.indicator;//设置已选指标
        for(var i=0;i<values.length;i++)//设置已填值
        {
          if(values[i].periodType.indexOf('year')>-1)//设置年的值
          {
            this.year_values[0].challengeValue=values[i].challengeValue;
            this.year_values[0].targetValue=values[i].targetValue;
          }
          else if(values[i].periodType.indexOf('quarter')>-1)//设置季度的值
          {
            for(var j=0;j<this.quarter_values.length;j++)
            {
              if(this.quarter_values[j].periodValue==values[i].periodValue)
              {
                this.quarter_values[j].challengeValue=values[i].challengeValue;
                this.quarter_values[j].targetValue=values[i].targetValue;
              }
            }
          }
          else//设置月度的值
          {
            for(j=0;j<this.month_values.length;j++)
            {
              if(this.month_values[j].periodValue==values[i].periodValue)
              {
                this.month_values[j].challengeValue=values[i].challengeValue;
                this.month_values[j].targetValue=values[i].targetValue;
              }
            }
          }
        }
        this.show_modal = true;
      },
      setIndicator: function () {
        var _com = this, data = {
          id: this.addedIndicatorDetail.id,
          values: this.year_values.concat(this.quarter_values).concat(this.month_values)
        };
        // 验证目标值和挑战值是否都填或者都未填
        // 验证年度
        for(var i=0;i<this.year_values.length;i++)
        {
          if((this.year_values[i].challengeValue===''&&this.year_values[i].targetValue!=='')||(this.year_values[i].challengeValue!==''&&this.year_values[i].targetValue===''))
          {
            _com.$message({
              type: 'error',
              message: '年度目标值和挑战值填写完整',
              duration:8000,
              showClose:true
            });
            return ;
          }
        }
        // 验证季度
        for(i=0;i<this.quarter_values.length;i++)
        {
          if((this.quarter_values[i].challengeValue===''&&this.quarter_values[i].targetValue!=='')||(this.quarter_values[i].challengeValue!==''&&this.quarter_values[i].targetValue===''))
          {
            _com.$message({
              type: 'error',
              message: '季度目标值和挑战值填写完整',
              duration:8000,
              showClose:true
            });
            return ;
          }
        }
        // 验证月度
        for(i=0;i<this.month_values.length;i++)
        {
          if((this.month_values[i].challengeValue===''&&this.month_values[i].targetValue!=='')||(this.month_values[i].challengeValue!==''&&this.month_values[i].targetValue===''))
          {
            _com.$message({
              type: 'error',
              message: '月度目标值和挑战值填写完整',
              duration:8000,
              showClose:true
            });
            return ;
          }
        }
        _com.$http.post(common.projectPath + 'sys/objective/set-indicator', data, {}).then(function (data) {
          data = data.body;
          if (data.code !== 'SUCCESS') {
            _com.$message.error(data.message);
          } else {
            _com.$message.success('提交成功');
            _com.getMapDetail();
            _com.show_modal = false;
          }
        })
      },
      /**
       * 点击移入指标
       * */
      checkIndicator: function (indicator) {
        var _com = this, data = {
          "objectiveFormId": this.mapData.id,
          "indicatorId": indicator.id,
          "departmentId": this.mapRowData.id,
          "postionId": this.mapRowData.objects[0].id,
          "employeeId": this.mapRowData.objects[0].employee.id,
          "businessDomainId": this.urlObj.params.businessDomainId
        };
        _com.$http.post(common.projectPath + 'sys/objective/add-indicator', data, {}).then(function (data) {
          data = data.body;
          if (data.code !== 'SUCCESS') {
            _com.$message.error(data.message);
          } else {
            _com.$message.success('指标已移入');
            _com.$set(_com.reload, 0, true);
            _com.indicatorChecked = indicator;
            _com.addedIndicatorDetail = data.data;
            _com.getMapDetail();
          }
        })
      },
      /**
       * 点击移出指标
       * */
      removeIndicator: function (id,type) {
        var _com = this, data = {
          "id": id
        };
        _com.$http.post(common.projectPath + 'sys/objective/del-indicator', data, {}).then(function (data) {
          data = data.body;
          if (data.code !== 'SUCCESS') {
            _com.$message.error(data.message);
          } else {
            _com.$message.success('指标已移出');
            _com.resetIndicator();
            _com.getMapDetail();
            if(type==='modal')//弹窗移除指标执行
            {
              _com.$set(_com.reload, 0, true);
            }

          }
        })
      },
      clickTimeBar: function (type, value ,origin_value) {
        var _com = this;
        this.active_time=origin_value;
        common.eachTree(this.dataSource, function (node) {
          var domains = node.objects[0].sortedFormDetails, details ,detailCountArr=[];
          domains = domains ? domains : [];
          for (var i = 0; i < domains.length; i++) {
            if (domains[i]&&domains[i].sortdetails) {
              details = domains[i].sortdetails;
              detailCountArr.push(details.length);
              for (var j = 0; j < details.length; j++) {
                for (var k = 0; k < details[j].values.length; k++) {
                  if (details[j].values[k].periodType.indexOf(type) > -1) {
                    if (details[j].values[k].periodValue == value) {
                      _com.$set(node.objects[0].sortedFormDetails[i].sortdetails[j], 'value', {
                        challengeValue: details[j].values[k].challengeValue,
                        targetValue: details[j].values[k].targetValue
                      })
                    }
                  }
                }
              }
            }
            else
            {
              detailCountArr.push(0);
            }
          }
          //根据detailCountArr,把节点下的每个领域的指标数量设为一置
          var max=Array.max(detailCountArr);
          for (i = 0; i < domains.length; i++) {

            if (domains[i]) {
              _com.$set(domains[i], 'sortdetail',new Array(max));

            }
            else
            {
              _com.$set(domains, i,{sortdetail:new Array(max)});
            }
//            else {
              for(var m=0;m<max;m++) {

                if (domains[i].sortdetails&&domains[i].sortdetails[m])
                {
                  _com.$set(domains[i].sortdetail, m, domains[i].sortdetails[m]);

                }
                else {
                  _com.$set(domains[i].sortdetail, m, {});
                }
              }
//            }
          }
//          console.log('节点所有领域包含指标的数目:'+detailCountArr)
        });
        console.log(this.dataSource);
      },
      commitMap:function () {
        var _com = this;
        _com.$http.get(common.projectPath + 'sys/objective/commit/' + this.mapData.id, {params:{}}).then(function (data) {
          data = data.body;
          if (data.code !== 'SUCCESS') {
            _com.$message.error(data.message);
          } else {
            _com.$message.success('目标系统图提交成功');
            _com.goIndex();
          }
        })
      },
      /**
       * 清空对应的表单模型
       * @param formName 表单的模型名字
       */
      clearForm: function (formName) {
        if (this.$refs[formName]) {
          this.$refs[formName].resetFields();
        }
//        this.indicatorChecked = {};
      },
      resetIndicator:function () {
        this.indicatorChecked = {};
        this.year_values= [
          {
            "periodType": "By_year",
            "targetValue": '',
            "challengeValue": ''
          }
        ];
        this.quarter_values= [
          {
            "periodType": "By_quarter",
            "periodValue": 1,
            "targetValue": '',
            "challengeValue": ''
          },
          {
            "periodType": "By_quarter",
            "periodValue": 2,
            "targetValue": '',
            "challengeValue": ''
          },
          {
            "periodType": "By_quarter",
            "periodValue": 3,
            "targetValue": '',
            "challengeValue": ''
          },
          {
            "periodType": "By_quarter",
            "periodValue": 4,
            "targetValue": '',
            "challengeValue": ''
          }
        ];
        this.month_values=[
          {
            "periodType": "By_month",
            "periodValue": 1,
            "targetValue": '',
            "challengeValue": ''
          },
          {
            "periodType": "By_month",
            "periodValue": 2,
            "targetValue": '',
            "challengeValue": ''
          },
          {
            "periodType": "By_month",
            "periodValue": 3,
            "targetValue": '',
            "challengeValue": ''
          },
          {
            "periodType": "By_month",
            "periodValue": 4,
            "targetValue": '',
            "challengeValue": ''
          },
          {
            "periodType": "By_month",
            "periodValue": 5,
            "targetValue": '',
            "challengeValue": ''
          },
          {
            "periodType": "By_month",
            "periodValue": 6,
            "targetValue": '',
            "challengeValue": ''
          },
          {
            "periodType": "By_month",
            "periodValue": 7,
            "targetValue": '',
            "challengeValue": ''
          },
          {
            "periodType": "By_month",
            "periodValue": 8,
            "targetValue": '',
            "challengeValue": ''
          },
          {
            "periodType": "By_month",
            "periodValue": 9,
            "targetValue": '',
            "challengeValue": ''
          },
          {
            "periodType": "By_month",
            "periodValue": 10,
            "targetValue": '',
            "challengeValue": ''
          },
          {
            "periodType": "By_month",
            "periodValue": 11,
            "targetValue": '',
            "challengeValue": ''
          },
          {
            "periodType": "By_month",
            "periodValue": 12,
            "targetValue": '',
            "challengeValue": ''
          }
        ];
      },
      setDialogTitle:function () {
        this.model_type=this.mapRowData.title+'-'+
          this.mapRowData.objects[0].name+'-'+
          this.mapRowData.objects[0].employee.realName;
        this.model_sub_type='在'+this.currentDomain.name+'业务领域的指标';
      },
      transition: function () {
        this.transitioned = !this.transitioned;
        if (this.transitioned) {
          $('.look_table').css({display: 'block', right: '0px'});
          $('.transition_button').css({right: ($('.map_table').width() - 40) + 'px'});
        }
        else {
          $('.look_table').css({display: 'block', right: '0px'});
          $('.transition_button').css({right: ($('.map_table').width() - 40) + 'px'});
        }
      },
      setMapHeight: function () {
        var height = $(window).height();
        $('.map_table').height((height - 330) + 'px');
      },
      setMapBodyHeight: function (table) {
        var table_body = $(table + ' .el-table__body-wrapper'),
          table_head = $(table + ' .el-table__header-wrapper'),
          map_table = $('.map_table');
        table_body.height((map_table.height() - table_head.height() - 1) + 'px');
        // 设置浮动表格的内容高度
        $(table + ' .el-table__fixed-body-wrapper').height((map_table.height() - table_head.height() - 1) + 'px');
      },
      addListen: function (table) {
        $(table + ' .el-table__fixed-body-wrapper').scroll(function () {
          var top = $(this).scrollTop();
          $(table + ' .el-table__body-wrapper').scrollTop(top);
        })
        $(table + ' .el-table__body-wrapper').scroll(function () {
          var top = $(this).scrollTop();
//          console.log(top);
          $(table + ' .el-table__fixed-body-wrapper').scrollTop(top);
        })
      },
      initScroll: function (table) {
        $(table + ' .el-table__body-wrapper').jScrollPane({autoReinitialise: true})
          .on("jsp-scroll-y", function (event, scrollPositionY, isAtTop, isAtBottom) {

          });
        $(table + ' .el-table__fixed-body-wrapper').jScrollPane({autoReinitialise: true})
          .on("jsp-scroll-y", function (event, scrollPositionY, isAtTop, isAtBottom) {

          });
        // 重设浮动区域的高度,原先的高度是el-table根据浏览器默认滚动条设置的
//        $('.edit_table'+' .el-table__fixed').height(($('.map_table').height()-6)+'px');
      }
    },
    mounted: function () {
      var _com = this;
      this.getDomainList();
      this.$nextTick(function () {
//        _com.setMapHeight();
//        _com.setMapBodyHeight('.edit_table');
//        _com.addListen('.edit_table');
//        _com.initScroll('.edit_table');
//        $('.look_table').css({display:'block',right:'-'+$('.map_table').width()+'px'})

//        $(".el-table__row:first-child td:first-child").attr('rowspan',len+1);
      })

    },
    components: {
      'page_head': head,
      'content_head': content_head,
      'tree-grid-map-edit': TreeGridMapEdit,
      'tree-grid-map': TreeGridMap,
      'indicator_box': indicator_box,
      'indicator-will': indicatorWill
    }
  }
</script>

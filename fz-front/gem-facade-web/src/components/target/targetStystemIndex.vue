<!--目标系统图组件-->
<template>
  <div class="">
    <div class="head_time_select">
      <i class="fa fa-angle-double-left mr20" aria-hidden="true" @click="yearClick(-1)"></i>
      <el-dropdown @command="changeYear">
        <span class="el-dropdown-link" :yearStr="yearStr"><span>{{selected_year}}</span></span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="y in yearArr" :command="y.toString()">{{y}}</el-dropdown-item>
          <!--<el-dropdown-item>2015</el-dropdown-item>-->
          <!--<el-dropdown-item>2018</el-dropdown-item>-->
        </el-dropdown-menu>
      </el-dropdown>
      <i class="fa fa-angle-double-right ml20" aria-hidden="true" @click="yearClick(1)"></i>
    </div>
    <div class="system_map">
      <div class="map_center">
        <div class="map_card new_map" @click="newMap">
          <img src="../../assets/img/plus.png" alt="">
          <p>创建目标系统图</p>
        </div>
        <div class="map_card map" v-if="mapData.id">
          <div class="map_des">
            <div class="title" v-text="mapData.name">2017年公司目标系统图</div>
            <p>版本号：<span v-text="mapData.version">V1.0</span></p>
            <p>制图人：<span v-text="mapData.name">V1.0</span></p>
            <p>制图时间：<span v-text="mapData.updatedAt">V1.0</span></p>
          </div>
          <div class="map_op">
            <i class="fa fa-pencil-square-o" @click="editMap(mapData.id)"></i>
            <i class="fa fa-history" @click="getHistoryVersion"></i>
            <i class="fa fa-thumbs-o-up" ></i>
            <span class="warn_tag fr mt5"><i class="fa fa-info-circle"></i>{{mapStatusEnum[mapData.status]}}</span>
          </div>
        </div>
        <!--<div class="map_card map">-->
          <!--<div class="map_des">-->
            <!--<div class="title">2017年公司目标系统图</div>-->
            <!--<p>版本号：<span>V1.0</span></p>-->
            <!--<p>制图人：<span>V1.0</span></p>-->
            <!--<p>制图时间：<span>V1.0</span></p>-->
          <!--</div>-->
          <!--<div class="map_op">-->
            <!--<i class="fa fa-pencil-square-o" ></i>-->
            <!--<i class="fa fa-history" ></i>-->
            <!--<i class="fa fa-thumbs-o-up" ></i>-->
            <!--<span class="warn_tag fr mt5"><i class="fa fa-info-circle"></i>已生效</span>-->
          <!--</div>-->
        <!--</div>-->
      </div>
    </div>
    <el-dialog v-model="show_modal" :title="mapData.name" @open="clearForm('form')" size="tiny" :close-on-click-modal="false">
      <div class="dialog_title_line"></div>
      <div class="map_edit_content">
        <img src="../../assets/img/map_bg.jpg" alt="" class="map_img">
        <p class="text-center">为{{map_type}}创建目标系统图</p>
        <el-form ref="form" :model="form"  :rules="rule"  v-if="model_type=='创建'">
          <el-form-item >
            <el-input v-model="form.remark" type="textarea" placeholder="请输入目标系统图简介"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!--<el-button type="primary" style="width: 100%">主要按钮</el-button>-->
      <div class="btn btn-primary mt10 mb10" style="width: 100%" @click="beginMap(2)">开始{{model_type}}目标系统图</div>
      <div class="btn btn-light" style="width: 100%">从其他目标系统图复制</div>
    </el-dialog>
    <el-dialog class="history_dialog" title="历史版本" v-model="historyVisible">
      <div class="dialog_title_line"></div>
      <div class="history_content clearfix">
        <div class="history_left fl">
          <el-steps :space="86" direction="vertical" :active="historyTarget.length - 1">
            <el-step v-for="step in historyTarget" >
              <div slot="description" class="history_card cursor_pointer" @click="showDerailModal(step.id)" :id="step.id">
                <p class="card_title clearfix">
                  版本号：<span class="pl5">{{ step.version }}</span>
                  <span class="warn_tag fr" :class="{warn_tag:step.status=='COMMITTED',stopuse_tag:step.status=='INIT'}"><i class="fa fa-info-circle"></i>{{mapStatusEnum[step.status]}}</span>
                </p>
                <p class="card_date">制图时间：<span class="pl5">{{ step.createdAt }}</span></p>
                <p class="card_date">生效时间：<span class="pl5">{{ step.committedAt }}</span></p>
              </div>
            </el-step>
          </el-steps>
        </div>
      </div>
    </el-dialog>
    <el-dialog class="history_detail" :title="history_detail_title" size="full" :visible.sync="historyDetailVisible">
      <div class="dialog_title_line"></div>
      <div class="map_table_warpper look_table" v-loading="map_loading">
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
          <tree-grid-map v-if="historyDetailVisible"
            :columns="look_columns" :tree-structure="true"
            :data-source="dataSource" tree-type="no"
            expand-icon="fa fa-angle-down" normal-icon="fa fa-angle-right"
            icon-color="" expand-icon-color="#3DA8F5"
            button-index="sex,name,age" :button-click="add"
          >
          </tree-grid-map>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import head from '../common/head.vue'
  import content_head from '../common/content_head.vue'
  import TreeGridMap from '../common/treeTable/vue/TreeGridMap.vue'

  module.exports = {
    data: function () {
      return {
        year:new Date().getFullYear(),
        selected_year:new Date().getFullYear(),
        show_modal:false,
        historyVisible:false,//控制历史版本对话框显隐
        historyTarget:[],
        historyDetailVisible:false,
        model_type:'',
        form:{
          remark:''
        },
        rule:{
//          remark:{required: true, message: '请输入目标系统图简介', trigger: 'blur'}
        },
        mapStatusEnum:{
          COMMITTED:"已生效",
          INIT:'未生效'
        },
        mapData: {},

        history_detail_title:'',
        map_loading:false,
        look_columns: [],
        dataSource: [],
        active_time:'',

      }
    },
    computed: {
      yearArr:function () {
        var arr=[];
        for(var i=0;i<5;i++)
        {
          arr.push(this.year);
          this.year++;
        }
        return arr;
      },
      yearStr:function () {
        return this.selected_year+'-12-31 11:59:59';
      },
      time_bar_data: function(){
        return {
          year: [this.mapData.time?this.mapData.time:''],
          quarter: ['Q1', 'Q2', 'Q3', 'Q4'],
          month: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
        };
      },
      map_type:function () {
        var type='';
        if(this.$store.state.userInfo.ruleId==='BOSS')
          type='公司';
        else if(this.$store.state.userInfo.ruleId==='MANAGER')
          type='部门';
        return type;
      },
      // 当前岗位的对象
      current_position:function () {
        return this.$store.state.userInfo.currentPostion;
      }
    },
    watch:{
      'selected_year':function () {
        this.getMapData(this.yearStr);
      }
    },
    methods: {
      newMap:function () {
        this.show_modal=true;
        this.toCreate();
        this.model_type='创建';
      },
      editMap:function (id) {
        this.show_modal=true;
        this.model_type='编辑';
      },
      beginMap:function (step) {
        var _com=this,data={
          formTime:this.yearStr
        };
        if(this.form.remark)
          data.remark=this.form.remark;
        if(this.model_type==='创建')
        {
          _com.$http.post(common.projectPath + 'sys/objective/create',data,{
          }).then(function (data) {
            data = data.body;
            if (data.code!=='SUCCESS') {
              _com.$message.error(data.message);
            } else {
              _com.$emit('go_edit',data.data)
            }

          })
        }
        else {
          _com.$emit('go_edit',_com.mapData)
        }
      },
      changeYear:function (command) {
        this.selected_year=command;
      },
      yearClick:function (offset) {
        this.selected_year+=offset;
        if(this.selected_year<parseInt(this.yearArr[0])||this.selected_year>parseInt(this.yearArr[4]))
        {
          this.selected_year-=offset;
        }
      },
      getMapData:function (year) {
        var _com=this,data={
          formTime:year
        };
        _com.$http.post(common.projectPath + 'sys/objective/current',data,{
        }).then(function (data) {
          data = data.body;
          if (data.code!=='SUCCESS') {
            _com.$message.error(data.message);
          } else {
            _com.mapData=data.data?data.data:{};

          }
        })
      },
      getHistoryVersion:function () {
        this.historyVisible=true;
        var _com=this,data={
          formTime:this.yearStr
        };
        _com.$http.post(common.projectPath + 'sys/objective/version/list',data,{
        }).then(function (data) {
          data = data.body;
          if (data.code!=='SUCCESS') {
            _com.$message.error(data.message);
          } else {
            _com.historyTarget=data.data;
          }

        })
      },
      showDerailModal:function (id) {
        var _com=this;
        this.history_detail_title=this.mapData.name+'V'+this.mapData.version+'版本';
        this.historyDetailVisible=true;
        this.$nextTick(function () {
          _com.getDomainList(id);
        });
      },
      getDomainList: function (id) {
        var _com = this;
        this.map_loading=true;
        _com.$http.post(common.projectPath + 'sys/domain/list', {}, {}).then(function (data) {
          data = data.body;
          if (data.code !== 'SUCCESS') {
            _com.$message.error(data.message);
          } else {

            if (!data.data)
              data.data = [];
            _com.look_columns = _com.initTableHead('look', data.data);
            _com.getMapDetail(id);
          }
        })
      },
      getMapDetail:function (id) {
        var _com=this;
        _com.$http.post(common.projectPath + 'sys/objective/history/detail/'+id,{},{
        }).then(function (data) {
          data = data.body;
          if (data.code!=='SUCCESS') {
            _com.$message.error(data.message);
          } else {
            _com.dataSource = data.data.grids;
            _com.clickTimeBar('year', null ,_com.time_bar_data.year[0]);
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

        _com.map_loading=false;
      },
      toCreate:function () {
        var _com=this,data={
          formTime:this.yearStr
        };
        _com.$http.post(common.projectPath + 'sys/objective/to-create',data,{
        }).then(function (data) {
          data = data.body;
          if (data.code!=='SUCCESS') {
            _com.$message.error(data.message);
          } else {
            _com.mapData=data.data;

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

        }
      }
    },
    mounted: function () {
      this.getMapData(this.yearStr);
    },
    components: {
      'page_head': head,
      'content_head': content_head,
      'tree-grid-map': TreeGridMap,
    }
  }
</script>

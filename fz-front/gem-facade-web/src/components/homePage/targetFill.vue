<!— ***模板  Created by limin on 2017/9/18—>
<template>
    <div class="strategy childTable targetFill">
      <div class="top_box" style="height: auto;">
        <div class="target_title" style="position: relative;">
          <span>工作事项/目标填报</span>
          <span class="return_btn mr20" @click="return_last"><i class="fa fa-arrow-circle-left fa-lg "></i> 返回上一级</span>
        </div>
        <div class="p20">
          <div class="head_time_select">
            <el-popover ref="popover" popper-class="head_time time_control" placement="bottom" title="" width="300" trigger="click" @hide="dateHide" v-model="dateSelectVisible">
            <span slot="reference" class="el-dropdown-link cursor_pointer">
              <i class="fa fa-angle-double-left mr20" aria-hidden="true"></i>
              <span >{{ headDate.originYear }}</span><span :class="{ pl30: headDate.originPeriod }">{{ headDate.originPeriod }}</span>
              <i class="fa fa-angle-double-right ml20" aria-hidden="true"></i>
            </span>
              <div class="date_year clearfix mb10">
                <i class="fa fa-angle-double-left mr20 fl" aria-hidden="true" @click="headDate.year--;"></i>
                <span>{{ headDate.year }} </span>
                <i class="fa fa-angle-double-right fr" aria-hidden="true" @click="headDate.year++;"></i>
              </div>
              <div class="divide_line divide_st"></div>
              <div class="date_quarter clearfix mt20 mb10">
                <span class="date_label fl">季度</span>
                <el-radio-group v-model="headDate.radioValue">
                  <el-radio-button label="Q1"></el-radio-button>
                  <el-radio-button label="Q2"></el-radio-button>
                  <el-radio-button label="Q3"></el-radio-button>
                  <el-radio-button label="Q4"></el-radio-button>
                </el-radio-group>
              </div>
              <div class="divide_line"></div>
              <div class="date_months clearfix mt20 mb20">
                <span class="date_label fl">月份</span>
                <el-radio-group v-model="headDate.radioValue">
                  <el-radio-button label="1月"></el-radio-button>
                  <el-radio-button label="2月"></el-radio-button>
                  <el-radio-button label="3月"></el-radio-button>
                  <el-radio-button label="4月"></el-radio-button>
                  <el-radio-button label="5月"></el-radio-button>
                  <el-radio-button label="6月"></el-radio-button>
                  <el-radio-button label="7月"></el-radio-button>
                  <el-radio-button label="8月"></el-radio-button>
                  <el-radio-button label="9月"></el-radio-button>
                  <el-radio-button label="10月"></el-radio-button>
                  <el-radio-button label="11月"></el-radio-button>
                  <el-radio-button label="12月"></el-radio-button>
                </el-radio-group>
              </div>
              <div class="btns clearfix" style="width: 260px;margin: 0px auto">
                <div class="btn btn-light fl" @click="clearSelect()">取消</div>
                <div class="btn btn-primary fr" @click="saveMonth()">确认</div>
              </div>
            </el-popover>
          </div>
          <el-table class="plan_map" height="100%" :data="tableData" border style="width: 100%;">
            <el-table-column prop="target" align="center" label="工作事项/目标" width="220"></el-table-column>
            <el-table-column prop="objectiveFormDetailValueText" align="center" label="来源" width="220">
              <template scope="scope">
                <div class="ml10 mr10" v-text="scope.row.objectiveFormDetailValueText"></div>
              </template>
            </el-table-column>
            <el-table-column prop="GS" align="center" label="是否列入GS" width="120">
              <template scope="scope">
                <div v-html="scope.row.GS"></div>
              </template>
            </el-table-column>
            <el-table-column prop="planSteps" align="center" label="计划内容" width="300">
              <template scope="scope">
                <div class="p10 borderDiv" style="text-align: left;" v-for="(item ,index) in scope.row.planSteps" v-text="index+1+'、'+item.content"></div>
              </template>
            </el-table-column>
            <el-table-column prop="charge" align="center" label="负责人" width="100">
            </el-table-column>
            <el-table-column prop="planSteps" align="center" label="完成时间节点" width="150">
              <template scope="scope">
                <div class="p10 borderDiv" v-for="(item ,index) in scope.row.planSteps">{{item.endTime | short_time}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="planSteps" align="center" label="完成情况" width="300">
              <template scope="scope">
                <div class="p10 borderDiv" v-for="(item ,index) in scope.row.planSteps">{{item.endTime | short_time}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="planSteps" align="center" label="实际完成时间" width="150">
              <template scope="scope">
                <div class="p10 borderDiv" v-for="(item ,index) in scope.row.planSteps">{{item.endTime | short_time}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="planSteps" align="center" label="操作" width="100">
              <template scope="scope">
                <!--<el-button type="text" style="color: #999;">查看附件</el-button>-->
                <span @click="show_modal=true" class="blue_btn">填报</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <el-dialog v-model="show_modal">
        <span slot="title">
          <span style="font-weight: bold">填报计划完成情况</span>
        </span>
        <div class="dialog_title_line"></div>
        <div class="mt10 mb10">
          <span class="gray-text">工作目标：</span>
          <span class="">接洽不低于8家此类材料供应商，获取供应商的资质资料</span>
        </div>
        <div class="mt10 mb20 pb20" style="border-bottom: 1px solid #D9D9D9">
          <span class="gray-text">完成日期节点：</span>
          <span class="">2017-08-28</span>
        </div>
        <el-form ref="form" :model="form" :rules="rules"  label-width="93px" label-position="left">
          <el-form-item label="完成日期：" prop="finishTime">
            <el-date-picker
              v-model="form.finishTime"
              type="date"
              placeholder="请选择完成日期"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="完成情况：" prop="finishState">
            <el-input type="textarea" v-model="form.finishState"  placeholder="请输入完成情况"></el-input>
          </el-form-item>
        </el-form>
        <div class="mt20 mb10">
          <span class="gray-text">添加附件：</span>
          <span class="blue_btn">点击添加</span>
        </div>
        <div slot="footer">
          <div class="btns clearfix" style="width: 260px;margin:0 auto 20px">
            <div class="btn btn-light fl" @click="show_modal=false">取消</div>
            <div class="btn btn-primary fr" @click="">确定</div>
          </div>
        </div>
      </el-dialog>
    </div>
</template>
<script>
    module.exports = {
      data:function () {
        return {
          form:{
            finishTime:'',
            finishState:''
          },
          headDate: {
            year: '',
            period: '',
            originYear: '',
            originPeriod: '',
            radioValue:''
          },//顶部日期
          show_modal:false,
          dateSelectVisible:false,//日期控件的显示与隐藏
          date: '',//要查看的日清表的日期
          tableData: [
            {
              target:'111',
              charge:'3333',
            }
          ],//计划表格
          rules:{
            finishState: [
              {required: true, message: '请填写完成情况', trigger: 'blur'}
            ],
            finishTime: [
              {required: true, message: '请选择完成时间', trigger: 'blur'}
            ],
          }
        }
      },
      computed: {
        year: function () {
          return this.$store.state.year;
        },
        text: function () {
          return this.$store.state.text;
        },
      },
      methods: {
        return_last:function () {
          this.$emit('getstep',1)
        },
        /**
         * 清空对应的表单模型
         * @param formName 表单的模型名字
         */
        clearForm:function (formName) {
          if(this.$refs[formName]){
            this.$refs[formName].resetFields();

          }
        },
        //设置查询的季度或月份
        setPeriod: function (val) {
          var _com = this;
          _com.headDate.period = val;
        },
        //日期控件隐藏事件
        dateHide: function () {
          var _com = this;
          _com.headDate.year = _com.headDate.originYear;
          _com.headDate.period = _com.headDate.originPeriod;
        },
        //日期控件确认事件
        getIndicatorList: function () {
          var _com = this;
          _com.headDate.originYear = _com.headDate.year;
          _com.headDate.originPeriod = _com.headDate.period;
          _com.dateSelectVisible = false;
        },
        //清除日期选择
        clearSelect:function () {
          this.headDate.radioValue='';
          this.dateSelectVisible=false;
        },
        //保存日期选择
        saveMonth:function () {
          this.headDate.originYear=this.headDate.year;
          this.headDate.originPeriod=this.headDate.radioValue;
          this.dateSelectVisible=false;
          this.$store.commit('setYear',this.headDate.year);
          this.$store.commit('setText',this.headDate.radioValue);
        },
      },
      mounted: function () {
        var _com=this;
        if(!_com.year){
          _com.$store.commit('setYear',new Date().getFullYear());
        }
        if(!_com.text){
          _com.$store.commit('setText',new Date().getMonth() + 1 + '月');
        }
        _com.headDate.originYear=_com.year;
        _com.headDate.originPeriod=_com.text;
        _com.headDate.year = _com.headDate.originYear;
        _com.headDate.period = _com.headDate.originPeriod;
        this.$nextTick(function () {
          quicker.returnTop();
        })
      },
    }
</script>
<style lang='scss'>

</style>

<!— ***模板  Created by limin on 2017/9/4—>
<template xmlns="http://www.w3.org/1999/html">
  <div class="indicator_box planManage myTarget map_content examine">
    <p class="clearfix bold_font">
        <span class="fl">2017年08月考核项目
        </span>
      <span class="stopuse_tag ml10"><i class="fa fa-info-circle"></i>未生效</span>
      <span class="mr20 ml40 f14" style="font-weight:normal;">KPI权重：80%</span>
      <span class="f14" style="font-weight: normal;">GS权重：20%</span>
      <span class="fr blue-text cursor_pointer return_top" @click="return_last"><i
        class="fa fa-arrow-circle-left fa-lg "></i> 返回上一级</span>
    </p>
    <p class="gray-text f12 mt5 mb10">版本号：<span class="ml10" v-text="checkDetail.version">V4.0</span></p>
    <div class="clearfix" style="position: relative;width:100%;">
      <div class="transition_wrapper" style="height: 550px;position: relative;overflow: hidden;"
           :class="{transitioned:transitioned}">
        <div class="plan_detail">
          <div class="add_plan mb10">
            <div class="blue-text cursor_pointer" @click="addExamine()"><i class="fa fa-plus-circle fa-lg "></i> 添加考核项目
            </div>
          </div>
          <div class="plan_content no_padding" style="position: relative;">
            <div class="clearfix" style="height: 32px;line-height: 32px;">
                    <span class=""><span class="gray-text">指标名称：</span>提高原辅材料的合格率
                      <el-popover placement="right" title="指标使用场景" width="200" trigger="hover" content="33333">
                        <i class="fa fa-question-circle-o ml5 cursor_pointer icon_color" slot="reference"></i>
                      </el-popover>
                      <span class="warn_tag mt5 ml10" style="background-color: #82C0EA;">KPI</span>
                      <span class="warn_tag mt5 ml10" style="background-color: #8DC1A0;">GS</span>
                      <span class="warn_tag mt5 ml5">上级分解</span>
                    </span>
              <div class="operate_btn operate_btns" style="top:0;right:10px">
                <el-button type="text" size="large" @click="deleteIndicator()"><i class="fa fa-trash fa-lg" aria-hidden="true"></i>
                </el-button>
                <el-button type="text" size="large" @click="editItem()"><i class="fa fa-edit fa-lg"
                                                                           aria-hidden="true"></i></el-button>
              </div>
            </div>
            <div class="clearfix mt10 mb10">
              <span class="gray-text fl">目标值：</span>
              <span class="fl mr30">58.60%</span>
              <span class="gray-text fl">挑战值：</span>
              <span class="fl mr30">58.60%</span>
              <span class="gray-text fl">权重：</span>
              <span class="fl">58.60%</span>
            </div>
            <div class="gray-text f12">来源：2017年08月目标系统图 V1.2</div>
            <div class="clearfix mt10 mb10">
              <span class="gray-text fl">评分标准：</span>
              <span class="fl mr30">必保目标与挑战目标间从90分到100分线性加分，达到挑战目标得110分封顶；低于必保目标加倍扣分，低于70%本项不得分。</span>
            </div>
          </div>
          <div v-for="i in checkList">
            <div class="plan_content">
              <p class="clearfix">
                    <span class="">提高原辅材料的合格率
                      <span class="warn_tag mt5 ml10" style="background-color: #82C0EA;">GS</span>
                      <span class="warn_tag mt5 ml5">上级分解</span>
                    </span>
                <span class="arrow_circle fr cursor_pointer" @click="planToggle(i)"><i class="fa icon_color"
                                                                                       v-bind:class="{'fa-angle-down': i.spread, 'fa-angle-up': !i.spread}"></i></span>
              </p>
              <div v-if="i.spread">
                <div class="clearfix mt10 pb10 mb10" style="border-bottom: 1px solid #F0F0F0">
                  <span class="gray-text fl">工作目标：</span>
                  <span class="fl">增加5家原辅材料的供应商</span>
                </div>
                <p class="gray-text mb10">实施步骤：</p>
                <el-steps :space="100" direction="vertical">
                  <el-step style="height: 36px">
                    <div slot="description">接洽不低于8家此类材料供应商，获取供应商的资质资料 <span class="gray-text ml30">2017-08-08 周峰</span>
                    </div>
                  </el-step>
                  <el-step style="height: 36px">
                    <div slot="description">接洽不低于8家此类材料供应商，获取供应商的资质资料 <span class="gray-text ml30">2017-08-08 周峰</span>
                    </div>
                  </el-step>
                  <el-step style="height: 36px">
                    <div slot="description">接洽不低于8家此类材料供应商，获取供应商的资质资料 <span class="gray-text ml30">2017-08-08 周峰</span>
                    </div>
                  </el-step>
                </el-steps>
                <div class="btns clearfix" style="width: 260px;margin: 0px auto">
                  <div class="btn btn-light fl" @click="">编辑行动计划</div>
                  <div class="btn btn-primary fr" @click="">取消此行动计划</div>
                </div>
              </div>

            </div>
            <div class="gray_content" v-if="i.spread">
              <div class="clearfix mb10">
                <span class="gray-text fl">我的目标：</span>
                <span class="fl">增加5家原辅材料的供应商</span>
              </div>
              <div class="clearfix">
                <span class="gray-text fl">策略名称：</span>
                <span class="fl">增加5家原辅材料的供应商</span>
              </div>
            </div>
          </div>
          <p class="no_data_tip gray_bg mt10" v-if="checkList.length==0">暂无考核项目</p>
        </div>

        <div class="transition_button" @click="transitioned=!transitioned" :transitioned="transition">
          <span v-if="!transitioned">查看考核表</span>
          <span v-if="transitioned">编辑考核表</span>
        </div>
        <div class="plan_map examine_map " style="width: 100%">
          <div class="kpi_box clearfix " style="position: relative;">
            <div class="kpi_left" style="">
              <div class="table_title">
                <div class="fl" style="color: #999;">考核目标</div>
                <div class="fl" style="color: #999;">权重</div>
              </div>
              <div class="table_title kpi_weight">
                <div class="fl">
                  KPI
                </div>
                <div class="fl">60%</div>
              </div>
            </div>
            <div style="padding-left: 219px">
              <el-table class="fl" height="100%" :data="tableKPI" border >
                <el-table-column prop="name" align="center" label="指标名称" width="320"></el-table-column>
                <el-table-column prop="weight" align="center" label="权重" width="120"></el-table-column>
                <el-table-column prop="targetValue" align="center" label="目标值" width="120"></el-table-column>
                <el-table-column prop="challengeValue" align="center" label="挑战值" width="120"></el-table-column>
                <el-table-column prop="scoreType" align="center" label="评分标准" min-width="400"></el-table-column>
                <el-table-column prop="actualValue" align="center" label="实际值" min-width="120"></el-table-column>
                <el-table-column prop="score" align="center" label="考核分" min-width="120"></el-table-column>
                <el-table-column prop="score" align="center" label="折算分" min-width="120"></el-table-column>
              </el-table>
            </div>
          </div>
          <div class="kpi_box clearfix " style="position: relative;">
            <div class="kpi_left" style="">
              <div class="table_title kpi_weight">
                <div class="fl">GS</div>
                <div class="fl">40%</div>
              </div>
            </div>
            <div style="padding-left: 219px;">
              <el-table class=" fl" height="100%" :data="tableGS" border >
                <el-table-column prop="name" align="center" label="指标名称" width="320"></el-table-column>
                <el-table-column prop="weight" align="center" label="权重" width="120"></el-table-column>
                <el-table-column prop="finishTime" align="center" label="完成时间" width="240"></el-table-column>
                <el-table-column prop="target" align="center" label="考核目标" min-width="400"></el-table-column>
                <el-table-column prop="finishState" align="center" label="完成情况" min-width="120"></el-table-column>
                <el-table-column prop="scorePerson" align="center" label="评分人" min-width="120"></el-table-column>
                <el-table-column prop="score" align="center" label="评分" min-width="120"></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!transitioned" class="btn btn-primary" style="width: 155px;margin: 20px auto 0;display: block;">提交</div>
    <!---新建考核表-->
    <el-dialog v-model="examine_modal" size="large" :close-on-click-modal="false">
      <span slot="title">
        <span class="" style="font-weight: bold">添加考核项目</span>
      </span>
      <div class="dialog_title_line"></div>
      <el-tabs class="chooseType" v-model="select_type" @tab-click="">
        <el-tab-pane label="KPI项目" name="KPI">
          <div class="edit_indicate_content clearfix">
            <div class="indicator_will p20">
              <div class="will_title clearfix mb10">
                <span class="fl">待选指标</span>
                <i class="fa fa-plus-circle fa-lg fr cursor_pointer" @click="addDialogContorl = true"></i>
                <i class="fa fa-search fa-lg fr cursor_pointer" v-show="!toggle" @click="toggleControl"></i>
                <el-input class="search fr" type="text" placeholder="请输入关键字" v-model="keyword" icon="search"
                          :on-icon-click="searchIndicator" v-show="toggle" @blur="toggle = !toggle"></el-input>
              </div>
              <p class="no_data_tip" v-if="!indicatorDefList && !indicatorRecList">暂无数据</p>
              <indicator_box v-for="item in indicatorDefList" :btn-show="true" :item="item"></indicator_box>
              <indicator_box v-for="item in indicatorRecList" :btn-show="true" :item="item"></indicator_box>
            </div>
            <div class="indicator_checked ml20 p20">
              <div class="checked_title mb20">
                <span class="fl">已选择指标</span>
              </div>
              <p class="no_data_tip" v-if="!indicatorCheckedList">暂无数据</p>
              <div class="indicator_box mb10" v-for="item in indicatorCheckedList">
                <p class="clearfix mb5">
                <span class="">1111
                  <el-popover placement="right" title="指标使用场景" width="200" trigger="hover" :content="item.description">
                    <i class="fa fa-question-circle-o ml5 cursor_pointer icon_color" slot="reference"></i>
                  </el-popover>
                  <span class="unover_text " v-if="item.isInit">推荐</span>
                  <span class="unover_text over_text" v-else>自定义</span>
                </span>
                  <span class="arrow_circle fr cursor_pointer" @click="arrowToggle(item,key)"><i class="fa icon_color"
                                                                                                 v-bind:class="{'fa-angle-down': item.spread, 'fa-angle-up': !item.spread}"></i></span>
                </p>
                <div v-show="!item.spread">
                  <div>
                    <el-tag class="font_white" type="gray" color="#82C0EA">333</el-tag>
                    <el-tag class="font_white" type="gray" color="#63B1E6" v-for="x in item.labels">444</el-tag>
                  </div>
                  <div>{{ item.description }}</div>
                </div>
                <div v-show="item.spread">
                  <div class="clearfix">
                    <span class="indicator_label indicator_height fl">标&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;签：</span>
                    <span class="indicator_content indicator_height fl"><el-tag class="font_white" type="gray" color="#82C0EA">333</el-tag></span>
                  </div>
                  <div class="clearfix">
                    <span class="indicator_label indicator_height fl">指标定义：</span>
                    <span class="indicator_content indicator_height fl">{{ item.description }}</span>
                  </div>
                  <div class="clearfix">
                    <span class="indicator_label indicator_height fl">数据公式：</span>
                    <span class="indicator_content indicator_height fl">{{ item.expression }}</span>
                  </div>
                </div>
                <div class="divide_line mt5 mb10" v-if="item.spread"></div>
                <div class="clearfix" v-if="item.spread">
                  <el-form :inline="true" :model="goalForm" :rules="goalRules" >
                    <el-form-item label="目标值：" class="goal_item" prop="goalScore">
                      <el-input v-model="goalForm.goalScore" placeholder="请输入目标值"></el-input>
                    </el-form-item>
                    <el-form-item label="挑战值：" class="goal_item" prop="challengeScore">
                      <el-input v-model="goalForm.challengeScore" placeholder="请输入挑战值"></el-input>
                    </el-form-item>
                    <el-form-item label="权重：" class="goal_item" prop="weight" style="margin-bottom: 20px;">
                      <el-input v-model="goalForm.weight" placeholder="请输入挑战值"></el-input>
                    </el-form-item>
                  </el-form>
                </div>
                <div v-show="item.spread">
                  <el-row>
                    <el-col :span="3">
                      <span class="indicator_label indicator_height fl">评分标准：</span>
                    </el-col>
                    <el-col :span="21">
                      <el-radio-group v-model="goalForm.scoreType">
                        <el-radio :label="3">必保目标与挑战目标间从90分到100分线性加分，达到挑战目标得110分封顶；低于必保目标加倍扣分，低于70%本项不得分。</el-radio>
                        <el-radio :label="6">必保目标与挑战目标间从90分到100分线性加分，达到挑战目标得110分封顶；低于必保目标加倍扣分，低于70%本项不得分。</el-radio>
                        <el-radio :label="9">必保目标与挑战目标间从90分到100分线性加分，达到挑战目标得110分封顶；低于必保目标加倍扣分，低于70%本项不得分。</el-radio>
                      </el-radio-group>
                    </el-col>
                  </el-row>
                </div>
                <!--移出-->
                <p class="indicator_btn pt5 pb5 cursor_pointer" @click="">
                  <i class="fa fa-arrow-circle-o-left fa-lg"></i>
                  将指标移出已选择指标区域
                </p>
              </div>
              <!--<indicator_box v-for="item in indicatorCheckedList" :btn-show="false" :no-btn="true" :item="item"-->
              <!--v-on:sendToParent="openDia"></indicator_box>-->
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="GS项目" name="GS">
          <div class="add_plan mb10">
            <div class="blue-text cursor_pointer" @click="addGS()"><i class="fa fa-plus-circle fa-lg "></i> 添加考核项目
            </div>
          </div>
          <div class="plan_content no_padding mb10" style="position: relative;" v-for="s in indicatorRecList">
            <div class="clearfix">
              <el-form ref="GSForm" :inline="true" :model="GSForm" :rules="gs_rule" label-width="96px">
                <el-form-item label="工作目标：" class="mb10">
                  <el-input v-model="GSForm.target" placeholder="请输入工作目标" v-if="s.isEdit"></el-input>
                  <div v-else>完成新机房建设方案</div>
                </el-form-item>
                <el-form-item label="完成日期：" class="mb10">
                  <el-input v-model="GSForm.scoreType" placeholder="请输入工作目标" v-if="s.isEdit"></el-input>
                  <div v-else>2018-09-08</div>
                </el-form-item>
                <el-form-item label="权重：" class="mb10">
                  <el-input v-model="GSForm.scoreType" placeholder="请输入工作目标" v-if="s.isEdit"></el-input>
                  <div v-else>23%</div>
                </el-form-item>
                <el-form-item label="评分标准：" class="scoreType" style="display: block;">
                  <el-input type="textarea" v-model="GSForm.scoreType" placeholder="请输入工作目标" v-if="s.isEdit"></el-input>
                  <div v-else>按期完成得90分，推迟1天扣5分，推迟5天不得分</div>
                </el-form-item>
              </el-form>
              <div class="operate_btn operate_btns" style="top:0;right:10px" v-if="!s.isEdit">
                <el-button type="text" size="large" @click=""><i class="fa fa-trash fa-lg" aria-hidden="true"></i>
                </el-button>
                <el-button type="text" size="large" @click="s.isEdit=true"><i class="fa fa-edit fa-lg"
                                                                              aria-hidden="true"></i></el-button>
              </div>
            </div>
            <div class="btns clearfix" style="width: 260px;margin: 20px auto 10px" v-if="s.isEdit">
              <div class="btn btn-light fl" @click="cancelGS(s)">取消</div>
              <div class="btn btn-primary fr" @click="s.isEdit=false">保存</div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="btns clearfix" style="margin: 40px auto 0;width: 156px;">
        <div class="btn btn-primary fl" @click="" style="width: 156px;">提交</div>
      </div>
    </el-dialog>
    <!---编辑考核项目-->
    <el-dialog v-model="item_modal" size="small" :close-on-click-modal="false" class="edit_strategy">
      <span slot="title">
        <span style="font-weight: bold">编辑考核指标</span>
      </span>
      <div class="dialog_title_line"></div>
      <div class=" clearfix">
        <div class="indicator_detail">
          <p class="clearfix">
              <span class="fl">大客户流失率
                <el-popover placement="right" title="指标使用场景" width="200" trigger="hover">
                  <i class="fa fa-question-circle-o ml5 cursor_pointer icon_color" slot="reference"></i>
                </el-popover>
                <span v-if="btnShow" class="recommand ml10">推荐</span>
                <span v-if="btnShow" class="defined ml10">自定义</span>
              </span>
          </p>
          <div class="clearfix mt5 mb10">
              <span class="">
                <span class="gray-text">标签：</span>
                  <span class="warn_tag mt5" style="background-color: #82C0EA;">GS</span>
                  <span class="warn_tag mt5 ml5">上级分解</span>
              </span>
          </div>
          <div class="clearfix mt10 mb10">
            <span class="gray-text fl">指标定义：</span>
            <span class="fl mr30">在考核周期内，流失的大客户数量与大客户总数比率</span>
          </div>
          <div class="clearfix mt10 mb10">
            <span class="gray-text fl">数据公式：</span>
            <span class="fl mr30">在考核周期内，流失的大客户数量与大客户总数比率</span>
          </div>
          <div style="border-top:1px solid #D9D9D9;border-bottom:1px solid #D9D9D9; padding: 10px 0">
            <div class="clearfix mb10">
              <span class="gray-text fl">目标值：</span>
              <span class="fl mr30">58.60%</span>
              <span class="gray-text fl">挑战值：</span>
              <span class="fl mr30">58.60%</span>
            </div>
            <div class="gray-text f12">来源：2017年08月目标系统图 V1.2</div>
          </div>
          <div class="clearfix mt15">
            <el-form :model="editForm" :rules="editFormRule" ref="editForm">
              <el-form-item label="权重：" prop="weight">
                <el-input v-model="editForm.weight" style="width: auto;" placeholder="请输入目标值"></el-input>
              </el-form-item>
            </el-form>
            <!--<span class="gray-text fl">权重：</span>-->
            <!--<el-input placeholder="请输入目标值" v-model="editForm.weight" style="width: auto;" class="fl mr30">58.60%</el-input>-->
          </div>
          <div class="clearfix mt20 mb10">
            <el-row>
              <el-col :span="3">
                <span class="gray-text fl">评分标准：</span>
              </el-col>
              <el-col :span="21">
                <el-radio-group v-model="editForm.scoreType">
                  <el-radio :label="3">必保目标与挑战目标间从90分到100分线性加分，达到挑战目标得110分封顶；低于必保目标加倍扣分，低于70%本项不得分。</el-radio>
                  <el-radio :label="6">必保目标与挑战目标间从90分到100分线性加分，达到挑战目标得110分封顶；低于必保目标加倍扣分，低于70%本项不得分。</el-radio>
                  <el-radio :label="9">必保目标与挑战目标间从90分到100分线性加分，达到挑战目标得110分封顶；低于必保目标加倍扣分，低于70%本项不得分。</el-radio>
                </el-radio-group>
              </el-col>

            </el-row>
          </div>
        </div>
      </div>
      <div class="btns clearfix" style="margin: 40px auto 0;width: 156px;">
        <div class="btn btn-primary fl" @click="" style="width: 156px;">提交</div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import indicator_box from  '../target/indicator.vue'

  module.exports = {
    data: function () {
      return {
        GSForm: {
          scoreType: '3',
          target: ''
        },//新建GS项目
        goalForm: {
          goalScore: '',
          challengeScore: '',
          scoreType: 3,
          weight: ''
        },//新建KPI项目
        select_type: 'KPI',//新建选择KPI或者GS
        editForm: {
          scoreType: 3,
          weight: ''
        },//编辑考核指标
        goalRules: {
          goalScore: [
            {required: true, message: '请输入目标值', trigger: 'blur'}
          ],
          challengeScore: [
            {required: true, message: '请输入挑战值', trigger: 'blur'}
          ],
          weight: [
            {required: true, message: '请输入权重', trigger: 'blur'}
          ]
        },
        editFormRule: {
          weight: [
            {required: true, message: '请输入权重', trigger: 'blur'}
          ],
        },
        operateType: '',//GS
        planId: '',
        addDialogContorl: false,//添加指标对话框显隐
        personList: [],//
        transitioned: false,
        checkDetail: {},//当前计划表
        steps: [
          {
            content: '',
            endTime: '',
            employeeId: '',
            step: 1
          }
        ],//行动计划对话框里面的步骤
        plan_rule: {
          name: [
            {required: true, message: '请填写计划名称', trigger: 'blur'}
          ],
          target: [
            {required: true, message: '请填写工作目标', trigger: 'blur'}
          ],
          steps: [
            {required: true, message: '请填写实施步骤'}
          ]
        },
        tableKPI: [{
          name: '提高原辅材料的合格率',
          weight: '60%',
          targetValue: '66%',
          challengeValue: '88%',
          scoreType: '必保目标与挑战目标间从90分到100分线性加分，达到挑战目标得110分封 顶；低于必保目标加倍扣分，低于70%本项不得分。',
        },
          {
            name: '提高原辅材料的合格率',
            weight: '60%',
            targetValue: '66%',
            challengeValue: '88%',
            scoreType: '必保目标与挑战目标间从90分到100分线性加分，达到挑战目标得110分封 顶；低于必保目标加倍扣分，低于70%本项不得分。',
          }, {
            name: '提高原辅材料的合格率',
            weight: '60%',
            targetValue: '66%',
            challengeValue: '88%',
            scoreType: '必保目标与挑战目标间从90分到100分线性加分，达到挑战目标得110分封 顶；低于必保目标加倍扣分，低于70%本项不得分。',
          },
          {
            name: '提高原辅材料的合格率',
            weight: '60%',
            targetValue: '66%',
            challengeValue: '88%',
            scoreType: '必保目标与挑战目标间从90分到100分线性加分，达到挑战目标得110分封 顶；低于必保目标加倍扣分，低于70%本项不得分。',
          }],
        tableGS: [{
          name: '提高原辅材料的合格率',
          weight: '60%',
          finishTime: '2017-08-28',
          target: '按期完成得90分，推迟1天扣5分，推迟5',
        },
          {
            name: '提高原辅材料的合格率',
            weight: '60%',
            finishTime: '2017-08-28',
            target: '按期完成得90分，推迟1天扣5分，推迟5',
          }, {
            name: '提高原辅材料的合格率',
            weight: '60%',
            finishTime: '2017-08-28',
            target: '按期完成得90分，推迟1天扣5分，推迟5',
          },
          {
            name: '提高原辅材料的合格率',
            weight: '60%',
            finishTime: '2017-08-28',
            target: '按期完成得90分，推迟1天扣5分，推迟5',
          }],
        examine_modal: false,//添加考核
        item_modal: false,//编辑考核指标
        examine_title: '添加考核项目',//添加或者编辑策略对话框的标题
        dateSelectVisible: false,//日期控件显隐
        strategyForm: {
          name: '',
          detail: '',
        },//添加或者编辑策略对话框的内容
        examineForm: {
          name: '',
          target: '',
        },//添加或者编辑行动计划对话框的内容
        stepForm: {
          name: '接洽不低于8家此类材料供应商，获取供应商',
          date: '2017-09-07',
          person: '郑少飞'
        },//步骤
        strategy_rule: {
          name: [
            {required: true, message: '请填写策略名称', trigger: 'blur'}
          ]
        },
        checkList: [],//计划列表
        indicatorRecList: [
          {
            name: '大客户流失率1',
            label: '财务',
            miaoshu: '这里是场景描述',
            area: '利润增长',
            description: '指在利润总额中按规定缴纳了所得税后公司的利润留成',
            expression: '总利润 - 所得税',
            spread: true,
            isEdit: false,
          },
          {
            name: '大客户流失率2',
            label: '财务',
            miaoshu: '这里是场景描述',
            area: '利润增长',
            description: '指在利润总额中按规定缴纳了所得税后公司的利润留成',
            expression: '总利润 - 所得税',
            spread: true,
            isEdit: false
          },
        ],//推荐指标
        indicatorDefList: [
          {
            name: '纯利润1',
            label: '财务',
            miaoshu: '这里是场景描述',
            area: '利润增长',
            description: '指在利润总额中按规定缴纳了所得税后公司的利润留成',
            expression: '总利润 - 所得税',
            spread: true
          },
          {
            name: '纯利润2',
            label: '财务',
            miaoshu: '这里是场景描述',
            area: '利润增长',
            description: '指在利润总额中按规定缴纳了所得税后公司的利润留成',
            expression: '总利润 - 所得税',
            spread: true
          },
        ],//自定义指标
        indicatorCheckedList: [
          {
            name: '已选指标1',
            label: '财务',
            miaoshu: '这里是场景描述',
            area: '利润增长',
            description: '指在利润总额中按规定缴纳了所得税后公司的利润留成',
            expression: '总利润 - 所得税',
            spread: false,
            scoreType: 3
          },
          {
            name: '已选指标2',
            label: '财务',
            miaoshu: '这里是场景描述',
            area: '利润增长',
            description: '指在利润总额中按规定缴纳了所得税后公司的利润留成;指在利润总额中按规定缴纳了所得税后公司的利润留成指在利润总额中按规定缴纳了所得税后公司的利润留成指在利润总额中按规定缴纳了所得税后公司的利润留成指在利润总额中按规定缴纳了所得税后公司的利润留成指在利润总额中按规定缴纳了所得税后公司的利润留成',
            expression: '总利润 - 所得税',
            spread: false,
            scoreType: 3
          },
        ],//已选择指标
        keyword: '',//指标搜索关键字
        toggle: false,//搜索框默认不显示
      }
    },
    computed: {
      transition: function () {
        if (this.transitioned) {
          $('.plan_map').css({display: 'block', right: '0px'});
          $('.transition_button').css({right: ($('.transition_wrapper').width() - 40) + 'px'});
        }
        else {
          $('.plan_map').css({display: 'block', right: '-' + ($('.transition_wrapper').width()) + 'px'});
          $('.transition_button').css({right: (0) + 'px'});
        }
        return this.transitioned;
      }
    },
    methods: {
      /**
       * 删除考核指标
       */
      deleteIndicator:function (id) {
        var _com = this;
        _com.$confirm('确定要删除此考核指标?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          _com.$http.get(common.projectPath + 'sys/plan/delete/' + id, {
            params: {}
          }).then(function (data) {
            data = data.body;
            if (data.code!=='SUCCESS') {
              _com.$message.error(data.message);
            } else {
              _com.$message.success('删除成功!');
              _com.getCheckList();
            }
          })
        }).catch(function () {

        })
      },
      cancelGS: function (item) {
        var _com = this;
        item.isEdit = false;
        if (_com.operateType !== 'new') {
          _com.indicatorRecList.shift();
        }
      },
      /**
       * select的远程搜索方法
       */
      addGS: function () {
        var _com = this;
        _com.operateType = 'new';
        _com.indicatorRecList.unshift({
          name: '大客户流失率1',
          label: '财务',
          miaoshu: '这里是场景描述',
          area: '利润增长',
          description: '指在利润总额中按规定缴纳了所得税后公司的利润留成',
          expression: '总利润 - 所得税',
          spread: true,
          isEdit: true
        })
      },
      init: function () {
        var _com = this;
        _com.$nextTick(function () {
          var h = $('.kpi_box').height();
          var s = h - 40;
          $('.kpi_weight').eq(0).find('div').css('height', s + 'px');
          $('.kpi_weight').eq(0).find('div').css('line-height', s + 'px');
          $('.kpi_weight').eq(1).find('div').css('height', h + 'px');
          $('.kpi_weight').eq(1).find('div').css('line-height', h + 'px');
        })
      },
      openDia: function (data) {
        this.addDialogContorl = true;
      },
      editItem: function () {
        var _com = this;
        _com.item_modal = true;
      },
      /**
       * select的远程搜索方法
       */
      remoteMethod(query) {
        var _com = this;
        if (query !== '') {
          _com.loading = true;
          setTimeout(function () {
            _com.loading = false;
            _com.getChildList(query)
            if (_com.indicators) {
              _com.indicators = _com.indicators.filter(function (item) {
                return item.name.toLowerCase()
                    .indexOf(query.toLowerCase()) > -1;
              });
            }
          }, 200);
        } else {

          _com.indicators = [];
        }

      },
      /**
       * 编辑行动计划
       */
      editExamine: function (item) {
        var _com = this;
        _com.planId = item.id;
        _com.examine_modal = true;
        _com.$http.get(common.projectPath + 'sys/plan/detail/' + item.id, {
          params: {}
        }).then(function (data) {
          data = data.body;
          if (data.code === 'SUCCESS') {
            if (data.data) {
              _com.examineForm = data.data;
              _com.steps = data.data.planSteps;
              for (var i = 0; i < _com.steps.length; i++) {
                var time = _com.steps[i].endTime.substring(0, 10).replace(/-/g, "/")
                _com.steps[i].endTime = new Date(time)
                console.log(_com.steps[i].endTime)
              }
            }
          } else {
            _com.$message.error(data.message);
          }
        })
      },
      /**
       * 保存行动计划
       */
      saveExamine: function () {
        var _com = this;
        for (var i = 0; i < _com.steps.length; i++) {
          var time = '';
          if (_com.steps[i].endTime) {
            time = _com.steps[i].endTime.getFullYear() + "-" + (_com.steps[i].endTime.getMonth() + 1) + "-" + _com.steps[i].endTime.getDate();
            _com.steps[i].endTime = time + ' ' + '00:00:00';
          }
        }
        var data = {
          content: _com.examineForm.content,
          isGs: _com.examineForm.isGs,
          target: _com.examineForm.target,
          name: _com.examineForm.name,
          steps: _com.steps,
          planType: 'other',
//          objectiveFormDetailId:'testid',
//          indicatorMethodSelected:_com.strategyId,
          text: '6月',
          year: '2017'
        }, url = '';
        if (_com.examine_title === '添加考核项目') {
          url = 'sys/plan/add';
        } else {
          url = 'sys/plan/update';
          data.id = _com.planId;
        }
        _com.$refs['examineForm'].validate(function (valid) {
          if (valid) {
            _com.$http.post(common.projectPath + url, data, {}).then(function (data) {
              data = data.body;
              if (data.code === 'SUCCESS') {
                _com.$message.success('保存成功!');
                _com.examine_modal = false;
                _com.getSelectedList();
              } else {
                _com.$message.error(data.message);
              }
            })
          }
        })

      },
      /**
       * 添加行动计划
       */
      addExamine: function () {
        var _com = this;
        _com.examine_modal = true;
        _com.clearForm('planForm');
        _com.examineForm.isGs = false;
        _com.steps = [{
          content: '',
          endTime: '',
          employeeId: '',
          step: 1
        }];
      },
      transition: function () {
        this.transitioned = !this.transitioned;
        if (this.transitioned) {
          $('.plan_map').css({display: 'block', right: '0px'});
          $('.transition_button').css({right: ($('.transition_wrapper').width() - 40) + 'px'});
        }
        else {
          $('.plan_map').css({display: 'block', right: '0px'});
          $('.transition_button').css({right: ($('.transition_wrapper').width() - 40) + 'px'});
        }
      },
      //点击返回上一级
      return_last: function () {
        this.$emit('return', 1);
      },
      //控制指标收起和展开
      arrowToggle: function (val) {
        val.spread = !val.spread;
//        alert('hha');
      },
      planToggle: function (val) {
        val.spread = !val.spread
      },
      //控制指标搜索框显隐
      toggleControl: function () {
        this.toggle = !this.toggle;
      },
      getIndicatorList: function () {
        var _com = this;
        console.log('点击了确认');
      },
      /**
       * 获得自己以及自己的下级
       */
      getChildList: function (name) {
        var _com = this, data = {
          objectiveFormDetailId: 'testid'
        };
        name = name ? name : ''
        _com.$http.get(common.projectPath + 'usr/employee/queryByName?name=' + name, {
          params: {
//            objectiveFormDetailId:'testid'
          }
        }).then(function (data) {
          data = data.body;
          if (data.code === 'SUCCESS') {
            if (data.data) {
              var personList = data.data;
              for (var i = 0; i < personList.length; i++) {
                personList[i].value = personList[i].id;
                personList[i].label = personList[i].realName;
              }
              _com.personList = personList;
            }
          } else {
            _com.$message.error(data.message);
          }
        })
      },
      /**
       * 获得计划列表
       */
      getCheckList: function () {
        var _com = this,data={

        };
        _com.$http.post(common.projectPath + 'sys/planform/toAdd/year/',data, {
          params: {
//            objectiveFormDetailId:'testid'
          }
        }).then(function (data) {
          data = data.body;
          if (data.code === 'SUCCESS') {
            if (data.data) {
              _com.checkDetail = data.data;
              _com.checkList = data.data.plans;
            }
          } else {
            _com.$message.error(data.message);
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
      }
    },
    mounted: function () {
      //获取当时日期，填入head
      var _com = this;
      _com.getCheckList();
//      _com.getChildList();

      this.$nextTick(function () {
        quicker.returnTop();
        _com.init();
      })
    },
    components: {
      'indicator_box': indicator_box
    }
  }
</script>
<style lang='scss'>

</style>

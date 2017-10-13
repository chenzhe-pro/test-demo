<!— ***模板  Created by limin on 2017/9/4—>
<template>
  <div class="wrapper homePage">
    <page_head></page_head>
    <div class="content_wrapper">
      <content_head :show-breadcrumb="false" show-menu="true"></content_head>
      <div class="content_content p20">
        <div v-if="step==1">
          <div class="top_box">
            <p class="top_title">2017年01月：本期考核项目</p>
          </div>
          <div class="bottom_box clearfix">
            <div class="bottom_left" >
              <p class="top_title">日常工作</p>
              <ul class="work_list">
                <li>
                  <div class="blue_line first_line"></div>
                  <p class="ml15">工作计划表审批<span class="notice_count">3</span></p>
                  <p class="gray_text mt5 ml15">最新：2017年01月陈嘉杰工作计划表</p>
                  <a class="check_detail" @click="step=5">查看详情</a>
                </li>
                <li>
                  <div class="blue_line first_line"></div>
                  <p class="ml15">工作目标审批<span class="notice_count">3</span></p>
                  <p class="gray_text mt5 ml15">最新：2017年01月陈嘉杰工作计划表</p>
                  <a class="check_detail" @click="step=7">查看详情</a>
                </li>
                <li>
                  <div class="blue_line first_line"></div>
                  <p class="ml15">考核表审批<span class="notice_count">3</span></p>
                  <p class="gray_text mt5 ml15">最新：2017年01月陈嘉杰工作计划表</p>
                  <a class="check_detail" @click="step=6">查看详情</a>
                </li>
                <li>
                <div class="blue_line second_line"></div>
                <p class="ml15">绩效数据实际值填报/复核<span class="notice_count">3</span></p>
                <p class="gray_text mt5 ml15">最新：2017年01月陈嘉杰工作计划表</p>
                <a class="check_detail" @click="step=4">查看详情</a>
                </li>
                <li>
                  <div class="blue_line second_line"></div>
                  <p class="ml15">考核表GS评分<span class="notice_count">3</span></p>
                  <p class="gray_text mt5 ml15">最新：2017年01月陈嘉杰工作计划表</p>
                  <a class="check_detail" @click="step=8">查看详情</a>
                </li>
                <li>
                  <div class="blue_line third_line"></div>
                  <p class="ml15">工作事项/目标填报<span class="notice_count">3</span></p>
                  <a class="check_detail" @click="step=3">查看详情</a>
                </li>
              </ul>
            </div>
            <div class="bottom_right">
              <p class="top_title">监管工作</p>
              <ul class="work_list">
                <li style="height: auto;">
                  <div class="blue_line"></div>
                  <p class="ml15">陈嘉杰 <span class="ml20">市场部副经理</span></p>
                  <div class="table_list clearfix ml15" @click="jump(2,'daliy')">
                    <span class="dotted daliy_dotted"></span>
                    <span class="mr20">2017-01-05</span>
                    <span class="">日清表</span>
                    <span class="fr">未提交</span>
                  </div>
                  <div class="table_list clearfix ml15" @click="jump(2,'work')">
                    <span class="dotted work_dotted"></span>
                    <span class="mr20">2017-01-05</span>
                    <span class="">工作计划表</span>
                    <span class="fr">未提交</span>
                  </div>
                  <div class="table_list clearfix ml15" @click="jump(2,'check')">
                    <span class="dotted check_dotted"></span>
                    <span class="mr20">2017-01-05</span>
                    <span class="">考核表</span>
                    <span class="fr">未提交</span>
                  </div>
                </li>
                <li style="height: auto;">
                  <div class="blue_line"></div>
                  <p class="ml15">陈嘉杰 <span class="ml20">市场部副经理</span></p>
                  <div class="table_list clearfix ml15">
                    <span class="dotted daliy_dotted"></span>
                    <span class="mr20">2017-01-05</span>
                    <span class="">日清表</span>
                    <span class="fr">未提交</span>
                  </div>
                  <div class="table_list clearfix ml15">
                    <span class="dotted work_dotted"></span>
                    <span class="mr20">2017-01-05</span>
                    <span class="">工作计划表</span>
                    <span class="fr">未提交</span>
                  </div>
                  <div class="table_list clearfix ml15">
                    <span class="dotted check_dotted"></span>
                    <span class="mr20">2017-01-05</span>
                    <span class="">考核表</span>
                    <span class="fr">未提交</span>
                  </div>
                </li>
                <div style="" @click="step=2" class="gray_text click_more">点击查看更多</div>
              </ul>
            </div>
          </div>
        </div>
        <childTable @getstep="showStep" :msg="msg" :type="type" v-if="step==2"></childTable>
        <targetFill @getstep="showStep" v-if="step==3"></targetFill>
        <examineRecheck @getstep="showStep" v-if="step==4"></examineRecheck>
        <workVerify @getstep="showStep" v-if="step==5"></workVerify>
        <checkVerify @getstep="showStep" v-if="step==6"></checkVerify>
        <targetVerify @getstep="showStep" v-if="step==7"></targetVerify>
        <gradeGS @getstep="showStep" v-if="step==8"></gradeGS>
      </div>
    </div>
  </div>
</template>
<script>
  import head from '../common/head.vue'
  import content_head from '../common/content_head.vue'
  import childTable from './childTable.vue'
  import targetFill from './targetFill.vue'
  import examineRecheck from './examineRecheck.vue'
  import workVerify from './workVerify.vue'
  import checkVerify from './checkVerify.vue'
  import targetVerify from './targetVerify.vue'
  import gradeGS from './gradeGS.vue'

  module.exports = {
    data: function () {
      return {
        step:1,
        type:''
      }
    },
    computed: {

    },
    methods: {
      showStep:function (msg) {
        this.type='';
        this.step=msg;
      },
      jump:function (step,type) {
        this.type='';
        this.step=step;
        this.type=type;
      },
      getSuperviseJobs:function () {
        var _com=this;
        _com.$http.get(common.projectPath+'usr/approverecord/getSuperviseJobs',{
          params:{}
        }).then(function (data) {
          data=data.body;
          if(data.code==='SUCCESS'){

          }else {
            _com.$message.error(data.message);
          }
        })
      },
    },
    mounted: function () {
      this.getSuperviseJobs();
      this.$nextTick(function () {
        quicker.returnTop();
      })
    },
    components: {
      'page_head': head,
      'content_head': content_head,
      'childTable': childTable,
      'targetFill': targetFill,
      'examineRecheck': examineRecheck,
      'workVerify': workVerify,
      'checkVerify': checkVerify,
      'targetVerify': targetVerify,
      'gradeGS': gradeGS,
    }
  }
</script>
<style lang='scss'>

</style>

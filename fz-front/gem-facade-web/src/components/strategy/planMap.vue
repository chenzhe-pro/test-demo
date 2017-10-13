<!— ***模板  Created by limin on 2017/9/4—>
<template>
    <div class="indicator_box planManage">
      <p class="clearfix bold_font">
      <span class="fl">2017年工作计划表
        <el-popover placement="right" title="指标使用场景" width="200" trigger="hover" content="5555">
          <i class="fa fa-question-circle-o ml5 cursor_pointer icon_color" slot="reference"></i>
        </el-popover>
      </span>
        <span class="fr blue-text cursor_pointer return_top" @click="return_last"><i class="fa fa-arrow-circle-left fa-lg "></i> 返回上一级</span>
      </p>
      <p class="gray-text f12 mt5 mb10">版本号：<span class="ml10">V4.0</span></p>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="type" align="center" label="事项类型" width="240"></el-table-column>
        <el-table-column prop="target" align="center" label="目标" width="240"></el-table-column>
        <el-table-column prop="strategy" align="center" label="策略" width="240"></el-table-column>
        <el-table-column prop="plan" align="center" label="计划事项" width="240"></el-table-column>
        <el-table-column prop="work" align="center" label="工作目标" width="240"></el-table-column>
        <el-table-column prop="GS" align="center" label="是否列入GS" width="120">
          <template scope="scope">
            <div v-html="scope.row.GS"></div>
          </template>
        </el-table-column>
        <el-table-column prop="content" align="center" label="计划内容" width="300">
          <template scope="scope">
            <div style="border-bottom: 1px solid #dfe6ec;padding:8px 18px;text-align: left;" v-for="(item ,index) in scope.row.content" v-text="index+1+'、'+item"></div>
          </template>
        </el-table-column>
        <el-table-column prop="date" align="center" label="完成时间节点" width="200"></el-table-column>
      </el-table>

    </div>
</template>
<script>
  module.exports = {
    data: function () {
      return {
        tableData: [],
      }
    },
    computed: {

    },
    methods: {
      //点击返回上一级
      return_last:function () {
        this.$emit('getStep',1);
      },

    },
    mounted: function () {
      var _com = this;
      this.$nextTick(function () {
        quicker.returnTop();
      })
    },
    components: {
//      'page_head': head,
//      'content_head': content_head,
//      'indicator_dia': indicator_dia
    }
  }
</script>
<style lang='scss'>

</style>

<template>
  <div class="target_history indicator_box mb10">
    <p class="clearfix">
      <span class="fl">{{ item.name }}
        <el-popover placement="right" title="指标使用场景" width="200" trigger="hover" :content="item.remark">
          <i class="fa fa-question-circle-o ml5 cursor_pointer icon_color" slot="reference"></i>
        </el-popover>
      </span>
      <span class="arrow_circle fr cursor_pointer" @click="arrowToggle(item)">
        <i class="fa icon_color" v-bind:class="{'fa-angle-down': !item.spread, 'fa-angle-up': item.spread}"></i>
      </span>
      <i v-if="!history" class="fa fa-pencil-square-o fr mr5 icon_color cursor_pointer modify_btn" @click="openAddDia(item)"></i>
    </p>
    <div v-show="!item.spread">
      <div v-if="history">
        <span class="warn_tag businessDomain_tag mr5" v-for="x in item.businessDomains"><i class="fa mr5 mb5" :class="x.icon" aria-hidden="true"></i>{{ x.name }}</span>
        <span class="warn_tag label_tag mr5" v-for="x in item.labels">{{ x.name }}</span>
      </div>
      <div class="clearfix" v-if="!history">
        <span class="indicator_label indicator_height fl">状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态：</span>
        <span class="indicator_content indicator_height fl" v-if="item.status === 'N'"><el-tag type="gray">停用</el-tag></span>
        <span class="indicator_content indicator_height fl" v-else><el-tag type="danger">启用</el-tag></span>
      </div>
      <div class="clearfix" v-if="!history">
        <span class="indicator_label indicator_height fl">指标定义：</span>
        <span class="indicator_content indicator_height fl">{{ item.description }}</span>
      </div>
      <div class="clearfix" v-if="!history">
        <span class="indicator_label indicator_height fl">数据公式：</span>
        <span class="indicator_content indicator_height fl">{{ item.expression }}</span>
      </div>
      <div v-if="history">{{ item.description }}</div>
    </div>
    <div v-show="item.spread">
      <div class="clearfix">
        <span class="indicator_label indicator_height fl">业务领域：</span>
        <span class="warn_tag businessDomain_tag mr5" v-for="x in item.businessDomains"><i class="fa mr5 mb5" :class="x.icon" aria-hidden="true"></i>{{ x.name }}</span>
      </div>
      <div class="clearfix">
        <span class="indicator_label indicator_height fl">标&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;签：</span>
        <span class="warn_tag label_tag mr5" v-for="x in item.labels">{{ x.name }}</span>
      </div>
      <div class="clearfix" v-if="!history">
        <span class="indicator_label indicator_height fl">状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态：</span>
        <span class="indicator_content indicator_height fl" v-if="item.status === 'N'"><el-tag type="gray">停用</el-tag></span>
        <span class="indicator_content indicator_height fl" v-else><el-tag type="danger">启用</el-tag></span>
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
    <div class="divide_line mt5 mb5" v-if="history"></div>
    <!--目标值挑战值-->
    <div class="history_goal mb10" v-if="history">
      <p><span class="font_gray">目标值：</span><span>{{ item.targetValue }}<span v-if="item.percentage === true">%</span></span></p>
      <p><span class="font_gray">挑战值：</span><span>{{ item.challengeValue }}<span v-if="item.percentage === true">%</span></span></p>
    </div>
  </div>
</template>

<script>
  module.exports = {
    name: 'myTargetHistory',
    data: function () {
      return {

      }
    },
    props: {
      history: {
        type: Boolean,
        default: true
      },
      item: {}
    },
    methods: {
      //控制指标收起和展开
      arrowToggle: function (item) {
        item.spread = !item.spread;
      },
      openAddDia: function (val) {
        this.$emit('openModifyDia', val);
      },
    },
    mounted: function () {

    }
  }
</script>

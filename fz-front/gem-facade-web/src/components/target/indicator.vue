<template>
  <div class="indicator_box mb10">
    <p class="clearfix">
      <span class="fl">{{ item.name }}
        <el-popover placement="right" title="指标使用场景" width="200" trigger="hover" :content="item.remark">
          <i class="fa fa-question-circle-o ml5 cursor_pointer icon_color" slot="reference"></i>
        </el-popover>
        <span v-if="item.type==='FROM_BACKGROUD' && btnShow" class="recommand ml10">推荐</span>
        <span v-if="item.type==='FROM_TENANT' && btnShow" class="defined ml10">自定义</span>
        <span class="warn_tag mt5 ml20" v-if="item.source != 'FROM_SELF' && !btnShow"><i class="fa fa-info-circle"></i>上级分解</span>
      </span>
      <span class="arrow_circle fr cursor_pointer" @click="arrowToggle">
        <i class="fa icon_color" v-bind:class="{'fa-angle-down': !item.spread, 'fa-angle-up': item.spread}"></i>
      </span>
      <i v-if="item.type==='FROM_TENANT' && btnShow" class="fa fa-pencil-square-o fr mr5 icon_color cursor_pointer modify_btn" @click="openAdd"></i>
    </p>
    <div v-show="!item.spread">
      <div>
        <span class="warn_tag businessDomain_tag mr5" v-for="x in item.businessDomains"><i class="fa mr5 mb5" :class="x.icon" aria-hidden="true"></i>{{ x.name }}</span>
        <span class="warn_tag label_tag mr5" v-for="x in item.labels">{{ x.name }}</span>
      </div>
      <div>{{ item.description }}</div>
    </div>
    <div v-show="item.spread">
      <div class="clearfix">
        <span class="indicator_label indicator_height fl">业务领域：</span>
        <span class="indicator_content indicator_height fl">
          <span class="warn_tag businessDomain_tag mr5" v-for="x in item.businessDomains"><i class="fa mr5 mb5" :class="x.icon" aria-hidden="true"></i>{{ x.name }}</span>
        </span>
      </div>
      <div class="clearfix">
        <span class="indicator_label indicator_height fl">标&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;签：</span>
        <span class="indicator_content indicator_height fl">
          <span class="warn_tag label_tag mr5" v-for="x in item.labels">{{ x.name }}</span>
        </span>
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
    <div class="divide_line mt5 mb10" v-if="!btnShow"></div>
    <!--已选指标特有-->
    <div class="clearfix mt10" v-if="!btnShow">
      <el-form :inline="true" class="" v-if="item.source ==='FROM_SELF'">
        <el-form-item label="目标值" class="goal_item">
          <el-input v-model="item.targetValue" placeholder="请输入目标值"></el-input>
        </el-form-item>
        <el-form-item label="挑战值" class="goal_item">
          <el-input v-model="item.challengeValue" placeholder="请输入挑战值"></el-input>
        </el-form-item>
        <el-form-item class="goal_item">
          <el-button @click="saveGoal(item.newId)" :disabled="saveBtn">保存</el-button>
        </el-form-item>
      </el-form>
      <div class="history_goal mb10" v-else>
        <p><span class="font_gray">目标值：</span><span>{{ item.targetValue }}<span v-if="item.percentage === true">%</span></span></p>
        <p><span class="font_gray">挑战值：</span><span>{{ item.challengeValue }}<span v-if="item.percentage === true">%</span></span></p>
      </div>
    </div>
    <!--移入-->
    <p class="indicator_btn pt5 pb5 cursor_pointer" v-if="btnShow" @click="checkIndicator(item)">
      将指标移入已选择指标区域
      <i class="fa fa-arrow-circle-o-right fa-lg"></i>
    </p>
    <!--移出-->
    <p class="indicator_btn pt5 pb5 cursor_pointer" v-if="item.source === 'FROM_SELF' && !btnShow" @click="unCheckIndicator(item)">
      <i class="fa fa-arrow-circle-o-left fa-lg"></i>
      将指标移出已选择指标区域
    </p>
  </div>
</template>

<script>
  module.exports = {
    data: function () {
      return {
//        goalForm: {
//          targetValue: '',
//          challengeValue: ''
//        },
//        goalRules: {
//          targetValue: [
//            { required: true, message: '请输入目标值', trigger: 'blur' }
//          ],
//          challengeValue: [
//            { required: true, message: '请输入挑战值', trigger: 'blur' }
//          ]
//        },
      }
    },
    computed: {
      saveBtn: function () {
        if (this.item.targetValue && this.item.challengeValue) {
          return false;
        } else {
          return true;
        }
      }
    },
    props: {
      noBtn: {
        type: Boolean,
        default: function () {
          return true;
        }
      },//是否显示保存按钮
      btnShow: {},//控制待选指标和已选指标的内容差别------true是待选指标，false是已选指标
      willTag: {},//控制待选指标的自定义和推荐标签-----------该参数应该从item中获得，不用从父组件传递,true是自定义，false是推荐
      item: {}
    },
    methods: {
      //控制指标收起和展开
      arrowToggle: function () {
        if (this.item.spread === false) {
          this.item.spread = true;
        } else {
          this.item.spread = false;
        }
      },
      //保存目标值
      saveGoal: function (id) {
        var _com = this,data = {};
        data.targetValue = this.item.targetValue;
        data.challengeValue = this.item.challengeValue;
        data.id = id;
        this.$emit('saveGoal', data);
      },
      openAdd: function () {
        this.$emit("openAddDia");
      },
      checkIndicator: function (val) {
        this.$emit('checkIndicator',val);
      },
      unCheckIndicator: function (val) {
        this.$emit('unCheckIndicator',val);
      },

    },
    mounted: function () {

    }
  }
</script>

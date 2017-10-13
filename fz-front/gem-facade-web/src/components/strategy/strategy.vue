<!— ***模板  Created by limin on 2017/9/4—>
<template>
  <div class="wrapper targetStystem strategy">
    <page_head></page_head>
    <div class="content_wrapper">
      <content_head show-menu="true"></content_head>
      <div class="content_content">
        <strategy-index @getStep="jump" :msg="msg" v-if="step==1"></strategy-index>
        <strategy-manage @return="getStep" :source-text="text" v-if="step==2"></strategy-manage>
      </div>
    </div>
  </div>
</template>
<script>
  import head from '../common/head.vue'
  import content_head from '../common/content_head.vue'
  import strategyIndex from './strategyIndex.vue'
  import strategyManage from './strategyManage.vue'

  module.exports = {
    data: function () {
      return {
        step:1,
        text:[],//
        yearM:[],
        show_modal:false,
        model_type:'2017年度公司目标系统图',
        form:{
          name:''
        },
        rule:{

        },
        indicatorList: [
          {}
        ],
        headDate: {
          year: '',
          period: '',
          originYear: '',
          originPeriod: ''
        },//顶部日期
      }
    },
    computed: {

    },
    methods: {
      getStep:function (msg) {
        this.step=msg
      },
      jump:function (msg) {
        this.step=2;
        this.text=msg;
//        this.text.push(msg);
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

    },
    components: {
      'page_head': head,
      'content_head': content_head,
      'strategy-index':strategyIndex,
      'strategy-manage':strategyManage
    }
  }
</script>
<style lang='scss'>

</style>

<!-- 内容标题模板  Created by chenzhe on 17/4/14-->
<template>
    <div class="content_head_title clearfix" :class="{dropdown:dropdown}">
      <div class="left_content clearfix" :class="{mt15:button_list}">
        <div class="icon_area" :class="{mt10:dropdown}">
          <i :class="[iconClass]" ></i>
        </div>
        <div class="text_title">
          <p>{{title}}</p>
          <slot name="dropdown_content">
          </slot>
        </div>
      </div>
      <div class="right_content">
        <slot name="button_list" class="button_group"></slot>
        <div class="slot_icon clearfix">
          <el-button size="small" ><i class="fa fa-question-circle-o" aria-hidden="true" ></i></el-button>
          <!--<slot slot="filter_icon" style="float: right" name="icon" @click="open()">-->
          <!--</slot>-->
          <el-button size="small" @click="open()" v-if="showFilter"><i class="fa fa-filter" aria-hidden="true"></i></el-button>
          <el-button size="small" @click="reloadFunction"><i class="fa fa-refresh" aria-hidden="true"></i></el-button>
        </div>
      </div>
    </div>
</template>
<script>
    module.exports = {
      data:function () {
        return{
          dropdown:this.$slots.dropdown_content?true:false,
          button_list:this.$slots.button_list?true:false,
          model:[
            {name:{type:'text',label:'名称',value:''}},
            {password:{type:'password',label:'密码',value:''}},
          ],
        }
      },
      methods:{
        /**
         * 打开筛选器
         */
        open:function () {
          common.openFilter();
//          this.$emit('upup',this.model);
//          common.Hub('open',this.model);
        }
      },
      props:{
        iconClass:{},
        title:{},
        showFilter:{},
        reloadFunction:Function
      },
      mounted:function () {
//        this.reloadFunction()
      }
    }
</script>

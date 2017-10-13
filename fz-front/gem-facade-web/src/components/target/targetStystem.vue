<!--目标系统图组件-->
<template>
  <div class="wrapper targetStystem myTarget">
    <page_head></page_head>
    <div class="content_wrapper">
      <content_head show-menu="true"></content_head>
      <div class="content_content">
        <target-stystem-index v-if="step==1" @go_edit="go_edit"></target-stystem-index>
        <target-stystem-map v-if="step==2" @go_index="go_index" :map-data="mapData" ></target-stystem-map>
      </div>
    </div>
    <el-dialog v-model="show_modal" :title="model_type" @open="clearForm('form')" size="tiny" :close-on-click-modal="false">
      <div class="dialog_title_line"></div>
      <div class="map_edit_content">
        <img src="" alt="" class="map_img">
        <p class="text-center">为公司创建自己的目标系统图</p>
        <el-form ref="form" :model="form" :rules="rule"  >
          <el-form-item >
            <el-input v-model="form.name" type="textarea" placeholder="请输入目标系统图简介"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!--<el-button type="primary" style="width: 100%">主要按钮</el-button>-->
      <div class="btn btn-primary mt10 mb10" style="width: 100%">开始创建目标系统图</div>
      <div class="btn btn-light" style="width: 100%">从其他目标系统图复制</div>
    </el-dialog>
  </div>
</template>

<script>
  import head from '../common/head.vue'
  import content_head from '../common/content_head.vue'
  import targetStystemIndex from './targetStystemIndex.vue'
  import targetStystemMap from './targetStystemMap.vue'

  module.exports = {
    data: function () {
      return {
        step:1,
        mapData:'',
        show_modal:false,
        model_type:'2017年度公司目标系统图',
        form:{
          name:''
        },
        rule:{

        },
        indicatorList: [
          {}
        ]
      }
    },
    computed: {

    },
    methods: {
      go_edit:function (mapData) {
        this.step=2;
        this.mapData=mapData;
      },
      go_index:function () {
        this.step=1;
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
      'target-stystem-index':targetStystemIndex,
      'target-stystem-map':targetStystemMap
    }
  }
</script>

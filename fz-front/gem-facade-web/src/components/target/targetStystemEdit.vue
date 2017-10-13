<!--目标系统图编辑组件-->
<template>
  <div class="map_content">
    <p class="map_name">2017年公司目标系统图<i class="fa fa-question-circle-o ml5 cursor_pointer"></i> <span class="return_prv">返回上一级<i
      class="fa fa-arrow-circle-right ml5"></i></span></p>
    <div class="map_table">
      <tree-grid
        :columns="columns" :tree-structure="true"
        :data-source="dataSource" tree-type="no"
        expand-icon="fa fa-angle-down" normal-icon="fa fa-angle-right"
        icon-color="" expand-icon-color="#3DA8F5"
        button-index="sex,name,age" :button-click="add">
      </tree-grid>
      <div class="transition_button">
        <span >查看目标系统图</span>

      </div>
    </div>
    <div class="btn btn-primary" style="width: 155px;margin: 20px auto;display: block;">提交</div>
    <el-dialog v-model="show_modal" :title="model_type" @open="clearForm('form')" size="tiny"
               :close-on-click-modal="false">
      <div class="dialog_title_line"></div>
      <div class="map_edit_content">
        <img src="" alt="" class="map_img">
        <p class="text-center">为公司创建自己的目标系统图</p>
        <el-form ref="form" :model="form" :rules="rule">
          <el-form-item>
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
  import TreeGrid from '../common/treeTable/vue/TreeGridMapEdit.vue'

  module.exports = {
    data: function () {
      return {
        show_modal: false,
        model_type: '2017年度公司目标系统图',
        form: {
          name: ''
        },
        rule: {},
        columns: [
          {
            text: '信息',
            dataIndex: 'info',
            children: [
              {
                text: '姓名',
                dataIndex: 'name'
              },
              {
                text: 'ID',
                dataIndex: 'id'
              }
            ]
          },
          {
            text: '年龄',
            dataIndex: 'age'
          },
          {
            text: '性别',
            dataIndex: 'sex',
//            children:[
//              {
//                text: '姓名',
//                dataIndex: 'name'
//              },
//              {
//                text: 'ID',
//                dataIndex: 'id'
//              }
//            ]
          }
        ],
        dataSource: [
          {
            id: 1,
            parentId: 0,
            name: '测试1',
            age: 18,
            sex: '男',
            children: [
              {
                id: 2,
                parentId: 1,
                name: '测试2',
                age: 22,
                sex: '+',
                textType: 'button'
              }
            ]
          },
          {
            id: 3,
            parentId: 0,
            name: '测试3',
            age: 23,
            sex: '女',
            children: [
              {
                id: 4,
                parentId: 3,
                name: '测试4',
                age: 22,
                sex: '男'
              },
              {
                id: 5,
                parentId: 3,
                name: '测试5',
                age: 25,
                sex: '男'
              },
              {
                id: 6,
                parentId: 3,
                name: '测试6',
                age: 26,
                sex: '女',
                children: [
                  {
                    id: 7,
                    parentId: 6,
                    name: '测试7',
                    age: 27,
                    sex: '男'
                  }
                ]
              }
            ]
          },
          {
            id: 18,
            parentId: 0,
            name: '测试8',
            age: 18,
            sex: '男'
          }
        ]
      }
    },
    computed: {},
    methods: {
      add: function () {

      },
      modify: function () {

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
//      $('.map_table').jScrollPane();
    },
    components: {
      'page_head': head,
      'content_head': content_head,
      'target-stystem-index': targetStystemIndex,
      'tree-grid': TreeGrid
    }
  }
</script>

<!--两层表头的树形表格(针对目标系统图查看)-->
<template>
  <el-table
    :data="data"
    border
    style="width:100%;"
    :height="height"
    :row-style="showTr">
    <!--修改后代码-->
    <el-table-column v-for="(column, index) in columns" :label="column.name" align="center" :width="column.width" :fixed="column.fixed">
      <template v-if="column.children">
        <el-table-column v-for="(column_, index_) in column.children" :label="column_.name" align="center" :width="column_.width">
          <template scope="scope" >
            <span v-if="spaceIconShow(index,index_)" v-for="(space, levelIndex) in scope.row._level"
                  class="ms-tree-space"></span>
            <a href="javascript:;" class="tree-arrow is-outlined is-primary is-small"
               v-if="toggleIconShow(index,index_,scope.row)" @click="toggle(scope.$index)">
              <i v-if="!scope.row._expanded" :class="normalIcon" :style="{color:iconColor}"></i>
              <i v-if="scope.row._expanded" :class="expandIcon" :style="{color:expandIconColor}"></i>
            </a>
            <span v-else-if="index===0&&index_===0" class="ms-tree-space"></span>
            <div v-if="index>2" >
              <div class="look_table_cell" v-if="scope.row.objects[0].sortedFormDetails&&scope.row.objects[0].sortedFormDetails[index-3]">
                <!--使用处理过的sortdetail做渲染数据-->
                <div class="" v-if="index_===0" v-for="x in scope.row.objects[0].sortedFormDetails[index-3].sortdetail">{{x.indicator?x.indicator.name:''}}</div>
                <div class="" v-if="index_===1" v-for="x in scope.row.objects[0].sortedFormDetails[index-3].sortdetail">{{x.value?x.value.targetValue:''}}</div>
                <div class="" v-if="index_===2" v-for="x in scope.row.objects[0].sortedFormDetails[index-3].sortdetail">{{x.value?x.value.challengeValue:''}}</div>
              </div>
            </div>
            <span v-else-if="index===0">{{scope.row.title}}</span>
            <span v-else-if="index===1">{{scope.row.objects[0].name}}</span>
            <span v-else-if="index===2">{{scope.row.objects[0].employee.realName}}</span>
          </template>
        </el-table-column>
      </template>
      <template scope="scope" >
        <span v-if="spaceIconShow(index,0)" v-for="(space, levelIndex) in scope.row._level"
            class="ms-tree-space"></span>
        <a href="javascript:;" class="tree-arrow is-outlined is-primary is-small"
           v-if="toggleIconShow(index,0,scope.row)" @click="toggle(scope.$index)">
          <i v-if="!scope.row._expanded" :class="normalIcon" :style="{color:iconColor}"></i>
          <i v-if="scope.row._expanded" :class="expandIcon" :style="{color:expandIconColor}"></i>
        </a>
        <span v-else-if="index===0" class="ms-tree-space"></span>
        <div v-if="index>2" >
          <div class="look_table_cell" v-if="scope.row.objects[0].sortedFormDetails&&scope.row.objects[0].sortedFormDetails[index-3]">
            <div class="index_0" v-if="index_===0" v-for="x in scope.row.objects[0].sortedFormDetails[index-3].sortdetails"><span>{{x.indicator.name}}</span></div>
            <div class="index_1" v-if="index_===1" v-for="x in scope.row.objects[0].sortedFormDetails[index-3].sortdetails"><span>{{x.indicator.name}}</span></div>
            <div class="index_2" v-if="index_===2" v-for="x in scope.row.objects[0].sortedFormDetails[index-3].sortdetails">{{x.indicator.name}}</div>
          </div>
        </div>
        <span v-else-if="index===0">{{scope.row.title}}</span>
        <span v-else-if="index===1">{{scope.row.objects[0].name}}</span>
        <span v-else-if="index===2">{{scope.row.objects[0].employee.realName}}</span>

      </template>
    </el-table-column>
    <!--修改前代码-->
    <!--<el-table-column  v-for="(column, index) in columns" :align="index==0?'left':'center'" :key="column.dataIndex"-->
    <!--:label="column.text">-->
    <!--<template scope="scope">-->
    <!--<span v-if="spaceIconShow(index)" v-for="(space, levelIndex) in scope.row._level" class="ms-tree-space"></span>-->
    <!--<a href="javascript:;" class="tree-arrow is-outlined is-primary is-small" v-if="toggleIconShow(index,scope.row)" @click="toggle(scope.$index)">-->
    <!--<i v-if="!scope.row._expanded" :class="normalIcon" :style="{color:iconColor}"></i>-->
    <!--<i v-if="scope.row._expanded" :class="expandIcon" :style="{color:expandIconColor}"></i>-->
    <!--</a>-->
    <!--<span v-else-if="index===0" class="ms-tree-space"></span>-->
    <!--{{scope.row[column.dataIndex]}}-->
    <!--</template>-->
    <!--</el-table-column>-->
    <el-table-column align="center" label="操作" v-if="treeType === 'normal'" :width="operationWidth">
      <template scope="scope">
        <el-button size="small" :disabled="data[scope.$index].init" @click="handleEdit(scope.$index)">
          <i class="fa fa-edit" aria-hidden="true"></i> 编辑
        </el-button>
        <el-button size="small" @click="addChildNode(scope.$index)" :disabled="data[scope.$index].init">
          <slot name="btnName"><i class="fa fa-plus-circle" aria-hidden="true"></i> 添加子节点</slot>
        </el-button>
        <el-button size="small" @click="handleDelete(scope.$index)" :disabled="data[scope.$index].init">
          <slot name="btnName"><i class="fa fa-plus-circle" aria-hidden="true"></i>删除节点</slot>
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
  import Utils from '../utils/index.js'
  //  import Vue from 'vue'
  export default {
    name: 'tree-grid',
    props: {
// 该属性是确认父组件传过来的数据是否已经是树形结构了，如果是，则不需要进行树形格式化
      treeStructure: {
        type: Boolean,
        default: function () {
          return false
        }
      },
// 这是相应的字段展示
      columns: {
        type: Array,
        default: function () {
          return []
        }
      },
// 这是数据源
      dataSource: {
        type: Array,
        default: function () {
          return []
        }
      },
// 这个作用是根据自己需求来的，比如在操作中涉及相关按钮编辑，删除等，需要向服务端发送请求，则可以把url传过来
      requestUrl: {
        type: String,
        default: function () {
          return ''
        }
      },
// 这个是是否展示操作列
      treeType: {
        type: String,
        default: function () {
          return 'normal'
        }
      },
// 是否默认展开所有树
      defaultExpandAll: {
        type: Boolean,
        default: function () {
          return false
        }
      },
      operationWidth: {
//        type: String,
        default: function () {
          return 260
        }
      },
      expandIcon: {
        type: String,
        default: function () {
          return 'el-icon-caret-bottom'
        }
      },
      normalIcon: {
        type: String,
        default: function () {
          return 'el-icon-caret-right'
        }
      },
      nodeIcon: {
        type: String,
        default: function () {
          return ''
        }
      },
      iconColor: {
        type: String,
        default: function () {
          return '#999'
        }
      },
      expandIconColor: {
        type: String,
        default: function () {
          return '#999'
        }
      },
      buttonIndex:{
        type: String,
        default: function () {
          return ''
        }
      },
    },
    data () {
      return {centerStyle: 'center',height:5}
    },
    computed: {
      // 格式化数据源
      data: function () {
        let me = this
        if (me.treeStructure) {
          let data = Utils.MSDataTransfer.treeToArray(me.dataSource, null, null, me.defaultExpandAll)
//          console.log(data)
          return data
        }
        return me.dataSource
      },
    },
    methods: {
      // 显示行
      showTr: function (row, index) {
        let show = (row._parent ? (row._parent._expanded && row._parent._show) : true)
        row._show = show
        return show ? '' : 'display:none;'
      },
      // 展开下级
      toggle: function (trIndex) {
        let me = this
        let record = me.data[trIndex]
        record._expanded = !record._expanded
      },
      // 显示层级关系的空格和图标
      spaceIconShow (index,index_) {
        let me = this
        if (me.treeStructure && index === 0 && index_ === 0) {
          return true
        }
        return false
      },
      // 点击展开和关闭的时候，图标的切换
      toggleIconShow (index,index_, record) {
        let me = this
        if (me.treeStructure && index === 0  && index_ === 0 && record.children && record.children.length > 0) {
          return true
        }
        return false
      },
      // 自定义修改 删除节点方法
      handleDelete (index) {
        this.$emit('delete', this.data[index].id);
      },
      // 自定义添加子节点方法
      addChildNode: function (index) {
        this.$emit('add', true, 1, this.data[index].id);
      },
      // 自定义添加编辑某个节点方法
      handleEdit: function (index) {
        this.$emit('edit', this.data[index].id);
      }
    },
    mounted:function () {
      var height=$(window).height()-330-11-50;
      this.height=height>0?height:100;
    }
  }
</script>
<style scoped>
  .ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-family: 'Glyphicons Halflings';
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: 18px;
    height: 14px;
  }

  .ms-tree-space::before {
    content: ""
  }

  table td {
    line-height: 26px;
  }

  .tree-arrow {
    color: #999;
  }
</style>

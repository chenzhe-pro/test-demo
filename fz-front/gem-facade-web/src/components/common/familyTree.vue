<!-- 家谱树模板  Created by chenzhe on 17/7/5-->
<template>
  <div>
    <ul>
      <li v-for="x in data" :id="x.id" :deep="x.deep">
        <div class="card_node" :class="{stop_status:x.status==='N'}">
          <div class="des">
            <p><span class="node_label">部门名称：</span><span class="node_value" v-text="x.title">总经理</span></p>
            <!--<p><span class="node_label">上级部门</span><span class="node_value" >{{x.parentTitle|null_to_text('无上级部门')}}</span></p>-->
          </div>
          <div class="op">
            <a href="javascript:;" @click="addNode(true,'新增部门卡片',x)" v-if="x.status==='Y'"><i class="fa fa-plus"></i> 新增直属部门</a>
            <a href="javascript:;" @click="editNode(true,'编辑部门卡片',x)" v-if="x.status==='Y'"><i class="fa fa-edit"></i> 编辑</a>
            <a href="javascript:;" @click="openDep(x)" v-if="x.status==='N'" style="margin: 0">启用</a>
          </div>
        </div>
        <family-tree-node v-if="x.children" :data="x.children" @addNode="addNode" @editNode="editNode" @openDep="openDep"></family-tree-node>
      </li>
    </ul>
  </div>
</template>
<script>
    module.exports = {
      name:'familyTreeNode',
      data: function () {
        return {

        }
      },
      props:{
        data:{},
        clickAddNode:{},
        clickEditNode:{}
      },
      methods:{
        addNode:function (operateType,modalType,node) {
          this.$emit('addNode',operateType,modalType,node);
        },
        editNode:function (operateType,modalType,node) {
          this.$emit('editNode',operateType,modalType,node);
        },
        openDep:function (node) {
          this.$emit('openDep',node);
        }
      },
      mounted:function () {

      }
    }
</script>


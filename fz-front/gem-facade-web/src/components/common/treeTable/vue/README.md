TreeGrid是通用组件
示例用法
<tree-grid  @add="add" @edit="modify"
  :columns="columns" :tree-structure="true"
  :data-source="dataSource" tree-type="no"
  expand-icon="fa fa-angle-down" normal-icon="fa fa-angle-right"
  icon-color="" expand-icon-color="#3DA8F5"
  button-index="sex,name,age" button-click="add">
</tree-grid>

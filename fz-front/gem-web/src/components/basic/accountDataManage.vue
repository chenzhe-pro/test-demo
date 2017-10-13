<template>
  <div class="wrapper">
    <page-head></page-head>
    <page-menu></page-menu>
    <div class="content_wrapper basicManage ivu-article">
      <div class="content_head clearfix">
        <content_head icon-class="fa fa-briefcase" title="账户资料管理" :reload-function="getAllDatas">
          <!--<el-dropdown slot="dropdown_content">-->
            <!--<span class="el-dropdown-link">-->
            <!--所有资料<i class="el-icon-caret-bottom el-icon&#45;&#45;right"></i></span>-->
            <!--<el-dropdown-menu slot="dropdown">-->
              <!--<el-dropdown-item>个人中心</el-dropdown-item>-->
              <!--&lt;!&ndash;<el-dropdown-item>退出</el-dropdown-item>&ndash;&gt;-->
            <!--</el-dropdown-menu>-->
          <!--</el-dropdown>-->
          <el-button-group slot="button_list">
            <el-button size="small" @click="addDatas(bool,0)">新建</el-button>
            <!--<el-button size="small" >导入</el-button>-->
            <el-button size="small" icon="caret-bottom" disabled></el-button>
          </el-button-group>
        </content_head>
      </div>
      <div class="content_content clearfix">
        <tree-grid :msg="index" @add="addDatas" @edit="show" :columns="columns" :tree-structure="true" :data-source="dataSource">
        </tree-grid>
        <el-pagination v-if="pagination.rowCount>pagination.pageSize"  class="fr page" size="small" ref="page" :page-size="pagination.pageSize"
                       @current-change="handleCurrentChange" :current-page="pagination.currentPage"
                       :total="pagination.rowCount" show-total show-elevator></el-pagination>
        <!--过滤器-->
      </div>
      <!--基础资料模态框-->
      <el-dialog v-model="modalData" :title="titleName">
        <el-form ref="formEdit" :model="formEdit" :rules="ruleValidate" label-width="85px" class="demo-ruleForm">
          <el-form-item label="名称" prop="name">
            <el-input v-model="formEdit.name" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="formEdit.description"></el-input>
          </el-form-item>
          <el-form-item label="启用状态" prop="status">
          <el-switch v-model="formEdit.status" on-text="启用" off-text="关闭" size="large"></el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button type="text" @click="clearForm('formEdit')">取消</el-button>
          <el-button type="primary" @click="save('formEdit')">保存</el-button>
        </div>
      </el-dialog>
    </div>
    <!--<page-foot></page-foot>-->
  </div>
</template>
<script>
  import head from '../common/head.vue'
  import menu from '../common/menu.vue'
  import foot from '../common/foot.vue'
  import content_head from '../common/content_head.vue'
  import filter_form from '../common/filter_form.vue'
  import TreeGrid from '../common/treeTable/vue/TreeGrid.vue'

  import com_ready from '../../assets/js/componentReady'
  module.exports = {
    data: function () {
      return {
        pagination: {//分页
          totalPage: 0,
          rowCount: 0,
          pageSize: 12,
          currentPage: 1,
        },
        id:'',
        add_node_type:1,//新建结点的类型,可以是根结点1或者子结点0
        titleName: '',
        modalData: false,//用户对话框
        columns: [
          {
            text: '名称',
            dataIndex: 'title'
          },
          {
            text: '编码',
            dataIndex: 'code'
          },
          {
            text: '描述',
            dataIndex: 'description'
          },
          {
            text: '状态',
            dataIndex: 'statusText'
          }
        ],
        dataSource: [
        ],
        formEdit: {
          name: '',
          status:'',
          description: '',
          id: '',
          catalog:'',
          type:'',
          preData:'',
        },
        ruleValidate: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '编码不能为空', trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      /**
       * 切换页码时列表渲染当前选中页码
       */
      handleCurrentChange(val) {
        this.pagination.currentPage = val;
        this.getAllDatas();
      },
      /**
       * 添加基础资料
       */
      addDatas: function (bool,type,id) {
        var _com = this;
        _com.id=id;
        this.add_node_type=type;
        _com.titleName = '添加基础资料';
        if (_com.$refs['formEdit']) {
          _com.$refs['formEdit'].resetFields();
        }
        for(var key in _com.formEdit){
          _com.formEdit[key]=''
        }
        _com.modalData = true;
      },
      /**
       * 点击查看单个基础资料信息
       * @param index 选中用户的索引值
       */
      show: function (id) {
        var _com = this;
        this.$http.get(common.projectPath + 'sys/basicdata/detail/' + id, {})
          .then(function (data) {
            data = data.body;
            if (data.code=='SUCCESS') {
              _com.titleName = '编辑基础资料';
              _com.formEdit = data.data;
              if(_com.formEdit.parent){
                _com.formEdit.preData=_com.formEdit.parent.id}
              if(_com.formEdit.status=='Y'){
                _com.formEdit.status=true;
              }else{
                _com.formEdit.status=false;
              }
              _com.modalData = true;
            } else {
              _com.$message.error(data.message);
            }
          })
      },
      /**
       * 点击保存新添加或者已修改的基础资料信息
       * @param index 表单的模型名字
       */
      save: function (formName) {
        var _com = this, data,url = '';
        data = {
          name: _com.formEdit.name,
          type:'codeRuleType',
          status: _com.formEdit.status?'Y':'N',
          catalog:'codeRule',
          description:_com.formEdit.description,
        }
        if (_com.titleName == '添加基础资料') {
          url = 'sys/basicdata/save'
          if(_com.add_node_type)//根1 子0
          {
            data.parent={
              id:_com.id
            };
          }else{
            data.parent=null;
          }
        } else {
          url = 'sys/basicdata/update';
          data.id = _com.formEdit.id;
        }
        this.$refs[formName].validate(function (valid) {
          if (valid) {//验证通过
            _com.$http.post(common.projectPath + url, data, {
              emulateJDataSON: false
            }).then(function (data) {
              data = data.body;
              if (data.code!=='SUCCESS') {//验证失败
                _com.$message.error(data.message);
              } else {
                _com.$message.success('提交成功!');
                _com.modalData = false;
                _com.getAllDatas();
              }
            })
          }
        })
      },
      /**
       * 清空对应表单模型
       * @param index 表单的模型名字
       */
      clearForm: function (formName) {
        var _com = this;
        _com.$refs[formName].resetFields();
        _com.modalData = false;
      },
      /**
       * 获取所有基础资料信息
       */
      getAllDatas: function () {
        var _com = this,data={
        };
        _com.$http.post(common.projectPath + 'sys/basicdata/listTree/Account/AccountType',data,{
        }).then(function (data) {
          data = data.body;
          if (data.code=='SUCCESS') {
            for(var key in data.data){
              _com.dataSource=data.data;
              var list = data.data;
              common.eachTree(list, function (e) {
                if(e.status=='Y'){
                  e.statusText='已启用'
                }else{
                  e.statusText='已禁用'
                }
              });
              _com.dataSource = list;
            }
            _com.pagination.rowCount = data.total;
          }else{
            _com.$message.error(data.message);
          }
        })
      },
    },
    components: {
      'page-head': head,
      "page-menu": menu,
      'page-foot': foot,
      'content_head': content_head,
      'filter_form':filter_form,
      'tree-grid':TreeGrid
    },
    mounted: function () {
      var _com = this;
      _com.getAllDatas();
      this.$nextTick(function () {
        quicker.returnTop();
        com_ready();
      });
    },
  }
</script>

<style lang='scss'>

</style>

<template>
  <div class="wrapper">
    <page-head></page-head>
    <page-menu></page-menu>
    <div class="content_wrapper roleManage ivu-article">
      <div class="content_head clearfix">
        <content_head icon-class="fa fa-crosshairs" title="业务领域管理" :show-filter="false" :reload-function="getDomains">
          <el-button-group slot="button_list">
            <el-button size="small" @click="addDomain()">新建</el-button>
            <!--<el-button size="small" >导入</el-button>-->
            <el-button size="small" icon="caret-bottom" disabled></el-button>
          </el-button-group>
        </content_head>
      </div>
      <div class="content_content clearfix" v-loading="loading">
        <el-table border :content="self" :data="roleData">
          <el-table-column label="编码" align="center" prop="code">
          </el-table-column>
          <el-table-column label="名称" align="center" prop="name">
          </el-table-column>
          <el-table-column label="描述" align="center" prop="remark">
          </el-table-column>
          <el-table-column label="状态" align="center" prop="statusText">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template scope="scope">
              <el-button size="small" @click="edit(scope.$index, scope.row)">
                <i class="fa fa-edit" aria-hidden="true"></i>
                编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <filter_form :filter-function="getDomains">
        </filter_form>
        <el-pagination v-if="pagination.rowCount>pagination.pageSize" class="fr page" ref="page"
                       :total="pagination.rowCount" :page-size="pagination.pageSize"
                       size="small" show-total show-elevator :current-page="pagination.currentPage"
                       @current-change='handleCurrentChange'></el-pagination>
      </div>
      <!--编辑-->
      <el-dialog v-model="modalDomain" :title="formTitle">
        <el-form ref="domainForm" :model="domainForm" label-width="80px" label-position="right" :rules="ruleValidate">
          <el-form-item label="名称" prop="name">
            <el-input v-model="domainForm.name"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="remark">
            <el-input v-model="domainForm.remark"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-switch v-model="domainForm.status" on-text="启用" off-text="关闭" size="large"></el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button type="text" size="large" @click="clearForm('domainForm')">取消</el-button>
          <el-button type="primary" size="large" @click="saveDomain('domainForm')">保存</el-button>
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
  import com_ready from '../../assets/js/componentReady'
  import filter_form from '../common/filter_form.vue'

  module.exports = {
    data: function () {
      return {
        loading: false,
        modalDomain: false,
        formTitle: '业务领域信息',
        titleKey: '',
        modalMenu: false,
        selMenu: [],//选择菜单
        roleData: [],//table展示表格
        pagination: {//分页
          totalPage: 0,
          rowCount: 0,
          pageSize: 12,
          currentPage:1
        },
        domainForm: {//角色详情弹出框
          code: '',
          name: '',
          status:'',
          remark:''
        },
        ruleValidate: {// modalDomain模态框验证
          name: [
            {required: true, message: '名字不能为空', trigger: 'blur'}
          ],
          remark: [
            {required: true, message: '描述不能为空', trigger: 'blur'}
          ],
        },
      }
    },
    methods: {
      /**
       * 显示选中页的内容
       * @param 选中页的索引
       */
      handleCurrentChange: function (val) {
        var _com = this;
        _com.pagination.currentPage = val;
        _com.getDomains();
      },
      /**
       * 获取角色列表
       */
      getDomains: function (filter) {
        var _com = this,data={
          data:{},
          page:_com.pagination.currentPage,
          pageSize:_com.pagination.pageSize,
          sorts:[{"field":"createdAt", "sortModel":"DESC"}]
        };
        _com.loading = true;
        if(filter){
          data.data=filter;
        }
        _com.$http.post(common.projectPath + 'sys/domain/list',data,{
        }).then(function (data) {
          data = data.body;
          if (data.code!=='SUCCESS') {
            _com.$message.error(data.message);
          } else {
            _com.pagination.rowCount = data.total;
            for(var key in data.data){
              if(data.data[key].status=='Y'){
                data.data[key].statusText='已启用'
              }else{
                data.data[key].statusText='已禁用'
              }
            }
            _com.roleData = data.data;
            setTimeout(function () {
              _com.loading=false;
            },300);
          }
        })
      },
      /**
       * 添加角色
       */
      addDomain: function () {
        var _com = this;
        _com.formTitle = '添加业务领域信息';
        _com.titleKey = 'add';
        if (_com.$refs['domainForm']) {
          _com.$refs['domainForm'].resetFields();
        }
        _com.domainForm.name = '';
        _com.domainForm.remark = '';
        _com.domainForm.status = '';
        _com.modalDomain = true;
      },
      /**
       * 编辑角色
       * @param index 单个角色详情在table中的索引
       */
      edit: function (index, row) {
        var _com = this,
          id = _com.roleData[index].id,
          url = 'sys/domain/detail/' + id;
        _com.modalDomain = true;
        _com.formTitle = '编辑业务领域信息';
        _com.titleKey = 'edit';
        _com.$http.get(common.projectPath + url, {
          params: {}
        }).then(function (data) {
          data = data.body;
          if (data.code!=='SUCCESS') {
            _com.$message.error(data.message);
          } else {
            _com.domainForm = data.data;
            if(_com.domainForm.status=='Y'){
              _com.domainForm.status=true;
            }else{
              _com.domainForm.status=false;
            }
            _com.modalDomain = true;
          }
        })
      },
      /**
       * !添加或者修改确定,保存
       * @param formName 表单模型,输入验证
       */
      saveDomain: function (formName) {
        var _com = this, url;
        _com.$refs[formName].validate(function (valid) {
          if (valid) {//验证通过
            var data = {
                name: _com.domainForm.name,
                status:_com.domainForm.status? 'Y':'N',
                remark:_com.domainForm.remark
            };
            if (_com.titleKey === 'add') {
              url = 'sys/domain/save';
            } else {
              data.id = _com.domainForm.id;
              url = 'sys/domain/modify';
            }
            _com.$http.post(common.projectPath + url, data, {
              emulateJSON: false
            }).then(function (data) {
              data = data.body;
              if (data.code=='SUCCESS') {
                _com.$message.success('保存成功!');
                _com.modalDomain = false;
                _com.getDomains();
              } else {//验证失败
                _com.$message.error('请求失败,重新输入!');
              }
            })
          }
        })
      },
      /**
       * 清空模态框表单
       * @param formName 表单模型
       */
      clearForm: function (formName) {
        var _com = this;
        _com.$refs[formName].resetFields();
        _com.modalDomain = false;
      },
    },
    components: {
      'page-head': head,
      "page-menu": menu,
      'page-foot': foot,
      'content_head': content_head,
      'filter_form':filter_form,
    },
    mounted: function () {
      var _com = this;
      this.$nextTick(function () {
        quicker.returnTop();
        com_ready();
        _com.getDomains();
      });
    }
  }
</script>


<style lang='scss'>

</style>

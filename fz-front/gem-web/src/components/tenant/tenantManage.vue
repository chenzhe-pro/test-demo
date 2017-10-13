<template>
  <div class="wrapper">
    <page-head></page-head>
    <page-menu></page-menu>

    <div class="content_wrapper userManage ivu-article">
      <div class="content_head clearfix">
        <content_head icon-class="fa fa-university" title="租户管理" show-filter="true" :reload-function="getAllUsers">
          <!--<el-dropdown slot="dropdown_content">-->
            <!--<span class="el-dropdown-link">-->
            <!--所有租户<i class="el-icon-caret-bottom el-icon&#45;&#45;right"></i></span>-->
            <!--<el-dropdown-menu slot="dropdown">-->
              <!--<el-dropdown-item>个人中心</el-dropdown-item>-->
              <!--&lt;!&ndash;<el-dropdown-item>退出</el-dropdown-item>&ndash;&gt;-->
            <!--</el-dropdown-menu>-->
          <!--</el-dropdown>-->
          <!--<el-button-group slot="button_list">-->
            <!--<el-button size="small" >新建</el-button>-->
            <!--&lt;!&ndash;<el-button size="small" >导入</el-button>&ndash;&gt;-->
            <!--<el-button size="small" icon="caret-bottom"></el-button>-->
          <!--</el-button-group>-->
        </content_head>
      </div>
      <div class="content_content clearfix">
        <el-table :columns="columnsTab" border :data="tenant_list" width="100%">
          <el-table-column align="center" prop="enterpriseName" label="企业名称" width=""></el-table-column>
          <el-table-column align="center" prop="mobilePhone" label="手机号码" width=""></el-table-column>
          <!--<el-table-column align="center" prop="password" label="密码" width=""></el-table-column>-->
          <el-table-column align="center" prop="mail" label="邮箱" width=""></el-table-column>
          <el-table-column align="center" prop="statusText" label="状态" width=""></el-table-column>
          <el-table-column align="center" label="操作" width="">
            <template scope="scope">
              <el-button @click="show(scope.$index)" size="small"><i class="fa fa-edit" aria-hidden="true"></i> 编辑
              </el-button>
              <el-button size="small" v-if="tenant_list[scope.$index].delf==='N'" @click="remove(scope.$index)" :plain="true" type="danger"><i class="fa fa-trash" aria-hidden="true"></i> 删除
              </el-button>
             <el-button size="small" :disabled="true" v-else>已删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-if="pagination.rowCount>pagination.pageSize" class="fr page" size="small" ref="page" :page-size="pagination.pageSize"
                       @current-change="handleCurrentChange" :current-page="pagination.currentPage"
                       :total="pagination.rowCount" show-total show-elevator></el-pagination>
        <filter_form :filter-function="getAllUsers">
        </filter_form>
      </div>
      <!--租户模态框-->
      <el-dialog v-model="modalUser" :title="titleName">
        <el-form ref="formEdit" :model="formEdit" :rules="ruleValidate" label-width="85px" class="demo-ruleForm">
          <el-form-item label="企业名称" prop="enterpriseName">
            <el-input v-model="formEdit.enterpriseName"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="formEdit.password" type="password" icon="close" @click="clear"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" >
            <el-input v-model="formEdit.mobilePhone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" >
            <el-input v-model="formEdit.mail"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="formEdit.status">
              <el-option v-for="(item,index) in statusList" :value="index" :label="item"></el-option>
            </el-select>
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
        tenant_list: [],//数据
        statusList: [],//状态数据
        titleName: '添加用户',
        modalOrg: false,//部门对话框
        modalUser: false,//用户对话框
        formEdit: {
          enterpriseName: '',
          mail:'',
          status:'',
          password: '',
          mobilePhone: '',
          id: '',
        },
        ruleValidate: {
          enterpriseName: [
            {required: true, message: '姓名不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ],
          mail: [
            {required: true, message: '邮箱不能为空', trigger: 'blur'},
          ],
          mobilePhone: [
            {required: true, message: '电话号码不能为空', trigger: 'blur'},
          ],
        },
//        modelUrl:common.projectPath + 'sys/general/list/conds'
      }
    },
    methods: {
      /**
       * 切换页码时列表渲染当前选中页码
       */
      handleCurrentChange(val) {
        this.pagination.currentPage = val;
        this.getAllUsers();
      },
      /**
       * 添加租户
       */
      addUser: function () {
        var _com = this;
        _com.titleName = '添加租户';
        if (_com.$refs['formEdit']) {
          _com.$refs['formEdit'].resetFields();
        }
        for(var key in _com.formEdit){
          _com.formEdit[key]=''
        }
        _com.modalUser = true;
      },
      /**
       * 点击查看单个租户信息
       * @param index 选中租户的索引值
       */
      show: function (index) {
        var _com = this;
        this.$http.get(common.projectPath + 'tat/tenant/detail/' + _com.tenant_list[index].id, {})
          .then(function (data) {
          data = data.body;
          if (data.code=='SUCCESS') {
            _com.titleName = '编辑租户';
            _com.formEdit = data.data;
            _com.formEdit.password = '00000000';
            _com.modalUser = true;
          } else {
            _com.$message.error(data.message);
//            _com.formEdit.password = '00000000';
          }

        })
      },
      /**
       * 删除单个租户信息
       * @param index 选中删除的租户的索引值
       */
      remove: function (index) {
        var _com = this, data;
        _com.$confirm('此操作将永久删除该租户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          _com.$http.get(common.projectPath + 'tat/tenant/delete/' + _com.tenant_list[index].id, {
//          emulateJSON:true
            params: {}
          }).then(function (data) {
            data = data.body;
            if (data.code!=='SUCCESS') {
              _com.$message.error(data.message);
            } else {
              _com.$message.success('删除成功!');
              if (_com.pagination.rowCount % 10 == 1) {
                window.location.reload();
              }
              _com.getAllUsers();
            }
          })
        }).catch(function () {

        })
      },
      /**
       * 点击保存新添加或者已修改的租户信息
       * @param index 表单的模型名字
       */
      save: function (formName) {
        var _com = this, data;
        var url = '';
        data = {
            mail: _com.formEdit.mail,
            enterpriseName: _com.formEdit.enterpriseName,
            status: _com.formEdit.status,
            mobilePhone: _com.formEdit.mobilePhone,
            id:_com.formEdit.id
        }

          url = 'tat/tenant/update';
          if (_com.formEdit.password !== '00000000') {
            data.password = _com.formEdit.password;
          }
        this.$refs[formName].validate(function (valid) {
          if (valid) {//验证通过
            _com.$http.post(common.projectPath + url, data, {
              emulateJSON: false
            }).then(function (data) {
              data = data.body;
              if (data.code!=='SUCCESS') {//验证失败
                _com.$message.error(data.message);
              } else {
                _com.$message.success('提交成功!');
                _com.modalUser = false;
                _com.getAllUsers();
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
        _com.modalUser = false;
      },
      /**
       * 清空需要修改的用户密码
       */
      clear: function () {
        this.formEdit.password = ''
      },
      /**
       * 获取所有租户信息
       */
      getAllUsers: function (filter) {
        var _com = this,
          data={
//            data:{
//            },
            page:_com.pagination.currentPage,
            pageSize:_com.pagination.pageSize,
//            sorts:[{"field":"createdAt", "sortModel":"DESC"}]
          };
        if(filter){
          data.data=filter;
        }
        _com.$http.post(common.projectPath + 'tat/tenant/pageList',data, {
          emulateJSON: false
        }).then(function (data) {
          console.log(data)
          data = data.body;
          if (data.code=='SUCCESS') {
            _com.tenant_list=data.data;
            _com.pagination.rowCount = data.total;
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      /**
       * 获取所有状态信息
       */
      getStatusList: function () {
        var _com = this
        _com.$http.get(common.projectPath + 'tat/tenant/statuses', {params: {}}).then(function (data) {
          data = data.body
          if (data.code=='SUCCESS') {
            _com.statusList = data.data;
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
      'filter_form':filter_form
    },
    mounted: function () {
      var _com = this;
      _com.getAllUsers();
      _com.getStatusList();
      this.$nextTick(function () {
        quicker.returnTop();
        com_ready();
      });
    },

  }
</script>

<style lang='scss'>

</style>

<template>
  <div class="wrapper">
    <page-head></page-head>
    <page-menu></page-menu>

    <div class="content_wrapper userManage ivu-article">
      <div class="content_head clearfix">
        <content_head icon-class="fa fa-user-circle" title="账户管理" show-filter="true" :reload-function="getAllUsers">
          <el-button-group slot="button_list">
            <el-button size="small" @click="addUser()">新建</el-button>
            <!--<el-button size="small" >导入</el-button>-->
            <el-button size="small" icon="caret-bottom" disabled></el-button>
          </el-button-group>
        </content_head>
      </div>
      <div class="content_content clearfix">
        <!--<el-button size="small" type="primary" class="" @click="addUser()" icon="plus">新增员工</el-button>-->
        <el-table :columns="columnsTab" border :data="user_list" width="100%">
          <el-table-column align="center" prop="code" label="编码" width=""></el-table-column>
          <el-table-column align="center" prop="mobilePhone" label="手机号码" width=""></el-table-column>
          <el-table-column align="center" prop="mail" label="邮箱" width=""></el-table-column>
          <!--<el-table-column align="center" prop="password" label="密码" width=""></el-table-column>-->
          <!--<el-table-column align="center" prop="partment" label="部门" width=""></el-table-column>-->
          <el-table-column align="center" prop="statusText" label="状态" width=""></el-table-column>
          <el-table-column align="center" label="操作" width="">
            <template scope="scope">
              <el-button @click="show(scope.$index)" size="small"><i class="fa fa-edit" aria-hidden="true"></i> 编辑
              </el-button>
              <!--<el-button size="small" type="danger" @click="remove(scope.$index)"><i class="fa fa-trash"-->
                                                                                     <!--aria-hidden="true"></i> 删除-->
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-if="pagination.rowCount>pagination.pageSize" class="fr page" size="small" ref="page" :page-size="pagination.pageSize"
                       @current-change="handleCurrentChange" :current-page="pagination.currentPage"
                       :total="pagination.rowCount" show-total show-elevator></el-pagination>
        <filter_form :filter-function="getAllUsers">
        </filter_form>
      </div>
      <!--账户模态框-->
      <el-dialog v-model="modalUser" :title="titleName">
        <el-form ref="formEdit" :model="formEdit" :rules="ruleValidate" label-width="85px" class="demo-ruleForm">
          <el-form-item label="电话号码" prop="mobilePhone">
            <el-input v-model="formEdit.mobilePhone" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="mail">
            <el-input v-model="formEdit.mail"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="formEdit.password" type="password" icon="close" @click="clear"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="roles">
            <el-select v-model="formEdit.roles" multiple>
              <el-option v-for="item in roles" :value="item.value" :label="item.label"></el-option>
            </el-select>
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
        user_list: [],//账户数据
        roles: [],//角色数据
        titleName: '添加账户',
        modalUser: false,//账户对话框
        formEdit: {
          mail: '',
          password: '',
          originPwd: '',
          mobilePhone: '',
          roles: [],
          id: '',
          status:''
        },
        ruleValidate: {
          name: [
            {required: true, message: '姓名不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ],
          mobilePhone: [
//            {required: true, message: '电话号码不能为空', trigger: 'blur'},
            {message: '填写正确电话号码', trigger: 'blur',pattern:/^0?(13[0-9]|15[012356789]|177|18[0-9]|14[57])[0-9]{8}$/}
          ],
          mail: [
//            {required: true, message: '邮箱不能为空', trigger: 'blur'},
            {message: '填写正确邮箱地址', trigger: 'blur',pattern:/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/}
          ],
          roles: [
            {required: true, type: 'array', message: '角色不能为空', trigger: 'change'},
          ]
        }
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
       * 添加账户
       */
      addUser: function () {
        var _com = this;
        _com.titleName = '添加账户';
        if (_com.$refs['formEdit']) {
          _com.$refs['formEdit'].resetFields();
        }
        _com.formEdit.mail = '';
        _com.formEdit.password = '';
        _com.formEdit.mobilePhone = '';
        _com.formEdit.roles = [];
        _com.modalUser = true;
      },
      /**
       * 点击查看单个账户信息
       * @param index 选中账户的索引值
       */
      show: function (index) {
        var _com = this;
        this.$http.get(common.projectPath + 'sys/account/detail/' + _com.user_list[index].id, {}).then(function (data) {
          data = data.body;
          if (data.code!=='SUCCESS') {
            _com.$message.error(data.message);
          } else {
            _com.titleName = '编辑账户';
            if(data.data.roles)
            for (var i = 0; i < data.data.roles.length; i++) {
              data.data.roles[i] = data.data.roles[i].id;
            }
            _com.formEdit = data.data;
            _com.formEdit.password = '00000000';
            if(_com.formEdit.status=='Y'){
              _com.formEdit.status=true;
            }else{
              _com.formEdit.status=false;
            }
            _com.modalUser = true;
          }

        })
      },
      /**
       * 点击保存新添加或者已修改的账户信息
       * @param index 表单的模型名字
       */
      save: function (formName) {
        var _com = this, data;
        var url = '';
        data = {
            roleIds: _com.formEdit.roles,
            mail: _com.formEdit.mail,
            mobilePhone: _com.formEdit.mobilePhone,
            status:_com.formEdit.status? 'Y':'N'
        }
        if (_com.titleName == '添加账户') {
          url = 'sys/account/add'
          data.password = _com.formEdit.password;
        } else {
          url = 'sys/account/update';
          data.id = _com.formEdit.id;
          if (_com.formEdit.password !== '00000000') {
            data.password = _com.formEdit.password;
          }
        }
        this.$refs[formName].validate(function (valid) {
          if (valid) {//验证通过
            if(_com.formEdit.mobilePhone||_com.formEdit.mail){
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
            }else{
              _com.$message.error('电话号码和邮箱至少填一个!');
            }

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
       * 清空需要修改的账户密码
       */
      clear: function () {
        this.formEdit.password = ''
      },
      /**
       * 获取所有账户信息
       */
      getAllUsers: function (filter) {
        var _com = this,data={
          page:_com.pagination.currentPage,
          pageSize:_com.pagination.pageSize,
          sorts:[{"field":"createdAt", "sortModel":"DESC"}]
        };
        if(filter){
          data.data=filter;
        }
        _com.$http.post(common.projectPath + 'sys/account/pageList',data, {

        }).then(function (data) {
          data = data.body;
          if (data.code!=='SUCCESS') {
            _com.$message.error(data.message);
          } else {
            if (data.data) {
              _com.pagination.rowCount = data.total;
              _com.user_list = data.data;
            }
            else {
              _com.user_list = [];
            }
          }
        })
      },
      /**
       * 获取所有角色信息
       */
      getRoleList: function () {
        var _com = this,data={
          data:{}
        };
        _com.$http.post(common.projectPath + 'sys/role/list',data,{

        }).then(function (data) {
          data = data.body
          if (data.data) {
            var roles = data.data;
            for (var i = 0; i < roles.length; i++) {
              roles[i].value = roles[i].id;
              roles[i].label = roles[i].name;
            }
            _com.roles = roles;
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
    },
    mounted: function () {
      var _com = this;
      _com.getAllUsers();
      _com.getRoleList();
      this.$nextTick(function () {
        quicker.returnTop();
        com_ready();
      });
    },

  }
</script>

<style lang='scss'>

</style>

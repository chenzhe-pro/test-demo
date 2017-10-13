<template>
  <div class="wrapper">
    <page-head></page-head>
    <page-menu></page-menu>
    <div class="content_wrapper roleManage ivu-article">
      <div class="content_head clearfix">
        <content_head icon-class="fa fa-crosshairs" title="角色管理" show-filter="true" :reload-function="getForm">
          <el-button-group slot="button_list">
            <el-button size="small" @click="addRole()">新建</el-button>
            <!--<el-button size="small" >导入</el-button>-->
            <el-button size="small" icon="caret-bottom" disabled></el-button>
          </el-button-group>
        </content_head>
      </div>
      <div class="content_content clearfix">
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
        <filter_form :filter-function="getForm">
        </filter_form>
        <el-pagination v-if="pagination.rowCount>pagination.pageSize" class="fr page" ref="page"
                       :total="pagination.rowCount" :page-size="pagination.pageSize"
                       size="small" show-total show-elevator :current-page="pagination.currentPage"
                       @current-change='handleCurrentChange'></el-pagination>
      </div>
      <!--编辑-->
      <el-dialog v-model="modalRole" :title="formTitle">
        <el-form ref="roleForm" :model="roleForm" label-width="80px" label-position="right" :rules="ruleValidate">
          <el-form-item label="名称" prop="name">
            <el-input v-model="roleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="菜单" prop="menuIdList">
            <el-button @click="selectMenu()"><i class="fa fa-sitemap" aria-hidden="true"></i> 选择菜单</el-button>
          </el-form-item>
          <el-form-item label="描述" prop="remark">
            <el-input v-model="roleForm.remark"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-switch v-model="roleForm.status" on-text="启用" off-text="关闭" size="large"></el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button type="text" size="large" @click="clearForm('roleForm')">取消</el-button>
          <el-button type="primary" size="large" @click="saveRole('roleForm')">保存</el-button>
        </div>
      </el-dialog>
      <el-dialog v-model="modalMenu" title="选择菜单" size="tiny">
        <div slot="title" style="display: inline-block;width: 100px;line-height: 28px;font-weight: bold;">
          <span>选择菜单</span>
        </div>
        <el-form ref="roleMenu" @keypress.13="saveMenu()">
          <el-form-item>
            <el-tree ref="menuTree" :data="selMenu" show-checkbox node-key="id"></el-tree>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button type="text" size="small" @click="modalMenu=false">取消</el-button>
          <el-button type="primary" size="small" @click="saveMenu()">保存</el-button>
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
        modalRole: false,
        formTitle: '角色信息',
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
        roleForm: {//角色详情弹出框
          name: '',
          status:'',
          menuIdList:[],
          menus:[],
          remark:''
        },
        ruleValidate: {// modalRole模态框验证
          name: [
            {required: true, message: '名字不能为空', trigger: 'blur'}
          ],
          menuIdList: [
            {required: true, type: 'array', message: '菜单不能为空', trigger: 'blur'}
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
        _com.getForm();
      },
      /**
       * 获取角色列表
       */
      getForm: function (filter) {
        var _com = this,data={
          data:{},
          page:_com.pagination.currentPage,
          pageSize:_com.pagination.pageSize,
          sorts:[{"field":"createdAt", "sortModel":"DESC"}]
        };
        if(filter){
          data.data=filter;
        }
        _com.$http.post(common.projectPath + 'sys/role/list',data,{
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
          }
        })
      },
      /**
       * 添加角色
       */
      addRole: function () {
        var _com = this;
        _com.formTitle = '添加角色信息';
        _com.titleKey = 'add';
        if (_com.$refs['roleForm']) {
          _com.$refs['roleForm'].resetFields();
        }
        _com.roleForm.menus = [];
        _com.roleForm.name = '';
        _com.roleForm.status = '';
        _com.roleForm.menuIdList = [];
        _com.modalRole = true;
      },
      /**
       * 编辑角色
       * @param index 单个角色详情在table中的索引
       */
      edit: function (index, row) {
        var _com = this,
          id = _com.roleData[index].id,
          url = 'sys/role/detail/' + id;
        _com.modalRole = true;
        _com.formTitle = '编辑角色信息';
        _com.titleKey = 'edit';
        _com.$http.get(common.projectPath + url, {
          params: {}
        }).then(function (data) {
          data = data.body;
          if (data.code!=='SUCCESS') {
            _com.$message.error(data.message);
          } else {
            var menuIdList = [];
            _com.roleForm = data.data;
            if (_com.roleForm.menus) {//从接口传回来的数据中获取当前角色已有菜单信息,对其对应ID列表进行转换
              for (var j = 0; j < _com.roleForm.menus.length; j++) {
                menuIdList.push(_com.roleForm.menus[j].id);
              }
              _com.roleForm.menuIdList = menuIdList;
            }
            if(_com.roleForm.status=='Y'){
              _com.roleForm.status=true;
            }else{
              _com.roleForm.status=false;
            }
            _com.modalRole = true;
          }
        })
      },
      /**
       * 选择菜单,点击查看菜单后弹出模态框
       */
      selectMenu: function () {
        var _com = this,
          url = 'sys/menu/list',data={
            data:{}
          };
        _com.modalMenu = true;
        _com.$http.post(common.projectPath + url,data, {
          params: {},
        }).then(function (data) {
            data = data.body;
            if (data.code=='SUCCESS') {
              var list = data.data;
              common.eachTree(list, function (e) {
                e.label = e.title;
              });
              _com.selMenu = list;//输出全菜单。然后在下面的for 循环中进行对应的checked渲染
              _com.$nextTick(function () {
                if (_com.roleForm.menus) {
                  common.eachTree(_com.selMenu, function (e) {
                    for (var j = 0; j < _com.roleForm.menus.length; j++) {
                      if (e.id === _com.roleForm.menus[j].id) {
                        _com.$refs['menuTree'].setChecked(e.id, true, false);
                        break;
                      }
                    }
                  });
                }
              })
            }
          }
        )
      },
      /**
       *
       * 菜单保存,保存菜单模态框中的勾选
       */
      saveMenu: function () {
        var _com = this,
          menuIdList = [],
          uniqueMenuList = [],//存放过滤后的节点数组
          json = {};//过滤参考数组
        var checkedNodes = _com.$refs['menuTree'].getCheckedNodes(false);
        checkedNodes.forEach(function (val) {
          menuIdList.push(val.id);
          menuIdList.push(val.parentId);//传入父节点
        });
        /**
         * 去除重复的节点,保留父亲节点的选中,并提交。确保在菜单管理中能显示层级关系
         */
        for (var i = 0; i < menuIdList.length; i++) {
          if (!json[menuIdList[i]] && menuIdList[i] != '0') {
            uniqueMenuList.push(menuIdList[i]);
            json[menuIdList[i]] = 1;
          }
        }//去重方法结束
        _com.roleForm.menuIdList = uniqueMenuList;
        console.log(_com.roleForm.menuIdList)
        _com.modalMenu = false;
        return '';
      },
      /**
       * !添加或者修改确定,保存
       * @param formName 表单模型,输入验证
       */
      saveRole: function (formName) {
        var _com = this, url,menus=[];
        for(var i=0;i<_com.roleForm.menuIdList.length;i++){
          if(_com.roleForm.menuIdList[i])
          menus.push(_com.roleForm.menuIdList[i])
        }
        console.log(menus)
        _com.$refs[formName].validate(function (valid) {
          if (valid) {//验证通过
            var data = {
                name: _com.roleForm.name,
                menuIds:menus,
                status:_com.roleForm.status? 'Y':'N',
                remark:_com.roleForm.remark
            };
            if (_com.titleKey === 'add') {
              url = 'sys/role/save';
            } else {
              data.id = _com.roleForm.id;
              url = 'sys/role/update';
            }
            _com.$http.post(common.projectPath + url, data, {
              emulateJSON: false
            }).then(function (data) {
              data = data.body;
              if (data.code=='SUCCESS') {
                _com.$message.success('保存成功!');
                _com.modalRole = false;
                _com.getForm();
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
        _com.modalRole = false;
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
        _com.getForm();
      });
    }
  }
</script>


<style lang='scss'>

</style>

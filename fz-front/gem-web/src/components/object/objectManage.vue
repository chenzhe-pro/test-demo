<template>
  <div class="wrapper">
    <page-head></page-head>
    <page-menu></page-menu>
    <div class="content_wrapper roleManage ivu-article">
      <div class="content_head clearfix">
        <content_head icon-class="fa fa-crosshairs" title="对象管理" show-filter="true" :reload-function="getObjList">
          <el-button-group slot="button_list">
            <el-button size="small" @click="addObj()">新建</el-button>
            <!--<el-button size="small" >导入</el-button>-->
            <el-button size="small" icon="caret-bottom" disabled></el-button>
          </el-button-group>
        </content_head>
      </div>
      <div class="content_content clearfix">
        <el-table border :content="self" :data="objData">
          <el-table-column label="编码" align="center" prop="code">
          </el-table-column>
          <el-table-column label="名称" align="center" prop="name">
          </el-table-column>
          <el-table-column label="状态" align="center" prop="statusText">
          </el-table-column>
          <el-table-column label="备注" align="center" prop="remark">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template scope="scope">
              <el-button size="small" @click="edit(scope.$index, scope.row)">
                <i class="fa fa-edit" aria-hidden="true"></i>
                编辑
              </el-button>
              <!--<el-button size="small" @click="removeRole(scope.$index, scope.row)" :plain="true" type="danger">-->
                <!--&lt;!&ndash;<i class="fa fa-trash" aria-hidden="true"></i>&ndash;&gt;-->
                <!--禁用-->
              <!--</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-if="pagination.rowCount>pagination.pageSize" class="fr page" ref="page"
                       :total="pagination.rowCount" :page-size="pagination.pageSize"
                       size="small" show-total show-elevator :current-page="pagination.currentPage"
                       @current-change='handleCurrentChange'></el-pagination>
        <filter_form :filter-function="getObjList">
        </filter_form>
      </div>
      <!--编辑-->
      <el-dialog v-model="modalObj" :title="formTitle">
        <el-form ref="objForm" :model="objForm" label-width="80px" label-position="right" :rules="ruleValidate">
          <el-form-item label="名称" prop="name">
            <el-input v-model="objForm.name"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="remark">
            <el-input v-model="objForm.remark"></el-input>
          </el-form-item>
          <el-form-item label="启用状态" prop="status">
            <el-switch v-model="objForm.status" on-text="启用" off-text="关闭" size="large"></el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button type="text" size="large" @click="clearForm('objForm')">取消</el-button>
          <el-button type="primary" size="large" @click="saveObj('objForm')">保存</el-button>
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
        modalObj: false,
        formTitle: '',
        titleKey: '',
        modalMenu: false,
        selMenu: [],//选择菜单
        objData: [],//table展示表格
        objects:[],
        pagination: {//分页
          totalPage: 0,
          rowCount: 0,
          pageSize: 12,
          currentPage:1
        },
        objForm: {//角色详情弹出框
          name: '',
          status:'',
          remark:''
        },
        ruleValidate: {// modalObj模态框验证
          name: [
            {required: true, message: '名字不能为空', trigger: 'blur'}
          ],
        },
      }
    },
    methods: {
      /**
       * 操作膜态框
       * @param type bool型,打开或者关闭膜态框
       */
      operateModal: function (operateType, type) {
        var _com=this;
        if (operateType)//打开
        {
          this.formTitle = type;
          this.modalObj = operateType;
          if(this.formTitle=='新增对象信息')
          this.$nextTick(function () {
//            _com.$refs['objForm'].resetFields();
          });
        }
        else {
          this.$refs['objForm'].resetFields();
          this.modalObj = operateType;
        }
      },
      /**
       * 显示选中页的内容
       * @param 选中页的索引
       */
      handleCurrentChange: function (val) {
        var _com = this;
        _com.pagination.currentPage = val;
        _com.getObjList();
      },
      /**
       * 获取对象列表
       */
      getObjList: function (filter) {
        var _com = this,data={
          data:{},
          page:_com.pagination.currentPage,
          pageSize:_com.pagination.pageSize,
          sorts:[{"field":"createdAt", "sortModel":"DESC"}]
        };
        if(filter){
          data.data=filter;
        }
        _com.$http.post(common.projectPath + 'sys/objects/pageList',data,{
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
            _com.objData = data.data;
          }
        })
      },
      /**
       * 添加对象
       */
      addObj: function () {
        var _com = this;
        _com.formTitle = '新增对象信息';
        _com.titleKey = 'add';
        _com.modalObj = true;
//        this.$nextTick(function () {
//            _com.$refs['objForm'].resetFields();
//        });
        _com.objForm.name = '';
        _com.objForm.remark = '';
        _com.objForm.status = '';
      },
      /**
       * 编辑对象
       * @param index 单个对象详情在table中的索引
       */
      edit: function (index, row) {
        var _com = this,
          id = _com.objData[index].id,
          url = 'sys/objects/detail/' + id;
        _com.$http.get(common.projectPath + url, {
          params: {}
        }).then(function (data) {
          data = data.body;
          if (data.code!=='SUCCESS') {
            _com.$message.error(data.message);
          } else {
            _com.objForm = data.data;
            if(_com.objForm.status=='Y'){
              _com.objForm.status=true;
            }else{
              _com.objForm.status=false;
            }
            _com.operateModal(true,'编辑对象信息');
//            _com.modalObj = true;
          }
        })
      },
      /**
       * !添加或者修改确定,保存
       * @param formName 表单模型,输入验证
       */
      saveObj: function (formName) {
        var _com = this, url,menus=[];
        console.log(menus)
        _com.$refs[formName].validate(function (valid) {
          if (valid) {//验证通过
            var data = {
                name: _com.objForm.name,
                remark: _com.objForm.remark,
                status: _com.objForm.status?'Y':'N',
            };
            if (_com.formTitle === '新增对象信息') {
              url = 'sys/objects/save';
            } else if(_com.formTitle === '编辑对象信息') {
              data.id = _com.objForm.id;
              url = 'sys/objects/update';
            }
            _com.$http.post(common.projectPath + url, data, {
              emulateJSON: false
            }).then(function (data) {
              data = data.body;
              if (data.code=='SUCCESS') {
                _com.$message.success('保存成功!');
                _com.operateModal(false);
//                _com.modalObj = false;
                _com.getObjList();
              } else {//验证失败
                _com.$message.error('请求失败,重新输入!');
              }
            })
          }
        })
      },
      /**
       * 获取所有元数据信息
       */
      getMetaDataList: function () {
        var _com = this,data={
          data:{}
        };
        _com.$http.post(common.projectPath + 'sys/objectsmetadata/pageList',data,{

        }).then(function (data) {
          data = data.body
          if (data.data) {
            var metaDatas = data.data;
            for (var i = 0; i < metaDatas.length; i++) {
              metaDatas[i].value = metaDatas[i].id;
              metaDatas[i].label = metaDatas[i].name;
            }
            _com.objects = metaDatas;
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
        _com.modalObj = false;
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
      _com.getMetaDataList();
      this.$nextTick(function () {
        quicker.returnTop();
        com_ready();
        _com.getObjList();

      });
    }
  }
</script>


<style lang='scss'>

</style>

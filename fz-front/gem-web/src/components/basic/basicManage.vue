<template>
  <div class="wrapper">
    <page-head></page-head>
    <page-menu></page-menu>
    <div class="content_wrapper basicManage ivu-article">
      <div class="content_head clearfix">
        <content_head icon-class="fa fa-briefcase" title="基础资料管理" :reload-function="getAllDatas">
          <!--<el-dropdown slot="dropdown_content">-->
            <!--<span class="el-dropdown-link">-->
            <!--所有资料<i class="el-icon-caret-bottom el-icon&#45;&#45;right"></i></span>-->
            <!--<el-dropdown-menu slot="dropdown">-->
              <!--<el-dropdown-item>个人中心</el-dropdown-item>-->
              <!--&lt;!&ndash;<el-dropdown-item>退出</el-dropdown-item>&ndash;&gt;-->
            <!--</el-dropdown-menu>-->
          <!--</el-dropdown>-->
          <el-button-group slot="button_list">
            <el-button size="small" @click="addDatas()">新建</el-button>
            <!--<el-button size="small" >导入</el-button>-->
            <el-button size="small" icon="caret-bottom" disabled></el-button>
          </el-button-group>
        </content_head>
      </div>
      <div class="content_content clearfix">
        <el-table :columns="columnsTab" border :data="data_list" width="100%">
          <el-table-column align="center" prop="code" label="编码" width=""></el-table-column>
          <el-table-column align="center" prop="name" label="名称" width=""></el-table-column>
          <el-table-column align="center" prop="description" label="描述" width=""></el-table-column>
          <el-table-column align="center" prop="catalog" label="目录" width=""></el-table-column>
          <el-table-column align="center" prop="type" label="类别" width=""></el-table-column>
          <el-table-column align="center" prop="data" label="上级资料" width=""></el-table-column>
          <el-table-column align="center" prop="statusText" label="状态" width=""></el-table-column>
          <el-table-column align="center" label="操作" width="180px">
            <template scope="scope">
              <el-button @click="show(scope.$index)" size="small"><i class="fa fa-edit" aria-hidden="true"></i> 编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-if="pagination.rowCount>pagination.pageSize"  class="fr page" size="small" ref="page" :page-size="pagination.pageSize"
                       @current-change="handleCurrentChange" :current-page="pagination.currentPage"
                       :total="pagination.rowCount" show-total show-elevator></el-pagination>
        <!--过滤器-->
        <filter_form :child-com="filterForm" @changeVal="getAllDatas()" :model="filterForm">
        </filter_form>
      </div>
      <!--基础资料模态框-->
      <el-dialog v-model="modalData" :title="titleName">
        <el-form ref="formEdit" :model="formEdit" :rules="ruleValidate" label-width="85px" class="demo-ruleForm">
          <el-form-item label="名称" prop="name">
            <el-input v-model="formEdit.name" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="目录" prop="catalog">
            <el-input v-model="formEdit.catalog" placeholder="请输入目录"></el-input>
          </el-form-item>
          <el-form-item label="类别" prop="type">
            <el-input v-model="formEdit.type" placeholder="请输入类别"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="formEdit.description"></el-input>
          </el-form-item>
          <el-form-item label="上级资料" prop="preData" class="autoSelect">
            <el-select v-model="formEdit.preData" size="small" filterable remote
                       placeholder="请输入上级目录名称" :remote-method="remoteMethod" :loading="loading">
              <el-option v-for="item in filter_list" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
            <!--<el-input v-model="formEdit.data" @change="get_list()"></el-input>-->
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
        data_list: [],//数据
        filter_list: [],//数据
        statusList: [],//状态数据
        titleName: '添加用户',
        modalOrg: false,//部门对话框
        modalData: false,//用户对话框
        filterForm:{
          name:{label:'名称',value:'',type:'text'},
          code:{label:'编码',value:'',type:'text'},
//          type:{label:'类型',value:{label:'',val:''},type:'select'}
        },
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
//          type: [
//            {required: true, message: '类别不能为空', trigger: 'blur'},
//          ]
        }
      }
    },
    methods: {
      /**
       * select的远程搜索方法
       */
      remoteMethod(query) {
        var _com = this;
        if (query !== '') {
          _com.loading = true;
          setTimeout(function () {
            _com.loading = false;
            _com.getAllTypes(query)
            if (_com.filter_list) {
              _com.filter_list = _com.filter_list.filter(function (item) {
                return item.name.toLowerCase()
                    .indexOf(query.toLowerCase()) > -1;
              });
            }
          }, 200);
        } else {
          _com.filter_list = [];
        }

      },
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
      addDatas: function () {
        var _com = this;
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
      show: function (index) {
        var _com = this;
        this.$http.get(common.projectPath + 'sys/basicdata/detail/' + _com.data_list[index].id, {})
          .then(function (data) {
            data = data.body;
            if (data.code=='SUCCESS') {
              _com.titleName = '编辑基础资料';
              _com.formEdit = data.data;
              if(_com.formEdit.parent){
                _com.formEdit.preData=_com.formEdit.parent.id
              }else{
                _com.formEdit.preData='';
              }
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
        _com.getAllTypes();
      },
      /**
       * 删除单个基础资料信息
       * @param index 选中删除的用户的索引值
       */
      remove: function (index) {
        var _com = this;
        _com.$confirm('此操作将永久删除该基础资料, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          _com.$http.get(common.projectPath + 'sys/basicdata/del/' + _com.data_list[index].id, {
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
              _com.getAllDatas();
            }
          })
        }).catch(function () {

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
          type: _com.formEdit.type,
          status: _com.formEdit.status?'Y':'N',
          code: _com.formEdit.code,
          catalog:_com.formEdit.catalog,
          description:_com.formEdit.description,
//          parent:{
//            id:_com.formEdit.preData
//          }
        }
        if (_com.titleName == '添加基础资料') {
          url = 'sys/basicdata/save'
        } else {
//          if(_com.formEdit.preData)
//            data.parent.id=_com.formEdit.preData
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
          data:{
            name:_com.filterForm.name.value,
            code:_com.filterForm.code.value,
          },
          page:_com.pagination.currentPage,
          pageSize:_com.pagination.pageSize,
          sorts:[{"field":"createdAt", "sortModel":"DESC"}]
        };
        _com.$http.post(common.projectPath + 'sys/basicdata/pageList', data,{
          emulateJSON: false
        }).then(function (data) {
          data = data.body;
          if (data.code=='SUCCESS') {
            for(var key in data.data){
              if(!data.data[key].description){
                data.data[key].description='暂无描述';
              }
              if(data.data[key].status=='Y'){
                data.data[key].statusText='已启用'
              }else{
                data.data[key].statusText='已禁用'
              }
              if(data.data[key].parent){
                data.data[key].data=data.data[key].parent.name
              }else{
                data.data[key].data='暂无'
              }
            }
            _com.data_list=data.data;
            _com.pagination.rowCount = data.total;
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      /**
       * 查看上级资料列表
       * @param name 根据name进行筛选
       */
      getAllTypes:function (name) {
        var _com = this,data={
//          data:{
            name:name
//          }
        };
//        _com.$http.post(common.projectPath + 'sys/basicdata/list', data,{
        _com.$http.post(common.projectPath + 'sys/basicdata/list', data,{
          emulateJSON: false
        }).then(function (data) {
          data=data.body;
          if(data){
            _com.filter_list=data;
          }
          console.log(_com.filter_list)
          console.log(_com.formEdit.id)
          if(_com.filter_list)
            for(var i=0;i<_com.filter_list.length;i++){
              if(_com.filter_list[i].id==_com.formEdit.id){
                _com.filter_list.splice(i,1)
              }
            }

        });
//        console.log(_com.formEdit)
//        console.log(_com.formEdit.id)

      }
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

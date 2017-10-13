<template>
  <div class="wrapper">
    <page-head></page-head>
    <page-menu></page-menu>

    <div class="content_wrapper userManage ivu-article">
      <div class="content_head clearfix">
        <content_head icon-class="fa fa-user-circle" title="元数据管理" show-filter="true" :reload-function="getMetaDatas">
          <el-button-group slot="button_list">
            <el-button size="small" @click="addMetaData()">新建</el-button>
            <!--<el-button size="small" >导入</el-button>-->
            <el-button size="small" icon="caret-bottom" disabled></el-button>
          </el-button-group>
        </content_head>
      </div>
      <div class="content_content clearfix">
        <el-table :columns="columnsTab" border :data="metaList_list" width="100%">
          <el-table-column align="center" prop="code" label="编码" width=""></el-table-column>
          <el-table-column align="center" prop="name" label="字段名称" width=""></el-table-column>
          <el-table-column align="center" prop="tag" label="字段标签" width=""></el-table-column>
          <el-table-column align="center" prop="type" label="数据类型" width=""></el-table-column>
          <el-table-column align="center" prop="object" label="对象" width=""></el-table-column>
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
        <filter_form :filter-function="getMetaDatas">
        </filter_form>
        <el-pagination v-if="pagination.rowCount>pagination.pageSize" class="fr page" size="small" ref="page" :page-size="pagination.pageSize"
                       @current-change="handleCurrentChange" :current-page="pagination.currentPage"
                       :total="pagination.rowCount" show-total show-elevator></el-pagination>
      </div>
      <!--账户模态框-->
      <el-dialog v-model="modalUser" :title="titleName">
        <el-form ref="formEdit" :model="formEdit" :rules="ruleValidate" label-width="85px" class="demo-ruleForm">
          <!--<el-form-item label="电话号码" prop="mobilePhone">-->
            <!--<el-input v-model="formEdit.mobilePhone"></el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="字段名称" prop="name">
            <el-input v-model="formEdit.name"></el-input>
          </el-form-item>
          <el-form-item label="字段标签" prop="tag">
            <el-input v-model="formEdit.tag"></el-input>
          </el-form-item>
          <el-form-item label="数据类型" prop="type">
            <el-input v-model="formEdit.type"></el-input>
          </el-form-item>
          <el-form-item label="对象" >
            <el-select v-model="formEdit.objects">
              <el-option v-for="item in objects" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <!--<el-form-item label="备注" prop="remark">-->
            <!--<el-input v-model="formEdit.remark"></el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="启用状态" prop="status">
            <el-switch v-model="formEdit.status" on-text="启用" off-text="关闭" size="large"></el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button type="text" @click="clearForm('formEdit')">取消</el-button>
          <el-button type="primary" @click="save('formEdit')">保存</el-button>
        </div>
      </el-dialog>
      <!---选择组织架构-->
      <el-dialog v-model="modalOrg" title="选择组织架构" size="tiny">
        <div slot="title" style="display: inline-block;width: 130px;line-height: 28px;font-weight: bold;">
          <span>选择组织架构</span>
          <el-tooltip class="question_badge fr" effect="dark" content="" placement="top">
            <div slot="content">(1)父子结点没有强关联关系,每个结点都需要单独操作,如果选中子结点,那必须也选中其父结点;<br>(2)对于后来添加的子结点,默认不选中,需要手动操作。</div>
            <el-badge is-dot class=" f16"><i class="fa fa-question-circle" aria-hidden="true"></i></el-badge>
          </el-tooltip>
        </div>
        <el-tree :default-checked-keys="[]" :data="partment_list" ref="tree" show-checkbox
                 node-key="id"></el-tree>
        <div slot="footer">
          <el-button type="text" size="small" @click="modalOrg=false">取消</el-button>
          <el-button type="primary" size="small" @click="saveDepartment()">确定</el-button>
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
        metaList_list: [],//账户数据
        objects: [],//角色数据
        titleName: '添加元数据',
        modalOrg: false,//部门对话框
        modalUser: false,//账户对话框
        formEdit: {
          id: '',
          name:'',
          tag:'',
          type:'',
          remark:'',
          status:'',
          objects:''
        },
        ruleValidate: {
          name: [
            {required: true, message: '姓名不能为空', trigger: 'blur'}
          ],
          objects: [
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
        this.getMetaDatas();
      },
      /**
       * 添加元数据
       */
      addMetaData: function () {
        var _com = this;
        _com.titleName = '添加元数据';
        _com.modalUser = true;
//        if (_com.$refs['formEdit']) {
//          _com.$refs['formEdit'].resetFields();
//        }
        for(var key in _com.formEdit){
          _com.formEdit[key]=''
        }
      },
      /**
       * 点击查看单个元数据信息
       * @param index 选中元数据的索引值
       */
      show: function (index) {
        var _com = this;
        this.$http.get(common.projectPath + 'sys/objectsmetadata/detail/' + _com.metaList_list[index].id, {}).then(function (data) {
          data = data.body;
          if (data.code!=='SUCCESS') {
            _com.$message.error(data.message);
          } else {
            _com.titleName = '编辑元数据';
            if(data.data.objects)
//              for (var i = 0; i < data.data.objects.length; i++) {
                data.data.objects = data.data.objects.id;
//              }
            _com.formEdit = data.data;
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
       * 点击保存新添加或者已修改的元数据信息
       * @param index 表单的模型名字
       */
      save: function (formName) {
        var _com = this, data;
        var url = '';
        data = {
          name: _com.formEdit.name,
          status:_com.formEdit.status? 'Y':'N',
          tag:_com.formEdit.tag,
          type:_com.formEdit.type,
//          remark:_com.formEdit.remark,
          objects:{
            id:_com.formEdit.objects
          }
        }
        if (_com.titleName == '添加元数据') {
          url = 'sys/objectsmetadata/save'
        } else {
          url = 'sys/objectsmetadata/update';
          data.id = _com.formEdit.id;
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
                _com.getMetaDatas();
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
       * 获取所有元数据信息
       */
      getMetaDatas: function (filter) {
        var _com = this,data={
          page:_com.pagination.currentPage,
          pageSize:_com.pagination.pageSize,
          sorts:[{"field":"createdAt", "sortModel":"DESC"}]
        };
        if(filter){
          data.data=filter;
        }
        _com.$http.post(common.projectPath + 'sys/objectsmetadata/pageList',data, {

        }).then(function (data) {
          data = data.body;
          if (data.code!=='SUCCESS') {
            _com.$message.error(data.message);
          } else {
            if (data.data) {
              _com.pagination.rowCount = data.total;
              for(var key in data.data){
                if(data.data[key].status=='Y'){
                  data.data[key].statusText='已启用'
                }else{
                  data.data[key].statusText='已禁用'
                }
                if(data.data[key].objects){
                  data.data[key].object=data.data[key].objects.name
                }else{
                  data.data[key].object='暂无'
                }
              }
              _com.metaList_list = data.data;
            }
            else {
              _com.metaList_list = [];
            }
          }
        })
      },
      /**
       * 获取所有对象信息
       */
      getObjectList: function () {
        var _com = this,data={
          data:{}
        };
        _com.$http.post(common.projectPath + 'sys/objects/ListAll',data,{

        }).then(function (data) {
          data = data.body
          if (data) {
            var objects = data;
            for (var i = 0; i < objects.length; i++) {
              objects[i].value = objects[i].id;
              objects[i].label = objects[i].name;
            }
            _com.objects = objects;
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
      _com.getMetaDatas();
      _com.getObjectList();
      this.$nextTick(function () {
        quicker.returnTop();
        com_ready();
      });
    },

  }
</script>

<style lang='scss'>

</style>

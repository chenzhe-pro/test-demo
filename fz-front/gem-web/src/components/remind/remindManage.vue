<template>
  <div class="wrapper">
    <page-head></page-head>
    <page-menu></page-menu>

    <div class="content_wrapper userManage ivu-article">
      <div class="content_head clearfix">
        <content_head icon-class="fa fa-exclamation" title="提醒设置管理" show-filter="true" :reload-function="getAllRemind">
          <el-button-group slot="button_list">
            <el-button size="small" @click="addRemind()">新建</el-button>
            <el-button size="small" icon="caret-bottom" disabled></el-button>
          </el-button-group>
        </content_head>
      </div>
      <div class="content_content clearfix">
        <!--<el-button size="small" type="primary" class="" @click="addRemind()" icon="plus">新增员工</el-button>-->
        <el-table :columns="columnsTab" border :data="remind_list" width="100%">
          <el-table-column align="center" prop="title" label="标题" width=""></el-table-column>
          <el-table-column align="center" prop="typeName" label="类型" width=""></el-table-column>
          <el-table-column align="center" prop="interval" label="时间间隔" width=""></el-table-column>
          <el-table-column align="center" prop="count" label="次数" width=""></el-table-column>
          <el-table-column align="center" prop="content" label="内容" width=""></el-table-column>
          <el-table-column align="center" prop="remark" label="备注" width=""></el-table-column>
          <!--<el-table-column align="center" prop="partment" label="部门" width=""></el-table-column>-->
          <el-table-column align="center" prop="statusText" label="状态" width=""></el-table-column>
          <el-table-column align="center" label="操作" width="">
            <template scope="scope">
              <el-button @click="show(scope.$index)" size="small"><i class="fa fa-edit" aria-hidden="true"></i> 编辑
              </el-button>
              <!--<el-button size="small" @click="remove(scope.$index)" :plain="true" type="danger"><i class="fa fa-trash"-->
              <!--aria-hidden="true"></i> 删除-->
              <!--</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <filter_form :filter-function="getAllRemind">
        </filter_form>
        <el-pagination v-if="pagination.rowCount>pagination.pageSize" class="fr page" size="small" ref="page" :page-size="pagination.pageSize"
                       @current-change="handleCurrentChange" :current-page="pagination.currentPage"
                       :total="pagination.rowCount" show-total show-elevator></el-pagination>
      </div>
      <!--提醒设置模态框-->
      <el-dialog v-model="modalRemind" :title="titleName">
        <el-form ref="formEdit" :model="formEdit" :rules="ruleValidate" label-width="85px" class="demo-ruleForm">
          <el-form-item label="标题" prop="title">
            <el-input v-model="formEdit.title"></el-input>
          </el-form-item>
          <!--<el-select v-model="formEdit.type" label="类型" prop="type">-->
          <el-form-item label="类型" prop="type">
            <el-cascader change-on-select :options="typesList"  v-model="formEdit.type"
                         @change="selectType"></el-cascader>
            <!--<el-select v-model="formEdit.example" multiple @change="selectContent">-->
              <!--<el-option v-for="item in example" :value="item.value" :label="item.label" ></el-option>-->
            <!--</el-select>-->
          </el-form-item>
          <el-form-item label="内容提示" >
            <el-select v-model="contentExp" multiple @change="selectPoint">
              <el-option v-for="item in example" :value="item.value" :label="item.label" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间间隔" prop="interval">
            <el-input-number  v-model="formEdit.interval"></el-input-number>
            <!--<el-input v-model="formEdit.interval"></el-input>-->
          </el-form-item>
          <el-form-item label="次数" prop="count">
            <el-input-number  v-model="formEdit.count"></el-input-number>
            <!--<el-input v-model="formEdit.count"></el-input>-->
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <el-input v-model="formEdit.content"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="formEdit.remark"></el-input>
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
        example:[],//内容提示列表
        contentExp:[],//内容提示列表选中的值
        typesList:[],
        remind_list: [],//提醒设置数据
        titleName: '添加提醒设置',
        modalOrg: false,//部门对话框
        modalRemind: false,//提醒设置对话框
        formEdit: {
          title: '',
          interval: '',
          count: '',
          content: '',
          remark: '',
          id: '',
          status:'',
          type:[],
        },
        ruleValidate: {
          title: [
            {required: true, message: '标题不能为空', trigger: 'blur'}
          ],
          type: [
            {required: true,type:'array', message: '类型不能为空', trigger: 'blur'}
          ],
          interval: [
            {required: true, type:'number', message: '提醒间隔不能为空', trigger: 'blur'}
          ],
          count: [
            {required: true, type:'number', message: '提醒次数不能为空', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '内容模板不能为空', trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      selectPoint:function (a) {
        var arr=[],content='';
        content=this.formEdit.content;
        for(var i=0;i<a.length;i++){
          this.formEdit.content=content+'['+a[i]+']'
        }
      },
      selectContent:function (id) {
        var _com=this;
        _com.$http.get(common.projectPath + 'sys/remind/remindTypes/'+id, {params: {}}).then(function (data) {
          data = data.body
          if (data.code=='SUCCESS') {
            for (var i = 0; i < data.data.length; i++) {
              _com.example.push({value:'',label:''})
              _com.example[i].value = data.data[i].name;
              _com.example[i].label = data.data[i].name;
            }
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      selectType:function (a) {

        var _com = this;
        _com.selectContent(a[0])
//        _com.$http.get(common.projectPath + 'sys/remind/remindTypes/'+a[0], {params: {}}).then(function (data) {
//          data = data.body
//          if (data.code=='SUCCESS') {
//            for (var i = 0; i < data.data.length; i++) {
//              _com.example.push({value:'',label:''})
//              _com.example[i].value = data.data[i].name;
//              _com.example[i].label = data.data[i].name;
//            }
//            console.log(_com.example)
//          }else{
//            _com.$message.error(data.message);
//          }
//        })

      },
      /**
       * 切换页码时列表渲染当前选中页码
       */
      handleCurrentChange(val) {
        this.pagination.currentPage = val;
        this.getAllRemind();
      },
      /**
       * 添加提醒设置
       */
      addRemind: function () {
        var _com = this;
        _com.titleName = '添加提醒设置';
        if (_com.$refs['formEdit']) {
          _com.$refs['formEdit'].resetFields();
        }
        for(var key in _com.formEdit){
          _com.formEdit[key]='';
        }
        _com.formEdit.type=[];
        _com.contentExp=[];
        _com.modalRemind = true;
      },
      /**
       * 点击查看单个提醒设置信息
       * @param index 选中提醒设置的索引值
       */
      show: function (index) {
        var _com = this;
        this.$http.get(common.projectPath + 'sys/remind/detail/' + _com.remind_list[index].id, {}).then(function (data) {
          data = data.body;
          if (data.code!=='SUCCESS') {
            _com.$message.error(data.message);
          } else {
            _com.contentExp=[];
            _com.titleName = '编辑提醒设置';
            if (data.data.type)
              var type=data.data.type;
            delete data.data.type;
            _com.formEdit = data.data;
            _com.formEdit.type=[];
            _com.formEdit.type.push(type.id);
//            _com.formEdit.example='';
            if(_com.formEdit.status=='Y'){
              _com.formEdit.status=true;
            }else{
              _com.formEdit.status=false;
            }
            _com.selectContent(type.id)
            _com.modalRemind = true;
          }
        })
      },
      /**
       * 删除单个提醒设置信息
       * @param index 选中删除的提醒设置的索引值
       */
      remove: function (index) {
        var _com = this, data;
        _com.$confirm('此操作将永久删除该提醒设置, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          _com.$http.get(common.projectPath + 'sys/remind/delete/' + _com.remind_list[index].id, {
            params: {}
          }).then(function (data) {
            data = data.body;
            if (data.code!=='SUCCESS') {
              _com.$message.error(data.message);
            } else {
              _com.$message.success('删除成功!');
              console.log(_com.pagination.rowCount)
              if (_com.pagination.rowCount % 8 == 1) {
                window.location.reload();
              }
              _com.getAllRemind();
            }
          })
        })
      },
      /**
       * 点击保存新添加或者已修改的提醒设置信息
       * @param index 表单的模型名字
       */
      save: function (formName) {
        var _com = this, data;
        var url = '';
//        var arr=_com.formEdit.type[0].split(',')
        data = {
          title: _com.formEdit.title,
          interval: _com.formEdit.interval,
          count: _com.formEdit.count,
          content: _com.formEdit.content,
          remark: _com.formEdit.remark,
          type:{id:_com.formEdit.type[0]},
          status:_com.formEdit.status? 'Y':'N'
        }
        if (_com.titleName == '添加提醒设置') {
          url = 'sys/remind/save'
        } else {
          url = 'sys/remind/update';
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
                _com.modalRemind = false;
                _com.getAllRemind();
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
        if(formName=='formEdit'){
          _com.formEdit.type=[];
        }
        _com.modalRemind = false;
      },
      /**
       * 获取所有提醒设置信息
       */
      getAllRemind: function (filter) {
        var _com = this,data={
          page:_com.pagination.currentPage,
          pageSize:_com.pagination.pageSize,
          sorts:[{"field":"createdAt", "sortModel":"DESC"}]
        };
        if(filter){
          data.data=filter;
        }
        _com.$http.post(common.projectPath + 'sys/remind/pageList',data, {
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
                if(data.data[key].type){
                  data.data[key].typeName=data.data[key].type.name
                }
              }
              _com.remind_list = data.data;
            }
            else {
              _com.remind_list = [];
            }
          }
        })
      },
      /**
       * 获取所有类型信息
       */
      getTypesList: function () {
        var _com = this
        _com.$http.get(common.projectPath + 'sys/remind/remindTypes', {params: {}}).then(function (data) {
          data = data.body
          if (data.code=='SUCCESS') {
            var list = data.data;
            common.eachTree(list, function (jn) {
              jn.label = jn.name;
//              jn.id=jn.id+','+jn.title;
//              jn.value = jn.id;
//              jn.value = jn.id+','+jn.name;
              jn.value = jn.id;
//              jn.id = jn.id;
//              jn.value = jn.id;
            });
            _com.typesList = list;
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
    },
    mounted: function () {
      var _com = this;
      _com.getAllRemind();
      _com.getTypesList();
      this.$nextTick(function () {
        quicker.returnTop();
        com_ready();
      });
    },

  }
</script>

<style lang='scss'>

</style>

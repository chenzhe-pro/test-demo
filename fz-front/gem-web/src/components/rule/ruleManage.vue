<template>
  <div class="wrapper">
    <page-head></page-head>
    <page-menu></page-menu>
    <div class="content_wrapper basicManage ivu-article">
      <div class="content_head clearfix">
        <content_head icon-class="fa fa-file-text-o" title="编码规则管理" show-filter="true" :reload-function="getAllRules">
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
        <el-table :columns="columnsTab" border :data="rule_list" width="100%">
          <el-table-column align="center" prop="name" label="名称" width=""></el-table-column>
          <el-table-column align="center" prop="type" label="规则类型" width=""></el-table-column>
          <el-table-column align="center" prop="postfixType" label="后缀规则" width=""></el-table-column>
          <el-table-column align="center" prop="length" label="长度" width=""></el-table-column>
          <el-table-column align="center" prop="prefix" label="前缀" width=""></el-table-column>
          <el-table-column align="center" prop="symbol" label="连接符" width=""></el-table-column>
          <el-table-column align="center" prop="description" label="描述" width=""></el-table-column>
          <el-table-column align="center" label="操作" width="180px">
            <template scope="scope">
              <el-button @click="show(scope.$index)" size="small"><i class="fa fa-edit" aria-hidden="true"></i> 编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-if="pagination.rowCount>pagination.pageSize" class="fr page" size="small" ref="page" :page-size="pagination.pageSize"
                       @current-change="handleCurrentChange" :current-page="pagination.currentPage"
                       :total="pagination.rowCount" show-total show-elevator></el-pagination>
        <filter_form :filter-function="getAllRules">
        </filter_form>
      </div>
      <!--编码规则模态框-->
      <el-dialog v-model="modalData" :title="titleName">
        <el-form ref="formEdit" :model="formEdit" :rules="ruleValidate" label-width="85px" class="demo-ruleForm">
          <el-form-item label="名称" prop="name">
            <el-input v-model="formEdit.name"></el-input>
          </el-form-item>
          <el-form-item label="规则类型" prop="type">
            <el-input v-model="formEdit.type"></el-input>
          </el-form-item>
          <el-form-item label="后缀规则" prop="postfixType">
            <el-select v-model="formEdit.postfixType" placeholder="请选择后缀规则" clearable>
              <el-option v-for="x in ruleType" :value="x.code" :label="x.name"></el-option>
            </el-select>
          </el-form-item>
          <!--<el-form-item label="后缀规则" prop="postfixType">-->
            <!--<el-input v-model="formEdit.postfixType"></el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="长度" prop="length">
            <el-input v-model="formEdit.length" placeholder="请输入长度"></el-input>
          </el-form-item>
          <el-form-item label="前缀" prop="prefix">
            <el-input v-model="formEdit.prefix"></el-input>
          </el-form-item>
          <el-form-item label="连接符" prop="symbol">
            <el-input v-model="formEdit.symbol"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="formEdit.description"></el-input>
          </el-form-item>
          <!--<el-form-item label="后缀" prop="postfix">-->
            <!--<el-input v-model="formEdit.postfix"></el-input>-->
          <!--</el-form-item>-->
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
        rule_list: [],//数据
        filter_list: [],//数据
        statusList: [],//状态数据
        ruleType:[],//规则类型
        titleName: '添加用户',
        modalOrg: false,//部门对话框
        modalData: false,//用户对话框
        filterForm:{
          name:'',
          code:''
        },
        formEdit: {
          name:'',
          id: '',
          type:'',
          postfixType:'',
//          postfix:'',
          description:'',
          prefix:'',
          length:0,
          symbol:''
        },
        ruleValidate: {
          type: [
            {required: true, message: '规则类型不能为空', trigger: 'blur'},
          ],
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'},
          ],
//          length: [
//            {required: true,type:'number', message: '长度不能为空', trigger: 'blur'},
//          ],
          postfixType: [
            {required: true, message: '后缀规则不能为空', trigger: 'blur'},
          ]
        }
      }
    },
    methods: {
      /**
       * 打开过滤器
       */
      openFilter:function () {
        common.openFilter();
      },
      /**
       * 关闭过滤器
       */
      closeFilter:function () {
        common.closeFilter();
      },
      /**
       * 切换页码时列表渲染当前选中页码
       */
      handleCurrentChange(val) {
        this.pagination.currentPage = val;
        this.getAllRules();
      },
      /**
       * 添加编码规则
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
       * 点击单个编码规则信息
       * @param index 选中用户的索引值
       */
      show: function (index) {
        var _com = this;
        this.$http.get(common.projectPath + 'sys/coderule/detail/' + _com.rule_list[index].id, {})
          .then(function (data) {
            data = data.body;
            if (data.code=='SUCCESS') {
              _com.titleName = '编辑基础资料';
              _com.formEdit = data.data;
              if(_com.formEdit.status=='Y'){
                _com.formEdit.status=true;
              }else{
                _com.formEdit.status=false;
              }
              if(_com.formEdit.postfixType){
                _com.formEdit.postfixType=_com.formEdit.postfixType.code
              }
              _com.modalData = true;
            } else {
              _com.$message.error(data.message);
            }

          })
      },
      /**
       * 点击保存新添加或者已修改的编码规则信息
       * @param index 表单的模型名字
       */
      save: function (formName) {
        var _com = this, data;
        var url = '';
        data = {
          name:_com.formEdit.name,
//          postfixType: {code:_com.formEdit.postfixType},
          postfixTypeS:_com.formEdit.postfixType,
          type: _com.formEdit.type,
          description:_com.formEdit.description,
//          postfix: {name:_com.formEdit.postfix},
          prefix: _com.formEdit.prefix,
          symbol:_com.formEdit.symbol,
//          id:_com.formEdit.id,
          length:_com.formEdit.length,
        }
        if (_com.titleName == '添加基础资料') {
          url = 'sys/coderule/save'
        } else {
          url = 'sys/coderule/update';
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
                _com.getAllRules();
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
       * 获取所有编码规则信息
       */
      getAllRules: function (filter) {
        var _com = this,data={
          data:{
//            type:_com.filterForm.type,
          },
          page:_com.pagination.currentPage,
          pageSize:_com.pagination.pageSize,
          sorts:[{"field":"createdAt", "sortModel":"DESC"}]
        };
        if(filter){
          data.data=filter;
        }
        _com.$http.post(common.projectPath + 'sys/coderule/pageList', data,{
          emulateJSON: false
        }).then(function (data) {
          console.log(data)
          data = data.body;
          if (data.code=='SUCCESS') {
            _com.rule_list=data.data;
            for(var k in _com.rule_list){
              if(_com.rule_list[k].postfixType)
                _com.rule_list[k].postfixType=_com.rule_list[k].postfixType.name
            }
              _com.pagination.rowCount = data.total;
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      getAllTypes:function () {
        var _com = this,
          url = 'sys/basicdata/codeRule/codeRuleType';
        _com.$http.get(common.projectPath + url, {
          params: {}
        }).then(function (data) {
          data = data.body;
          if (data) {
            _com.ruleType = data;
          }
        })
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
      _com.getAllRules();
      _com.getAllTypes();
      this.$nextTick(function () {
        quicker.returnTop();
        com_ready();
      });
    },

  }
</script>

<style lang='scss'>

</style>

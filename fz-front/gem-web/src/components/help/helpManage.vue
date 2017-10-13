<!-- ***  Created by raman on 17/3/8-->
<template>
  <div class="wrapper">
    <page-head></page-head>
    <page-menu></page-menu>
    <div class="content_wrapper help_manage  ivu-article">
      <div class="content_head clearfix">
        <content_head icon-class="fa fa-flag-o" title="帮助管理" show-filter="true" :reload-function="getList">
          <div slot="button_list" >
            <el-button-group >
            <el-button size="small" @click="operateModal(true,'新增帮助信息')">新建</el-button>
            <!--<el-button size="small" >导入</el-button>-->
            <el-button size="small" icon="caret-bottom" disabled></el-button>
            </el-button-group>
          </div>
        </content_head>
      </div>
      <div class="content_content clearfix">
        <div>
          <el-table :data="helpList" border>
            <el-table-column label="编码" align="center" prop="code">
            </el-table-column>
            <el-table-column label="页面名称" align="center" prop="pageName">
              <!--<template scope="scope">-->
                <!--<div class="clearfix" v-show="!scope.row.show_input">-->
                  <!--<span v-text="scope.row.pageName" ></span>-->
                  <!--<i class="fa fa-pencil-square-o" aria-hidden="true" @click="scope.row.show_input=true"></i>-->
                <!--</div>-->
                <!--<el-input v-model="scope.row.pageName" size="mini" placeholder="请输入名称" v-show="scope.row.show_input" @blur="scope.row.show_input=false"></el-input>-->
              <!--</template>-->
            </el-table-column>
            <el-table-column label="位置序号" align="center" prop="sequence">
            </el-table-column>
            <el-table-column label="帮助内容" align="center" prop="content">
            </el-table-column>
            <el-table-column label="启用状态" align="center" prop="statusText">
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template scope="scope">
                <el-button size="small" @click="modifyHelp(scope.$index, scope.row)"><i class="fa fa-edit" aria-hidden="true"></i> 编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <filter_form :filter-function="getList">
          </filter_form>
          <div v-if="no_help_here==true" style="padding: 20px">暂无数据</div>
          <el-pagination v-show="pagination.rowCount>pagination.pageSize" class="fr page" ref="page" :total="pagination.rowCount" :page-size="pagination.pageSize"
                         size="small" show-total show-elevator :current-page="pagination.page"
                         @current-change='handleCurrentChange'></el-pagination>
        </div>
      </div>
      <el-dialog v-model="helpModal" :title="modalTitle">
        <el-form ref="helpForm" :model="helpForm" label-width="80px" label-position="right" :rules="helpRules"
                 @keypress.13="saveHelp()">
          <el-form-item label="页面名称" prop="pageName">
            <el-input v-model="helpForm.pageName" size="small" placeholder="请输入页面名称"></el-input>
          </el-form-item>
          <el-form-item label="位置序号" prop="sequence">
            <el-input-number  v-model="helpForm.sequence"></el-input-number>
          </el-form-item>
          <el-form-item label="帮助内容" prop="content">
            <el-input type="textarea" v-model="helpForm.content" size="small" placeholder="请输入帮助内容"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-switch v-model="helpForm.status" size="large" on-text="启用" off-text="禁用">
            </el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button type="text"  @click="helpModal=false">取消</el-button>
          <el-button type="primary"  @click="saveHelp()">保存</el-button>
        </div>
      </el-dialog>
    </div>
    <page-foot></page-foot>
  </div>
</template>
<script>
  import head from '../common/head.vue'
  import menu from '../common/menu.vue'
  import foot from '../common/foot.vue'
  import com_ready from '../../assets/js/componentReady'
  import content_head from '../common/content_head.vue'
  import filter_form from '../common/filter_form.vue'

  module.exports = {
    data: function () {
      return {
        helpModal: false,
        modalTitle:'',
        pagination: {//分页
          page: 1,
          pageSize: 12,
          rowCount:0
        },
        helpForm: {//模态框初始化
          pageName: '',
          status: true,
          sequence: '',
          content: ''
        },
        no_help_here: false,
        helpList: [{code:'1232131231',pageName:'asdsadas',sequence:1,content:'111',statusText:'已启用',show_input:false}],// 标签列表table
        helpRules: {
          content: [
            {required: true, message: '内容不能为空', trigger: 'blur'}
          ],
          pageName: [
            {required: true, message: '页面名称不能为空', trigger: 'blur'}
          ],
          sequence:[
//            { required: true, message: '序号不能为空', trigger: 'blur'},
            { type: 'number', message: '序号必须为数字值', trigger: 'blur'}
          ]
        }
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
          this.modalTitle = type;
          this.helpModal = operateType;
          this.$nextTick(function () {
//            _com.$refs['helpForm'].resetFields();
          });
        }
        else {
          this.$refs['helpForm'].resetFields();
          this.helpModal = operateType;
        }
      },
      /**
       * 显示选中页的内容
       * @param  val 选中页的索引
       */
      handleCurrentChange: function (val) {
        var _com = this;
        _com.pagination.page = val;
        _com.getList();
      },
      getList: function (filter) {
        var _com = this,
          url = 'sys/help/pageList',
          data={
            data:{

            },
            "page": this.pagination.page,
            "pageSize": this.pagination.pageSize
          };
        if(filter){
          data.data=filter;
        }
        _com.$http.post(common.projectPath + url, data, {
          emulateJSON: false
        }).then(function (data) {
          data = data.body;
          if (data.code==='SUCCESS') {
            for(var i=0;i<data.data.length;i++)
            {
              data.data[i].show_input=false;
              if(data.data[i].status=='Y'){
                data.data[i].statusText='已启用';
              }else{
                data.data[i].statusText='已禁用';
              }
            }
            _com.helpList=data.data;
            _com.getPagination(data);
          } else {
            _com.$message.error(data.message);
          }
        })
      },
      /**
       * 标签修改
       * @param index 当前标签在Table索引
       */
      modifyHelp: function (index, row) {
        var _com = this,
          url = 'sys/help/detail/',
          id = _com.helpList[index].id;
        _com.operateModal(true,'编辑帮助信息');
        _com.$http.get(common.projectPath + url + id, {
          params: {}
        }).then(function (data) {
          data = data.body;
          if (data.code==='SUCCESS') {
            data.data.status = data.data.status==='Y' ? true : false;
            _com.helpForm = data.data;
          } else {
            console.log(data.message)
          }
        })
      },
      /***
       *保存帮助信息
       */
      saveHelp: function () {
        var _com = this, url;
        _com.$refs['helpForm'].validate(function (valid) {
          if (valid) {
            var data = {
              pageName: _com.helpForm.pageName,
              status: _com.helpForm.status?'Y':'N',
              content: _com.helpForm.content,
              sequence: _com.helpForm.sequence
            };
//            _com.helpForm.status=_com.helpForm.status?'Y':'N';
            if (_com.modalTitle === '新增帮助信息') {
              url = 'sys/help/save';
            }
            else if (_com.modalTitle === '编辑帮助信息') {
              url = 'sys/help/update';
              data.id=_com.helpForm.id;
            }
            _com.$http.post(common.projectPath + url, data, {
              emulateJSON: false
            }).then(function (data) {
              data = data.body;
              if (data.code==='SUCCESS') {
                _com.$message.success('保存成功!');
                _com.operateModal(false);
                _com.getList();
              } else {
                _com.$message.error(data.message);
              }
            })
          }
          else {//验证失败
            _com.$message.error('请正确填写资料!');
          }
        });
      },
      /**
       * 标签删除
       * @param index 当前标签在Table中索引
       */
      removeHelp: function (index) {
        var _com = this;
        console.log('remove')
      },
      getPagination:function (data) {
        this.pagination.page=data.page;
        this.pagination.pageSize=data.pageSize;
        this.pagination.rowCount=data.total;
      }
    },
    components: {
      'page-head': head,
      "page-menu": menu,
      'page-foot': foot,
      'content_head':content_head,
      'filter_form':filter_form,
    },
    mounted: function () {
      var _com = this;
      this.$nextTick(function () {
        quicker.returnTop();
        com_ready();
        _com.getList();
      });
    }
  }
</script>


<style lang='scss'>

</style>

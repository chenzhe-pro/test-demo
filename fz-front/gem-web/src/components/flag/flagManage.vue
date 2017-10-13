<!-- ***  Created by raman on 17/3/8-->
<template>
  <div class="wrapper">
    <page-head></page-head>
    <page-menu></page-menu>
    <div class="content_wrapper menuManage ivu-article">
      <div class="content_head clearfix">
        <content_head icon-class="fa fa-flag-o" title="标签管理" show-filter="true" :reload-function="getList">
          <el-button-group slot="button_list">
            <el-button size="small" @click="addFlag(bool,0)">新建</el-button>
            <!--<el-button size="small" >导入</el-button>-->
            <el-button size="small" icon="caret-bottom" disabled></el-button>
          </el-button-group>
        </content_head>
      </div>
      <div class="content_content clearfix">
            <!--<div>-->
              <!--<el-pagination v-if="pagination.rowCount>pagination.pageSize" class="fr page" ref="page" :total="pagination.rowCount" :page-size="pagination.pageSize"-->
                             <!--size="small" show-total show-elevator :current-page="pagination.currentPage"-->
                             <!--@current-change='handleCurrentChange'></el-pagination>-->
            <!--</div>-->
        <tree-grid :msg="index" @add="addFlag" @edit="modifyFlag" :columns="columns" :tree-structure="true" :data-source="dataSource">
        </tree-grid>
        <filter_form :filter-function="getList">
        </filter_form>
      </div>
      <el-dialog v-model="flagModal" :title="modalTitle">
        <el-form ref="flagForm" :model="flagForm" label-width="80px" label-position="right" :rules="flagRules"
                 @keypress.13="saveFlag()">
          <el-form-item label="名称" prop="name">
            <el-input v-model="flagForm.name" size="small" placeholder="请输入名称" @change="checkName()"></el-input>
          </el-form-item>

          <!--<el-form-item label="归属范畴" prop="type">-->
            <!--<el-select v-model="flagForm.type" placeholder="请选择归属范畴" clearable>-->
                <!--<el-option v-for="x in flagType" :value="x.id" :label="x.name"></el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <el-form-item label="指标" prop="indicators">
            <el-select style="width: 100%;"  v-model="flagForm.indicators" size="small" multiple filterable remote
                       placeholder="请输入指标名称" :remote-method="remoteMethod" :loading="loading">
              <el-option v-for="item in indicators" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
            <!--<el-select v-model="formEdit.indicators" multiple>-->
              <!--&lt;!&ndash;<el-option v-for="item in indicators" :value="item.value" :label="item.label"></el-option>&ndash;&gt;-->
            <!--</el-select>-->
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="flagForm.description" size="small" placeholder="请输入描述"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-switch v-model="flagForm.status" size="large" :disabled="disabledEditForm" on-text="启用" off-text="禁用">
            </el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button type="text" size="large" @click="flagModal=false">取消</el-button>
          <el-button type="primary" size="large" @click="saveFlag()">保存</el-button>
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
  import com_ready from '../../assets/js/componentReady'
  import content_head from '../common/content_head.vue'
  import TreeGrid from '../common/treeTable/vue/TreeGrid.vue'
  import filter_form from '../common/filter_form.vue'

  module.exports = {
    data: function () {
      return {
        id:'',//目前选择标签的id
        flagModal: false,
        modalTitle: 'initing...',
        option_Key: '',//添加标签条目之前获取key,传值给get
        pagination: {//分页
          totalPage: 0,
          currentPage: 1,
          pageSize: 12,
          rowCount:0
        },
        add_node_type:1,//新建结点的类型,可以是根结点1或者子结点0
        columns: [
          {
            text: '名称',
            dataIndex: 'title'
          },
          {
            text: '编码',
            dataIndex: 'code'
          },
//          {
//            text: '归属范畴',
//            dataIndex: 'type'
//          },
          {
            text: '描述',
            dataIndex: 'description'
          },
          {
            text: '状态',
            dataIndex: 'statusText'
          }
        ],
        dataSource: [],
        name:'',
        indicators: [],//指标数据
        flagForm: {//模态框初始化
          name: '',
          status: true,
          description: '',
          detail: '',
          type:'',
          scope:'',
          preFlag:'',
          indicators:[]
        },
        flagType: [],//标签类型
        repeatName:true,
//        flagList: [],// 标签列表table
        flagRules: {
          type: [
            {required: true, message: '归属范畴不能为空', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '名称不能为空', trigger: 'change'}
          ]
        },
        filterForm:{
          name:{label:'名称',value:'',type:'text'},
          code:{label:'编码',value:'',type:'text'},
        },

      }
    },
    methods: {
      checkName:function () {
        var _com = this,data={
            name:_com.flagForm.name
        };

        if(_com.flagForm.name){
          _com.$http.post(common.projectPath + 'sys/label/check',data,{

          }).then(function (data) {
            data = data.body;
            if(data.code=="FAIL"){
              _com.repeatName=true;
              _com.$message.error('此标签名已存在!请重新输入');
            }else {
              _com.repeatName=false;
            }
          })

        }

      },
      /**
       * select的远程搜索方法
       */
      remoteMethod(query) {
        var _com = this;
        if (query !== '') {
          _com.loading = true;
          setTimeout(function () {
            _com.loading = false;
            _com.getIndicatorList(query)
            if (_com.indicators) {
              _com.indicators = _com.indicators.filter(function (item) {
                return item.name.toLowerCase()
                    .indexOf(query.toLowerCase()) > -1;
              });
            }
          }, 200);
        } else {

          _com.indicators = [];
        }

      },
      /**
       * 显示选中页的内容
       * @param 选中页的索引
       */
      handleCurrentChange: function (val) {
        var _com = this;
        _com.pagination.currentPage = val;
        _com.getList();
      },
      /**
       * 展示标签table
       * @param  typeId 在类型栏点选类型,相应传入此参数,改变显示列表
       */
      getList: function (filter) {
        var _com = this,
          url = 'sys/label/list',data={
          };
        if(filter){
          data.data=filter;
        }
        _com.$http.post(common.projectPath + url,data, {
        }).then(function (data) {
          data = data.body;
          if (data.code=='SUCCESS') {
                _com.dataSource=data.data;
                var list = data.data;
                common.eachTree(list, function (e) {
                  if(e.title=='技术创新'||e.title=='市场领先'||e.title=='产品品质'||e.title=='人员配备'||e.title=='客户服务'||e.title=='利润增长'){
                    e.disBtn=true;
                  }else{
                    e.disBtn=false;
                  }
                  if(e.status=='Y'){
                    e.statusText='已启用'
                  }else{
                    e.statusText='已禁用'
                  }
                });
                _com.dataSource = list;
            _com.pagination.rowCount = data.total;
          } else {
            _com.$message.error(data.message);
          }
        })
      },
      /**
       * 添加标签,根据标签组选择,传入key值,决定新标签归属
       *
       */
      addFlag: function (bool,type,id) {
        var _com = this;
        _com.id=id;
        _com.option_key = 'add';
        _com.modalTitle = '添加标签';
        _com.flagModal = true;
        _com.add_node_type=type;
        console.log(_com.add_node_type)
        if (_com.$refs['flagForm']) {
          _com.$refs['flagForm'].resetFields();
        }
        _com.flagForm.type=''
      },
      /**
       * 标签修改
       * @param index 当前标签在Table索引
       */
      modifyFlag: function (id) {
        var _com = this,
          url = 'sys/label/detail/';
//        _com.$refs['flagForm'].resetFields();
        _com.option_key = 'modify';
        _com.modalTitle = '修改标签';
        _com.$http.get(common.projectPath + url + id, {
          params: {}
        }).then(function (data) {
          data = data.body;
          if (data.code=='SUCCESS') {
            data.data.status = data.data.status=="Y" ? true : false;
            _com.flagForm = data.data;
            _com.name=_com.flagForm.name;
            if(data.data.type)
              _com.flagForm.type=data.data.type.id;
            if(data.data.indicators){
              for(var k=0;k<data.data.indicators.length;k++){
                data.data.indicators[k]=data.data.indicators[k].id;
              }
            }
            if(data.data.parent)
              _com.flagForm.preFlag=data.data.parent.id;
          } else {
            console.log(data.message)
          }
        })
        _com.flagModal = true;
//        _com.getAllTypes();
      },
      /***
       *保存标签
       */
      saveFlag: function () {
        var _com = this, url;
//        _com.repeatName=false;
        _com.$refs['flagForm'].validate(function (valid) {
          if (valid) {
            if(_com.flagForm.indicators){
              for(var j=0;j<_com.flagForm.indicators.length;j++){
                _com.flagForm.indicators[j]={id:_com.flagForm.indicators[j]}
              }
            }
            var data = {
                name: _com.flagForm.name,
                status: _com.flagForm.status ? 'Y' : 'N',
                remark: _com.flagForm.remark,
                description:_com.flagForm.description,
                indicators:_com.flagForm.indicators
            };
            if(_com.flagForm.preFlag){
              data.parent={id:''};
              data.parent.id=_com.flagForm.preFlag;
            }
            if (_com.option_key === 'add') {
              url = 'sys/label/save';
              if(_com.add_node_type)//根1 子0
              {
                data.parent={
                  id:_com.id
                };
              }
              _com.checkName();
            }
            else if (_com.option_key === 'modify') {
              data.id = _com.flagForm.id;
              url = 'sys/label/update';
              if(_com.flagForm.name!==_com.name){
                _com.checkName();
              }else{
                _com.repeatName=false;
              }
            }
            if(!_com.repeatName){
              _com.$http.post(common.projectPath + url, data, {
                emulateJSON: false
              }).then(function (data) {
                data = data.body;
                if (data.code=='SUCCESS') {
                  _com.$message.success('保存成功!');
                  _com.$refs['flagForm'].resetFields();
                  _com.getList();
                } else {//验证失败
                  _com.$message.error(data.message);
                }
              })
              _com.flagModal = false;
            }else{
              _com.$message.error('标签名已存在!');
            }
          }
        })

      },
      /**
       * 标签删除
       * @param index 当前标签在Table中索引
       */
      removeFlag: function (index) {
        var _com = this;
        console.log('remove')
      },
      /**
       * 获取所有指标信息
       */
      getIndicatorList: function (name) {
        var _com = this,data={
          name:name
        };
        _com.$http.post(common.projectPath + 'sys/indicator/list',data,{

        }).then(function (data) {
          data = data.body
          if (data) {
            var indicators = data;
            for (var i = 0; i < indicators.length; i++) {
              indicators[i].value = indicators[i].id;
              indicators[i].label = indicators[i].name;
            }
            _com.indicators = indicators;
          }
        })
      },
    },
    components: {
      'page-head': head,
      "page-menu": menu,
      'page-foot': foot,
      'content_head':content_head,
      'tree-grid':TreeGrid,
      'filter_form':filter_form
    },
    mounted: function () {
      var _com = this;
      this.$nextTick(function () {
        quicker.returnTop();
        com_ready();
//        _com.showFlagtype();
        _com.getList();
        _com.getIndicatorList();
      });
    }
  }
</script>


<style lang='scss'>

</style>

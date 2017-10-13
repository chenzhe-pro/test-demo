<template>
  <div class="wrapper">
    <page-head></page-head>
    <page-menu></page-menu>

    <div class="content_wrapper indicatorManage ivu-article">
      <div class="content_head clearfix">
        <content_head icon-class="fa fa-hand-peace-o" title="指标管理" show-filter="true" :reload-function="getAllIndicators">
          <el-button-group slot="button_list">
            <el-button size="small" @click="addUser()">新建</el-button>
            <el-button size="small" @click="operateModal(true)">批量上传</el-button>
            <!--<el-button size="small" icon="caret-bottom" disabled></el-button>-->
          </el-button-group>
        </content_head>
      </div>
      <div class="content_content clearfix">
        <el-table :columns="columnsTab" border :data="indicator_list" width="100%">
          <el-table-column align="center" prop="code" label="编码" width=""></el-table-column>
          <el-table-column align="center" prop="name" label="名称" width=""></el-table-column>
          <el-table-column align="center" prop="expression" label="计算公式" width=""></el-table-column>
          <!--<el-table-column align="center" prop="factors" label="计算因子" width=""></el-table-column>-->
          <!--<el-table-column align="center" prop="labelsText" label="标签(职责)" width=""></el-table-column>-->
          <!--<el-table-column align="center" prop="version" label="版本" width=""></el-table-column>-->
          <el-table-column align="center" prop="description" label="定义" width=""></el-table-column>
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
        <el-pagination  v-if="pagination.rowCount>pagination.pageSize" class="fr page" size="small" ref="page" :page-size="pagination.pageSize"
                       @current-change="handleCurrentChange" :current-page="pagination.currentPage"
                       :total="pagination.rowCount" show-total show-elevator></el-pagination>
        <filter_form :filter-function="getAllIndicators">
        </filter_form>
      </div>
      <!--用户模态框-->
      <el-dialog v-model="modalUser" :title="titleName">
        <el-form ref="formEdit" :model="formEdit" :rules="ruleValidate" label-width="85px" class="demo-ruleForm">
          <el-form-item label="名称" prop="name">
            <el-input v-model="formEdit.name"></el-input>
          </el-form-item>
          <el-form-item label="计算公式" prop="expression">
            <el-input v-model="formEdit.expression" ></el-input>
          </el-form-item>
          <el-form-item label="计算因子" prop="indicatorFactors">
            <el-input v-model="formEdit.indicatorFactors" placeholder="(各计算因子之间以；分隔）"></el-input>
          </el-form-item>
          <el-form-item label="版本" prop="version">
            <el-input-number  v-model="formEdit.version"></el-input-number>
          </el-form-item>
          <el-form-item label="定义" prop="description">
            <el-input v-model="formEdit.description"></el-input>
          </el-form-item>
          <el-form-item label="评分标准" prop="scoreType">
            <el-select v-model="formEdit.scoreType">
              <el-option v-for="s in scoreType" :value="s.value" :label="s.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标签" prop="labels">
            <el-select v-model="formEdit.labels" multiple>
              <el-option v-for="item in labels" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="计算结果是否用百分比" prop="remark">
            <el-radio-group v-model="formEdit.percentage">
              <el-radio label="1" >是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="名称解释" prop="remark">
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
      <!--指标批量上传的模态框-->
      <el-dialog v-model="uploadModel" title="指标批量上传" size="tiny">
        <el-steps space="75%" align-center :active="activeStep">
          <el-step title="下载Excel模板" icon="edit"></el-step>
          <el-step title="填写模板，并上传" icon="upload"></el-step>
        </el-steps>
        <div class="excel_box">
          <div class="mb20 mt10">
            <span class="excel_text"><i class="fa fa-table" aria-hidden="true"></i> Excel模板</span>
            <el-button  size="small" @click="download()"><i class="fa fa-download" aria-hidden="true"></i> 点击下载</a></el-button>
          </div>
          <div>
            <el-upload class="upload-demo" :on-preview="handlePreview" accept=".xlsx" list-type="text" :on-success="returnMsg"  :action="fileUrl" :file-list="fileList">
              <el-button size="small"><i class="fa fa-upload" aria-hidden="true"></i> 点击上传</el-button>
            </el-upload>
          </div>
        </div>
        <div slot="footer">
          <el-button type="text" @click="uploadModel=false" size="small">取消</el-button>
          <el-button type="primary" @click="uploadModel=false" size="small">完成</el-button>
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
        fileList:[],//上传的excel模板
        activeStep:0,
        labels: [],//标签数据
        indicator_list: [],//用户数据
        fileUrl:common.projectPath + 'sys/indicator/upload',//上传Excel表格的请求路径
        titleName: '添加指标',
        modalUser: false,//用户对话框
        uploadModel: false,//批量上传对话框
        formEdit: {
          name: '',
          expression:'',
          description:'',
          remark:'',
          version:'',
          id: '',
          status:'',
          labels:[],
          indicatorFactors:'',
          percentage:'',
          scoreType:''
        },
        ruleValidate: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'}
          ],
          expression: [
            {required: true, message: '计算公式不能为空', trigger: 'blur'}
          ],
          indicatorFactors: [
            {required: true, message: '计算因子不能为空', trigger: 'blur'}
          ],
          description: [
            {required: true, message: '定义不能为空', trigger: 'blur'}
          ],
          scoreType: [
            {required: true, message: '评分标准不能为空', trigger: 'change'}
          ]
        },
        scoreType: [{
          value: 'POSITIVE',
          label: '正向'
        }, {
          value: 'NEGATIVE',
          label: '逆向'
        },{
          value: 'VETO_SINGLE',
          label: '单项否决'
        },{
          value: 'VETO_ALL',
          label: '整体否决'
        }]
      }
    },
    methods: {
      /**
       * 批量上传时候点击上传成功时候
       */
      returnMsg:function (data) {
        var _com=this;
        if(data.code=='SUCCESS'){
          _com.$message.success(data.message);
        }else{
          _com.$message.error(data.message);
        }
      },
      /**
       * 批量上传时候点击下载模板excel
       */
      download:function () {
        this.activeStep=1;
        window.location.href='http://kpimd.fz-ark.com/api/indicator.xlsx';

      },
      handlePreview:function (file,fileList) {
        this.activeStep=2;
        console.log(file)
        console.log(fileList)
      },
      /**
       * 操作膜态框
       * @param type bool型,打开或者关闭膜态框
       */
      operateModal: function (operateType, type) {
        var _com=this;
        if (operateType)//打开
        {
//          this.modalTitle = type;
          _com.uploadModel = operateType;
          _com.activeStep = 0;
          _com.$nextTick(function () {
//            _com.$refs['formEdit'].resetFields();
          });
        }
        else {
//          this.$refs['formEdit'].resetFields();
          _com.uploadModel = operateType;
        }
      },
      /**
       * 切换页码时列表渲染当前选中页码
       */
      handleCurrentChange(val) {
        this.pagination.currentPage = val;
        this.getAllIndicators();
      },
      /**
       * 添加指标
       */
      addUser: function () {
        var _com = this;
        _com.titleName = '添加指标';
        if (_com.$refs['formEdit']) {
          _com.$refs['formEdit'].resetFields();
        }
        _com.formEdit.name = '';
        _com.formEdit.expression = '';
        _com.formEdit.remark = '';
        _com.formEdit.version = '';
        _com.formEdit.description = '';
        _com.formEdit.status = false;
        _com.formEdit.lables = [];
        _com.modalUser = true;
      },
      /**
       * 点击查看单个指标信息
       * @param index 选中指标的索引值
       */
      show: function (index) {
        var _com = this;
        this.$http.get(common.projectPath + 'sys/indicator/detail/' + _com.indicator_list[index].id, {}).then(function (data) {
          data = data.body;
          if (data.code!=='SUCCESS') {
            _com.$message.error(data.message);
          } else {
            _com.titleName = '编辑指标';
            if(data.data.labels)
            for (var i = 0; i < data.data.labels.length; i++) {
              data.data.labels[i] = data.data.labels[i].id;
            }

            _com.formEdit = data.data;
            var arr=_com.formEdit.indicatorFactors;
            if(arr){
              _com.formEdit.indicatorFactors=''
              for(var i=0;i<arr.length-1;i++){
                console.log(arr[i].name+'；')
                _com.formEdit.indicatorFactors=_com.formEdit.indicatorFactors+arr[i].name+'；'
              }
              console.log(arr[i].name)
              _com.formEdit.indicatorFactors+=arr[i].name;
            }
            if(_com.formEdit.status=='Y'){
              _com.formEdit.status=true;
            }else{
              _com.formEdit.status=false;
            }
            _com.formEdit.percentage=_com.formEdit.percentage==true?'1':'0'
            _com.modalUser = true;
          }
        })
      },
      /**
       * 点击保存新添加或者已修改的指标信息
       * @param index 表单的模型名字
       */
      save: function (formName) {
        var _com = this, data,url = '',labelIds=[];
        for(var i=0;i<_com.formEdit.labels.length;i++){
          labelIds.push({id:_com.formEdit.labels[i]})
        };
        var factors=_com.formEdit.indicatorFactors.split('；')
        var indicatorFactors=[];
        for(var i=0;i<factors.length;i++){
          indicatorFactors.push({name:factors[i]})
        }
        data = {
//          data:{
            labels: labelIds,
            name: _com.formEdit.name,
            expression: _com.formEdit.expression,
            remark: _com.formEdit.remark,
            description: _com.formEdit.description,
            version: _com.formEdit.version,
            status:_com.formEdit.status? 'Y':'N',
            indicatorFactors:indicatorFactors,
            percentage:_com.formEdit.percentage=='1'?true:false,
            scoreType:_com.formEdit.scoreType

//          },
        }
        if (_com.titleName == '添加指标') {
          url = 'sys/indicator/save'
        } else {
          url = 'sys/indicator/update';
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
                _com.getAllIndicators();
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
       * 获取所有指标信息
       */
      getAllIndicators: function (filter) {
        var _com = this,data={
          page:_com.pagination.currentPage,
          pageSize:_com.pagination.pageSize,
          sorts:[{"field":"createdAt", "sortModel":"DESC"}]
        };
        if(filter){
          data.data=filter;
        }
        _com.$http.post(common.projectPath + 'sys/indicator/pageList',data, {
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
//                var arr=data.data[key].indicatorFactors;
//                if(arr){
//                  data.data[key].factors='';
//                  for(var i=0;i<arr.length-1;i++){
//                    console.log(arr[i].name+'；')
//                    data.data[key].factors=data.data[key].factors+arr[i].name+'；'
//                  }
//                  console.log(arr[i].name)
//                  data.data[key].factors+=arr[i].name;
//                }
              }
              _com.indicator_list = data.data;
            }
            else {
              _com.indicator_list = [];
            }
          }
        })
      },
      /**
       * 获取所有标签信息
       */
      getLabelList: function () {
        var _com = this,data={
//          data:{}
        };
        _com.$http.post(common.projectPath + 'sys/label/listAll',data,{

        }).then(function (data) {
          data = data.body;
          if (data) {
            var labels = data;
            for (var i = 0; i < labels.length; i++) {
              labels[i].value = labels[i].id;
              labels[i].label = labels[i].name;
            }
            _com.labels = labels;
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
      _com.getAllIndicators();
      _com.getLabelList();
      this.$nextTick(function () {
        quicker.returnTop();
        com_ready();
      });
    },

  }
</script>

<style lang='scss'>

</style>

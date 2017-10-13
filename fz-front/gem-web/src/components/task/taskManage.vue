<template>
  <div class="wrapper">
    <page-head></page-head>
    <page-menu></page-menu>

    <div class="content_wrapper taskManage ivu-article">
      <div class="content_head clearfix">
        <content_head icon-class="fa fa-user-circle" title="任务管理" show-filter="true" :reload-function="getAllTasks">
          <el-button-group slot="button_list">
            <el-button size="small" @click="addTask()">新建</el-button>
            <!--<el-button size="small" >导入</el-button>-->
            <el-button size="small" icon="caret-bottom" disabled></el-button>
          </el-button-group>
        </content_head>
      </div>
      <div class="content_content clearfix">
        <el-table :columns="columnsTab" border :data="task_list" width="100%">
          <el-table-column align="center" prop="code" label="编码" width=""></el-table-column>
          <el-table-column align="center" prop="name" label="名称" width=""></el-table-column>
          <el-table-column align="center" prop="work" label="调用类名" width=""></el-table-column>
          <el-table-column align="center" prop="args" label="初始化参数" width=""></el-table-column>
          <!--<el-table-column align="center" prop="mail" label="触发器" width=""></el-table-column>-->
          <el-table-column align="center" prop="description" label="描述" width=""></el-table-column>
          <!--<el-table-column align="center" prop="statusText" label="状态" width=""></el-table-column>-->
          <el-table-column align="center" label="操作" width="">
            <template scope="scope">
              <el-button @click="show(scope.$index)" size="small"><i class="fa fa-edit" aria-hidden="true"></i> 编辑
              </el-button>
              <el-button @click="start(scope.$index)" size="small" v-if="task_list[scope.$index].status==='N'" >
                <i class="fa fa-play-circle" aria-hidden="true"></i>
                开启定时
              </el-button>
              <el-button @click="stop(scope.$index)" :plain="true" type="danger" size="small" v-else>
                <i class="fa fa-ban" aria-hidden="true"></i>
                停止定时
              </el-button>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-if="pagination.rowCount>pagination.pageSize" class="fr page" size="small" ref="page" :page-size="pagination.pageSize"
                       @current-change="handleCurrentChange" :current-page="pagination.currentPage"
                       :total="pagination.rowCount" show-total show-elevator></el-pagination>
        <filter_form :filter-function="getAllTasks">
        </filter_form>
      </div>
      <!--任务模态框-->
      <el-dialog v-model="modalUser" :title="titleName">
        <el-form ref="formEdit" :model="formEdit" :rules="ruleValidate" label-width="85px" class="demo-ruleForm">
          <el-form-item label="名称" prop="name">
            <el-input v-model="formEdit.name"></el-input>
          </el-form-item>
          <el-form-item label="调用类名" prop="work">
            <el-input v-model="formEdit.work"></el-input>
          </el-form-item>
          <el-form-item label="初始化参数" prop="args">
            <el-input v-model="formEdit.args"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="formEdit.description"></el-input>
          </el-form-item>
          <el-form-item label="设置定时" prop="args">
            <el-button @click="setTime()"><i class="fa fa-sitemap" aria-hidden="true"></i> 选择触发时间</el-button>
          </el-form-item>
          <!--<el-form-item label="启用状态" prop="status" v-if="formEdit.status==='N'">-->
            <!--<el-button @click="start()" size="small">开启定时-->
            <!--</el-button>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="启用状态" prop="status" v-if="formEdit.status==='Y'">-->
            <!--<el-button @click="stop()" size="small">关闭定时-->
            <!--</el-button>-->
          <!--</el-form-item>-->
        </el-form>
        <div slot="footer">
          <el-button type="text" @click="clearForm('formEdit')">取消</el-button>
          <el-button type="primary" @click="save('formEdit')">保存</el-button>
        </div>
      </el-dialog>
      <!---设置定时任务-->
      <el-dialog v-model="modalTask" title="设置定时任务" size="tiny">
        <div slot="title" style="display: inline-block;width: 100px;line-height: 28px;font-weight: bold;">
          <span>设置定时任务</span>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane name="day">
            <span slot="label">每天</span>
            <el-form ref="taskMenu">
              <el-form-item label="执行时间点">
                <el-time-picker
                  v-model="formEdit.dayTime"
                  placeholder="任意时间点">
                </el-time-picker>
              </el-form-item>
            </el-form>
            </el-tab-pane>
          <el-tab-pane name="week">
            <span slot="label">每周</span>
            <el-form ref="taskMenu" @keypress.13="saveTask()">
              <el-form-item label="选择星期几">
              <el-select v-model="formEdit.dayOfWeek" placeholder="请选择" clearable>
                <el-option
                  v-for="item in week"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
                </el-form-item>
              <el-form-item label="执行时间点">
                <el-time-picker
                  v-model="formEdit.weekTime"
                  placeholder="任意时间点">
                </el-time-picker>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane  name="month">
            <span slot="label">每月</span>
            <el-form ref="taskMenu" inline label-width="85px">
              <!--<el-form-item label="一月中某天">-->
                <!--<el-input v-model="formEdit.dayOfMonth" placeholder="输入1-31任意数字"></el-input>-->
              <!--</el-form-item>-->
              <el-form-item label="一月中某天">
                <el-input-number  v-model="formEdit.dayOfMonth"></el-input-number>
              </el-form-item>
              <el-form-item label="执行时间点">
                <el-time-picker
                  v-model="formEdit.monthTime"
                  placeholder="任意时间点">
                </el-time-picker>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <div slot="footer">
          <el-button type="text" size="small" @click="modalTask=false">取消</el-button>
          <el-button type="primary" size="small" @click="saveTask()">保存</el-button>
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
//        id:''
        week:[
          {value:0,label:'星期日'},
          {value:1,label:'星期一'},
          {value:2,label:'星期二'},
          {value:3,label:'星期三'},
          {value:4,label:'星期四'},
          {value:5,label:'星期五'},
          {value:6,label:'星期六'},
        ],
        activeName: 'day',
        modalTask:false,//定时任务对话框
        pagination: {//分页
          totalPage: 0,
          rowCount: 0,
          pageSize: 12,
          currentPage: 1,
        },
        task_list: [],//任务数据
        roles: [],//角色数据
        titleName: '添加任务',
        modalOrg: false,//部门对话框
        modalUser: false,//任务对话框
        formEdit: {
          name: '',
          args: '',
          work: '',
          id: '',
          dayTime:'',
          weekTime:'',
          monthTime:'',
          dayOfMonth:'',
          description:'',
          dayOfWeek:'',
          status:'',
          period:''
        },
        ruleValidate: {
          name: [
            {required: true, message: '姓名不能为空', trigger: 'blur'}
          ],
          work: [
            {required: true, message: '调用类名不能为空', trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      /**
       * 启动定时任务
       * @param index 选中删除的提醒设置的索引值
       */
      start: function (index) {
        var _com = this;
        _com.$confirm('此操作将开启该定时任务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          _com.$http.get(common.projectPath + 'sys/task/start/'+_com.task_list[index].id, {
          }).then(function (data) {
            data = data.body;
            if (data.code!=='SUCCESS') {
              _com.$message.error(data.message);
            } else {
              _com.$message.success(data.message);
              console.log(_com.pagination.rowCount)
              _com.getAllTasks();
            }
          })
        })
      },
      /**
       **停止定时任务
       * @param index 选中停止的提醒设置的索引值
       */
      stop: function (index) {
        var _com = this;
        _com.$confirm('此操作将停止该定时任务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          _com.$http.get(common.projectPath + 'sys/task/stop/'+_com.task_list[index].id, {
            params:{}
          }).then(function (data) {
            data = data.body;
            if (data.code!=='SUCCESS') {
              _com.$message.error(data.message);
            } else {
              _com.$message.success(data.message);
              _com.getAllTasks();
            }
          })
        })
      },
      saveTask:function () {
        var _com = this;
        console.log(_com.formEdit)
        _com.modalTask=false
      },
      handleClick:function (tab, event) {
        if(this.formEdit.period=='day'){
          this.formEdit.weekTime='';
          this.formEdit.monthTime='';
          this.formEdit.dayOfMonth='';
          this.formEdit.dayOfWeek='';
        }else if(this.formEdit.period=='week'){
          this.formEdit.dayTime='';
          this.formEdit.monthTime='';
          this.formEdit.dayOfMonth='';
        }else{
          this.formEdit.dayTime='';
          this.formEdit.weekTime='';
          this.formEdit.dayOfWeek='';
        }
      },
      /**
       * 选择触发时间,点击查看后弹出模态框
       */
      setTime: function () {
        var _com = this,
          url = 'sys/menu/list',data={
            data:{}
          };
        _com.modalTask = true;
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
            }
          }
        )
      },
      /**
       * 切换页码时列表渲染当前选中页码
       */
      handleCurrentChange(val) {
        this.pagination.currentPage = val;
        this.getAllTasks();
      },
      /**
       * 添加任务
       */
      addTask: function () {
        var _com = this;
        _com.titleName = '添加任务';
        if (_com.$refs['formEdit']) {
          _com.$refs['formEdit'].resetFields();
        }
        for(var i in _com.formEdit){
          _com.formEdit[i]='';
        }
        _com.activeName='day'
        _com.modalUser = true;
      },
      /**
       * 点击查看单个任务信息
       * @param index 选中任务的索引值
       */
      show: function (index) {
        var _com = this;
        this.$http.get(common.projectPath + 'sys/task/detail/' + _com.task_list[index].id, {}).then(function (data) {
          data = data.body;
          if (data.code!=='SUCCESS') {
            _com.$message.error(data.message);
          } else {
            _com.titleName = '编辑任务';
            _com.formEdit = data.data;
//            if(_com.formEdit.status=='Y'){
//              _com.formEdit.status=true;
//            }else{
//              _com.formEdit.status=false;
//            }
            _com.activeName=_com.formEdit.period;
            _com.modalUser = true;
          }

        })
      },
      /**
       * 点击保存新添加或者已修改的任务信息
       * @param index 表单的模型名字
       */
      save: function (formName) {
        var _com = this, data;
        var url = '';
        data = {
            name: _com.formEdit.name,
            args: _com.formEdit.args,
            work: _com.formEdit.work,
            description: _com.formEdit.description,
//            dayOfMonth: _com.formEdit.dayOfMonth,
//            dayOfWeek: _com.formEdit.dayOfWeek,
//            dayTime: _com.formEdit.dayTime,
            period: _com.activeName,
        }
        if (_com.titleName == '添加任务') {
          url = 'sys/task/save'
        } else {
          url = 'sys/task/update';
          data.id = _com.formEdit.id;
        }
        if(_com.activeName=='day'){
          data.dayTime=_com.formEdit.dayTime;
        }else if(_com.activeName=='week'){
          data.dayOfWeek=_com.formEdit.dayOfWeek;
          data.weekTime=_com.formEdit.weekTime;
        }else if(_com.activeName=='month'){
          data.dayOfMonth=_com.formEdit.dayOfMonth;
          data.monthTime=_com.formEdit.monthTime;
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
                _com.getAllTasks();
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
       * 获取所有任务信息
       */
      getAllTasks: function (filter) {
        var _com = this,data={
          data:{},
          page:_com.pagination.currentPage,
          pageSize:_com.pagination.pageSize,
//          sorts:[{"field":"createdAt", "sortModel":"DESC"}]
        };
        if(filter){
          data.data=filter;
        }
        _com.$http.post(common.projectPath + 'sys/task/pageList',data, {

        }).then(function (data) {
          data = data.body;
          if (data.code!=='SUCCESS') {
            _com.$message.error(data.message);
          } else {
            if (data.data) {
              _com.pagination.rowCount = data.total;
              for(var key in data.data){
                if(data.data[key].status=='Y'){
                  data.data[key].statusText='已开启'
                }else{
                  data.data[key].statusText='已关闭'
                }
              }
              _com.task_list = data.data;
            }
            else {
              _com.task_list = [];
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
      _com.getAllTasks();
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

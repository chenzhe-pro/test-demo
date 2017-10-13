<template>
  <div class="wrapper">
    <page-head></page-head>
    <page-menu></page-menu>
    <!-- Content Wrapper. Contains page content -->
    <div class="content_wrapper menuManage " >
      <div class="content_head clearfix">
        <content_head icon-class="fa fa-navicon" title="菜单管理" show-filter="true" :reload-function="getMenuData">
          <!--<el-dropdown slot="dropdown_content">-->
            <!--<span class="el-dropdown-link">-->
            <!--下拉菜单<i class="el-icon-caret-bottom el-icon&#45;&#45;right"></i></span>-->
            <!--<el-dropdown-menu slot="dropdown">-->
              <!--<el-dropdown-item>个人中心</el-dropdown-item>-->
              <!--<el-dropdown-item>退出</el-dropdown-item>-->
            <!--</el-dropdown-menu>-->
          <!--</el-dropdown>-->
          <el-button-group slot="button_list">
            <el-button size="small" @click="operateModal(true,1)">新建</el-button>
            <!--<el-button size="small" >导入</el-button>-->
            <el-button size="small" icon="caret-bottom" disabled></el-button>
          </el-button-group>
        </content_head>
      </div>
      <div class="content_content clearfix">
        <!--新增结点弹窗-->
        <el-dialog v-model="show_modal" title="新增菜单">
          <el-form ref="formAdd" :model="formAdd" :rules="rule"  label-width="60px">
            <el-form-item label="序号" prop="sequence">
              <el-input-number  v-model="formAdd.sequence"></el-input-number>
              <!--<el-input v-model="formAdd.sequence" size="small" placeholder="请输入排序"></el-input>-->
            </el-form-item>
            <el-form-item label="名称" prop="name">
              <el-input v-model="formAdd.name"  placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="URL" prop="url">
              <el-input v-model="formAdd.url" placeholder="请输入URL(只需要输入模块名字)"></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-switch v-model="formAdd.status" on-text="启用" off-text="关闭" size="large"></el-switch>
            </el-form-item>
          </el-form>
          <div slot="footer">
            <el-button type="text" size="large" @click="operateModal(false)">取消</el-button>
            <el-button type="primary" size="large" @click="addNode('formAdd')">保存</el-button>
          </div>
        </el-dialog>
        <!--编辑节点--->
        <el-dialog v-model="edit_modal" title="编辑菜单">
          <el-form ref="formEdit" :model="formEdit" :rules="rule"  label-width="60px">
            <el-form-item label="序号" prop="sequence" >
              <el-input-number  v-model="formEdit.sequence" :min="0"></el-input-number>
              <!--<el-input v-model="formEdit.sequence" size="small" placeholder="请输入排序"></el-input>-->
            </el-form-item>
            <el-form-item label="名称" prop="name">
              <el-input v-model="formEdit.name" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="URL" prop="url">
              <el-input v-model="formEdit.url" placeholder="请输入URL(只需要输入模块名字)"></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-switch v-model="formEdit.status" on-text="启用" off-text="关闭" size="large"></el-switch>
            </el-form-item>
          </el-form>
          <div slot="footer">
            <el-button type="text" size="large" @click="operateModal(false)">取消</el-button>
            <el-button type="primary" size="large" @click="saveNode('formEdit')">保存</el-button>
          </div>
        </el-dialog>
        <tree-grid :msg="index" @add="operateModal" @edit="showDetail" :columns="columns" :tree-structure="true" :data-source="dataSource">
          <!--<span slot="operation">禁用</span>-->
        </tree-grid>
        <filter_form :filter-function="getMenuData">
        </filter_form>
      </div>

    </div>
    <!-- /.content-wrapper -->
    <!--<page-foot></page-foot>-->
  </div>
</template>

<script>
  import head from '../common/head.vue'
  import menu from '../common/menu.vue'
  import foot from '../common/foot.vue'
  import content_head from '../common/content_head.vue'
  import filter_form from '../common/filter_form.vue'
  import TreeGrid from '../common/treeTable/vue/TreeGrid.vue'

  import com_ready from '../../assets/js/componentReady'
  module.exports={
    data:function () {
      return {
        id:'',
        allMenu:'',
        show_modal:false,//是否现实弹窗
        edit_modal:false,//是否现实弹窗
        disabledAddBtn:true,//是否禁用新增结点按钮
        disabledEditForm:true,//是否禁用编辑表单
        add_modal_loading:false,//提交新增结点接口的loading
        add_node_type:1,//新建结点的类型,可以是根结点1或者子结点0
        formEdit:{
          id:'',
          name:'',
          url:'',
          sequence:'',
          status:''
        },
        formAdd:{
          name:'',
          url:'',
          sequence:'',
          status:''
        },
        rule: {
          name: [
            { required: true, message: '请填写菜单名称', trigger: 'blur' }
          ],
          url: [
            { required: true, message: '请填写菜单url', trigger: 'blur' }
          ],
          sequence:[
            { required: true,type:'number', message: '请填写菜单排序', trigger: 'blur' }
          ]
        },
        menuData: [

        ],
        columns: [
          {
            text: '名称',
            dataIndex: 'title',
//            align:left
          },
          {
            text: '编码',
            dataIndex: 'code'
          },
          {
            text: '序号',
            dataIndex: 'sequence'
          },
          {
            text: 'URL',
            dataIndex: 'url'
          },
          {
            text: '状态',
            dataIndex: 'statusText'
          }
        ],
        dataSource: [
        ]
      }
    },
    methods:{
      /**
       * 操作膜态框
       * @param type bool型,打开或者关闭膜态框
       */
      operateModal:function (operateType,type,id) {
        this.id=id;
        if(operateType)//打开
        {
          this.add_node_type=type;
          this.show_modal=operateType;
          this.$nextTick(function () {
            this.clearForm('formAdd');
          });
        }
        else{
          this.show_modal=operateType;
          this.edit_modal=operateType;
        }
      },
      /**
       * 获取菜单数据
       */
      getMenuData:function (filter) {
        var _com = this,data={

        };
        if(filter){
          data.data=filter;
        }
        _com.disabledAddBtn=true;
        _com.disabledEditForm=true;
        _com.$http.post(common.projectPath+'sys/menu/list',data,{
//          emulateJSON:false
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.dataSource=data.data;
            var list = data.data;
            common.eachTree(list, function (e) {
              if(e.status=='Y'){
                e.statusText='已启用'
              }else{
                e.statusText='已禁用'
              }
            });
            _com.dataSource = list;
          }else{
            _com.$message.error(data.message);
          }
        });
      },
      /**
       * 点击选中展示详情
       * @param id 选中的菜单的id
       */
      showDetail:function (id) {
        this.edit_modal=true;
        this.disabledAddBtn=false;
        this.disabledEditForm=false;
        var _com = this;
        _com.$http.get(common.projectPath+'sys/menu/detail/'+id,{
          params:{
          }
        }).then(function (data) {
          data=data.body;
          if(data.code!=='SUCCESS'){
            _com.$message.error({message:data.message,showClose: true,duration:1400});
          }else{
            if(data.data.sequence!==undefined)
              data.data.sequence=data.data.sequence.toString();
            _com.formEdit=data.data;
            if(_com.formEdit.status=='Y'){
              _com.formEdit.status=true;
            }else{
              _com.formEdit.status=false;
            }
          }
        });
      },
      /**
       * 添加结点
       * @param formName 表单的模型名字
       */
      addNode:function (formName) {
        var _com=this,data;
        _com.$refs[formName].validate(function(valid){
          if (valid) {//验证通过
            data={
              level:0,
              name:_com.formAdd.name,
              url:_com.formAdd.url,
              sequence:_com.formAdd.sequence,
              status:_com.formEdit.status? 'Y':'N'
            };
            if(_com.add_node_type)//根1 子0
            {
              data.parentId=_com.id;
            }
            _com.$http.post(common.projectPath+'sys/menu/save',data, {
              emulateJSON:false //emulateJSON 默认是false,以json形式传参;true以formData形式,post的时候必传
            }).then(function (data) {
              data=data.body;
              if(data.code=="SUCCESS"){
                _com.$message.success({message:'添加成功!',showClose: true,duration:1400});
                _com.show_modal=false;
                _com.getMenuData();
              }else{
                _com.$message.error({message:data.message,showClose: true,duration:1400});
              }
            });
          } else {//验证失败
            _com.$message.error({message:'请填写正确数据!',showClose: true,duration:1400});
          }
        })
      },
      /**
       * 保存结点
       * @param formName 表单的模型名字
       */
      saveNode:function (formName) {
        var _com=this,data;
        _com.$refs[formName].validate(function(valid){
          if (valid) {//验证通过
            data={
              id:_com.formEdit.id,
              level:0,
              name:_com.formEdit.name,
              url:_com.formEdit.url,
//              icon:_com.formEdit.icon,
              parentId:_com.formEdit.parentId,//选中的结点的id
              sequence:_com.formEdit.sequence,
              status:_com.formEdit.status? 'Y':'N'
            };
            _com.$http.post(common.projectPath+'/sys/menu/update',data, {
              emulateJSON:false //emulateJSON 默认是false,以json形式传参;true以formData形式,post的时候必传
            }).then(function (data) {
              data=data.body;
              if(data.code!=='SUCCESS'){
                _com.$message.error({message:data.message,showClose: true,duration:1400});
              }else{
                _com.$message.success({message:'保存成功!',showClose: true,duration:1400});
                _com.edit_modal=false;
                _com.getMenuData();
              }
            });
          } else {//验证失败
            _com.$message.error({message:'请填写正确数据!',showClose: true,duration:1400});
          }
        })
      },
      /**
       * 清空对应的表单模型
       * @param formName 表单的模型名字
       */
      clearForm:function (formName) {
        this.$refs[formName].resetFields();
      }
    },
    components:{
      'page-head':head,
      "page-menu":menu,
      'page-foot':foot,
      'content_head':content_head,
      'filter_form':filter_form,
      'tree-grid':TreeGrid
    },
    mounted:function () {
      this.getMenuData();
      this.$nextTick(function () {
        quicker.returnTop();
        com_ready();
      });
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  /*包含字体的样式在页面直接引用,不可以import导入,否则打包后字体路径会发生错误*/
   .menu_tree{
     .ivu-checkbox-wrapper{
       display: none;
     }
   }
</style>

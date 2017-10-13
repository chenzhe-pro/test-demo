<!--hr部门设置组件-->
<template>
  <div class="wrapper department postSet" v-loading.fullscreen="pageLoading">
    <page-head></page-head>
    <div class="content_wrapper">
      <content_head show-menu="true"></content_head>
      <div class="content_content">
        <div class="">
          <p class="set_title">组织架构图</p>
          <div class="set_content">
            <div class="post_tree_area dragscroll ">
              <div class="post_tree ">
                <family-tree :data="departmentData" @addNode="operateModal" @editNode="operateModal" @openDep="openDep"></family-tree>
                <p class="no_data_tip" v-if="departmentData.length===0">缺少第一级部门数据</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-dialog v-model="show_modal" :title="model_type" size="tiny">
        <div class="dialog_title_line"></div>
        <el-form ref="form" :model="form" :rules="rule"  label-width="80px">
          <el-form-item label="部门名称" prop="name">
            <el-input v-model="form.name"  placeholder="请输入部门名称"></el-input>
          </el-form-item>
          <el-form-item label="上级部门" prop="parentId" v-if="!_disabled">
            <el-select v-model="form.parentId" placeholder="请选择上级部门" :disabled="_disabled">
              <el-option
                v-for="item in options"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <div class="btns clearfix" style="width: 320px;margin: 0px auto">
            <div class="btn btn-light fl" @click="stopDep()" v-if="model_type == '编辑部门卡片'">冻结部门</div>
            <div class="btn btn-light fl" @click="operateModal(false)" v-else>取消</div>
            <div class="btn btn-primary fr" @click="saveNode">保存卡片</div>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import head from '../common/head.vue'
  import content_head from '../common/content_head.vue'
  import familyTree from '../common/familyTree.vue'
  import drag from '../../assets/js/dragscroll'
  module.exports = {
    data: function () {
      return {
        pageLoading:false,
        show_modal:false,
        model_type:'',
        _disabled:false,
        form:{
          name:'',
          parentId:''
        },
        rule:{
          name: [
            {required: true, message: '请填写部门名称', trigger: 'blur'}
          ]
        },
        currentNode:{},
        departmentData:[],
        options: [],
        value: '',
        oldParentId:''
      }
    },
    computed:{
      userInfo:function () {
        return this.$store.state.userInfo;
      }
    },
    props:{
      childFun:{}
    },
    methods:{
      edit:function () {
        var _com=this;
        _com.$http.get(common.projectPath + 'usr/department/detail/'+this.currentNode.id,{
          params:{}
        }).then(function (data) {
          data = data.body;
          if (data.code==='SUCCESS') {
            _com.form.name=data.data.name;
            _com.form.parentId=data.data.parentId;
            _com.oldParentId=data.data.parentId;
            _com.getParentNode();
          } else {
            _com.$message.error(data.message);
          }
        })
      },
      /**
       * 操作膜态框
       * @param type bool型,打开或者关闭膜态框
       */
      operateModal:function (operateType,modalType,node) {
        if(operateType)//打开
        {
          this.model_type=modalType;
          this.show_modal=operateType;
          this.$nextTick(function () {
            this.clearForm('form');
          });
          this.currentNode=node;
          if(this.model_type==='新增部门卡片'){
            this._disabled=true;
          }
          else {
            this._disabled=false;
            this.edit();
          }
        }
        else{
          this.clearForm('form');
          this.show_modal=operateType;
        }
      },
      getParentNode:function () {
        var _com = this,
          url = 'usr/department/queryAllParentByDepId/'+this.currentNode.id;
        _com.$http.get(common.projectPath + url, {
          params: {

          }
        }).then(function (data) {
          data = data.body;
          if (data.code==='SUCCESS') {
            _com.options=data.data;
            if(_com.options.length===0)//无上级部门,也就是最高级部门
            {
              _com._disabled=true;
            }
          } else {
            _com.$message.error(data.message);
          }
        })
      },
      getData: function () {
        var _com = this,
          url = 'usr/department/queryDep';
        _com.pageLoading=true;
        _com.$http.get(common.projectPath + url, {
          params: {

          }
        }).then(function (data) {
          data = data.body;
          if (data.code==='SUCCESS') {
            if(data.data&&data.data.length>0)
            {
              _com.departmentData=data.data;
              var deep_arr=[];
              common.eachTree(_com.departmentData,function (node,deep) {
                node.deep=deep;
                deep_arr.push(deep);
//                max+=node.maxNodes;
              });
              _com.$nextTick(function () {
//                var nodes=$("[deep="+deep_arr.getMost().key+"]"),width=0;
                $(".postSet .post_tree").css({width:(deep_arr.getMost().length*50)+'%'});
//                for(var i=0;i<nodes.length;i++)
//                {
//                  width+=($(nodes[i]).width()+15);
//                }
//                console.log(width);
                $(".postSet .post_tree").css({width:($('[deep=0]').width()+20+10+2)+'px'});
                var height=($(window).height()-200)<500?500:($(window).height()-200);
                $(".postSet .post_tree_area").css({height:height+'px'});
                $('.post_tree_area').jScrollPane();
//              drag.reset();
              });
            }
            else {
              _com.departmentData=[];
              $(".postSet .post_tree").css({width:'auto'});
            }
            setTimeout(function () {
              _com.pageLoading=false;
            },500);

          } else {
            _com.$message.error(data.message);
          }
        })
      },
      saveNode:function () {
        var _com=this,url,data={

        };
        if(this.model_type==='新增部门卡片')
        {
          url='usr/department/addChildDept';
          data={
            parentId:this.currentNode.id,
            name:this.form.name
          }
        }
        else {
          url='usr/department/updateDep';
          data={
            parentId:this.form.parentId,
            newName:this.form.name,
            id:this.currentNode.id
          }
        }
        _com.$refs['form'].validate(function (valid) {
          if(valid){
            if(_com.oldParentId!==_com.form.parentId)//判断是否换了部门
            {
              _com.$confirm('部门内岗位及人员将一并调整, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(function(){
                _com.ajaxSaveNode(url,data);
              }).catch(function() {

              });
            }
            else {
              _com.ajaxSaveNode(url,data);
            }
          }
          else {
//            _com.$message.error('');
          }
        });
      },
      ajaxSaveNode:function (url,data) {
        var _com=this;
        _com.$http.post(common.projectPath + url, data, {
          emulateJSON: false
        }).then(function (data) {
          data = data.body;
          if (data.code==='SUCCESS') {
            _com.operateModal(false);
            _com.getData();
          } else {
            _com.$message.error(data.message);
          }
        })
      },
      /**
       * 冻结部门
       */
      stopDep:function () {
        var _com=this;
        _com.$http.get(common.projectPath+'usr/department/stopDep/'+this.currentNode.id,{

        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.$message.success('该部门已冻结!');
            _com.operateModal(false);
            _com.getData();
          }else{
            _com.$message.error(data.message);
          }
        })
      },
      /**
       * 启用部门
       */
      openDep:function (node) {
        var _com=this;
        _com.$http.get(common.projectPath+'usr/department/openDep/'+node.id,{

        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.$message.success('该部门已启用!');
//            _com.operateModal(false);
            _com.getData();
          }else{
            _com.$message.error(data.message);
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
    components: {
      'family-tree':familyTree,
      'page-head': head,
      'content_head':content_head
    },
    mounted:function () {
      this.getData();
      this.$nextTick(function () {
        quicker.returnTop();


      })
    }
  }
</script>




<template>
  <div class="menu">
    <el-menu :default-active="check_menu" class="el-menu-demo" mode="horizontal" router unique-opened @select="">
      <li class="menu_grid" @click="roleModal=true">
        <a class="navbar-icon" href="javascript:;"><div class="slds-icon-waffle_container" data-aura-rendered-by="28:0;p"><div class="slds-icon-waffle" data-aura-rendered-by="29:0;p"><div class="slds-r1" data-aura-rendered-by="30:0;p"></div><div class="slds-r2" data-aura-rendered-by="31:0;p"></div><div class="slds-r3" data-aura-rendered-by="32:0;p"></div><div class="slds-r4" data-aura-rendered-by="33:0;p"></div><div class="slds-r5" data-aura-rendered-by="34:0;p"></div><div class="slds-r6" data-aura-rendered-by="35:0;p"></div><div class="slds-r7" data-aura-rendered-by="36:0;p"></div><div class="slds-r8" data-aura-rendered-by="37:0;p"></div><div class="slds-r9" data-aura-rendered-by="38:0;p"></div></div></div> </a>
      </li>
      <template v-for="x in menuData">
        <el-submenu :index="x.url" v-if="x.children">
          <template slot="title">
            <i :class="x.iconCls"></i>
            {{x.title}}
          </template>
          <el-menu-item :index="y.url" v-for="y in x.children">
            <i :class="y.iconCls"></i>
            {{y.title}}
          </el-menu-item>
        </el-submenu>
        <el-menu-item :index="x.url" v-else>
          <i :class="x.iconCls"></i>
          {{x.title}}
        </el-menu-item>

      </template>
      <li class="menu_more" @click="modal=true" v-if="allData.length>9">
        更多 <i class="fa fa-angle-double-right"></i>
      </li>
      <!--<template v-for="x in menuData">-->
        <!--<el-menu-item :index="x.url" >-->
          <!--<i :class="x.iconCls"></i>-->
          <!--{{x.title}}-->
        <!--</el-menu-item>-->
      <!--</template>-->
    </el-menu>
    <!--<el-menu :default-active="check_subMenu" class="el-menu-demo" mode="horizontal" unique-opened @select="clickSubMenu">-->
      <!--<template v-for="x in subMenuData">-->
        <!--<el-menu-item :index="x.url" >-->
          <!--<i :class="x.iconCls"></i>-->
          <!--{{x.title}}-->
        <!--</el-menu-item>-->
      <!--</template>-->
    <!--</el-menu>-->
    <el-dialog title="所有功能" v-model="modal">
      <div class="menu_list_">
        <template v-for="x in allData">
          <el-dropdown v-if="x.children" @command="redirect_" >
            <el-button size="small">
              {{x.title}}<i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="y in x.children" :command="y.url">{{y.title}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button size="small" v-else @click="redirect_(x.url)">{{x.title}}</el-button>
        </template>

      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="modal = false">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择角色" v-model="roleModal" size="large">
      <div class="line"></div>
      <ul class="role_list clearfix">
        <li v-for="x in roleData">
          <a href="javascript:;">
            <div class="icon_area"><i class="fa fa-users" aria-hidden="true"></i></div>
            <div class="t">
              <a href="javascript:;" class="role_name" @click="changeRole(x.id,x.name)" v-text="x.name">销售</a>
              <p class="role_detail">asdasdsadasdasdasdasdsadasdasdasd</p>
            </div>
          </a>
        </li>
      </ul>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="roleModal = false">确定</el-button>
    </div>
  </el-dialog>
  </div>
</template>
<style>

</style>
<script>
  module.exports = {
    data: function () {
      return {
        check_menu:common.check_menu,
        check_subMenu:'',
        modal:false,
        roleModal:false,
        menuData: [
          {
            url:''
          }
        ],
        allData:[],
      }
    },
    computed:{
      roleData:function () {
        return this.$store.state.userInfo.roles;
      }
    },
    watch:{
      'roleData':function () {//刷新后得到角色数据后执行
        if(this.roleData)
        {
          if(this.$store.state.roleId) {//已有角色,直接渲染
            this.loadMenuDataByRole();
          }
          else{//无角色,默认以第一个做为角色
            this.$store.commit('changeRoleId',this.roleData[0].id);
            this.loadMenuDataByRole();
          }
        }
      },
//      '$store.state.roleId':function (oldVal,newVal) {
//        if(this.$store.state.roleId){
//          this.loadMenuDataByRole();
//        }
//      }
    },
    methods:{

      loadMenuDataByRole:function (isChange) {
        var menu=[],hide_menu=[],name='';
        for(var i=0;i<this.roleData.length;i++)
        {
          if(this.$store.state.roleId===this.roleData[i].id)
          {
            menu=this.roleData[i].menuGrids.concat([]);
            name=this.roleData[i].name;
            break;
          }
        }
        if(menu.length>9)
        {
          hide_menu=menu.splice(9,menu.length-9);
        }
        this.menuData=menu;
        this.allData=this.menuData.concat(hide_menu);
      },
      /**
       * 获取角色列表
       */
      getRoleList: function () {
        var _com = this,data={
          data:{},
          page:1,
          pageSize:100,
          sorts:[{"field":"createdAt", "sortModel":"DESC"}]
        };
        _com.$http.post(common.projectPath + 'sys/role/list',data,{
        }).then(function (data) {
          data = data.body;
          if (data.code!=='SUCCESS') {
            if(data.code==='NO_LOGIN'){//未登录
              window.location.href='login.html';
            }
            else _com.$message.error(data.message);
          } else {
            _com.roleData = data.data;
            _com.loadMenuData(_com.roleData);
          }
        })
      },
      redirect_:function (url) {
        this.$router.push({name:url});
      },
      /**
       * 改变角色,这里需要改变后跳转到角色对应菜单的第一个菜单
       * @param roleId
       * @param name
       */
      changeRole:function (roleId,name) {
        this.$store.commit('changeRoleId',roleId);
        this.loadMenuDataByRole();
        this.redirect_(this.allData[0].url);
        this.roleModal=false;
        this.$message.success('角色已切换到'+name);
      }
    },
    mounted:function () {
      if(this.roleData)
      {
        //路由切换,直接渲染菜单,因为不会改变角色
        if(this.$store.state.roleId){
          this.loadMenuDataByRole();
        }
      }
      this.$nextTick(function () {

      })
    }
  }
</script>

<!--登陆中转组件-->
<template>
  <div class="loading" v-loading.fullscreen="fullscreenLoading" element-loading-text="正在加载工作台">

  </div>
</template>

<script>
  module.exports = {
    data: function () {
      return {
        fullscreenLoading:true,
        menuData:[]
      }
    },
    computed:{
      roleData:function () {
        return this.$store.state.userInfo.roles;
      }
    },
    watch:{
      'roleData':function () {
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
      }
    },
    methods:{
      loadMenuDataByRole:function () {
        var menu=[],hide_menu=[];
        for(var i=0;i<this.roleData.length;i++)
        {
          if(this.$store.state.roleId===this.roleData[i].id)
          {
            menu=this.roleData[i].menuGrids.concat([]);
            break;
          }
        }
        this.menuData=menu;
        var _com=this;
        setTimeout(function () {
          _com.$router.push({name:menu[0].url});
//          $('body').css('overflow','scroll');
        },800);

      }
    },
    mounted:function () {
      var _com=this;
      if(this.roleData)
      {
        //路由切换,直接渲染菜单,因为不会改变角色
        if(this.$store.state.roleId){
          this.loadMenuDataByRole();
        }
      }
    }
  }
</script>

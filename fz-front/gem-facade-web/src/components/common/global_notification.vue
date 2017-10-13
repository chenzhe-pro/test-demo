<!-- 全局通知模板  Created by chenzhe on 17/4/14-->
<template>
    <div class="notification">

    </div>
</template>
<script>
    module.exports = {
      data:function () {
        return{

        }
      },
      methods:{
        getNotification:function () {
          var _com = this;
          _com.$http.get(common.projectPath+'role/loadMenus',{
            params:{
              ids:ids
            },
          }).then(function (data) {
            data=data.body;
            if(!data.success){
              _com.$message({
                duration:1400,
                showClose: true,
                message: data.message,
                type:'error'
              });
            }else{
              if(data.obj.length>9)
              {
                left_data=data.obj.splice(10,data.obj.length-9);
              }
              _com.menuData=data.obj;
              _com.$nextTick(function () {
                // 手动更新当前选项
//              _com.$refs['menu'].updateActiveKey()
              })
            }
          });
        }
      },
      mounted:function () {

      }
    }
</script>

<!— ***模板  Created by limin on 2017/9/4—>
<template>
  <div class="post stationSet childTable">
    <div class="set_content">
      <div class="left_content" v-if="!type">
        <p style="color:#4C5C6F;font-weight: bold;" class="f16 mb10">我的下属</p>
        <el-tree :data="positionList" highlight-current></el-tree>
      </div>
      <div class="right_side">
        <span class="return_btn mt10 mr10" @click="return_last"><i class="fa fa-arrow-circle-left fa-lg "></i> 返回上一级</span>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="日清表" name="daliy">
            <daliy_table></daliy_table>
          </el-tab-pane>
          <el-tab-pane label="工作计划表" name="work">
            <work_table></work_table>
          </el-tab-pane>
          <el-tab-pane label="考核表" name="check">
            <check_table></check_table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="line_"></div>
    </div>
  </div>
</template>
<script>
  import head from '../common/head.vue'
  import content_head from '../common/content_head.vue'
  import daliyTable from './daliyTable.vue'
  import checkTable from './checkTable.vue'
  import workTable from './workTable.vue'

  module.exports = {
    data: function () {
      return {
        activeName:'daliy',
        positionList:[],
        data:[
          {
            label: '一级 1',
            children: [{
              label: '二级 1-1',
              children: [{
                label: '三级 1-1-1'
              }]
            }]
          }, {
            label: '一级 2',
            children: [{
              label: '二级 2-1',
              children: [{
                label: '三级 2-1-1'
              }]
            }, {
              label: '二级 2-2',
              children: [{
                label: '三级 2-2-1'
              }]
            }]
          }, {
            label: '一级 3',
            children: [{
              label: '二级 3-1',
              children: [{
                label: '三级 3-1-1'
              }]
            }, {
              label: '二级 3-2',
              children: [{
                label: '三级 3-2-1'
              }]
            }]
          }
        ]
      }
    },
    props:['type'],
    computed: {

    },
    methods: {
      return_last:function () {
        this.$emit('getstep',1)
      },
      init:function () {
        var _com=this;
        if(_com.type){
          $('.childTable .right_side').css('margin-left',0);
          _com.activeName=_com.type;
        }
      },
      handleClick(tab) {
        if(tab.name==='check')
        this.initCheck();
      },
      initCheck: function () {
        var _com = this;
        _com.$nextTick(function () {
          var h = $('.kpi_box').height();
          var s = h - 40;
          $('.kpi_weight').eq(0).find('div').css('height', s + 'px');
          $('.kpi_weight').eq(0).find('div').css('line-height', s + 'px');
          $('.kpi_weight').eq(1).find('div').css('height', h + 'px');
          $('.kpi_weight').eq(1).find('div').css('line-height', h + 'px');
        })

      },
      /**
       * 获得人员和岗位数据
       */
      getEmployeeList:function () {
        var _com=this;
        _com.pageLoading=true;
        _com.$http.get(common.projectPath+'sys/employee/list-branch',{
          params:{}
        }).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            var list=data.data;
            common.eachTree(list, function (e) {
              e.label = e.title;
              if(!e.children) e.children=[];
              if(!e.objects) e.objects=[];
              if(e.objects){
                for(var i=0;i<e.objects.length;i++){
                  e.objects[i].realName=e.objects[i].realName+'('+e.title+')';
                  e.objects[i].level=e.level;
                }
              }
              e.children=e.children.concat(e.objects);
            });
            _com.positionList.push(list);

            common.eachTree(_com.positionList,function (m) {
              if(m.realName){
                m.label = m.realName;
              }
            })
//            if(_com.personId){
//              _com.$nextTick(function () {
//                var count=0,delf=true;
//                common.eachTree(_com.positionList,function (l) {
//                  if(l.id==_com.personId){
////                  _com.$refs['personTree'].setChecked(l.id,true);
//                    _com.level=l.level;
//                    $($('.el-tree-node')[count]).click();
//                    delf=null;
//                  }else{
//                    if(delf){
//                      if(l.children.length)
//                        $($('.el-tree-node')[count]).click();
//                      count++;
//                    }
//                  }
//                })
//              })
//            }
            setTimeout(function () {
              _com.pageLoading=false;
            },500);

          }else{
            _com.$message.error(data.message);
          }
        })

      },
    },
    mounted: function () {
      this.init();
      this.getEmployeeList();
      this.$nextTick(function () {
        quicker.returnTop();
      })
    },
    components: {
      'page_head': head,
      'content_head': content_head,
      'daliy_table': daliyTable,
      'check_table': checkTable,
      'work_table': workTable,
    }
  }
</script>
<style lang='scss'>

</style>

<!--组织初始化组件-->
<template>
  <div class="wrapper initSet">
    <page-head></page-head>
    <div class="content_wrapper">
      <content_head :show-breadcrumb="false" show-menu="false"></content_head>
      <div class="content_content">
        <div class="init_step clearfix">
          <div class="step step1">
            <span class="step_number " :class="{success_step:parseInt(step)>1,current_step:parseInt(step)===1}"><span>1</span><i class="fa fa-check"></i></span>
            <span>组织架构调整</span>
            <img src="../../assets/img/dot_line.svg" alt="" class="dot_line">
          </div>
          <div class="step step2">
            <span class="step_number " :class="{success_step:parseInt(step)>2,current_step:parseInt(step)===2}"><span>2</span><i class="fa fa-check"></i></span>
            <span>岗位职责配置</span>
            <img src="../../assets/img/dot_line.svg" alt="" class="dot_line">
          </div>
          <div class="step step3">
            <span class="step_number" :class="{success_step:parseInt(step)>3,current_step:parseInt(step)===3}"><span>3</span><i class="fa fa-check"></i></span>
            <span>审核设置</span>
            <img src="../../assets/img/dot_line.svg" alt="" class="dot_line">
          </div>
          <div class="step step4">
            <span class="step_number" :class="{success_step:parseInt(step)>4,current_step:parseInt(step)===4}"><span>4</span><i class="fa fa-check"></i></span>
            <span>权限设置</span>
            <img src="../../assets/img/dot_line.svg" alt="" class="dot_line">
          </div>
          <div class="step step5">
            <span class="step_number" :class="{success_step:parseInt(step)===5}"><span>5</span><i class="fa fa-check"></i></span>
            <span>完成</span>
            <img src="../../assets/img/dot_line.svg" alt="" class="dot_line">
          </div>
        </div>
        <div class="init_content">
          <department-set :child-fun="process" v-if="step==1&&sub_step==1"></department-set>
          <correspond-set :child-fun="process" v-if="step==1&&sub_step==2"></correspond-set>
          <post-set :child-fun="process" v-if="step==2&&sub_step==1"></post-set>
          <station-set :child-fun="process" v-if="step==2&&sub_step==2"></station-set>
          <check-set :child-fun="process" v-if="step==3"></check-set>
          <right-set :child-fun="process" v-if="step==4"></right-set>
          <finish :child-fun="process" v-if="step==5"></finish>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import head from '../common/head.vue'
  import content_head from '../common/content_head.vue'
  import departmentSet from './departmentSet.vue'
  import postSet from './postSet.vue'
  import stationSet from './stationSet.vue'
  import indicatorSet from './indicatorSet.vue'
  import checkSet from './checkSet.vue'
  import rightSet from './rightSet.vue'
  import correspondSet from './correspondSet.vue'
  import finish from './finish.vue'
  module.exports = {
    data: function () {
      return {
        step:this.$route.query.step,
        sub_step:this.$route.query.sub_step,
//        userInfo:this.$store.state.userInfo
      }
    },
    computed:{
      userInfo:function () {
        return this.$store.state.userInfo;
      }
    },
    watch: {
      // 路由query变化
      '$route.query.step' (to, from) {
        this.step=this.$route.query.step;
//        if
      },
      '$route.query.sub_step' (to, from) {
        this.sub_step=this.$route.query.sub_step;
      }
    },
    methods:{
      getList: function () {
        var _com = this,
          url = 'sys/help/pageList',
          data={
            data:{
            },
            pageSize:20
          };
        _com.$http.post(common.projectPath + url, data, {
          emulateJSON: false
        }).then(function (data) {
          data = data.body;
          if (data.code==='SUCCESS') {
            for(var i=0;i<data.data.length;i++)
            {
              if(_com.menuTitle==data.data[i].pageName){
                _com.menuTitle=data.data[i].sequence
              }
            }
          } else {
            _com.$message.error(data.message);
          }
        })
      },
      process:function (currentId,stepId,type) {
        var _com = this,step=stepId.split('-')[0],sub_step=stepId.split('-')[1]?stepId.split('-')[1]:null;
//        if(stepId===''){
//          _com.$router.push({name:'checkManage'});
//        }
        if(type==='next')//接着下一步
        {
          _com.$http.get(common.projectPath+'sys/initprocess/nextStep/'+currentId,{
            params:{}
          }).then(function (data) {
            data = data.body;
            if (data.code==='SUCCESS') {
              if(stepId){//要跳转的步骤
                if(sub_step)
                  _com.$router.push({name:'initSet',query:{step:step,sub_step:sub_step}});
                else
                  _com.$router.push({name:'initSet',query:{step:step}});
              }
              else{//没有步骤id就是点完成,则发送短信并跳转至首页
                _com.$http.get(common.projectPath+'usr/employee/sendOpenSMS',{
                  params:{}
                }).then(function (data) {
                  data = data.body;
                  if (data.code==='SUCCESS') {
                    _com.$router.push({name:'homePage'});
                  }
                  else{
                    _com.$message.error(data.message);
                  }
                });
              }
            }else{
              _com.$message.error(data.message);
            }
          })
        }//返回上一步
        else {
          if(sub_step)
            _com.$router.push({name:'initSet',query:{step:step,sub_step:sub_step}});
          else _com.$router.push({name:'initSet',query:{step:step}});
        }
      },
    },
    components: {
      'page-head': head,
      'department-set':departmentSet,
      'post-set':postSet,
      'station-set':stationSet,
      'right-set':rightSet,
      'indicator-set':indicatorSet,
      'check-set':checkSet,
      'correspond-set':correspondSet,
      'content_head':content_head,
      'finish':finish,
    },
    mounted:function () {
      if(!(this.step))
      {
        this.$message.error('参数错误!');
      }
      this.$nextTick(function () {
        quicker.returnTop();
      })
    }
  }
</script>


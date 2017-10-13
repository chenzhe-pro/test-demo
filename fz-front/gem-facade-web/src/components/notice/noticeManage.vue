<template>
  <div class="wrapper notice" v-loading.fullscreen="pageLoading">
    <page-head></page-head>
    <div class="content-wrapper">
      <content_head show-menu='true'></content_head>
      <div class="content_content">
        <div class="content_main clearfix">
          <p class="main_head clearfix">
            <span class="head_title fl">消息通知</span>
            <span class="head_handle fr" @click="allRead" v-if="noticeList.length > 0">全部已读</span>
          </p>
          <div class="main_notice" v-for="x in noticeList">
            <div class="notice_overview clearfix">
              <!-- <p class="overview_content fl"><span class="overview_left point_position" v-bind:class="{red_point: !x.readBoolean,green_point: x.readBoolean}"></span><span class="overview_right">{{ x.createName }}{{ x.statusText }}了您{{ x.content }}的申请。</span></p> -->
              <p class="overview_content fl"><span class="overview_left point_position" v-bind:class="{red_point: !x.readBoolean,green_point: x.readBoolean}"></span><span class="overview_right"  @click="jumpTo(x.attachId,x.id,x.type)">{{ x.title }}</span></p>
              <p class="notice_time fr">{{ x.createdAt }}</p>
            </div>
            <div class="notice_leaveWord" v-if="x.content !== null">
              <p v-if="x.status==='AGREE'&&x.type==='EVA'">{{ '附加留言: '+'"' + x.content + '"' }}</p>
              <p v-else-if="x.status==='REFUSE'&&x.type==='EVA'">{{ '拒绝理由: '+'"' +x.content + '"' }}</p>
              <p v-else-if="x.type==='DAILY_FORM'" >{{'点评内容: '+'"' + x.content + '"' }}</p>
              <p v-else-if="x.status==='REFUSE'&&x.type==='INDICATOR'" >{{'拒绝理由: '+'"' + x.content + '"' }}</p>
            </div>
          </div>
          <div class="no_data_tip" v-if="noticeList.length == 0">暂无数据</div>
          <el-pagination v-if="noticeList.length !== 0" class="fr page" size="small" ref="page" @current-change="handleCurrentChange" :page-size="pagination.pageSize" :total="pagination.rowCount" show-total show-elevator :current-page="pagination.currentPage"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import head from '../common/head.vue'
  import content_head from '../common/content_head.vue'

  module.exports = {
    data: function () {
      return {
        noticeList: [],//获取的消息列表
        pagination: {
          totalPage: 0,
          pageSize: 5,
          rowCount: 0,
          currentPage: 1
        },
        pageLoading:true
      }
    },
    computed: {

    },
    methods: {
      jumpTo:function (id,noticeId,type) {
        var _com=this,personId='',time='';
        _com.oneRead(noticeId);
        if(type=='EVA'){
          _com.$http.get(common.projectPath+'usr/evaluationForm/detail/'+id).then(function (data) {
            data=data.body;
            if(data.code=='SUCCESS'){
              if(data.data){
                time=data.data.startTime.substring(0,10);
              _com.$store.commit('changePerson',data.data.employeeId);
              _com.$store.commit('changeDate',time);
              window.location.href='#/checkManage'
              }
//
            }else{
              _com.$message.error(data.message);
            }
          })
        }


      },
      /**
       * 获取未读通知数量
       */
      getNoticeNum: function () {
        var _com = this;
        _com.$http.get(common.projectPath+'sys/notity/countUnRead').then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.$store.commit('setUnRead',data.data);
          }else {
            _com.$message.error(data.message);
          }
        })
      },
      /**
       * 选择页码改变当前列表
       */
      handleCurrentChange(val) {
        this.pagination.currentPage = val;
        this.getNoticeList();
      },
      /**
       * 获取通知列表
       */
      getNoticeList: function () {
        var _com = this;
        _com.pageLoading=true;
        var para = {
          page: _com.pagination.currentPage,
          pageSize: _com.pagination.pageSize
        };
        _com.$http.post(common.projectPath + 'sys/notify/pageList', para).then(function (data) {
          data = data.body;
          if (data.code != 'SUCCESS') {//请求失败
            _com.$message.error(data.message);
          } else {//请求成功
            if (data.data) {
              _com.noticeList = [];
              _com.noticeList = data.data;
              for (var i = 0; i < _com.noticeList.length; i++) {
                if (_com.noticeList[i].read == 'READ') {
                  _com.noticeList[i].readBoolean = true;
                } else {
                  _com.noticeList[i].readBoolean = false;
                }
              }
              _com.pagination.currentPage = data.page;
              _com.pagination.rowCount = data.total;
              setTimeout(function () {
                _com.pageLoading=false;
              },500);
            } else {
              _com.noticeList = [];
            }
          }
        })
      },
      /**
       * 全部已读
       */
      allRead: function () {
        var _com = this;
        _com.$http.get(common.projectPath+'sys/notify/readAll').then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.$message.success("全部信息设置为已读");
            _com.getNoticeNum();
            _com.getNoticeList();
          }else {
            _com.$message.error(data.message);
          }
        })
      },
      /**
       * 单个已读
       */
      oneRead: function (val) {
        var _com = this;
        _com.$http.get(common.projectPath+'sys/notify/read/' + val).then(function (data) {
          data=data.body;
          if(data.code=='SUCCESS'){
            _com.getNoticeNum();
            _com.getNoticeList();
          }else {
            _com.$message.error(data.message);
          }
        })
      },
//      reload: function () {
//        alert('刷新啦');
//        window.location.reload();
////        this.$router.go(0);
//      },
    },
    created: function () {

    },
    mounted: function () {
      this.getNoticeList();
    },
    components: {
      'page-head': head,
      'content_head': content_head,
    }
  }
</script>

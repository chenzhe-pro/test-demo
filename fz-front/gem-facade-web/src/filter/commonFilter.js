/**
 * Created by chenzhe on 17/2/17.
 */
import Vue from 'vue';
// 图片资源作为模块被webpack打包,返回打包后的资源路径;
// 要注意的是当某一张图片作为独立模块时,这张图片不能在其它的css或者html中使用,否则会出错!
import head_origin_pic from '../assets/img/ion-avatar.png' ;
import origin_pic from '../assets/img/origin_pic.jpg';
module.exports=function () {
    Vue.filter("head_origin_pic",function (value) {
      if(!value)
        return head_origin_pic;
      return value;
    });
    Vue.filter("origin_pic",function (value) {
      if(!value)
        return origin_pic;
      return value;
    });
    Vue.filter("null_to_text",function (value,text) {
      if(!value)
        return text;
      return value;
    });
  Vue.filter("short_time",function (str) {
    if(str){
      return str.substring(0,10)
    }else{
      return '暂无'
    }
  });
  Vue.filter("indicator_status",function (val) {
    if (val == "to_verify") {
      return "待审核"
    } else if (val == "verified") {
      return "审核通过"
    } else if (val == "unverified") {
      return "审核不通过"
    } else if (val == "to_approve") {
      return "待审批"
    } else if (val == "approved") {
      return "审批通过"
    } else if (val == "unApproved") {
      return "审批不通过"
    } else if (val == "fillin") {
      return "待填报"
    } else if (val == "fillover") {
      return "填报完成"
    }
  });
  Vue.filter("dailyForm_status",function (val) {
    if (val == "INIT") {
      return "初始化，待提交"
    } else if (val == "TO_APPROVE") {
      return "已提交，待审核"
    } else if (val == "APPROVED") {
      return "已审核"
    }
  });
  Vue.filter("chooseName",function (val) {
    if(val)
    var len=val.replace(/[^\x00-\xff]/g, '__').length
    if(len<7){
      return val;
    }else if(len>6){
       return val.substring(val.length-2,val.length)
    }

  })
};

Vue.filter("matters_type",function (val) {
  if (val == "KPI") {
    return "KPI相关"
  } else if (val == "GS") {
    return "GS相关"
  } else if (val == "OTHER") {
    return "其他任务"
  }
});

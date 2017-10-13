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
};

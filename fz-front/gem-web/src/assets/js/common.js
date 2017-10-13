/**
 * Created by chenzhe on 17/3/8.
 */
var icon=require('../img/logo.png');
function init() {
  /**
   * 初始化项目
   */
  this.init=function () {
    this.redirect();
    var hostName="http://kpimd.fz-ark.com",//开发打开
    // var hostName="http://kpimt.fz-ark.com",//测试打开
//  var hostName=window.location.protocol + "//" + window.location.host+"",//上线打开
 //      subProject="/cy-facade-mgr/",//测试打开
      subProject="/api/",//测试打开
      projectPath= hostName+subProject;
    this.projectPath=projectPath;
    // if(window.location.href.indexOf("login")<=-1)//非登录页面
    // {
    //   this.userInfo={
    //     admin_phone:quicker.getCookie("admin_phone")?decodeURIComponent(quicker.getCookie("admin_phone")):null,
    //     admin_mail:quicker.getCookie("admin_mail")?decodeURIComponent(quicker.getCookie("admin_mail")):null
    //   };
    // }
    this.appendTagIcon(icon);

    window.common=this;
  };
  /**
   * 添加标签图标
   * @param icon 图标路径
   */
  this.appendTagIcon=function (icon) {
    var icon_element=document.createElement('link');
    icon_element.rel='shortcut icon';
    // icon_element.style='image/x-icon';
    icon_element.href=icon;
    document.querySelector('head').appendChild(icon_element);
  };
  this.redirect=function () {
    var ua=window.navigator.userAgent;
    if(ua.indexOf('MSIE')>-1)
    {
      alert("您在使用IE低版本浏览器，请使用IE Edge或者谷歌、360浏览器将会获得更好的体验。请点击'确定'按钮,去下载谷歌浏览器");
      window.location.href = "http://rj.baidu.com/soft/detail/14744.html";
    }
  };
  this.eachTree=function (jsontree,callback) {
    if ((typeof jsontree == 'object') && (jsontree.constructor== Object.prototype.constructor)) {
      var arrey = [];
      arrey.push(jsontree);
    }
    else arrey = jsontree;
    for (var i = 0; i < arrey.length; i++) {
      var jn = arrey[i];
      // 找到节点,执行相应代码
      if(callback) callback(jn);

      // 遍历节点,执行相应代码
      if (jn.children && jn.children.length > 0) {
        this.eachTree(jn.children,callback);
      }
    }
  };
  this.openFilter=function () {
    document.querySelector('.filter_form').style.display="none";
    document.querySelector('.filter_form').style.display="block";
    // var H=$('.filter_form').height()>$('.content_content').height()?$('.filter_form').height():'100%';
    // $('.filter_form').css('height',H)

  };
  this.closeFilter=function () {
    document.querySelector('.filter_form').style.display="none";
  };
  this.projectPath=null;
}
module.exports=new init();

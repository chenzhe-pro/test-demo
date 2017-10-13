/**
 * Created by chenzhe on 17/2/22.
 * 组件渲染完成执行
 */
module.exports=function () {
  var windowHeight=$(window).height(),
    pageHeight=$('body').height();
  if(windowHeight>pageHeight)//内容少,没有滚动条
  {
    var offset=windowHeight-pageHeight-2;
    $('.foot').css({'margin-top':offset+'px'})
  }
  else {
    // $('.foot').css({'position':'relative'})
  }

  //给每个模块的图标加动画
  $(".icon_area").removeClass('magictime puffIn').addClass('magictime puffIn');

};

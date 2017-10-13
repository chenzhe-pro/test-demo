$(function() {

  'use strict';

  // 仅允许存在一个 psv 容器，用于存放生成的 PhotoSphereViewer 对象
  var psv;

  function loadPano(img) {

    // 如果已经创建过psv，则清空
    if (psv) {
      $('.pano-scene').empty();
      psv = undefined;
    }

    psv = new PhotoSphereViewer({
      panorama: img,
      container: $('.pano-scene').get(0),
      time_anim: false,
      navbar: true
    });
  }

  

  
  // 默认加载
  loadPano( $('.pano-items > li.active').first().find('a').data('pano-url') );

  // 点击加载
  $('.pano-items').delegate('> li > a', 'click', function(event) {

    event.preventDefault();

    loadPano($(this).data('pano-url'));

    // 删除原有 active，创建新的 active
    $(event.delegateTarget).find('> li.active').removeClass('active');
    $(this).parent().addClass('active');
  });

	  // $('.sofa').click(function() {
	  // 	var url = 'c.png';
	  // 	loadPano(url);
	  // })
	 // $('.sofa').click(function() {
	 //  	loadsofa();
	 //  })
	 // function loadsofa() {
	 // 	var psvb = new PhotoSphereViewer({
	 //      panorama: 'c.png',
	 //      container: $('#pano-sofa'),
	 //      time_anim: false,
	 //      navbar: true
  //   	});
	 // }

	 var sofa = 'js/c.png';

	 $('.sofa').click(function(){
         if(!shafaShow)
             loadShafa();
         else
             hideShafa();
         shafaShow=!shafaShow;
    });



	 

});


// $(function() {
//         var panoramaHeight = function() {
//             var $windowHeight = $(window).height();
//             $('#panorama').css({height:$windowHeight});
//         }
//         panoramaHeight();
//         $(window).resize(function() {
//             panoramaHeight();
//         });
//         window.onload = function() {
//             loadPano('keting');
//         };
//         $('#keting,#bedroom,#shufang,#bathroom').on('click',function(){
//             var imgName = $(this).attr('id');
//             console.log(imgName);
//             loadPano(imgName);
//         });
//     })

//     function loadPano(pano) {
//         var imgUrl = 'http://7xl96d.com2.z0.glb.qiniucdn.com/pano-';
//         var pano = imgUrl + pano + '.jpg';
//         var panorama = document.getElementById('panorama');
//         var PSV = new PhotoSphereViewer({
//             panorama: pano,
//             container: panorama,
//             time_anim: false,
//             navbar: true,
//         });
//     }

    






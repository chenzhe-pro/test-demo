var cacheData=[];
//js相关公共方法
function jsFunction(){
    this.alert=function(alertStr,type,call_ok) {
        var obj=this,alert_elem,alert_elemstr,alert_bg_mask,sleep_flg=true,result=false;
        if($(".common_alert")[0]) {
            $(".common_alert").css({"display": "block", "opacity": 1});
            if(type==0) {
                $(".common_alert")[0].innerHTML = alertStr;
                var timeout=setTimeout(function(){$(".common_alert").hide();clearTimeout(timeout);},1000);
            }
            else
            {
                $(".common_alert p")[0].innerHTML = alertStr;
            }
        }
        else
        {
            if(type==0)
            {
                alert_elem=document.createElement("p");
                alert_elem.style.cssText="width:200px;padding:10px;position: fixed;z-index:1000;top:40%;border-radius: 6px 6px;text-align: center;background-color: rgba(25,24,24,.9);color:#fff;";
                alert_elem.className="common_alert";
                alert_elem.innerHTML=alertStr;
                $("body")[0].appendChild(alert_elem);
                var width=$(".common_alert")[0].offsetWidth;
                $(".common_alert")[0].style.left=($("body")[0].offsetWidth-width)/2+"px";
                var timeout=setTimeout(function(){$(".common_alert").remove();clearTimeout(timeout);},1000);
            }
            else
            {
                alert_elemstr="<div class='common_alert'><div class='common_alert_title'>提示</div><p style='font-size: 13px;padding: 10px 15px;'>"+alertStr+"</p> <div class='common_alert_sure'>确定</div></div>";
                alert_bg_mask="<div class='alert_bg_mask'></div>";
                $('body').append(alert_elemstr);
                $('body').append(alert_bg_mask);
                $(".common_alert")[0].style.cssText="font-family: 'microsoft yahei';box-shadow: 0px 0px 8px 3px #999;width:260px;padding:0 0 10px 0;position: fixed;z-index:1005;top:40%;border-radius: 5px 5px;text-align: center;background-color: #fff;color:#2d2d2d;border:1px solid #999;";
                $(".common_alert_title")[0].style.cssText="text-align: left;background-color: rgb(13, 162, 234);padding: 0 12px;line-height: 30px;border-radius: 4px 4px 0px 0;letter-spacing: 1px;color: #fff;font-size: 13px;";
                $('.common_alert_sure')[0].style.cssText="cursor:pointer;width: 70px;height: 26px;text-align: center;line-height: 28px;background-color: #0DA2EA;border-radius: 6px 6px;letter-spacing: 1px;color: #fff;display: inline-block;margin:10px auto 0;"
                $(".alert_bg_mask")[0].style.cssText="position:fixed;width:100%;height:100%;z-index:1000;top:0;left:0;background-color:rgba(255,255,255,0)";
                var width=$(".common_alert")[0].offsetWidth;
                $(".common_alert")[0].style.left=($("body")[0].offsetWidth-width)/2+"px";

                $('.common_alert_sure').click(function(){
                    $(".common_alert").remove();
                    $(".alert_bg_mask").remove();
                    if(call_ok)
                    {
                        call_ok();
                    }
                });
            }
        }
    };
    this.confirm=function(alertStr,call_ok,call_cancel)
    {
        var obj=this,alert_elem,alert_elemstr,alert_bg_mask;
        alert_elemstr="<div class='common_alert'><div class='common_alert_title'>确认</div><p style='font-size: 13px;padding: 10px 15px;'>"+alertStr+"</p> <div class='common_alert_sure'>确定</div> <div class='common_alert_cancel'>取消</div></div>"
        alert_bg_mask="<div class='alert_bg_mask'></div>";
        $('body').append(alert_elemstr);
        $('body').append(alert_bg_mask);
        $(".common_alert")[0].style.cssText="font-family: 'microsoft yahei';box-shadow: 0px 0px 8px 3px #999;width:260px;padding:0 0 10px 0;position: fixed;z-index:1005;top:40%;border-radius: 6px 6px;text-align: center;background-color: #fff;color:#2d2d2d;border:1px solid #999;";
        $(".common_alert_title")[0].style.cssText="text-align: left;background-color: rgb(13, 162, 234);padding: 0 12px;line-height: 30px;border-radius: 4px 4px 0px 0;letter-spacing: 1px;color: #fff;font-size: 13px;";
        $('.common_alert_sure')[0].style.cssText="cursor:pointer;float:right;width: 70px;height: 26px;text-align: center;line-height: 26px;background-color: #0DA2EA;border-radius: 5px 5px;letter-spacing: 1px;color: #fff;display: inline-block;margin:10px 50px 0 0px;";
        $('.common_alert_cancel')[0].style.cssText="cursor:pointer;float:left;width: 70px;height: 26px;text-align: center;line-height: 26px; background-color: #0DA2EA;border-radius: 5px 5px;letter-spacing: 1px;color: #fff;display: inline-block;margin:10px 0px 0 50px;";
        $(".alert_bg_mask")[0].style.cssText="position:fixed;width:100%;height:100%;z-index:1000;top:0;left:0;background-color:rgba(255,255,255,0)";
        var width=$(".common_alert")[0].offsetWidth;
        $(".common_alert")[0].style.left=($("body")[0].offsetWidth-width)/2+"px";
        $('.common_alert_cancel').click(function(){
            $(".common_alert").remove();
            $(".alert_bg_mask").remove();
            if(call_cancel)
            {
                call_cancel();
            }
        });
        $('.common_alert_sure').click(function(){
            $(".common_alert").remove();
            $(".alert_bg_mask").remove();
            if(call_ok)
            {
                call_ok();
            }
        });
    };
    this.setCookie=function(objName,objValue,path,objHours){
        var str = objName + "=" + encodeURI (objValue);
        if(objHours > 0){//为时不设定过期时间，浏览器关闭时cookie自动消失
            var date = new Date();
            var ms = objHours*3600*1000;
            date.setTime(date.getTime() + ms);
            str += (";expires=" + date.toGMTString());
        }
        if(path){
            str+=((path) ? (";path=" + path) : "");
        }
        document.cookie = str;
    };
    this.getCookie=function(name) {
        var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
        if(arr != null) {
            return decodeURI(arr[2]);
        }
        return null;
    };
    this.delCookie=function(name,path){
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval=getCookie(name);
        if(cval!=null){
            var str = name + "="+'aaa'+";expires="+exp.toGMTString();
            if(path){
                str+=((path) ? (";path=" + path) : "");
            }else{
                str+=";path=/";
            }
            document.cookie= str;
        }
    }
}
var js=new jsFunction();
//angular服务
var serviceFunction=function(){
    //核心服务
    this.getTime=function(str){
        var date=str.split(" ")[0],dateArr=date.split("-");
        var time=str.split(" ")[1],timeArr=time.split(":");
        var d=new Date(parseInt(dateArr[0]),parseInt(dateArr[1])-1,parseInt(dateArr[2]),parseInt(timeArr[0]),parseInt(timeArr[1]));
        return d.getTime();
    };
    this.formatDate=function(d,type){
        var date=new Date(d),s;
        if(type=="hour")
        {
            s=date.toLocaleTimeString();
        }
        else if(type=="day")
        {
            s=date.toLocaleDateString();
        }
        else if(type=='month'){
            s=(date.getMonth()+1)+"月";
        }
        else {
            s=(date.getFullYear())+"年";
        }
        return s;
    };
    this.isLogin=function(data){
        //option
        if(typeof(data.isLogin) !== "undefined" && !data.isLogin){
            window.location.href=redirect_url;
            return false;
        }
        else  return true;
    };
    this.formatDate_long=function(time_long){
        var date=new Date(time_long),m=(date.getMonth()+1)<11?"0"+(date.getMonth()+1):(date.getMonth()+1),
            d=date.getDate()<10?"0"+date.getDate():date.getDate(),h=date.getHours()<10?"0"+date.getHours():date.getHours(),
            min=date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes();
        var str=date.getFullYear()+"-"+m+"-"+d+" "+h+":"+min;
        return str;
    };
    this.dateStringToLongTime=function(datestr,type){
        var arr,year,month,dt,hour,minute,longTime,date;
        if(type!==" ")
        {
            arr=datestr.split(" ")[0].split(type);
            year=arr[0],month=arr[1],dt=arr[2];
            hour=datestr.split(" ")[1].split(':')[0];
            minute=datestr.split(" ")[1].split(':')[1];
        }
        date=new Date(year,parseInt(month)-1,dt,hour,minute);
        longTime=date.getTime();
        return longTime;
    };
    this.longTimeToDateString=function(longtime,type){
        var date=new Date(longtime),m=(date.getMonth()+1)<11?"0"+(date.getMonth()+1):(date.getMonth()+1),
            d=date.getDate()<10?"0"+date.getDate():date.getDate(),h=date.getHours()<10?"0"+date.getHours():date.getHours(),
            min=date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes();
        var str=date.getFullYear()+type+m+type+d+" "+h+":"+min;
        return str;
    };
    this.commonAjax=function($http,option){
        var httpOption=null;
        if(option.menthod.toUpperCase()=="GET")
        {
            httpOption={
                method:option.method,
                url: option.url,
                params:option.params,
                cache:option.cache
            };
        }
        else
        {
            httpOption={
                method:option.method,
                url: option.url,
                data:option.data,
                cache:option.cache,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}//post使用
            };
            if(option.cache)
            {
                if (cacheData.length > 0) {
                    for (var i = 0; i < cacheData.length; i++) {
                        if (cacheData[i].params == option.data && cacheData[i].url == option.url)//找到缓存数据,无需请求直接返回返回缓存数据
                        {
                            option.success(cacheData[i].data);
                            if (option.loading) {
                                // bg.addClass("none");
                                // loading.addClass("none");
                            }
                            return;
                        }
                    }
                }
            }
        }
        $http(httpOption).success(function(data){
            option.success(data);
            if(option.cache) {
                cacheData.push({params: option.data, url: option.url, data: data});
            }
        });
    };
    this.returnTop=function(){
        $(".return_top").click(function(){
            $("body").scrollTop(0);
            document.documentElement.scrollTop=0
        });
    };
    this.queryString=function(p){
        var url=window.location.href,search=window.location.search,
            paramsArr=search.replace("?",'').split('&'),params={},result;
        for(var i=0;i<paramsArr.length;i++)
        {
            if(paramsArr[i].indexOf(p)===0)
            {
                result=paramsArr[i].split('=')[1];
                break;
            }
        }
        return result;
    };
    this.validateMobile=function (mobile) {
        var reg=/^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
        if(reg.test(reg))
        {

        }
    }
    //业务服务
    this.sid=js.getCookie("sid");
    this.scname=js.getCookie("scname");
    this.smobile=js.getCookie("smobile");
};



var origin = window.location.protocol + "//" + window.location.host+"/",
    // project="facade-web/",
    project="fzark_ng/",
    ajaxPath = origin+project,
    redirectPath= origin + project;
console.log(origin);

function commonAjax(option){
   var sucFun = option.success;
    option.success = function(data) {
        if(typeof(data.isLogin) !== "undefined" && !data.isLogin){
            window.location.href=redirect_url;
        }else {
            sucFun(data);
        }
    };
    $.ajax(option);
}



//构建app,配置过滤器和指令
var app,url=window.location.href;

//页面模块配置,根据具体项目的每个页面使用不同的模块
if(url.indexOf("login.html")>-1)
{
    app=angular.module('app', []);
}
else if(url.indexOf("index.html")>-1)
{
    app=angular.module('app', []);
}
else
{
    app=angular.module('app', ['ngRoute']);
}
app.service("$service",serviceFunction);
app.filter('trustHtml', function ($sce) {
    return function (input) {
        return $sce.trustAsHtml(input);
    }
});
app.filter('longTimeToDateString', function ($sce) {
    return function (longtime) {
        var date=new Date(longtime),m=(date.getMonth()+1)<11?"0"+(date.getMonth()+1):(date.getMonth()+1),
            d=date.getDate()<10?"0"+date.getDate():date.getDate(),h=date.getHours()<10?"0"+date.getHours():date.getHours(),
            min=date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes();
        var str=date.getFullYear()+"-"+m+"-"+d+" "+h+":"+min;
        return str;
    }
});
app.directive("alert",function(){
    return {
        restrict: 'E',
        transclude: true,
        scope: {'alert':"="},
        controller: [ "$scope", function($scope) {
            $scope.sureFunction=function () {
                if($scope.alert[2])
                    $scope.alert[2]();
                $scope.alert[0]=0;
            }
        }],
        template:
        '<div class="alert" ng-show="alert[0]" style="position:fixed;width:100%;height:100%;z-index:1000;top:0;left:0;background-color:rgba(255,255,255,0)">'+
        '<div class="common_alert" style="font-family: microsoft yahei; box-shadow: rgb(153, 153, 153) 0px 0px 8px 3px; width: 260px; padding: 0px 0px 10px; position: fixed; z-index: 1005; top: 40%; border-radius: 5px; text-align: center; color: rgb(45, 45, 45); border: 1px solid rgb(153, 153, 153); left: 496px; background-color: rgb(255, 255, 255);">' +
        '<div class="common_alert_title" style="text-align: left; padding: 0px 12px; line-height: 30px; border-radius: 4px 4px 0px 0px; letter-spacing: 1px; color: rgb(255, 255, 255); font-size: 13px; background-color: rgb(13, 162, 234);">提示</div>' +
        '<p style="font-size: 13px;padding: 10px 15px;">{{alert[1]}}</p> ' +
        '<div class="common_alert_sure" ng-click="sureFunction()" style="cursor: pointer; width: 70px; height: 26px; text-align: center; line-height: 28px; border-radius: 6px; letter-spacing: 1px; color: rgb(255, 255, 255); display: inline-block; margin: 10px auto 0px; background-color: rgb(13, 162, 234);">确定</div>' +
        '</div>'+
        '</div>'
        ,replace: true
    };
});
app.directive("pagination",function(){
    return {
        restrict: 'E',
        transclude: true,
        scope: {'config':"="},
        controller: [ "$scope", function($scope) {
            //当前页
            $scope.page=config.page;
            //每页显示条数
            $scope.pageCount=config.count;
            //显示页码
            $scope.five=[
                1
            ];
            //分页方法
            $scope.open_page=function(page,$event)
            {
                if($event)
                {
                    var keyCode=$event.keyCode;
                    if(keyCode===13)
                    {
                        if(page===-1||page===0) return;

                        $scope.changeCondition(10,page);
                    }
                }
                else
                {
                    if(page===-1||page===0) return;

                    $scope.changeCondition(10,page);
                }
            };
            $scope.ajaxConfig={
                method:config.method,
                url: config.url,
                data:config.data,
                cache:true,//get请求才有用
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}//post使用
            };
            if(config.method=='get')
                $scope.ajaxConfig.params=config.params;
            $scope.ajax=function(){
                $http($scope.ajaxConfig).success(function(data){
                    //分页逻辑
                    var fromShowPage= 0,
                        page=$scope.page,
                        pageCount=$scope.pageCount,
                        totalPages=data.totalPages;
                    //if(page===1) $scope.personPage=totalPages;
                    //else
                    $scope.personPage=page;
                    $scope.totalPages=totalPages;
                    if(pageCount<totleCount)//有分页
                    {
                        $scope.five=[1];
                        if(totalPages>5)
                        {
                            if(page>=4)
                            {
                                if((totalPages-page)>5)
                                {
                                    fromShowPage=1;

                                    $scope.five[0]=page-1;

                                    for(var i=fromShowPage;i<5;i++)
                                    {
                                        $scope.five[i]=page;
                                        page++;
                                    }
                                }
                                else//页数到底
                                {
                                    if(totalPages===6)//总数为6页的特殊判断
                                    {
                                        for(var i=0;i<5;i++)
                                        {
                                            $scope.five[i]=(i+1);
                                        }
                                    }
                                    else{
                                        $scope.five[0]=totalPages-6;
                                        for(var i=1;i<7-1;i++)
                                        {
                                            $scope.five[i]=totalPages-6+i;
                                        }
                                    }
                                    //$scope.hidePageNum=totalPages-1;
                                }
                            }
                            else
                            {
                                for(var i=0;i<5;i++)
                                {
                                    $scope.five[i]=(i+1);
                                }
                            }
                        }
                        else
                        {
                            for(var i=0;i<totalPages;i++)
                            {
                                $scope.five[i]=(i+1);
                            }
                        }

                    }
                    else //清空多余分页
                    {
                        $scope.five=[1];
                        for(var i=0;i<totalPages;i++)
                        {
                            $scope.five[i]=(i+1);
                        }
                    }
                    //分页逻辑 结束
                    //业务逻辑
                    config.success(data);
                });
            };
            $scope.ajax();
        }],
        template:
            '<div class="pagenation ">'+
            '<div class="pagenation-right gap ">'+
                '<ul>'+
                '<li class="prev_page"><a href="javascript:void(0)" ng-click="open_page(page==1?-1:page-1)" >上一页</a></li>'+
                '<li class="btn_hover" ng-repeat="x in five" ng-class="{day_select:x==$parent.page}"><a href="javascript:void(0)" ng-bind="x" ng-click="$parent.open_page(x)"></a></li>'+
                '<li class="dot" ng-if="totalPages>5&&(totalPages-page)>5||(totalPages==7&&(totalPages-page)>3)">...</li>'+
                '<li class="btn_hover" ng-if="totalPages>5"><a href="javascript:void(0)" ng-bind="totalPages" ng-click="open_page(totalPages)" ></a></li>'+
                '<li class="next_page"><a href="javascript:void(0)" ng-click="open_page(page==totalPages?0:page+1)">下一页</a></li>'+
                '<li class="fenye_word">跳转到第</li>'+
                '<li><input type="text" class="page_num_size" ng-model="personPage" ng-keyup="open_page(personPage,$event)" ></li>'+
                '<li class="fenye_word_1">页</li>'+
                '</ul>'+
                '</div>'+
            '</div>'
        ,replace: true
    };
});
app.directive("head",function () {
    return {
        restrict: 'E',
        transclude: true,
        // scope: {'config':"="},
        controller: [ "$scope", function($scope) {

        }],
        template:
        '<div class="jl-header header-primary position"  id="header">'+
        '<div class="container">'+
        '<a class="jl-logo fl"  href="../index/index.html">'+
        '<img src="../../assets/img/fz-logo.png" alt="">'+
        '</a>'+
        '<div class="jl-nav">'+
        '<div class="jl-nav-fl fl">'+
        '<a class="" href="../index/index.html">'+
        '<span>首页</span>'+
        '</a>'+
        '<a class="" href="../evaluation/evaluation-list.html">'+
        '<span>测评</span>'+
        '</a>'+
        '<a class=""   href="../course/course-list.html">'+
        '<span>课程</span>'+
        '</a>'+
        '<a class=""  href="../dynamic/dynamic-list.html">'+
        '<span>动态</span>'+
        '</a>'+
        '</div>'+
        '<div class="jl-nav-fr fr">'+
        '<a target="_blank" href="../login/login.html" id="loginBtn" style="float:right;">登录/注册</a>'+
        '<a href="javascript:void(0)" id="loginOutBtn" style="float:right;" ng-click="login_out()">退出</a>'+
        '<a target="_self" href="../evaluation/EvaluateReportList.html" class="none" id="evaluateReportList" style="float:right;">个人中心</a>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'
        ,replace: true
    };
});
app.controller("head",function($scope,$service,$http){
    $scope.sid=$service.sid;
    $scope.isLogin=0;
    if($scope.sid)
    {
        $scope.isLogin=1;
    }
    $scope.login_out=function(){
        js.delCookie("sid","/");
        js.delCookie("scname","/");
        js.delCookie("smobile","/");
        window.location.href=redirectPath+"html/login/login.html";
    }
});
app.controller("left_menu",function($scope,$service,$http){
    $scope.s1="";
    $scope.s2="";
    if(url.indexOf("forumManager.html")>-1)
        $scope.s1="select";
    else if(url.indexOf("platformManager.html")>-1)
        $scope.s2="select";
});
app.controller("foot",function($scope,$service,$http){

});



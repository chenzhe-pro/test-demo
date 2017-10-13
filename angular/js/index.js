var app=angular.module('content', ["highcharts-ng","ngRoute","ngAnimate"]);
app.service("$c",function(){
	this.alert=function(text){alert(text)}
});
app.config(function($routeProvider,$locationProvider,$httpProvider) {//路由配置
    // Initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }

    // Enables Request.IsAjaxRequest() in ASP.NET MVC
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

    // Disable IE ajax request caching
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
    $routeProvider.
    when('/list', {templateUrl: 'list.html',   controller: 'listCtrl'})

    //otherwise({redirectTo: '/phones'});
})
app.filter("bool",function(){
    return function (input){
        var result=parseInt(input);
        return result;
    }
});
app.filter("trustHtml",function($sce){
    return function (input){
        return $sce.trustAsHtml(input);
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
})
app.controller("listCtrl",function($scope){
    $scope.data=[
        {name:"list1",age:22,index:0,html:"<span>111</span>"},
        {name:"list3",age:26,index:1,html:"<span>222</span>"}
    ];
    $scope.text1="list";
    $scope.clickLi=function(i){
        $scope.data=[
            {name:"list2",age:22,index:0},
            {name:"list3",age:26,index:1},
            {name:"list3",age:22,index:0},
            {name:"list4",age:26,index:1}
        ];
        alert(i)
    }
})
;
app.controller("f",function($scope,$c) {
    $scope.data=[
        {name:"陈哲",age:22,index:0},
        {name:"朱",age:26,index:1}
    ];
    $scope.all=0;
    $scope.arr=[];
    $scope.d={name:"正常",age:23,index:0};
    $scope.checkboxs=[null,null];
    $scope.click=function(index){
        if($scope.checkboxs[index])
            $scope.arr.push($scope.data[index]);
        else
        {
            for(var i=0;i<$scope.arr.length;i++)
            {
                if($scope.arr[i].index==$scope.data[index].index)
                {
                    $scope.arr.splice(i,1);
                    break;
                }
            }
        }
        $scope.all=0;
        console.log($scope.arr)
    };
    $scope.check=function(){

        console.log($scope.checkboxs)
        $scope.all1=false;
    };
    $scope.allChecked=function(t){
        if(t)
        {
            for(var i=0;i<$scope.data.length;i++)
            {
                $scope.checkboxs[i]={name:$scope.data[i].name,age:$scope.data[i].age};
            }
        }
        else
        {
            $scope.checkboxs=new Array($scope.data.length);
        }
        console.log($scope.checkboxs)
    };
    $scope.deleteData=function (index) {
        $scope.alert=[1,"sdsdsd",function(){alert(2)}];
        $scope.data.splice(index,1);
    };
    $scope.add=function () {
        var obj={name:"得瑟",age:17};
        $scope.data.push(obj);
        this.flg=!this.flg;
        $scope.chartConfig.series[0].data[0]++;
        $scope.chartConfig2.series[0].data[0][1]=35.0;
        console.log($scope.chartConfig2.series[0].data[0][1]);//$c.alert(1);
        //x=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $scope.chartConfig.xAxis.categories=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
    };
    $scope.flg=false;

    var x=[];

    //This is not a highcharts object. It just looks a little like one!
    $scope.chartConfig = {
        options: {
            chart: {
                type: 'line'
            },
            tooltip: {
                valueSuffix: '°C'
            }
        },
        series: [{
            name: 'Tokyo',
            data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
        }, {
            name: 'London',
            data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
        },{
            name: '伦敦',
            data: [9, 4.7, 5.9, 8.5, 21.9, 11.2, 17.0, 12.6, 17.2, 10.3, 6.6, 4.8],
            color:"#FF0000",//局部设置，也可以在plotOptions中全局设置，但是全局设置会应用到所有数据
            marker: {//局部设置，也可以在plotOptions中全局设置，也可以在data中单个设置maker
                    radius: 8,
                    symbol:"diamond"
                },
            lineWidth:5,

        }],
        title: {
            text: 'Monthly Average Temperature',
            x: -20 //center
        },
        subtitle: {
            text: 'Source: WorldClimate.com',
            x: -20
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        xAxis: {
            title: {
                text: '月份',
                align: 'high'
            },
            categories:[]
        },
        yAxis: {
            title: {
                text: 'Temperature (°C)'
            }
        },
        credits: {
            enabled:true,
            text: 'winndoo.com',
            href: 'http://www.winndoo.com'
        },
        legend:{
            backgroundColor: '#FCFFC5',
            borderColor: '#C98657',
            borderWidth: 1
        }
    };
    $scope.chartConfig2 = {
        options: {
            chart: {
                type: 'pie',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            }
        },
        series: [{
            name: 'Browser share',
            data: [
                ['Firefox',   45.0],
                ['IE',       26.8],
                {
                    name: 'Chrome',
                    y: 12.8,
                    sliced: true,
                    selected: true
                },
                ['Safari',    8.5],
                ['Opera',     6.2],
                ['Others',   0.7]
            ]
        }],
        title: {
            text: 'Browser market shares at a specific website, 2010'
        },
        subtitle: {
            text: 'Source: WorldClimate.com',
            x: -20
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    color: '#000000',
                    connectorColor: '#000000',
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                }
            }
        },

    };



    //$scope.chartTypes = [
    //    {"id": "line", "title": "Line"},
    //    {"id": "spline", "title": "Smooth line"},
    //    {"id": "area", "title": "Area"},
    //    {"id": "areaspline", "title": "Smooth area"},
    //    {"id": "column", "title": "Column"},
    //    {"id": "bar", "title": "Bar"},
    //    {"id": "pie", "title": "Pie"},
    //    {"id": "scatter", "title": "Scatter"}
    //];
    //
    //$scope.dashStyles = [
    //    {"id": "Solid", "title": "Solid"},
    //    {"id": "ShortDash", "title": "ShortDash"},
    //    {"id": "ShortDot", "title": "ShortDot"},
    //    {"id": "ShortDashDot", "title": "ShortDashDot"},
    //    {"id": "ShortDashDotDot", "title": "ShortDashDotDot"},
    //    {"id": "Dot", "title": "Dot"},
    //    {"id": "Dash", "title": "Dash"},
    //    {"id": "LongDash", "title": "LongDash"},
    //    {"id": "DashDot", "title": "DashDot"},
    //    {"id": "LongDashDot", "title": "LongDashDot"},
    //    {"id": "LongDashDotDot", "title": "LongDashDotDot"}
    //];
    //
    //$scope.chartSeries = [
    //    {"name": "Some data", "data": [1, 2, 4, 7, 3]},
    //    {"name": "Some data 3", "data": [3, 1, null, 5, 2], connectNulls: true},
    //    {"name": "Some data 2", "data": [5, 2, 2, 3, 5], type: "column"},
    //    {"name": "My Super Column", "data": [1, 1, 2, 3, 2], type: "column"}
    //];
    //
    //$scope.chartStack = [
    //    {"id": '', "title": "No"},
    //    {"id": "normal", "title": "Normal"},
    //    {"id": "percent", "title": "Percent"}
    //];
    //
    //$scope.addPoints = function () {
    //    var seriesArray = $scope.chartConfig.series;
    //    var rndIdx = Math.floor(Math.random() * seriesArray.length);
    //    seriesArray[rndIdx].data = seriesArray[rndIdx].data.concat([1, 10, 20])
    //};
    //
    //$scope.addSeries = function () {
    //    var rnd = []
    //    for (var i = 0; i < 10; i++) {
    //        rnd.push(Math.floor(Math.random() * 20) + 1)
    //    }
    //    $scope.chartConfig.series.push({
    //        data: rnd
    //    })
    //}
    //
    //$scope.removeRandomSeries = function () {
    //    var seriesArray = $scope.chartConfig.series;
    //    var rndIdx = Math.floor(Math.random() * seriesArray.length);
    //    seriesArray.splice(rndIdx, 1)
    //}
    //
    //$scope.removeSeries = function (id) {
    //    var seriesArray = $scope.chartConfig.series;
    //    seriesArray.splice(id, 1)
    //}
    //
    //$scope.toggleHighCharts = function () {
    //    this.chartConfig.useHighStocks = !this.chartConfig.useHighStocks
    //}
    //
    //$scope.replaceAllSeries = function () {
    //    var data = [
    //        { name: "first", data: [10] },
    //        { name: "second", data: [3] },
    //        { name: "third", data: [13] }
    //    ];
    //    $scope.chartConfig.series = data;
    //};
    //
    //$scope.chartConfig = {
    //    options: {
    //        chart: {
    //            type: 'areaspline'
    //        },
    //        plotOptions: {
    //            series: {
    //                stacking: ''
    //            }
    //        }
    //    },
    //    series: $scope.chartSeries,
    //    title: {
    //        text: 'Hello'
    //    },
    //    credits: {
    //        enabled: true
    //    },
    //    loading: false,
    //    size: {}
    //}
    //
    //$scope.reflow = function () {
    //    $scope.$broadcast('highchartsng.reflow');
    //};
});

// var route=angular.module('route', ["ngRoute"]);

// route.controller("listCtrl",function($scope){
//     $scope.text="sdsdsdsds"
// })
// .config(function($routeProvider,$locationProvider) {
//     $routeProvider.
//     when('/list', {templateUrl: 'list.html',   controller: 'listCtrl'});

//     //otherwise({redirectTo: '/phones'});
// });
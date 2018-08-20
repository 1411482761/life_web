/**
 * Created by chenmengqi on 2015/11/25.
 */
var b2bOrderDetailInfo=angular.module('b2bOrderDetailInfo',['ngRoute','ngTouch','ui.bootstrap','angular-loading-bar','app','tm.pagination']);

b2bOrderDetailInfo.service('dataService',function($q,$http,rest){
	rest.init(null,null,'/servlets/binserv/Fair');
	
    return {
    	//根据查询条件，向后台请求信息
    	getOrderDetail: function(postData,callback){
     		var trans = {
				'id': 1,
				'command': "com.agilecontrol.fair.MiscCmd",
				'params': {
    					cmd: "B2BOrderCenter",
    					postData:postData,
    					type:'selectDetail'
    				}
     		};
			rest.sendOneRequest(trans,function(response){
				var data=response.data[0].result;
				if(data==null){
					alert(response.data[0].message);
					return;
				}else{
					callback(data);
				}
			});
    	},
    	
    	//导出订单详情
    	exportOrder: function(table,ids,callback){
     		var trans = {
				'id': 1,
				/*'callbackEvent':"ExportJasper",*/
				'command': "com.agilecontrol.fair.MiscCmd",
				'params': {
    					cmd: "PrintObject",
    					table:table,
    					format:"xls",
    					ids:ids,
    					template:"B2B订单详情信息"
    				}
     		};
			rest.sendOneRequest(trans,function(response){
				var data=response.data[0].result;
				if(data==null){
					alert(response.data[0].message);
					return;
				}else{
					callback(data);
				}
			});
    	}
    };
});


b2bOrderDetailInfo.controller('mainCtr',function($scope,$filter,$window,dataService,initService,rest){
    	//initService.loadIdx;
    	//initService.fairid;
    	//initService.orderId;
	$scope.isEndUser=initService.isEndUser;
	$scope.docno=initService.docno;
	
	$scope.$on("OrderConfigChange",function (event, orders_config) {
		$scope.$broadcast("orderconfig", orders_config);
	});

    // 重新获取数据条目
    var reGetProducts = function(){
        // 发送给后台的请求数据
        var postData = {
            currentPage: $scope.paginationConf.currentPage,
            itemsPerPage: $scope.paginationConf.itemsPerPage,
            orderId:initService.orderId
        };
        
        dataService.getOrderDetail(postData,function(data){
        	// 变更分页的总数
            $scope.paginationConf.totalItems = data.total;
            // 变更产品条目
            $scope.orderDetails=data.orderDetails;
            $scope.orderConfig=data.orderConfig;
            $scope.$emit('OrderConfigChange',data.orderConfig);
           // $scope.chkall = false;
        });
    };
   // $scope.reGetProducts=reGetProducts;
    
    // 配置分页基本参数
    $scope.paginationConf = {
        currentPage: 1,
        totalItems: 100,
        itemsPerPage: 20,
        pagesLength: 7,
        perPageOptions: [10, 20, 30, 40, 50],
        rememberPerPage: 'perPageItems',
    };

    // 通过$watch currentPage和itemperPage menuType monthMenuType当他们一变化的时候，重新获取数据条目
    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', reGetProducts);
    
    $scope.ordercenter=function(){
    	//window.location.replace("/fair/ipad/B2B/orderCenter.jsp?loadIdx="+initService.loadIdx+"&fairid="+initService.fairid);
    	window.location.href="/fair/ipad/B2B/orderCenter.jsp?loadIdx="+initService.loadIdx+"&fairid="+initService.fairid;
    };
    
   /* $scope.$back = function() { 
    	//$window.history.back();
    	window.location.replace("/fair/ipad/B2B/orderCenter.jsp?loadIdx="+dataService.loadIdx+"&fairid="+dataService.fairid);
	};*/
	
	//全选导出
	$scope.chkall = false;
	
	$scope.chkAll = function(checked){
        angular.forEach($scope.orderDetails, function(value, key){
        	value.checked = checked;
        });
    };
    
    $scope.$watch('orderDetails', function(nv, ov){
    	$scope.isRem='disabled';
        if(nv == ov){
        	return;
        }
        $scope.choseArr = [];
        angular.forEach(
	     $filter('filter')(nv, {checked: true}), function(v) {
	    	 $scope.choseArr.push(v.id);
	    });
        if($scope.choseArr.length!=0){
        	$scope.isRem='';
        }
        if($scope.orderDetails.length != 0)
        	$scope.chkall = $scope.choseArr.length == $scope.orderDetails.length;
   }, true);
    
    //订单详情导出
   $scope.exportOrderDetail=function(){
	   console.info($scope.choseArr);
	   dataService.exportOrder("b_foitem",$scope.choseArr,function(data){
			   window.location=data.url;
	   });
   };
   
   //收藏夹功能
   $scope.collection=function(type){
   	var params={cmd:"JudgeMonth",fairid:initService.fairid,method:"beforeCollection",judtype:type};
		var trans={id:1, command:"com.agilecontrol.fair.FairCmd",params:params};
		rest.sendOneRequest(trans, function(response){
			var ret=response.data[0].result;
			if (ret==0) {
				if (type=="month") {
					window.location.href='/fair/ipad/B2B/shoppingCart.jsp?loadIdx='+initService.loadIdx+'&fairid='+initService.fairid+'&ordertype=month&iscollection=yes';
				}else if(type=="day"){
					window.location.href='/fair/ipad/B2B/shoppingCart.jsp?loadIdx='+initService.loadIdx+'&fairid='+initService.fairid+'&ordertype=day&iscollection=yes';
				}
			}else{
				if (type == "month") {
					alert("当前存在未确认的月单，无法创建月单收藏订单");
				} else if (type == "day") {
					alert("当前存在未确认的日单，无法创建日单收藏订单");
				}
			}
		});
   };
   
}) ;

b2bOrderDetailInfo.directive('tableAll', function($compile,dataService) {
	return{
		restrict:'AE',
		replace: true,
		scope:{
			orderDetails: '='
		},
		template:'<table class="table table-bordered table-hover table-condensed scrollTable" id="table_content" ></table>',
		link: function(scope,element,attrs){
			scope.$on('orderconfig',function(event,orders_config){
				element[0].innerHTML='';
				if(orders_config.length>0){
					
					var thead='<thead><tr class="table_head"><th>序号</th>';
					for ( var i = 0; i < orders_config.length; i++) {
						thead+='<th>'+orders_config[i].description+'</th>';
					}
					thead+='</tr></thead>';
					
					var tbody='<tbody><tr class="{{order.status}} button_nowrap" ng-repeat="order in orderDetails"><td style="text-align:center;"><input type="checkbox" ng-model="order.checked"/>&nbsp;{{$index+1}}</td>';
					for( var j = 0; j < orders_config.length; j++) {
						tbody+='<td ng-class="{\'numStyle\': '+orders_config[j].isNum+'==true}">{{order.'+orders_config[j].name+'}}</td>';
					}
					tbody+='</tr></tbody>';
					
					element.append($compile(thead+tbody)(scope));
				}
			});
		}
	};
});




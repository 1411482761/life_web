/**
 * Created by chenmengqi on 2015/9/12.
 */
var b2b=angular.module('b2b',['ngRoute','ngTouch','angular-loading-bar','app']);

b2b.service('dataService',function($q,$http,rest){
    return {
    	//获取订货会
    	getOptions:function(callback){
    		rest.init(null,null,'/servlets/binserv/Fair');
    		var trans = {
    				'id': 1,
    				'command': "com.agilecontrol.fair.MiscCmd",
    				'params': {
    					cmd: "B2B",
    					type:"options"
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
    	
    };
});

b2b.controller('mainCtr',function($scope,dataService){
	dataService.getOptions(function(data){
		dataService.options=data.options;
		var length=data.options.length;
		dataService.optionsLength=$scope.optionsLength=length;
		if(length==0){
			//alert("没有可选供应商！");
		//	window.open('/nea/core/portal');
			 window.location.replace("/nea/core/portal");
		}
	});
	
    $scope.load = function(index) {
    	var fairid=dataService.options[index].fairid;
        window.location.replace("/fair/ipad/B2B/index.jsp?loadIdx="+index+"&fairid="+fairid);
    };
}) ;

b2b.directive('options',function(dataService){
	return {
		  	restrict:'AE',
		  	replace: true,
		  	scope:{
		  		load: '&'
		  	},
	        template:'<div class="options" ><h4 ng-if="optionsLength>1" style="text-aligen:left;float:left">请选择供应商:</h4><table class="table table-hover options_tab" ng-if="optionsLength>1"><tr ng-repeat="option in options track by $index"><td ng-click="load({index:$index})" >{{option.description}}</td></tr></table></div>',
	        link : function(scope,elem,attrs){
	        	scope.options=dataService.options;
	        	scope.optionsLength=dataService.optionsLength;
	        }
	}
});

/**
 * Created by chenmengqi on 2015/9/2.
 */
var orderCenter=angular.module('b2bOrderCenter',['ngRoute','ngTouch','ui.bootstrap','angular-loading-bar','app','tm.pagination']);

orderCenter.service('dataService',function($q,$http,rest){
	rest.init(null,null,'/servlets/binserv/Fair');
	
    return {
    	//初始化
    	loadInit:function(callback){
    		var trans = {
    			'id': 1,
    			'command': "com.agilecontrol.fair.MiscCmd",
    			'params': {
    				cmd: "B2BOrderCenter",
    				type:"init",
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
    	//操作
        handle:function(type,orderId,callback){
    		var trans = {
    				'id': 1,
    				'command': "com.agilecontrol.fair.MiscCmd",
    				'params': {
    					cmd: "B2BOrderCenter",
    					type:type,
    					orderId:orderId,
    					menuType:this.menuType,
    					reminder:this.choseArr
    					
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
    	
    	//根据查询条件，向后台请求信息
    	getClickMenu: function(postData,callback){
    		/*console.info('---req---');
    		console.info(postData);*/
    		
     		var trans = {
				'id': 1,
				'command': "com.agilecontrol.fair.MiscCmd",
				'params': {
    					cmd: "B2BOrderCenter",
    					postData:postData,
    					type:'select'
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
    	
    	//导入订单
    	importOrder: function(callback){
     		var trans = {
				'id': 1,
				'command': "com.agilecontrol.fair.MiscCmd",
				'params': {
    					cmd: "B2BOrderCenter",
    					type:'importOrder',
    					monthMenuType:this.monthMenuType,
    					fairid:this.fairid
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
    	
    	//导出订单
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
    					template:"配送中心打印门店订单"
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
    	
    	//地址列表
    	addressList: function(callback){
    		var trans = {
    				'id': 1,
    				'command': "com.agilecontrol.fair.FairCmd",
    				'params': {
    					cmd: "B2BPersonalCenter",
    					type:"load"
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
    	
    	//设置地址
    	setOrderAddress: function(orderId,addrId,callback){
    		var trans = {
    				'id': 1,
    				'command': "com.agilecontrol.fair.MiscCmd",
    				'params': {
    					cmd: "B2BOrderCenter",
    					type:"setOrderAddress",
    					orderId:orderId,
    					addrId:addrId
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
    	//新增收货地址
    	addAddress: function(name,tel,address,callback){
    		var trans = {
    				'id': 1,
    				'command': "com.agilecontrol.fair.FairCmd",
    				'params': {
    					cmd: "B2BPersonalCenter",
    					type:"save",
    					name:name,
    					tel:tel,
    					address:address
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
    	//删除地址 by id
    	removeAddress: function(addrid,callback){
    		var trans = {
    				'id': 1,
    				'command': "com.agilecontrol.fair.FairCmd",
    				'params': {
    					cmd: "B2BPersonalCenter",
    					type:"delete",
    					addrs:addrid
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

orderCenter.controller('MenuOrderCenterCtrl', function ($scope,$window,dataService) {
	$scope.menus=dataService.menus;
	$scope.isEndUser=dataService.isEndUser;
	$scope.back=function(){
		$window.history.back();
		//window.location.replace('/fair/ipad/B2B/index.jsp?loadIdx='+dataService.loadIdx);
	}
});

orderCenter.directive('menu',function(dataService){
    return{
        restrict:'EA',
        replace: true,
        templateUrl:'menu-order-center.html',
        link: function(scope,element,attrs){
        	 scope.clickFair = function(index,menu,m){
	        		 //alert(document.body.clientWidth);
	        		//console.info(element[0].offsetParent.scrollTop);
	        		//console.info(element[0].parentElement.parentElement.offsetTop);
	        		//console.info(menu);
	        		 
	        		 scope.$emit("CtrlMenuChange", menu,m); 
	        		 
	        		 var menu_order=document.getElementById("menu-order").children;
	        		 for ( var i = 0; i < menu_order.length; i++) {
	        			 menu_order[i].className= "col-md-2 col-sm-6";
	        		 }
	        		 menu_order[index].className="col-md-2 col-sm-6 cur";
        	    };
        }
    };
});

/*orderCenter.controller('MonthMenuOrderCenterCtrl', function ($scope,dataService) {
	$scope.monthMenus=dataService.monthMenus;
	$scope.importOptions=dataService.importOptions;
	$scope.isShowOptions=false;
	
	$scope.$on("options",function (event, options) {
		$scope.importOptions=options;
		
	});
});*/
orderCenter.directive('dayMenu',function(dataService,$filter){
    return{
        restrict:'EA',
        //replace: true,
        scope:{
        	'reGetProducts':'&',
        	'importOptions':'=',
        	'orders':'='
        },
      //  template:'<label for="chkAll" style="float: left;line-height: 44px;"><input id="chkAll" type="checkbox" ng-model="chkall"  ng-click="chkAll(chkall)"/>全选</label>&nbsp;<button type="button" class="btn btn-mg btn-lg {{isRem}}" ng-click="exportOrder();">导出</button> <button type="button" class="btn btn-mg btn-lg" ng-click="dayImportOrder();">导入订单</button>',
        template:'<label for="chkAll" style="float: left;line-height: 44px;"><input id="chkAll" type="checkbox" ng-model="chkall"  ng-click="chkAll(chkall)"/>全选</label>&nbsp;<button type="button" class="btn btn-mg btn-lg {{isRem}}" ng-click="exportOrder();">导出</button>',
        link: function(scope,element,attrs){
        	scope.importOrder= function(){
        		scope.isShowOptions=true;
        	};
        	
        	scope.optionChange=function(fairid){
        		dataService.fairid=fairid;
        		scope.isShowOptions=false;
        		dataService.importOrder(function(data){
        		/*	console.info(data.b_fo_id)
        			alert(data.b_fo_id);*/
        			// +"&fixedcolumns="+encodeURIComponent("51307=2998")
        			
        			window.open("/nea/core/objext/import_excel.jsp?objectid="+data.b_fo_id+"&table=B2B_B_FOITEMIMP&fixedcolumns="+encodeURIComponent(data.parentid+"="+data.b_fo_id));
        			
        		//	window.open("/nea/core/objext/import_excel.jsp?objectid="+data.b_fo_id+"&table=16689");
        			scope.reGetProducts();
        		});
        	};
        	
        	//全选导出
        	scope.chkall = false;
			
			scope.chkAll = function(checked){
		        angular.forEach(scope.orders, function(value, key){
		        	value.checked = checked;
		        });
		    };
		    
		    scope.$watch('orders', function(nv, ov){
		    	scope.isRem='disabled';
		        if(nv == ov){
		        	return;
		        }
		        scope.choseArr = [];
		        angular.forEach(
			     $filter('filter')(nv, {checked: true}), function(v) {
			        scope.choseArr.push(v.b_fo_id);
			        
			    });
		        //console.info(scope.choseArr);
		       // dataService.choseArr=scope.choseArr;
		        if(scope.choseArr.length!=0){
		        	scope.isRem='';
		        }
		        if(scope.orders.length != 0)
		        scope.chkall = scope.choseArr.length == scope.orders.length;
		   }, true);
		    
		   //日单导出操作 
		   scope.exportOrder=function(){
			   dataService.exportOrder("b_fo",scope.choseArr,function(data){
				   window.location=data.url;
			   });
		   };
		   
		   scope.dayImportOrder=function(){
		    	
		    	dataService.importOrder(function(data){
	        			window.open("/nea/core/objext/import_excel.jsp?objectid="+data.b_fo_id+"&table=B2B_B_FOITEMIMP&fixedcolumns="+encodeURIComponent(data.parentid+"="+data.b_fo_id));
	        			
	        		//	window.open("/nea/core/objext/import_excel.jsp?objectid="+data.b_fo_id+"&table=16689");
	        			scope.reGetProducts();
	            });
		   };
        }
    };
});
orderCenter.directive('monthMenu',function(dataService,$filter){
    return{
        restrict:'EA',
        //replace: true,
        scope:{
        	'reGetProducts':'&',
        	'monthMenus':'=',
        	'importOptions':'=',
        	'isShowOptions':'=',
        	'orders':'='
        },
        templateUrl:'month-menu-order-center.html',
        link: function(scope,element,attrs){
        	 scope.isImport='disabled';
        	 scope.monthMenuType=dataService.monthMenuType;
        	 scope.clickMonthMenu = function(index,monthMenu){
        		 var menu_order=document.getElementById("month-menu-order").children;
        		 for ( var i = 0; i < menu_order.length; i++) {
        			 menu_order[i].className= "";
        		 }
        		 menu_order[index].className="cur";
        	    	
        		 scope.$emit("CtrlMonthMenuChange", monthMenu); 
        		 
        		if(monthMenu.type == 'all'){
             		scope.isImport='disabled';
             	}else{
             		scope.isImport='';
             	}
        		
        		dataService.monthMenuType=monthMenu.type; 
        	};
        	
        	scope.importOrder= function(){
        		scope.isShowOptions=true;
        	};
        	
        	scope.optionChange=function(fairid){
        		dataService.fairid=fairid;
        		scope.isShowOptions=false;
        		dataService.importOrder(function(data){
        		/*	console.info(data.b_fo_id)
        			alert(data.b_fo_id);*/
        			// +"&fixedcolumns="+encodeURIComponent("51307=2998")
        			
        			window.open("/nea/core/objext/import_excel.jsp?objectid="+data.b_fo_id+"&table=B2B_B_FOITEMIMP&fixedcolumns="+encodeURIComponent(data.parentid+"="+data.b_fo_id));
        			
        		//	window.open("/nea/core/objext/import_excel.jsp?objectid="+data.b_fo_id+"&table=16689");
        			scope.reGetProducts();
        		});
        	};
        	
        	//全选导出
        	scope.chkall = false;
			
			scope.chkAll = function(checked){
		        angular.forEach(scope.orders, function(value, key){
		        	value.checked = checked;
		        });
		    };
		    
		    scope.$watch('orders', function(nv, ov){
		    	scope.isRem='disabled';
		        if(nv == ov){
		        	return;
		        }
		        scope.choseArr = [];
		        angular.forEach(
			     $filter('filter')(nv, {checked: true}), function(v) {
			    	 /*if(dataService.b2b_b_mfo_id == undefined || dataService.b2b_b_mfo_id ==null){
			    		 dataService.b2b_b_mfo_id=v.id;
			    	 }*/
			        scope.choseArr.push(v.b_fo_id);
			        
			    });
		        //console.info(scope.choseArr);
		        //dataService.choseArr=scope.choseArr;
		        if(scope.choseArr.length!=0){
		        	scope.isRem='';
		        }
		        if(scope.orders.length != 0)
		        scope.chkall = scope.choseArr.length == scope.orders.length;
		   }, true);
		    
		   //月单导出操作 
		   scope.exportOrder=function(){
			 //  console.info(scope.choseArr);
			   dataService.exportOrder("b_fo",scope.choseArr,function(data){
					   window.location=data.url;
			   });
		   };
        }
    };
});

orderCenter.controller('mainCtr',function($rootScope,$scope,$filter,dataService,rest){
	//dataService.menus=[{name:"日单",type:"dayOrder",isDayMenu:true},{name:"月单",type:"monthOrder",isMonthMenu:true},{name:"汇总订单",type:"collectOrder",isAllFilter:true,hasMul:true}];
	dataService.menus=[{name:"汇总订单",type:"collectOrder",isAllFilter:true,hasMul:true},{name:"订单明细汇总",type:"collectOrderDetail",isAllFilter:true,hasMul:true,isAllTimeFilter:true},{name:"日单",type:"dayOrder",isDayMenu:true},{name:"月单",type:"monthOrder",isMonthMenu:true}];
	dataService.menuType=$scope.menuType=dataService.menus[0].type;
	$scope.monthMenus=[{name:"全部",type:"all"},{name:"月单",type:"single_month"},{name:"补单",type:"single_supplement"}];
	dataService.monthMenuType=$scope.monthMenuType=$scope.monthMenus[0].type;
	
	//是否日单 
	$scope.isDayMenu=false;
	//月单 订单导入 订货会下拉选项是否显示
	$scope.isShowOptions=false;
	//是否是月单
	$scope.isMonthMenu=false;
	//汇总订单是否过滤
	$scope.isAllFilter=true;
	$scope.isAllTimeFilter=false;
    
	//初始化
    $scope.loadInit = function(loadIdx,fairid,isEndUser) {
    	var startDate=new Date();
    	startDate.setDate(1);
 		//$rootScope.dt1=startDate;
 		$rootScope.dt1=startDate.format("{0}-{1}-{2}");
 		
    	var endDate = new Date(startDate);
  		endDate.setMonth(startDate.getMonth()+1);
  		endDate.setDate(0);
  		$rootScope.dt2= endDate.format("{0}-{1}-{2}");
    	 
    	dataService.loadIdx=loadIdx;
    //	dataService.sessionkey=sessionkey;
    	dataService.fairid=fairid;
    	dataService.isEndUser=isEndUser;
    	
        dataService.loadInit(function(data){
        	dataService.menus[0].options=dataService.menus[1].options=data.options;
        	$scope.importOptions=data.options;
        	//dataService.fairid=data.options[0].fairid
        });
    };
    
	$scope.$on("CtrlMenuChange",function (event, menu,m) {
 	   $scope.$broadcast("menu", menu,m);
	});
	
	$scope.$on("CtrlMonthMenuChange",function (event, monthMenu) {
		$scope.$broadcast("month-menu", monthMenu);
	});
	
	$scope.$on("OrderChange",function (event, orders_config,isAllTimeFilter) {
		$scope.$broadcast("order", orders_config,isAllTimeFilter);
	});
	
	$scope.$on("menu",function (event, menu,m) {
		$scope.isDayMenu=menu.isDayMenu;
		$scope.isMonthMenu=menu.isMonthMenu;
		$scope.isAllFilter=menu.isAllFilter;
		$scope.isAllTimeFilter=menu.isAllTimeFilter;
		if(m != ''){
			if(dataService.fairid != m.fairid){
				dataService.fairid=$scope.fairid=m.fairid;
				$scope.$emit('OrderChange',[]);
			}
		}
		if($scope.isMonthMenu){
			$scope.monthMenuType = $scope.monthMenus[0].type;
		}
		dataService.menuType=$scope.menuType=menu.type;
		$scope.paginationConf.currentPage=1;
		
	});
	$scope.$on("month-menu",function (event, monthMenu) {
		$scope.monthMenuType=monthMenu.type;
		$scope.paginationConf.currentPage=1;
		
	});
    
	$scope.isShowAddressList = false;
	$scope.isShowAddAddress = false;
    $scope.submit = function(order){
    	$scope.addrDefault ={
    		addrid:order.ad_user_addr_id,
    		orderId:order.b_fo_id
    	};
    	
    	dataService.addressList(function(data){
    		$scope.isShowAddressList = true;
    		$scope.addrList=data.addrs;
    	});
    };
    
    $scope.choseAddr = function(addr){
    	$scope.addrDefault.addrid = addr.addrid;
    };
    
    $scope.submitAddr = function(){
    	if($scope.addrDefault.addrid == null){
    		alert("请选择收货地址");
    		return;
    	}
    	$scope.isShowAddressList = !$scope.isShowAddressList;
    	dataService.setOrderAddress($scope.addrDefault.orderId,$scope.addrDefault.addrid,function(data){
    		_submit($scope.addrDefault.orderId);
    	});
        
    };
    
    var _submit = function(orderId){
    	dataService.handle('submit',orderId,function(data){
			alert(data.message);
			if(data.code==0){
				reGetProducts();
			}
		});
    };
    
    $scope.addAddr = function(){
    	$scope.isShowAddressList = false;
    	$scope.isShowAddAddress = true;
    };
    
    $scope.cancelAddAddr = function(){
    	$scope.isShowAddressList = true;
    	$scope.isShowAddAddress = false;
    };
    
    $scope.submitAddAddr = function(ad){
    	$scope.isShowAddressList = true;
    	$scope.isShowAddAddress = false;
    	
    	dataService.addAddress(ad.name,ad.tel,ad.address,function(data){
    		$scope.add={
    			addrid:data.addrid,
    			isdefault:'N',
    			name:ad.name,
    			tel:ad.tel,
    			address:ad.address
    		};
    		$scope.addrList.push($scope.add);
    	});
    };
    
    $scope.delAddr = function(){
    	var flag= true;
    	$scope.addrDefault.addrid;
    	var index=null;
    	
    	for ( var i = 0; i < $scope.addrList.length; i++) {
			if($scope.addrDefault.addrid == $scope.addrList[i].addrid){
				flag = false;
				$scope.addrList.splice(i,1);
				index=i;
				
				dataService.removeAddress($scope.addrDefault.addrid,function(data){});
			}
		}
    	
    	if(flag){
    		alert('请选择要删除的选项!');
    	}
    	
    	if(index != null){
    		
    		if( $scope.addrList[index-1] == undefined){
    			$scope.addrDefault.addrid == null;
    		}else{
    			$scope.addrDefault.addrid = $scope.addrList[index-1].addrid;
    		}
    	}
    };
    
    $scope.cancel = function(orderId){
    	if (confirm("确定要作废吗?")==true){ 
    		dataService.handle('cancel',orderId,function(data){
    			//console.info(data);
    			if(data.status=="success"){
    				alert("成功！");
    				reGetProducts();
    			}
    		});
    		return true; 
    	}else{ 
    		return false; 
    	}
    };
    
    //催单
    $scope.reminder=function(){
    	//b2b_b_mfoitem_id
    	//alert('reminder');
    	dataService.handle('reminder',dataService.b2b_b_mfo_id,function(data){
	    	 //获取当前网址
	   		 var curWwwPath=window.document.location.href;
	   		 //获取主机地址之后的目录
	   		 var pathName=window.document.location.pathname;
	   		 var pos=curWwwPath.indexOf(pathName);
	   		 //获取主机地址
	   		 var localhostPaht=curWwwPath.substring(0,pos);
	   		 //console.info(localhostPaht);
	   		var message=data.message.split("showDialog(\"")[1];
	   		message="(\""+localhostPaht+"/nea/core/object/"+message;
	   		//window.open("http://localhost/nea/core/object/object.jsp?table=b2b_b_ugfo&fixedcolumns=&id=71",940, 530,true);
	    	eval("window.open"+message);
    
    	});
    };
    
    //汇总订单查询
    $scope.all_select=function(){
		   reGetProducts();
	};
    // 重新获取数据条目
    var reGetProducts = function(){
    	if("collectOrderDetail"==$scope.menuType){
    		$scope.date1=null;
    		$scope.date2=null;
    		if($rootScope.dt1!=undefined){
    			//var datepicker=document.getElementById('datepicker').value;
    			var date = new Date($rootScope.dt1);
    			$scope.date1=date.format("{0}{1}{2}");
    		}
    		if($rootScope.dt2!=undefined){
    			//var datepicker2=document.getElementById('datepicker2').value;
    			var date = new Date($rootScope.dt2);
    			$scope.date2=date.format("{0}{1}{2}");
    		}
    	}
        // 发送给后台的请求数据
        var postData = {
            currentPage: $scope.paginationConf.currentPage,
            itemsPerPage: $scope.paginationConf.itemsPerPage,
            menuType: $scope.menuType,
            monthMenuType: $scope.monthMenuType,
            fairid:$scope.fairid,
            pdt:$scope.pdt,
            ql:$scope.ql.id,
            /*qlchk:$scope.qlchk,*/
            date1:$scope.date1,
            date2:$scope.date2
        };
        
        dataService.getClickMenu(postData,function(data){
        	// 变更分页的总数
            $scope.paginationConf.totalItems = data.total;
            // 变更产品条目
            $scope.orders=data.orders;
            $scope.$emit('OrderChange',data.orders_config,$scope.isAllTimeFilter);
            $scope.chkall = false;
        });
    };
    $scope.reGetProducts=reGetProducts;
    
    // 配置分页基本参数
    $scope.paginationConf = {
        currentPage: 1,
        totalItems: 100,
        itemsPerPage: 10,
        pagesLength: 7,
        perPageOptions: [10, 20, 30, 40, 50],
        rememberPerPage: 'perPageItems',
    };

    // 通过$watch currentPage和itemperPage menuType monthMenuType当他们一变化的时候，重新获取数据条目
    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage + menuType + fairid + monthMenuType', reGetProducts);
    
    $scope.ordercenter=function(){
    	//window.location.replace("/fair/ipad/B2B/orderCenter.jsp?loadIdx="+dataService.loadIdx+"&fairid="+dataService.fairid);
    	window.location.href="/fair/ipad/B2B/orderCenter.jsp?loadIdx="+dataService.loadIdx+"&fairid="+dataService.fairid;
    };
    
    $scope.selectInfo=function(orderId,docno){
    	//$scope.isShowDetailInfo=true;
    	//新页面
    	window.open("/fair/ipad/B2B/orderDetailInfo.jsp?loadIdx="+dataService.loadIdx+"&fairid="+dataService.fairid+"&orderId="+orderId+"&docno="+docno);
    	//window.location.href="/fair/ipad/B2B/orderDetailInfo.jsp?loadIdx="+dataService.loadIdx+"&fairid="+dataService.fairid+"&orderId="+orderId+"&docno="+docno; 
	};
	
	/*$scope.closeDetailInfo=function(){
		$scope.isShowDetailInfo=false;
	};*/
	
	$scope.qls=[  
	              {  
	            	id:-1,  
	            	name:'欠量不为0'
	              },  
	              {  
	                id:0,  
	                name:'欠量为0'
	              },  
	              {  
	            	id:1,  
		            name:'全部欠量'  
	              }  
	           ]; 
	$scope.ql=$scope.qls[0];
	
	$scope.selectAction = function(val) {
	    $scope.ql=val;
	    reGetProducts();
	};
	
/*	$scope.qlchk = true;
    $scope.check = function(val){
    	$scope.qlchk=!$scope.qlchk;
    	reGetProducts();
    };*/
    
    $scope.enter=function(ev){
		  if(ev.keyCode!=13) return;
		  reGetProducts();
	};
	  
	//收藏夹功能
    $scope.collection=function(type){
    	var params={cmd:"JudgeMonth",fairid:dataService.fairid,method:"beforeCollection",judtype:type};
		var trans={id:1, command:"com.agilecontrol.fair.FairCmd",params:params};
		rest.sendOneRequest(trans, function(response){
			var ret=response.data[0].result;
			if (ret==0) {
				if (type=="month") {
					window.location.href='/fair/ipad/B2B/shoppingCart.jsp?loadIdx='+dataService.loadIdx+'&fairid='+dataService.fairid+'&ordertype=month&iscollection=yes';
				}else if(type=="day"){
					window.location.href='/fair/ipad/B2B/shoppingCart.jsp?loadIdx='+dataService.loadIdx+'&fairid='+dataService.fairid+'&ordertype=day&iscollection=yes';
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

orderCenter.directive('tableContent', function($compile,dataService) {
	return{
        restrict:'AE',
        replace: true,
        scope:{
        	submit: '&',
        	/*editor: '&',*/
        	cancel: '&',
        	selectInfo: '&',
        	orders: '='
	  	},
        template:'<table class="table  table-hover table-condensed" ></table>',
        link: function(scope,element,attrs){
		    
        	scope.$on('order',function(event,orders_config,isAllTimeFilter){
        		element[0].innerHTML='';
        		if(orders_config.length>0){
        			var thead='<thead><tr class="table_head"><th>序号</th>';
        			for ( var i = 0; i < orders_config.length; i++) {
        				thead+='<th>'+orders_config[i].description+'</th>';
        			}
        			thead+='<th>操作</th></tr></thead>';
        			
        			var tbody='<tbody><tr class="{{order.status}} button_nowrap" ng-repeat="order in orders" value="{{order.docno}}"><td><input type="checkbox" ng-model="order.checked"/>&nbsp;{{$index+1}}</td>';
        			for ( var j = 0; j < orders_config.length; j++) {
        				if('docno' == orders_config[j].name){
        					//ng-dblclick
        					tbody+='<td ng-click="selectInfo({index:order.b_fo_id,docno:order.docno})" style="cursor: pointer;">{{order.'+orders_config[j].name+'}}</td>';
        				}else{
        					tbody+='<td>{{order.'+orders_config[j].name+'}}</td>';
        				}
        				//tbody+='<td> {{order.status}}</td>';
        			}
        			tbody+='<td style="text-align:center"><button type="button" class="btn d_color {{order.disable}}" ng-click="submit({index:order});">提交</button>&nbsp;<button type="button" class="btn d_color {{order.disable}}" ng-click="editor(order.b_fo_id,order.docno,order.b2b_fo_type,order.status);">编辑</button>&nbsp;<button type="button" class="btn d_color {{order.disable}}" ng-click="cancel({index:order.b_fo_id});">作废</button></td></tr></tbody>';
        			
        			element.append($compile(thead+tbody)(scope));
        		}
        	});
        	
        	scope.editor = function(orderId,docNo,b2b_fo_type,stu){
        		var arr=[];
        		var tbody=element[0].getElementsByTagName("tbody")[0]; 
        		
        		var num=0;
        		if(stu=="warning"){
        			var status=tbody.getElementsByClassName("danger");
        		}else{
        			var status=tbody.getElementsByClassName(stu);
        			num=1;
        		}
        		if(status.length>num){
    				for ( var i = 0; i < status.length; i++) {
    					var docno=status[i].getAttribute("value");
    					if(docNo != docno){
    						arr.push("您有未确认的订单，单据编号："+docno+"请先确认该订单，再编辑！");
    					}
    				}
    				if(arr.length>0){
    					alert(arr);
    				}
    			}else{
    				window.location.replace("/fair/ipad/B2B/shoppingCart.jsp?foid="+orderId+"&fairid="+dataService.fairid+"&loadIdx="+dataService.loadIdx);
    				//window.location.replace("/fair/ipad/b2bOrder.jsp?orderId="+orderId+"&fairtype="+b2b_fo_type+"&loadIdx="+dataService.loadIdx);
    			}
        		
        		/*if(stu=="warning"){
        			var status=tbody.getElementsByClassName("danger");
        			if(status.length>0){
        				for ( var i = 0; i < status.length; i++) {
        					var docno=status[i].getAttribute("value");
        					if(docNo != docno){
        						arr.push("您有未确认的订单，单据编号："+docno+"请先确认该订单，再编辑！");
        					}
        				}
        				if(arr.length>0){
        					alert(arr);
        				}
        			}else{
        				window.location.replace("/fair/ipad/b2bOrder.jsp?orderId="+orderId+"&fairtype="+b2b_fo_type+"&loadIdx="+dataService.loadIdx);
        			}
        		}else{
        			var status=tbody.getElementsByClassName(stu);
        			if(status.length>1){
        				for ( var i = 0; i < status.length; i++) {
        					var docno=status[i].getAttribute("value");
        					if(docNo != docno){
        						arr.push("您有未确认的订单，单据编号："+docno+"请先确认该订单，再编辑！");
        					}
        				}
        				if(arr.length>0){
        					alert(arr);
        				}
        			}else{
        				window.location.replace("/fair/ipad/b2bOrder.jsp?orderId="+orderId+"&fairtype="+b2b_fo_type+"&loadIdx="+dataService.loadIdx);
        			}
        		}*/
        	};
        }
    };
});

orderCenter.directive('allFilter',function($filter,dataService){
	return{
		restrict:'EA',
		replace: true,
		templateUrl:'all-filter.html',
		link: function(scope,element,attrs){
			scope.chkall = false;
			
			scope.chkAll = function(checked){
		        angular.forEach(scope.orders, function(value, key){
		        	value.checked = checked;
		        });
		    };
		    
		    scope.$watch('orders', function(nv, ov){
		    	scope.isRem='disabled';
		        if(nv == ov){
		        	return;
		        }
		        scope.choseArr = [];
		        angular.forEach(
			     $filter('filter')(nv, {checked: true}), function(v) {
			    	 if(dataService.b2b_b_mfo_id == undefined || dataService.b2b_b_mfo_id ==null){
			    		 dataService.b2b_b_mfo_id=v.id;
			    	 }
			        scope.choseArr.push(v.b2b_b_mfoitem_id);
			    });
		      //  console.info(scope.choseArr);
		        dataService.choseArr=scope.choseArr;
		        if(scope.choseArr.length!=0){
		        	scope.isRem='';
		        }
		        if(scope.orders.length != 0)
		        scope.chkall = scope.choseArr.length == scope.orders.length;
		   }, true);
		   
		   scope.$watch('pdt',function(){
			  // if((scope.gys == null || scope.gys == '')  && (scope.jxs == null || scope.jxs == '')){
			   if(scope.pdt == null || scope.pdt == ''){
				   scope.isSel='disabled';
			   }else{
				   scope.isSel='';
			   }
		   });
		   
		   
		   var picker = new Pikaday(
				    {
				        field: document.getElementById('datepicker'),
				        firstDay: 1,
				        minDate: new Date('2015-01-01'),
				        maxDate: new Date('2025-12-31'),
				        yearRange: [2015,2025]
				    });
		   var picker2 = new Pikaday(
				   {
					   field: document.getElementById('datepicker2'),
					   firstDay: 1,
					   minDate: new Date('2015-01-01'),
					   maxDate: new Date('2025-12-31'),
					   yearRange: [2015,2025]
				   });
		   
		}
	};
});

orderCenter.directive('tableAll', function($compile,dataService) {
	return{
		restrict:'AE',
		replace: true,
		scope:{
			reminder: '&',
			orders: '='
		},
		template:'<table class="table table-bordered table-hover table-condensed" id="table_content"></table>',
		link: function(scope,element,attrs){
			//var table_content=document.getElementById("table_content");
			
			scope.$on('order',function(event,orders_config,isAllTimeFilter){
				element[0].innerHTML='';
				if(orders_config.length>0){
					
					var thead='<thead class="fixedHeader"><tr class="table_head"><th>序号</th>';
					for ( var i = 0; i < orders_config.length; i++) {
						thead+='<th>'+orders_config[i].description+'</th>';
					}
					thead+='</tr></thead>';
					if(isAllTimeFilter){
						var tbody='<tbody ng-if="orders.length>1"><tr ng-class="{\'first-cell\': $index==0}" ng-repeat="order in orders"><td ng-if="$index==0">合计</td><td ng-if="$index!=0">&nbsp;{{$index}}</td>';
					}else{
						//var tbody='<tbody><tr ng-class="first-cell {{order.status}} button_nowrap" ng-repeat="order in orders" ><td ng-if="$index==0">合计</td><td ng-if="$index!=0"><input type="checkbox" ng-model="order.checked" />&nbsp;{{$index}}</td>';
						var tbody='<tbody ng-if="orders.length>1"><tr ng-class="{\'first-cell\': $index==0}" ng-repeat="order in orders" ><td ng-if="$index==0">合计</td><td ng-if="$index!=0"><input type="checkbox" ng-model="order.checked" />&nbsp;{{$index}}</td>';
					}
					for ( var j = 0; j < orders_config.length; j++) {
						tbody+='<td ng-class="{\'numStyle\': '+orders_config[j].isNum+'==true}">{{order.'+orders_config[j].name+'}}</td>';
						//tbody+='<td> {{order.status}}</td>';
					}
					//tbody+='<td style="text-align:center"><button type="button" class="btn btn-primary" ng-click="reminder({index:order.b_fo_id});">催单</button></td></tr></tbody>';
					tbody+='</tr></tbody>';
					
					element.append($compile(thead+tbody)(scope));
				}
			});
		}
	};
});

orderCenter.controller('dateDemo',function($rootScope,$scope){
    $scope.$watch('dt1', function(nv, ov){
    	if(nv == ov){
  /*  		var date=new Date();
    		date.setDate(1);
    		$rootScope.dt1=$scope.dt1=date.format("{0}-{1}-{2}");*/
        	return;
        }else{
        	if($rootScope.dt2!=undefined){
    		//	var date=$rootScope.dt2;
    			var datepicker2=document.getElementById('datepicker2').value;
    			var date = new Date(datepicker2);
    			var da1=date.format("{0}{1}{2}");
    		
    			
    			if(nv!=undefined){
    				//var date1=nv;
    				var date1 = new Date(nv);
    				var da2=date1.format("{0}{1}{2}");
    				if(parseInt(da2)-parseInt(da1)>0)  
    				{  
    					alert("开始时间不能大于结束时间！");  
    					$rootScope.dt1=$scope.dt1=ov;
    					return false;  
    				}
    			}
    		}
        }
    	$rootScope.dt1=$scope.dt1=nv;
    });
    $scope.$watch('dt2', function(nv, ov){
    	if(nv == ov){
    	/*	var endDate = new Date($scope.dt1);
    		endDate.setMonth($scope.dt1.getMonth()+1);
    		endDate.setDate(0);
    		$rootScope.dt2=$scope.dt2= endDate.format("{0}-{1}-{2}");*/
        	return;
        }else{
    		if($rootScope.dt1!=undefined){
    			//var date=$rootScope.dt1;
    			var datepicker=document.getElementById('datepicker').value;
    			var date = new Date(datepicker);
    			var da1=date.format("{0}{1}{2}");
    			//console.info(da1)
    			if(nv!=undefined){
    			//	var date1=nv;
    				var date1 = new Date(nv);
    				var da2=date1.format("{0}{1}{2}");
    		
    				if(parseInt(da1)-parseInt(da2)>0 )  
    				{  
    					alert("开始时间不能大于结束时间！");  
    					$rootScope.dt2=$scope.dt2=ov;
    					return false;  
    				}
    			}
    		}
        }
    	$rootScope.dt2=$scope.dt2=nv;
    });
    
});

String.prototype.format = function() {
	var vs = arguments;
	return this.replace(/\{(\d+)\}/g, function() { return vs[parseInt(arguments[1])]; });
};
 
Date.prototype.format = function(formatString) {
    with (this) {
        return (formatString||"{0}-{1}-{2} {3}:{4}:{5}").format(
              getFullYear()
            , ("0" + (getMonth()+1)).slice(-2)
            , ("0" + getDate()).slice(-2)
            , ("0" + getHours()).slice(-2)
            , ("0" + getMinutes()).slice(-2)
            , ("0" + getSeconds()).slice(-2)
        );
    }
};
 
function getWeek(theDay) {
    var monday = new Date(theDay.getTime());
    var sunday = new Date(theDay.getTime());
    monday.setDate(monday.getDate()+1-monday.getDay());
    sunday.setDate(sunday.getDate()+7-sunday.getDay());
    return {monday:monday, sunday:sunday};
}


/**
 * Created by chenmengqi on 2015/7/15.
 */
var b2b=angular.module('b2b',['ngRoute','ngTouch','ui.bootstrap','angular-carousel','angular-loading-bar','app']);

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

    	//初始化操作
        getInit:function(index,callback){
    		rest.init(null,null,'/servlets/binserv/Fair');
    		var trans = {
    				'id': 1,
    				'command': "com.agilecontrol.fair.MiscCmd",
    				'params': {
    					cmd: "B2B",
    					type:"init",
    					order:this.order,
    					option:index,
    					date1:this.date1,
    					date2:this.date2
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

    	//订单状态查询
    	getOrderStatus:function(callback){
    		rest.init(null,null,'/servlets/binserv/Fair');
    		var trans = {
    			'id': 1,
    			'command': "com.agilecontrol.fair.MiscCmd",
    			'params': {
    				cmd: "B2B",
    				type:"order_status",
    				date1:this.date1,
    				date2:this.date2
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

    	//菜单栏 一二级 订货会 热销商品  查询都访问此方法传参向后台发送请求
    	getSearchPdt: function(type,callback){
     		var trans = {
				'id': 1,
				'command': "com.agilecontrol.fair.MiscCmd",
				'params': {
    					cmd: "B2B",
    					type:type,
    					fairId:this.fairid,
    					categoryfir:this.categoryfir,
    					categorysec:this.categorysec,
    					fairtype:this.fairtype,
    					currentPage:this.currentPage,
    					isRankList:this.isRankList,
    					order:this.order
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

    	//喜欢商品
    	getFavorite: function(fairid,pdtid,f,callback){
    		var trans = {
				'id': 1,
				'command': "com.agilecontrol.fair.MiscCmd",
				'params': {
    					cmd: "B2B",
    					type:"favorite",
    					fairid:fairid,
    					pdtid:pdtid,
    					favorite:f
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
b2b.controller('fairCtr',function($scope,$http,dataService){

});

b2b.directive('search',function($rootScope,dataService){
      return {
          restrict:'E',
          scope:{
              popular_search:'=search'
          },
          replace: true,
          templateUrl:'search.html',
          link : function(scope,element,attrs){
        	  scope.search=function search(value){

        		 var val;
        		 if(value==undefined){
        			val=document.getElementById("search").value;
        		 }else{
        			val= value;
        		 }

        		 window.open('/fair/ipad/B2B/main.jsp?loadIdx='+dataService.loadIdx+'&from=index&search=all&value='+val+'&fair='+dataService.fairid);
        	  };
        	  scope.enter=function(ev){
        		  if(ev.keyCode!=13) return;
        		  scope.search();
        	  };
          }
      };
});
b2b.controller('PostListController', function ($scope,$http,dataService) {
	var slides = $scope.slides = [];
	$scope.param = null;
	$scope.carouselIndex2 = 0;

	 $scope.$on("carouselchange",function (event, data) {
    		if(data.length>0){
				for ( var i = 0; i < data.length; i++) {
					slides.push({id : i+1,label:'slide #' + (i+1),img:data[i].name,href:data[i].href});
				}
			}
     });
	/*$http.get('images/picture.json').success(function(data) {
			if(data.length>0){
				for ( var i = 0; i < data.length; i++) {
					slides.push({id : i+1,label:'slide #' + (i+1),img:data[i].name,href:data[i].href});
				}
			}
    }).error(function(data){
           console.info(data);
    });*/
});


b2b.controller('productCtr',function($scope,dataService){

});

b2b.controller('bannerCtr',function($scope,$rootScope){});
b2b.directive('noticeBox',function($rootScope,dataService){
  return {
      restrict:'A',
      transclude: true,
      scope: {
    	  notices:"=",
    	  orderStatus:"="

      },
      templateUrl:'notice.html',
      link : function(scope,element,attrs){
        //  console.info(element)
        //  console.info(document.getElementById("div1"))
      /*    var box=document.getElementById("notice-content"),can=true;
          box.innerHTML+=box.innerHTML;
          box.onmouseover=function(){can=false};
          box.onmouseout=function(){can=true};
          new function (){
              var stop=box.scrollTop%18==0&&!can;
              if(!stop)box.scrollTop==parseInt(box.scrollHeight/2)?box.scrollTop=0:box.scrollTop++;
              setTimeout(arguments.callee,box.scrollTop%18?10:1500);
          };*/

    	  scope.mg=function(newsid){
    		  if(newsid == null){
    			  window.open('/fair/ipad/B2B/news.jsp?loadIdx='+dataService.loadIdx);
    		  }else{
    			  window.open('/fair/ipad/B2B/news.jsp?loadIdx='+dataService.loadIdx+'&newsid='+newsid);
    		  }

    	  };

    	  scope.isShowTimeFilter=false;
    	  scope.showTime=function(){
    		  scope.isShowTimeFilter=!scope.isShowTimeFilter;
    	  };

    	  scope.submitTime=function submitTime(){
    		  var status=document.getElementsByName("status");
			  for ( var i = 0; i < status.length; i++) {
				  if(i==2){
					  status[i].className="cur";
				  }else{
					  status[i].className="";
				  }
			  }

    		  scope.isShowTimeFilter=false;
    		  if($rootScope.dt1 != undefined){
    			  dataService.date1=$rootScope.dt1.format("{0}{1}{2}");
    		  }else{
    			  dataService.date1="";
    		  }
    		  if($rootScope.dt2 != undefined){
    			  dataService.date2=$rootScope.dt2.format("{0}{1}{2}");
    		  }else{
    			  dataService.date2="";
    		  }

    		  dataService.getOrderStatus(function(data){
    			  scope.orderStatus=data.order_status;
    		  });
    	  };

    	  scope.statusWeek=function(){
    		  var status=document.getElementsByName("status");
    		  for ( var i = 0; i < status.length; i++) {
    			  if(i==0){
    				  status[i].className="cur";
    			  }else{
    				  status[i].className="";
    			  }
    		  }
			  if(scope.isShowTimeFilter==true){
				  scope.isShowTimeFilter=!scope.isShowTimeFilter;
			  }

    		dataService.date1=dataService.monday;
      		dataService.date2=dataService.sunday;
	      	  dataService.getOrderStatus(function(data){
	      		scope.orderStatus=data.order_status;
			  });
    	  };

    	  scope.statusMonth=function(){
			  var status=document.getElementsByName("status");
			  for ( var i = 0; i < status.length; i++) {
				  if(i==1){
					  status[i].className="cur";
				  }else{
					  status[i].className="";
				  }
			  }
			  if(scope.isShowTimeFilter==true){
				  scope.isShowTimeFilter=!scope.isShowTimeFilter;
			  }

    		if(dataService.date == undefined || dataService.endDate == undefined){
    			var date=new Date();
    			date.setDate(1);
    			dataService.date=date.format("{0}{1}{2}");

    			var endDate = new Date(date);
    			endDate.setMonth(date.getMonth()+1);
    			endDate.setDate(0);
    			dataService.endDate=endDate.format("{0}{1}{2}");
    		}
    		dataService.date1=dataService.date;
    		dataService.date2=dataService.endDate;

    		  dataService.getOrderStatus(function(data){
    			  scope.orderStatus=data.order_status;
    		  });
    	  };

    	  scope.isShowQty=true;
    	  scope.changStatus = function(index){
    		var status=document.getElementsByName("order-status");
			  for ( var i = 0; i < status.length; i++) {
				  if(i==index){
					  status[i].className="active";
				  }else{
					  status[i].className="";
				  }
			  }

			 // console.info(scope.orderStatus);
			  if(index == 0){
				  scope.isShowQty=true;
			  }else{
				  scope.isShowQty=false;
			  }
    	  };

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


b2b.controller('MenuFairCtrl', function ($scope,$rootScope, $log,$http,dataService,initService) {
	$scope.isEndUser=initService.isEndUser;

    $scope.clickFair = function(index,fair,fairType){
    	//跳转至main.jsp界面
    	window.open('/fair/ipad/B2B/main.jsp?loadIdx='+dataService.loadIdx+'&from=index&search=menuFair&fair='+fair.fairid+'&fairType='+fair.type+'&crtFairIndex='+index);
    };

});

b2b.directive('menuFair',function(){
    return{
        restrict:'EA',
        transclude: true,
        scope: {
        	'fairs':'='
        },
        templateUrl:'menu-fair.html',
    };
});

b2b.directive('productMenu',function(){
    return{
        restrict:'EA',
        transclude: true,
        scope: {
        	'categorys':'='
        },
        templateUrl:'category-menu.html',
        link : function(scope,element,attrs){
        	scope.num=0;
        	scope.id=-1;
        	scope.categoryMonse = function categoryMonse(categoryid){
        		//移动端
        		if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        			//if(scope.id==categoryid){
        			/*	scope.num++;
        				if(scope.num % 2 !=0){
        					var category_sec=document.getElementsByName("left-menu_second");
    	           			for ( var i = 0; i < category_sec.length; i++) {
    	           				category_sec[i].style.display="none";
    	           			}

    	           			var that= document.getElementById("left-menu_second_"+categoryid);
    	           			that.style.display="block";

    	           			var left_menu= document.getElementById("left-menu_"+categoryid);
    	           			left_menu.style.color= "rgb(182,29,29)";
    	           			left_menu.style.backgroundColor="rgb(247,247,247)";
        				}*/
        			//}else{
        			   scope.id=categoryid;

        			   	var category_sec=document.getElementsByName("left-menu_second");
	           			for ( var i = 0; i < category_sec.length; i++) {
	           				category_sec[i].style.display="none";
	           			}

	           			var that= document.getElementById("left-menu_second_"+categoryid);
	           			that.style.display="block";

	           			var left_menu= document.getElementById("left-menu_"+categoryid);
	           			left_menu.style.color= "rgb(182,29,29)";
	           			left_menu.style.backgroundColor="rgb(247,247,247)";
        			//}
        		}else{
        			var left_menu= document.getElementById("left-menu_"+categoryid);
        			left_menu.style.color= "rgb(182,29,29)";
        			left_menu.style.backgroundColor="rgb(247,247,247)";
        			left_menu.style.marginRight="-1px";

        			var category_sec=document.getElementsByName("left-menu_second");
        			for ( var i = 0; i < category_sec.length; i++) {
        				category_sec[i].style.display="none";
        			}

        			var that= document.getElementById("left-menu_second_"+categoryid);
        			that.style.display="block";
        	/*
        			var that= document.getElementById("left-menu_second_312");
        			that.style.display="block";*/

        		}

        	};



        	scope.categoryMonseout = function categoryMonseout(categoryid){
        		 var category_sec=document.getElementsByName("left-menu_second");
        		 for ( var i = 0; i < category_sec.length; i++) {

        			 category_sec[i].style.display="none";
        		 }
          		var left_menu= document.getElementById("left-menu_"+categoryid);
          		left_menu.style.color= " #000";
         		left_menu.style.backgroundColor="white";
         		left_menu.style.marginRight="0px";
        	};

        	scope.headShow=true;
        }
    };
});

b2b.controller('categoryMenuCtrl',function($scope,dataService){
	 $scope.num=0;
	 $scope.id=-1;
	//菜单栏
	$scope.category_click = function(first,firstattr,second,secondattr,third,thirdattr){
		var firstid=first;
		var search='category_fir';
		var secondid = null;
		var thirdid = null;
		if(second != null && third != null){
			secondid = second;
			thirdid = third;
			search='category_thr';
		}
		//移动端
		if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
			if($scope.id==firstid){
				$scope.num++;
				if($scope.num % 2 ==0){
				/*	if(second == null){
						var html='<span ng-click="category_click()">'+dataService.currentfair.fairname+'</span> > <span ng-click="category_click()">'+first.attribname+'</span>';
					}else{
						var html='<span ng-click="category_click()">'+dataService.currentfair.fairname+'</span> > <span ng-click="category_click()">'+first.attribname+'</span> > <span ng-click="category_click()">'+second.attribname+'</span>';
					}
					$scope.$emit("CtrlCurrentPosition", html);*/

					dataService.currentPage=1;

					dataService.type='category';
					dataService.categoryfir=firstid;
					dataService.categorysec=secondid;

					dataService.isRankList=false;
					dataService.getSearchPdt('category',function(data){
						$scope.$emit("CtrlDataChange", data);
					});

					var left_menu= document.getElementById("left-menu_"+firstid);
	         		left_menu.style.color= "#fff";
	         		left_menu.style.backgroundColor="rgb(200,22,35)";

	         		//click之后隐藏展开category
					 var that= document.getElementById("left-menu_second_"+firstid);
			 		that.style.display="none";
				}else{
					var category_sec=document.getElementsByName("left-menu_second");
        			for ( var i = 0; i < category_sec.length; i++) {
        				category_sec[i].style.display="none";
        			}

        			var that= document.getElementById("left-menu_second_"+firstid);
        		//	console.info(that);
        			that.style.display="block";

        			var left_menu= document.getElementById("left-menu_"+firstid);
        			left_menu.style.color= "rgb(182,29,29)";
        			left_menu.style.backgroundColor="rgb(247,247,247)";
				}
			}else{
				$scope.num=1;
				$scope.id=firstid;
			}
		}else{ //PC端
			//console.info(dataService.currentfair);
		/*	if(second == null){
				var html='<span ng-click="category_click()">'+dataService.currentfair.fairname+'</span> > <span ng-click="category_click()">'+first.attribname+'</span>';
			}else{
				var html='<span ng-click="category_click()">'+dataService.currentfair.fairname+'</span> > <span ng-click="category_click()">'+first.attribname+'</span> > <span ng-click="category_click()">'+second.attribname+'</span>';
			}
			$scope.$emit("CtrlCurrentPosition", html);*/

			/*dataService.currentPage=1;

			dataService.type='category';
			dataService.categoryfir=firstid;
			dataService.categorysec=secondid;

			dataService.isRankList=false;
			dataService.getSearchPdt('category',function(data){
				$scope.$emit("CtrlDataChange", data);
			});*/

			//click之后隐藏展开category
			var that= document.getElementById("left-menu_second_"+firstid);
	 		that.style.display="none";


	 		window.open('/fair/ipad/B2B/main.jsp?loadIdx='+dataService.loadIdx+'&from=index&search='+search+'&firstid='+firstid+'&secondid='+secondid+'&thirdid='+thirdid+'&fair='+dataService.fairid);
		}

	};
});

b2b.controller('mainCtr',function($scope,$rootScope, $http,$timeout,rest,dataService,initService){
	$scope.isDataShow=false;
	$scope.isOptionsShow=true;

	dataService.fairid=initService.fairid;
	$scope.isEndUser=initService.isEndUser;

    $scope.busy = false;
    $scope.currentPage = 1;
    dataService.currentPage = 1;
    $scope.limit = 24;
    $scope.pages = 1;

    $scope.$on("CtrlDataChange",function (event, data) {
        $scope.$broadcast("datachange", data);
    });
    $scope.$on("CtrlFairChange",function (event, data) {
    	$scope.$broadcast("categorychange", data);
    });

    $scope.$on("CarouselChange",function (event, data) {
    	$scope.$broadcast("carouselchange", data);
    });

    $scope.$on("datachange",function (event, data) {
    	 $scope.busy = false;
    	 $scope.pdts = data.products.pdt;
         $scope.pages = Math.ceil(data.products.total_num/$scope.limit);
    	 $scope.total=data.products.total_num;

    	 $scope.currentPage=1;

    	 if(data.category!=null){
    		 $scope.$emit("CtrlFairChange", data.category);
    	 }
    });

    $scope.$on("ranklist",function (event, data) {
    	$scope.pdts = data.products.pdt;
    });

    $scope.load = function(index,fairid) {
    	dataService.loadIdx=index;
    	dataService.fairid=fairid;
    	$scope.isOptionsShow=false;

    	//dataService.order=' order by id';
    	dataService.order='orderno';

    	var week = getWeek(new Date());
		dataService.date1=dataService.monday=week.monday.format("{0}{1}{2}");
		dataService.date2=dataService.sunday=week.sunday.format("{0}{1}{2}");

        dataService.getInit(index,function(data){
        	 $scope.isDataShow=true;
        	 $scope.pdts = data.top.pdts[0].pdt;
        	 dataService.top_pdts=data.top.pdts;
        	 $scope.head_title = data.top.head_title;

             //2015-10-15 15:13:01 排序改为可配
             $scope.pdt_sort=data.pdt_sort;

             // 初始化工作
             dataService.fairid=data.menufair[0].fairid;
             dataService.fairtype=data.menufair[0].type;
             dataService.categoryfir=null;
             dataService.categorysec=null;
             dataService.type='clickFair';
             dataService.dim1=data.dim1;
             dataService.dim2=data.dim2;
             dataService.dim3=data.dim3;
             dataService.currentfair=data.menufair[0];

             dataService.carousel=data.carousel;
             $scope.$emit("CarouselChange", data.carousel);

             console.info(dataService.carousel);

             $scope.menufair=data.menufair;
             $scope.categorys=data.category;
             $scope.search=data.hot;
             $scope.notices=data.notice;
             $scope.orderStatus=data.order_status;

             $scope.all_qq=data.qq;
        });
    };

    $scope.alert_qq = function(qq){
    	location.href='tencent://message/?uin='+qq+'&amp;Site=&amp;Menu=yes';
    };

    $scope.product_click = function(pdt,index,category_fir,category_sec,top){
    	//console.info(category_fir+','+category_sec+','+pdt.id+','+dataService.dim3);
    	var jspName='';
    	if(initService.userDescription=='guest'){
    		jspName='b2bOrder_Guest.jsp';
    	}else{
    		jspName='b2bOrder.jsp';
    	}
    	if(top=='top'){
    		window.location.href="/fair/ipad/"+jspName+"?type=category&fairid="+dataService.fairid+"&categoryfir="+category_fir+"&categorysec="+category_sec+"&fairtype=all"+"&dim1="+dataService.dim1+"&dim2="+dataService.dim2+"&index="+index+"&currentPage="+dataService.currentPage+"&order="+dataService.order+"&loadIdx="+dataService.loadIdx+"&top_name="+dataService.top_name;
    	}else{
    		//var pdtid=pdt.id;
        	window.location.href="/fair/ipad/"+jspName+"?type=category&fairid="+dataService.fairid+"&categoryfir="+category_fir+"&categorysec="+category_sec+"&fairtype="+dataService.fairtype+"&dim1="+dataService.dim1+"&dim2="+dataService.dim2+"&index="+index+"&currentPage="+dataService.currentPage+"&order="+dataService.order+"&loadIdx="+dataService.loadIdx;
    	}
    };

    $scope.favorite=function(pdtid,favorite){
		if(favorite.is_fav=='Y'){
			favorite.is_fav="N";
		}else{
			favorite.is_fav="Y";
		}
    	dataService.getFavorite(dataService.fairid,pdtid,favorite.is_fav,function(data){

    	});
    };

    $scope.isShowChgPwd=false;
    $scope.isShowChgLogin=false;
    $scope.changePwd=function(){
    	$scope.isShowChgPwd=true;
    	$scope.isDataShow=false;
    };

    $scope.clearChgPwd=function(){
    	$scope.isShowChgPwd=false;
    	$scope.isDataShow=true;
    };

    $scope.submitChgPwd=function(){
    	var reg = /^[0-9a-zA-Z]+$/;

    	var newpwd1=$scope.newpwd;
    	var newpwd2=$scope.newpwd2;

    	if($scope.oldpwd==undefined || $scope.oldpwd.trim().length==0){
    		alert("旧密码不能为空！");
    		return;
    	}
    	if(newpwd1==undefined || newpwd1.trim().length==0){
    		alert("新密码不能为空！");
    		return;
    	}

    	if($scope.oldpwd==newpwd1){
    		alert("新旧密码一致！");
    		return;
    	}
    	if(!reg.test(newpwd1)){
    		alert("新密码必须是英文或数字！");
    		return;
    	}
    	if(newpwd1.length<6){
    		alert("密码长度不能低于六位！");
    		return;
    	}
    	if(newpwd1!=newpwd2){
    		alert("请确认两次输入密码一致！");
    		return;
    	}


		var trans = {
			'id': 1,
			'command': "com.agilecontrol.fair.MiscCmd",
			'params': {
					cmd: "B2B",
					type:"chgPwd",
					phoneNum:$scope.phoneNum,
					oldpwd:$scope.oldpwd,
					newpwd:$scope.newpwd
				}
 		};
		rest.sendOneRequest(trans,function(response){
			//console.info(response.data[0])
				if(response.data[0].code == 1){
					$scope.isShowChgPwd=false;
					$scope.isShowChgLogin=true;

					$scope.countTimer=10;
					var myTime = setInterval(function() {
                        $scope.countTimer--;
                        $scope.$digest(); // 通知视图模型的变化
                        }, 1000);

					$timeout(function() {
						 window.location.replace("/control/logout");

		                   clearInterval(myTime);
		                   $scope.countTimer.$destroy();
					}, 10000);

				}else{
					alert(response.data[0].message);
				}
		});

    };

    $scope.collection=function(type){
    	var params={cmd:"JudgeMonth",fairid:dataService.fairid,method:"beforeCollection",judtype:type};
		var trans={id:1, command:"com.agilecontrol.fair.FairCmd",params:params};
		rest.sendOneRequest(trans, function(response){
			var ret=response.data[0].result;
			if (ret==0) {
				if (type=="month") {
					//window.location.replace('/fair/ipad/B2B/shoppingCart.jsp?loadIdx='+dataService.loadIdx+'&fairid='+dataService.fairid+'&ordertype=month&iscollection=yes');
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

    $scope.ordercenter = function(){
    	window.location.href="/fair/ipad/B2B/orderCenter.jsp?loadIdx="+dataService.loadIdx+"&fairid="+dataService.fairid;
    };

    $scope.addFavorite=function(obj,opts){
    /*	var url = window.location;
    	url="www.baidu.com";
        var title = document.title;
        var ua = navigator.userAgent.toLowerCase();
        console.info(url);
        console.info(title);
        console.info(ua);
				if (ua.indexOf("360se") > -1) {
					alert("由于360浏览器功能限制，请按 Ctrl+D 手动收藏！");
				} else if (ua.indexOf("msie 8") > -1) {
					window.external.AddToFavoritesBar(url, title); // IE8
				} else if (document.all) {
					try {
						window.external.addFavorite(url, title);
					} catch (e) {
						alert('您的浏览器不支持,请按 Ctrl+D 手动收藏!');
					}
				} else if (window.sidebar) {
					alert(1);
					window.sidebar.addPanel("test", "www.baidu.com", "");
				} else {
					alert('您的浏览器不支持,请按 Ctrl+D 手动收藏!');
				}*/
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

b2b.directive('whenScrolled', function(dataService) {

   return function(scope, elm, attr) {
      /* var raw = elm[0];
       elm.bind('scroll', function () {
           if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
               scope.$apply(attr.whenScrolled);
           }
       });*/
	    dataService.top_name='b2b_top_hot';
       	scope.dimChange=function dimChange(index,outindex,name,c_fir,c_sec,top_name){
       		dataService.top_name=top_name;
       		//console.info(top_name);
       		var name_list=null;
       		if(outindex!=null){
       			name_list=document.getElementsByName(name+outindex);
       		}else{
       			name_list=document.getElementsByName(name);
       		}
	       	for ( var i = 0; i < name_list.length; i++) {
	       		name_list[i].className="pdt-nav-item";
			}

	       	name_list[index].className= "pdt-nav-item active";

	       	if(outindex==null && name=='top'){
       			scope.pdts=dataService.top_pdts[index].pdt;
       		}else{
       			dataService.currentPage=1;
    			dataService.itemsPerPage=12;
    			dataService.type='category';
    			dataService.categoryfir=c_fir;
    			dataService.categorysec=c_sec;

    			dataService.isRankList=false;

    	       	//更新商品数据
    	        dataService.getSearchPdt(dataService.type,function(data){
    	        	if(outindex!=null){
    	        		scope.categorys[outindex-1].category_pdts.pdt=data.products.pdt;
    	        	}else{
    	        		scope.pdts=data.products.pdt;
    	        	}
                });
       		}
        };

        scope.dimClick=function(name,search,category_fir,category_sec){
        	 window.open('/fair/ipad/B2B/main.jsp?loadIdx='+dataService.loadIdx+'&from=index&search='+search+'&top_name='+name+'&fair='+dataService.fairid+'&firstid='+category_fir+'&secondid='+category_sec);
        };

   };

});

b2b.controller('dateDemo',function($rootScope,$scope){
	var startDate=new Date();
	startDate.setDate(1);
	$rootScope.dt1=$scope.dt1=startDate.format("{0}-{1}-{2}");

	var endDate = new Date(startDate);
	endDate.setMonth(startDate.getMonth()+1);
	endDate.setDate(0);
	$rootScope.dt2=$scope.dt2=endDate.format("{0}-{1}-{2}");

   $scope.$watch('dt1', function(nv, ov){
   	if(nv == ov){
   		/*var date=new Date();
   		date.setDate(1);
   		$rootScope.dt1=$scope.dt1=date.format("{0}{1}{2}");*/
       	return;
       }else{
       	if($rootScope.dt2!=undefined){
       		var datepicker2=document.getElementById('datepicker2').value;
			var date = new Date(datepicker2);
			var da1=date.format("{0}{1}{2}");

   			if(nv!=undefined){
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
	       	return;
	    }else{
	   		if($rootScope.dt1!=undefined){
	   			var datepicker=document.getElementById('datepicker').value;
    			var date = new Date(datepicker);
    			var da1=date.format("{0}{1}{2}");

	   			if(nv!=undefined){
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

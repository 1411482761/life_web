/**
 * Created by chenmengqi on 2015/7/15.
 */
var main=angular.module('b2b.main',['ngRoute','ngTouch','ui.bootstrap','angular-carousel','angular-loading-bar','app','tm.pagination']);

main.service('dataService',function($q,$http,rest,initService){
    return {
    	//获取订货会
   /* 	getOptions:function(callback){
    		rest.init(null,null,'/servlets/binserv/Fair');
    		var trans = [{
    				'id': 1,
    				'command': "com.agilecontrol.fair.MiscCmd",
    				'params': {
    					cmd: "B2B",
    					type:"options"
    				}
    		}];
    		rest.sendOneRequest(trans,function(response){
    			var data=response.data[0].result;
    			if(data==null){
    				alert(response.data[0].message);
    				return;
    			}else{
    				callback(data);
    			}
    		});
    	},*/

    	//初始化操作
        getInit:function(index,callback){
    		rest.init(null,null,'/servlets/binserv/Fair');
    		var trans = {
    				'id': 1,
    				'command': "com.agilecontrol.fair.MiscCmd",
    				'params': {
    					cmd: "B2B",
    					type:"init",
    					from:"main",
    					order:this.order,
    					option:index,
    					currentFair:this.fairid
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
    					categorythr:this.categorythr,
    					fairtype:this.fairtype,
    					currentPage:this.currentPage,
    				/*	isRankList:this.isRankList,*/
    					top_name:initService.top_name,
    					order:this.order,
    					itemsPerPage:this.itemsPerPage,
    					//dim筛选条件
    					dim_color:this.dim_color,
    					dim_color_val:this.dim_color_val,
    					dim_format:this.dim_format,
    					dim_format_val:this.dim_format_val,
    					dim_series:this.dim_series,
    					dim_series_val:this.dim_series_val,
    					dim_functionality:this.dim_functionality,
    					dim_functionality_val:this.dim_functionality_val,
    					dim_school_term:this.dim_school_term,
    					dim_school_term_val:this.dim_school_term_val,
    					dim_month:this.dim_month,
    					dim_month_val:this.dim_month_val,
    					dim_price:this.dim_price,
    					dim_price_val1:this.dim_price_val1,
    					dim_price_val2:this.dim_price_val2,
    					selectedMc:this.selectedMc 
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
    	importOrder: function(type,callback){
     		var trans = {
				'id': 1,
				'command': "com.agilecontrol.fair.MiscCmd",
				'params': {
    					cmd: "B2BOrderCenter",
    					type:type,
    					monthType:this.monthType,
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

    	//喜欢得商品
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
main.controller('fairCtr',function($scope,$http,dataService){
	 $scope.$on("mainCtrlInit",function (event, data) {
			        $scope.search=data.hot;
	 });

	   $scope.$on("searchval",function (event, val) {
   	    	$scope.searchVal = val;
   	   });
});

main.directive('search',function($rootScope,dataService,initService){
      return {
          restrict:'E',
          scope:{
              popular_search:'=search',
              searchVal:'='
          },
          replace: true,
          templateUrl:'search.html',
          link : function(scope,element,attrs){
        	  scope.search=function search(value){
        		 initService.from='main';

        		 scope.$emit("CtrlCurrentPosition", '<span>'+dataService.currentfair.fairname+'</span>');

        		 var val;
        		 if(value==undefined){
        			val=document.getElementById("search").value;
        		 }else{
        			val= value;
        		 }
        		 dataService.type='search';
        		 dataService.categoryfir=null;
        		 dataService.categorysec=scope.searchVal=val;

        		 dataService.isChangefair=true;

        		/* dataService.isRankList=false;*/
        		 $rootScope.reGetProducts();
        	  };
        	  scope.enter=function(ev){
        		  if(ev.keyCode!=13) return;
        		  scope.search();
        	  };
          }
      };
});

/*main.directive('noticeBox',function(dataService){
  return {
      restrict:'A',
      transclude: true,
      scope: {
    	  notices:"="
      },
      templateUrl:'notice.html',
      link : function(scope,element,attrs){
        //  console.info(element)
        //  console.info(document.getElementById("div1"))
          var box=document.getElementById("notice-content"),can=true;
          box.innerHTML+=box.innerHTML;
          box.onmouseover=function(){can=false};
          box.onmouseout=function(){can=true};
          new function (){
              var stop=box.scrollTop%18==0&&!can;
              if(!stop)box.scrollTop==parseInt(box.scrollHeight/2)?box.scrollTop=0:box.scrollTop++;
              setTimeout(arguments.callee,box.scrollTop%18?10:1500);
          };
      }
  };
});*/


main.controller('MenuFairCtrl', function ($scope,$rootScope, $log,$http,dataService,initService) {
	$scope.isEndUser=initService.isEndUser;
	/* $scope.$on("mainCtrlInit",function (event, data) {
	        $scope.fairs=data.menufair;
	 });*/

    $scope.clickFair = function(index,fair,fairType){
    	var menu_fair=document.getElementsByName("menu_fair");
    	for ( var i = 0; i < menu_fair.length; i++) {
    		if(i==index){
    			menu_fair[index].className="custom";
    		}else{
    			menu_fair[i].className= "";
    		}
		}

    	$rootScope.isNewShow=fairType=='new'?true:false;
    	$rootScope.isQuickOrder=fairType=='singleMonth'?true:false;
    	//console.info(fairType);
    	initService.from='main';
    	var fairId=fair.fairid;
    	var html='<span>'+fair.fairname+'</span>';
    	$scope.$emit("CtrlCurrentPosition", html);
    	dataService.currentfair=fair;

        dataService.fairid=fairId;
        dataService.fairtype=fairType;
        dataService.categoryfir=null;
        dataService.categorysec=null;
        dataService.categorythr=null;
        dataService.type='clickFair';

       /* dataService.currentPage=1;*/
        dataService.isChangefair=true;

        $rootScope.reGetProducts();
    };

});

main.directive('menuFair',function(){
    return{
        restrict:'EA',
        transclude: true,
        scope: {
        	'fairs':'='
        },
        templateUrl:'menu-fair.html',

    };
});

main.directive('productMenu',function(dataService){
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

        		}
        	};
        	scope.categoryMonseout = function categoryMonseout(categoryid){
        		 var category_sec=document.getElementsByName("left-menu_second");
        		 for ( var i = 0; i < category_sec.length; i++) {

        			 category_sec[i].style.display="none";
        		 }

          		var left_menu= document.getElementById("left-menu_"+categoryid);
         		/*left_menu.style.color= " #ffffff";
         		left_menu.style.backgroundColor="rgb(200,22,35)";*/
          		left_menu.style.color= "#000";
         		left_menu.style.backgroundColor="white";
         		left_menu.style.marginRight="0px";
        	};
        	scope.headShow=false;
        	scope.headCategoryMouseover=function(){
        		scope.headShow=true;
        	};

        	scope.headCategoryMouseleave=function(){
        		scope.headShow=false;
        	};

        	scope.back=function(){
        		window.location.replace('/fair/ipad/B2B/index.jsp?loadIdx='+dataService.loadIdx);
        	};
        }
    };
});

main.controller('categoryMenuCtrl',function($scope,$rootScope,dataService,initService){

	/* $scope.$on("categorychange",function (event, category) {
		 $scope.categorys=category;
	 });	*/

	 $scope.num=0;
	 $scope.id=-1;
	//菜单栏
	$scope.category_click = function(first,firstattr,second,secondattr,third,thirdattr){
		dataService.type='category';

		initService.from='main';
		dataService.isChangefair=true;
		var firstid=first;
		var secondid = null;
		if(second != null){
			var secondid = second;
		}
		//移动端
		if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
			if($scope.id==firstid){
				$scope.num++;
				if($scope.num % 2 ==0){
					if(second == null){
						var html='<span ng-click="category_click(\''+dataService.type+'\','+dataService.currentfair.fairid+',null,null)">'+dataService.currentfair.fairname+'</span> > <span>'+firstattr+'</span>';
					}else{
						var html='<span ng-click="category_click(\''+dataService.type+'\','+dataService.currentfair.fairid+',null,null)">'+dataService.currentfair.fairname+'</span> > <span ng-click="category_click(\''+dataService.type+'\','+dataService.currentfair.fairid+','+first+',\''+firstattr+'\')">'+firstattr+'</span> > <span>'+secondattr+'</span>';
					}
					$scope.$emit("CtrlCurrentPosition", html);

					//dataService.currentPage=1;
					dataService.isChangefair=true;

					dataService.type='category';
					dataService.categoryfir=firstid;
					dataService.categorysec=secondid;
					dataService.categorythr=third;

					/*dataService.isRankList=false;*/
				/*	dataService.getSearchPdt('category',function(data){
						$scope.$emit("CtrlDataChange", data);
					});*/
					$rootScope.reGetProducts();


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
			if(second == null){
				var html='<span ng-click="category_click(\''+dataService.type+'\','+dataService.currentfair.fairid+',null,null,null,null)" style="color: red;background-color: #fff;">'+dataService.currentfair.fairname+'</span> > <span>'+firstattr+'</span>';
			}else{
			//	var html='<span ng-click="category_click(\''+dataService.type+'\','+dataService.currentfair.fairid+',null,null,null,null)" style="color: red;background-color: #fff;">'+dataService.currentfair.fairname+'</span> > <span ng-click="category_click(\''+dataService.type+'\','+dataService.currentfair.fairid+','+first+',\''+firstattr+'\',null,null)" style="color: red;background-color: #fff;">'+firstattr+'</span> > <span>'+secondattr+'</span>';

				var html='<span ng-click="category_click(\''+dataService.type+'\','+dataService.currentfair.fairid+',null,null,null,null)" style="color: red;background-color: #fff;">'+dataService.currentfair.fairname+'</span> > <span ng-click="category_click(\''+dataService.type+'\','+dataService.currentfair.fairid+','+first+',\''+firstattr+'\',null,null)" style="color: red;background-color: #fff;">'+firstattr+'</span> > <span ng-click="category_click(\''+dataService.type+'\','+dataService.currentfair.fairid+','+first+',\''+firstattr+'\','+second+',\''+secondattr+'\')" style="color: red;background-color: #fff;">'+secondattr+'</span> > <span>'+thirdattr+'</span>';
			}
			$scope.$emit("CtrlCurrentPosition", html);

			//dataService.currentPage=1;

			dataService.categoryfir=firstid;
			dataService.categorysec=secondid;
			dataService.categorythr=third;

			/*dataService.isRankList=false;*/
			$rootScope.reGetProducts();

			//click之后隐藏展开category
			var that= document.getElementById("left-menu_second_"+firstid);
	 		that.style.display="none";
		}

	};
});

main.controller('mainCtr',function($scope,$rootScope, $http,rest,dataService,initService){
	$scope.isEndUser=initService.isEndUser;
	/*if(initService.isEndUser=='false'){
		$scope.isEndUser=false;
	}else{
		$scope.isEndUser=true;
	}*/

	$scope.isDataShow=false;

    $scope.$on("Ctr1NameChange",function (event, data) {
    	   $scope.$broadcast("mainCtrlInit", data);
    });

    $scope.$on("CtrlDataChange",function (event, data) {
        $scope.$broadcast("datachange", data);
    });

    $scope.$on("CtrlRankList",function (event, data) {
    	$scope.$broadcast("ranklist", data);
    });

  /*  $scope.$on("CtrlFairChange",function (event, data) {
    	$scope.$broadcast("categorychange", data);
    });*/

    $scope.$on("CtrlShow",function (event, isShow) {
    	$scope.$broadcast("show", isShow);
    });

    $scope.$on("CtrlCurrentPosition",function (event, html) {
    	$scope.$broadcast("currentposition", html);
    });

    $scope.$on("CtrlSearchVal",function (event, val) {
    	$scope.$broadcast("searchval", val);
    });

    $scope.$on("datachange",function (event, data) {
    	 $scope.pdts = data.products.pdt;
     //    $scope.pages = Math.ceil(data.products.total_num/$scope.limit);
         $scope.total=data.products.total_num;
    	 $scope.paginationConf.totalItems=data.products.total_num;

    });

    $scope.$on("ranklist",function (event, data) {
    	$scope.pdts = data.products.pdt;
    });

    $scope.load = function() {
    	var searchType=initService.search;

		dataService.loadIdx=initService.loadIdx;

    	dataService.fairid=initService.fair;
    	dataService.fairtype='allow';

    	//$scope.isOptionsShow=false;

    	dataService.order='orderno';
    	 dataService.getInit(initService.loadIdx,function(data){
    		// console.info(data);
        	 $scope.isDataShow=true;

             //2015-10-15 15:13:01 排序改为可配
             $scope.pdt_sort=data.pdt_sort;
             $scope.search=data.hot;

             dataService.dim1=data.dim1;
             dataService.dim2=data.dim2;
             dataService.dim3=data.dim3;
             dataService.currentfair=data.menufair[0];

             $scope.menufair=data.menufair;
             $scope.categorys=data.category;
             $scope.filters=data.filter;
          //   $scope.$emit("Ctr1NameChange", data);


         	if(searchType=="all"){
         	   var val=initService.value;

         	   	$scope.$emit("CtrlCurrentPosition", '<span>'+dataService.currentfair.fairname+'</span>');

     	   		 dataService.type='search';
     	   		 dataService.categoryfir=null;
     	   		 dataService.categorysec=val;
     	   		 $scope.$emit("CtrlSearchVal", val);

     	   		 dataService.getSearchPdt('search',function(data){
     	   			$scope.$emit("CtrlDataChange", data);
     	   		 });
         	}else if(searchType=="category_fir" || searchType=="category_sec" || searchType=="category_thr"){
         		dataService.type='category';

    			var categorys=$scope.categorys;
    			var category=null;
    			var html='';

    			for ( var i = 0; i < categorys.length; i++) {
					if(categorys[i].id==initService.firstid){
						category=categorys[i];
						if(searchType=="category_fir"){
		    				//initService.firstid;
							html='<span ng-click="category_click(\''+dataService.type+'\','+dataService.currentfair.fairid+',null,null,null,null)" style="color: red;background-color: #fff;">'+dataService.currentfair.fairname+'</span> > <span>'+category.attribname+'</span>';
		    			}else if(searchType=="category_sec"){
		    				for ( var j = 0; j < categorys[i].category_sec.length; j++) {
								if(categorys[i].category_sec[j].id==initService.secondid){
									var category_sec=categorys[i].category_sec[j];
									html='<span ng-click="category_click(\''+dataService.type+'\','+dataService.currentfair.fairid+',null,null,null,null)" style="color: red;background-color: #fff;">'+dataService.currentfair.fairname+'</span> > <span ng-click="category_click(\''+dataService.type+'\','+dataService.currentfair.fairid+','+categorys[i].id+',\''+categorys[i].attribname+'\',null,null)" style="color: red;background-color: #fff;">'+categorys[i].attribname+'</span> > <span>'+category_sec.attribname+'</span>';
								}
							}
		    			}else{
		    				for ( var j = 0; j < categorys[i].category_sec.length; j++) {
								if(categorys[i].category_sec[j].id==initService.secondid){
									var category_sec=categorys[i].category_sec[j];

									for ( var k = 0; k < category_sec.category_thr.length; k++) {
										//console.info(category_sec.category_thr[k].id+"----"+initService.thirdid)
										if(category_sec.category_thr[k].id == initService.thirdid){
											var category_thr=category_sec.category_thr[k];
											html='<span ng-click="category_click(\''+dataService.type+'\','+dataService.currentfair.fairid+',null,null,null,null)" style="color: red;background-color: #fff;">'+dataService.currentfair.fairname+'</span> > <span ng-click="category_click(\''+dataService.type+'\','+dataService.currentfair.fairid+','+categorys[i].id+',\''+categorys[i].attribname+'\',null,null)" style="color: red;background-color: #fff;">'+categorys[i].attribname+'</span> > <span ng-click="category_click(\''+dataService.type+'\','+dataService.currentfair.fairid+','+categorys[i].id+',\''+categorys[i].attribname+'\','+category_sec.id+',\''+category_sec.attribname+'\')" style="color: red;background-color: #fff;">'+category_sec.attribname+'</span> > <span>'+category_thr.attribname+'</span>';
										}
									}
								}
							}
		    			}
					}
				}
    			$scope.$emit("CtrlCurrentPosition", html);

    			dataService.categoryfir=initService.firstid;
    			dataService.categorysec=initService.secondid;
    			dataService.categorythr=initService.thirdid;

    			dataService.getSearchPdt('category',function(data){
    				$scope.$emit("CtrlDataChange", data);
    			});
         	}else if(searchType=="menuFair"){
         		var name='';

         		var index_menu_fair=null;
         		if(initService.fairType=='allow'){
         			index_menu_fair=0;
         			name='可订货商品';
         		}else if(initService.fairType=='all'){
         			index_menu_fair=1;
         			name='全部商品';
         		}else if(initService.fairType=='new'){
         			index_menu_fair=2;
         			name='新品';
         			$rootScope.isNewShow=true;
         		}else if(initService.fairType=='singleMonth'){
         			index_menu_fair=3;
         			name='月单';
         			$rootScope.isQuickOrder=true;
         		}
                $scope.$emit("CtrlCurrentPosition", '<span>'+name+'</span>');

                dataService.fairtype=initService.fairType;
             	dataService.currentfair=$scope.menufair[initService.crtFairIndex];

                 dataService.categoryfir=null;
                 dataService.categorysec=null;
                 dataService.categorythr=null;
                 dataService.type='clickFair';

                // dataService.currentPage=1;

              /*  dataService.isRankList=false;*/
                dataService.getSearchPdt('clickFair',function(data){
                 	$scope.$emit("CtrlDataChange", data);

                 	var menu_fair=document.getElementsByName("menu_fair");
             		for ( var i = 0; i < menu_fair.length; i++) {
             			if(i==index_menu_fair){
             				menu_fair[index_menu_fair].className="custom";
             			}else{
             				menu_fair[i].className= "";
             			}
             		}
          		});

         	}else if(searchType=="top"){
         		dataService.type='top';

         		var top_name=initService.top_name;
         		var html='';
         		if(top_name=='b2b_top_hot'){
         			html='<span ng-click="category_click(\''+dataService.type+'\','+dataService.currentfair.fairid+',null,null,null,null)" style="color: red;background-color: #fff;">'+dataService.currentfair.fairname+'</span> > <span>热卖商品</span>';
         		}else{
         			html='<span ng-click="category_click(\''+dataService.type+'\','+dataService.currentfair.fairid+',null,null,null,null)" style="color: red;background-color: #fff;">'+dataService.currentfair.fairname+'</span> > <span>新品上架</span>';
         		}
         		$scope.$emit("CtrlCurrentPosition", html);

         		dataService.categoryfir=null;
                dataService.categorysec=null;
                dataService.categorythr=null;

              /*  dataService.isRankList=false;*/
                dataService.getSearchPdt(searchType,function(data){
                 	$scope.$emit("CtrlDataChange", data);
          		});
         	}

         	//初始化之后修改from为index 置为空
         	initService.from='';
        });

    };

    $scope.product_click = function(pdt,index){
    	var jspName='';
    	if(initService.userDescription=='guest'){
    		jspName='b2bOrder_Guest.jsp';
    	}else{
    		jspName='b2bOrder.jsp';
    	}
    	//var pdtid=pdt.id;
    	//console.info("type="+dataService.type+"&fairid="+dataService.fairid+"&categoryfir="+dataService.categoryfir+"&categorysec="+dataService.categorysec+"&fairtype="+dataService.fairtype+"&dim1="+dataService.dim1+"&dim2="+dataService.dim2+"&pdtid="+pdtid);
    	//跳转至下单界面 传参
    	//window.location.replace("/fair/ipad/b2bOrder.jsp?type="+dataService.type+"&fairid="+dataService.fairid+"&categoryfir="+dataService.categoryfir+"&categorysec="+dataService.categorysec+"&fairtype="+dataService.fairtype+"&dim1="+dataService.dim1+"&dim2="+dataService.dim2+"&index="+index+"&currentPage="+dataService.currentPage+"&order="+dataService.order+"&isRecentVisit="+false+"&loadIdx="+dataService.loadIdx);

    //	window.location.href="/fair/ipad/"+jspName+"?type="+dataService.type+"&fairid="+dataService.fairid+"&categoryfir="+dataService.categoryfir+"&categorysec="+dataService.categorysec+"&categorythr="+dataService.categorythr+"&fairtype="+dataService.fairtype+"&dim1="+dataService.dim1+"&dim2="+dataService.dim2+"&dim3="+dataService.dim3+"&index="+index+"&currentPage="+dataService.currentPage+"&order="+dataService.order+"&loadIdx="+dataService.loadIdx+"&dim_color="+dataService.dim_color+"&dim_color_val="+dataService.dim_color_val+"&dim_format="+dataService.dim_format+"&dim_format_val="+dataService.dim_format_val+"&dim_series="+dataService.dim_series+"&dim_series_val="+dataService.dim_series_val+"&dim_functionality="+dataService.dim_functionality+"&dim_functionality_val="+dataService.dim_functionality_val+"&dim_school_term="+dataService.dim_school_term+"&dim_school_term_val="+dataService.dim_school_term_val+"&dim_month="+dataService.dim_month+"&dim_month_val="+dataService.dim_month_val+"&dim_price="+dataService.dim_price+"&dim_price_val1="+dataService.dim_price_val1+"&dim_price_val2="+dataService.dim_price_val2+"&selectedMc="+dataService.selectedMc+"&itemsPerPage="+dataService.itemsPerPage;

      if(dataService.type == 'top')
    	   window.location.href="/fair/ipad/"+jspName+"?type="+dataService.type+"&fairid="+dataService.fairid+"&categoryfir="+dataService.categoryfir+"&categorysec="+dataService.categorysec+"&categorythr="+dataService.categorythr+"&fairtype="+dataService.fairtype+"&dim1="+dataService.dim1+"&dim2="+dataService.dim2+"&dim3="+dataService.dim3+"&index="+index+"&currentPage="+dataService.currentPage+"&order="+dataService.order+"&loadIdx="+dataService.loadIdx+"&dim_color="+dataService.dim_color+"&dim_color_val="+dataService.dim_color_val+"&dim_format="+dataService.dim_format+"&dim_format_val="+dataService.dim_format_val+"&dim_series="+dataService.dim_series+"&dim_series_val="+dataService.dim_series_val+"&dim_functionality="+dataService.dim_functionality+"&dim_functionality_val="+dataService.dim_functionality_val+"&dim_school_term="+dataService.dim_school_term+"&dim_school_term_val="+dataService.dim_school_term_val+"&dim_month="+dataService.dim_month+"&dim_month_val="+dataService.dim_month_val+"&dim_price="+dataService.dim_price+"&dim_price_val1="+dataService.dim_price_val1+"&dim_price_val2="+dataService.dim_price_val2+"&selectedMc="+dataService.selectedMc+"&itemsPerPage="+dataService.itemsPerPage+"&top_name="+initService.top_name;
      else
    	   window.location.href="/fair/ipad/"+jspName+"?type="+dataService.type+"&fairid="+dataService.fairid+"&categoryfir="+dataService.categoryfir+"&categorysec="+dataService.categorysec+"&categorythr="+dataService.categorythr+"&fairtype="+dataService.fairtype+"&dim1="+dataService.dim1+"&dim2="+dataService.dim2+"&dim3="+dataService.dim3+"&index="+index+"&currentPage="+dataService.currentPage+"&order="+dataService.order+"&loadIdx="+dataService.loadIdx+"&dim_color="+dataService.dim_color+"&dim_color_val="+dataService.dim_color_val+"&dim_format="+dataService.dim_format+"&dim_format_val="+dataService.dim_format_val+"&dim_series="+dataService.dim_series+"&dim_series_val="+dataService.dim_series_val+"&dim_functionality="+dataService.dim_functionality+"&dim_functionality_val="+dataService.dim_functionality_val+"&dim_school_term="+dataService.dim_school_term+"&dim_school_term_val="+dataService.dim_school_term_val+"&dim_month="+dataService.dim_month+"&dim_month_val="+dataService.dim_month_val+"&dim_price="+dataService.dim_price+"&dim_price_val1="+dataService.dim_price_val1+"&dim_price_val2="+dataService.dim_price_val2+"&selectedMc="+dataService.selectedMc+"&itemsPerPage="+dataService.itemsPerPage;
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

    // 重新获取数据条目
    var reGetProducts = function(){
    	dataService.itemsPerPage=$scope.paginationConf.itemsPerPage;
    	dataService.currentPage=$scope.paginationConf.currentPage;
	   	if(initService.from=='index'){
	   		$scope.load();
	   	}else{
	   		if(dataService.isChangefair){
	   			dataService.currentPage=$scope.paginationConf.currentPage=1;
	   			dataService.isChangefair=false;
	   		}
	   	//	$scope.paginationConf.currentPage=dataService.currentPage
	   	  // console.info(dataService.type);
	   	   dataService.getSearchPdt(dataService.type,function(data){
	        	$scope.$emit("CtrlDataChange", data);
	   	   });
	   	}

    };

    $rootScope.reGetProducts= $scope.reGetProducts=reGetProducts;

    // 配置分页基本参数
    $scope.paginationConf = {
        currentPage: 1,
        totalItems: 100,
        itemsPerPage: 30,
        pagesLength: 7,
        perPageOptions: [30, 60, 90, 120, 150],
       // rememberPerPage: 'perPageItems',  不存入本地，致使订单中心显示页数收本设置的影响
        rememberPerPage: 'perPageItems-',
    };

    // 通过$watch 当他们一变化的时候，重新获取数据条目 paginationConf.currentPage + paginationConf.itemsPerPage
    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', reGetProducts);

    $scope.ordercenter = function(){
    	//window.location.replace("/fair/ipad/B2B/orderCenter.jsp?loadIdx="+dataService.loadIdx+"&fairid="+dataService.fairid);
    	window.location.href="/fair/ipad/B2B/orderCenter.jsp?loadIdx="+dataService.loadIdx+"&fairid="+dataService.fairid;
    };

    $scope.addFavorite=function(){
    	var url = window.location.host;//window.location;
        var title = '登录晨光B2B';
        var ua = navigator.userAgent.toLowerCase();
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
					alert(title);
					window.sidebar.addPanel(title,url, "");
				} else {
					alert('您的浏览器不支持,请按 Ctrl+D 手动收藏!');
				}

  /*     	var _t,_u;
		if(typeof opts !='object'){
			_t = '晨光B2B';
			_u = window.location.host;
		}else{
			_t='晨光B2B';
			_u= window.location.host;
		}
		try{
			window.external.addFavorite(_u,_t);
		}catch(e){
			if(window.sidebar){
				obj.href=_u;
				obj.title='晨光B2B';
				obj.rel='sidebar';
			}else{
				alert("抱歉，您使用的浏览器无法完成此操作,请使用Ctrl+D进行添加。");
			}
		}*/
    };

    //筛选条件重置
    $scope.reset=function(){

    	for ( var i = 0; i < $scope.filters.length; i++) {
    		if($scope.filters.length-1 == i){
    			var name=document.getElementsByName('price'+i);
    			var price=document.getElementsByName("price");
    			for ( var i = 0; i < price.length; i++) {
    				price[i].value='';
				}

    		}else if(i==4 || i==5){
    			var name=document.getElementsByName('new'+i);
    		}else{
    			var name=document.getElementsByName('form'+i);
    		}
        	for ( var j = 0; j < name.length; j++) {
        		if(j==0){
        			name[j].className='checked';
        		}else{
        			name[j].className='';
        		}
    	    }
		}

    	dataService.dim_color=null;
    	dataService.dim_format=null;
    	dataService.dim_series=null;
    	dataService.dim_functionality=null;
    	dataService.dim_school_term=null;
    	dataService.dim_month=null;
    	dataService.dim_price=null;

    	dataService.isChangefair=true;
    	$scope.reGetProducts();
    };

    $scope.priceOne='';
    $scope.priceTwo='';
    //价格区间确认按钮
    $scope.priceSubmit=function(priceOne,priceTwo){
    	var name=document.getElementsByName('price'+($scope.filters.length-1));
    	for ( var i = 0; i < name.length; i++) {
    		if(i==0){
    			if(priceOne=='' && priceTwo==''){
    				name[i].className='checked';
    				dataService.dim_price=null;
                }else{
                	name[i].className='';
                }
    		}else{
    			name[i].className='';
    		}
		}
    	//console.info(priceOne+","+priceTwo);
    	  dataService.dim_price='priceactual';
    	  dataService.dim_price_val1=priceOne;
		  dataService.dim_price_val2=priceTwo;

		  dataService.isChangefair=true;
	      $scope.reGetProducts();
    };

   // $rootScope.isNewShow=dataService.fairtype=='new'?true:false;

    //点击筛选条件
    $scope.form_change=function(index,names,dim,value,val){
    	//console.info(value);
    	var name=document.getElementsByName(names);
    	for ( var i = 0; i < name.length; i++) {
    		if(index==i){
    			name[index].className='checked';
    		}else{
    			name[i].className='';
    		}
	    }

    	if(names.indexOf('price')>-1){
    		var price=document.getElementsByName("price");
    		for ( var i = 0; i < price.length; i++) {
    			price[i].value='';
    		}

    	   if(value!=null){
    		   var price1= value.split('~')[0];
    		   var price2= value.split('~')[1];

    		   dataService.dim_price_val1=price1;
    		   dataService.dim_price_val2=price2;
    	   }else{
    		   dataService.dim_price_val1=value;
    		   dataService.dim_price_val2=value;
    	   }
    	}
      //  console.info(value);
    	if(dim=='color'){
    		if(value==null && val==null){
    			dataService.dim_color=null;
        		dataService.dim_color_val=null;
    		}else{
    			dataService.dim_color='mp.alias_'+dim;
        		dataService.dim_color_val="'"+val+"'";
    		}
    	}else if(dim=='dim6'){
    		if(value==null){
    			dataService.dim_format=null;
        		dataService.dim_format_val=null;
    		}else{
    			dataService.dim_format='mp.m_'+dim+'_id';
        		dataService.dim_format_val=value;
    		}
    	}else if(dim=='dim9'){
    		if(value==null){
    			dataService.dim_series=null;
        		dataService.dim_series_val=null;
    		}else{
    			dataService.dim_series='mp.m_'+dim+'_id';
        		dataService.dim_series_val=value;
    		}
    	}else if(dim=='dim7'){
    		if(value==null){
    			dataService.dim_functionality=null;
        		dataService.dim_functionality_val=null;
    		}else{
    			dataService.dim_functionality='mp.m_'+dim+'_id';
        		dataService.dim_functionality_val=value;
    		}
    	}else if(dim=='dim8'){
    		if(value==null){
    			dataService.dim_school_term=null;
        		dataService.dim_school_term_val=null;
    		}else{
    			dataService.dim_school_term='mp.m_'+dim+'_id';
        		dataService.dim_school_term_val=value;
    		}
    	}else if(dim=='dim2'){
    		if(value==null){
    			dataService.dim_month=null;
        		dataService.dim_month_val=null;
    		}else{
    			dataService.dim_month='mp.m_'+dim+'_id';
        		dataService.dim_month_val=value;
    		}
    	}else if(dim=='price'){
    		if(value==null){
    			dataService.dim_price=null;
    		}else{
    			dataService.dim_price=dim+'actual';
    		}
    	}

    	//console.info(dataService.type+","+dataService.fairid+","+dataService.categoryfir+","+dataService.categorysec+","+dataService.fairtype+","+dataService.currentPage+","+dataService.itemsPerPage);
    	dataService.isChangefair=true;
    	$scope.reGetProducts();

    };
    
    $scope.selectedMc = [];
    var updateSelected = function(action,id,name){
         if(action == 'add' && $scope.selectedMc.indexOf(id) == -1){
           $scope.selectedMc.push(id);
         }
             
        if(action == 'remove' && $scope.selectedMc.indexOf(id)!=-1){
            var idx = $scope.selectedMc.indexOf(id);
            $scope.selectedMc.splice(idx,1);
        }
        
        dataService.selectedMc = $scope.selectedMc;
       // console.info($scope.selectedMc);
        
        dataService.isChangefair=true;
    	$scope.reGetProducts();
    };
    
    $scope.isSelected = function(id){
         return $scope.selectedMc.indexOf(id)>=0;
    };
    
    $scope.updateSelection = function($event, id){
        var checkbox = $event.target;
        var action = (checkbox.checked?'add':'remove');
        updateSelected(action,id,checkbox.name);
    };
    
    //月单列表下单
    $scope.listOrder=function(){
    	//dataService.fairid;
    //	alert('listOrder');
    	window.open("/fair/ipad/B2B/shoppingCart.jsp?ordertype=month&fairid="+dataService.fairid+"&loadIdx="+dataService.loadIdx);
    };

    //月单EXCEL下单
    $scope.monthOrder=function(type){
    	dataService.monthType=type;
    	dataService.importOrder('importOrder',function(data){
    		  window.open("/nea/core/objext/import_excel.jsp?objectid="+data.b_fo_id+"&table=B2B_B_FOITEMIMP&fixedcolumns="+encodeURIComponent(data.parentid+"="+data.b_fo_id));
    	});
    };

    //日单列表下单
    $scope.dayListOrder=function(){
    	//alert('dayListOrder');
    	window.open("/fair/ipad/B2B/shoppingCart.jsp?ordertype=day&fairid="+dataService.fairid+"&loadIdx="+dataService.loadIdx);
    };

    $scope.dayOrder=function(){
    	dataService.importOrder('dayImportOrder',function(data){
  		  window.open("/nea/core/objext/import_excel.jsp?objectid="+data.b_fo_id+"&table=B2B_B_DFOITEMIMP&fixedcolumns="+encodeURIComponent(data.parentid+"="+data.b_fo_id));
    	});
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
});

main.directive('currentPosition',function($compile,$rootScope,dataService){
	return {
	  	restrict:'E',
	  	replace: true,
        template:'<div></div>',
        link: function(scope,element,attrs){
        	scope.$on("currentposition",function (event, html){
        		element[0].innerHTML='';
        		element.append($compile(html)(scope));
        	});

        	scope.category_click=function(type,fairid,category_fir_id,category_fir_name,category_sec_id,category_sec_name){
        	//	console.info(type+","+fairid+","+category_fir_id);
        		console.info(category_fir_id+"--"+category_sec_id)
        		dataService.fairid=fairid;
        		dataService.categoryfir=category_fir_id;
        		dataService.categorysec=category_sec_id;
        		dataService.categorythr=null;
        		dataService.categorysec = null;
        		dataService.type=type;
        		dataService.isChangefair=true;
        		dataService.getSearchPdt(type,function(data){
        		//	console.info(data);
    				scope.$emit("CtrlDataChange", data);

    				if(category_fir_id==null && category_sec_id==null){
    				//	console.info(123)
    					scope.$emit("CtrlCurrentPosition", '<span>'+dataService.currentfair.fairname+'</span>');
    				}else if(category_fir_id!=null && category_sec_id==null){
    					var html='<span ng-click="category_click(\''+type+'\','+dataService.currentfair.fairid+',null,null,null,null)" style="color: red;background-color: #fff;">'+dataService.currentfair.fairname+'</span> > <span>'+category_fir_name+'</span>';
    					scope.$emit("CtrlCurrentPosition", html);
    				}else{
    					var html='<span ng-click="category_click(\''+type+'\','+dataService.currentfair.fairid+',null,null,null,null)" style="color: red;background-color: #fff;">'+dataService.currentfair.fairname+'</span> > <span ng-click="category_click(\''+type+'\','+dataService.currentfair.fairid+','+category_fir_id+',\''+category_fir_name+'\',null,null)" style="color: red;background-color: #fff;">'+category_fir_name+'</span> > <span>'+category_sec_name+'</span>';
    					scope.$emit("CtrlCurrentPosition", html);
    				}
    			});
        	};
        }
	};
});
main.directive('whenScrolled', function($rootScope,dataService,initService) {

   return function(scope, elm, attr) {
      /* var raw = elm[0];
       elm.bind('scroll', function () {
           if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
               scope.$apply(attr.whenScrolled);
           }
       });*/

       dataService.num=0;
       dataService.rankIndex=-1;
       	scope.orderBy=function orderBy(index,name){
       	  	var order=document.getElementsByName("order");
	       	for ( var i = 0; i < order.length; i++) {
				order[i].className="";

				order[i].innerHTML=order[i].getAttribute('value');
			}
	       	order[index].className= "cur";

       		if(dataService.rankIndex==index){
       			dataService.num++;
       			if(dataService.num % 2 == 0){
       				//dataService.order=" order by "+name+" desc";
       				if(index != 0){
       					dataService.order=name+" desc";
       					order[index].innerHTML=order[index].getAttribute('value')+"↓";
       				}else{
       					dataService.order=name;
       					order[index].innerHTML=order[index].getAttribute('value');
       				}
       			}else{
       				//dataService.order=" order by "+name;
       				dataService.order=name;
       				if(index != 0){
       					order[index].innerHTML=order[index].getAttribute('value')+"↑";
       				}else{
       					order[index].innerHTML=order[index].getAttribute('value');
       				}
       			}
       		}else{
       			dataService.num=0;
       			dataService.rankIndex=index;

       			//dataService.order=" order by "+name+" desc";

       			if(index != 0){
       				dataService.order=name+" desc";
       				order[index].innerHTML=order[index].getAttribute('value')+"↓";
   				}else{
   					dataService.order=name;
   					order[index].innerHTML=order[index].getAttribute('value');
   				}

       		}

	       //	scope.order=name;
	      // 	dataService.order=" order by "+name;
	      /* 	dataService.isRankList=false;*/
	       	initService.from='main';
	       	dataService.isChangefair=true;
	      // 	console.info(dataService.currentPage);
	      /*  dataService.getSearchPdt(dataService.type,function(data){
	        	// scope.$emit("CtrlRankList", data);
	        	 scope.$emit("CtrlDataChange", data);
            });*/
	       	$rootScope.reGetProducts();
        };

   };

});

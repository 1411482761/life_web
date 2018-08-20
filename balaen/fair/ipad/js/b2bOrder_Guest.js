
var app = angular.module('app');
var o_data;
var d_Object;
var mycells;
//var default_value=new Object();
var myTable=new Array();
var values=new Object();
var input_rows_cols=new Array();
var table_id;
var sql='1=1';
var desc="";
var exp="";
var fairid;
var isSupply="none";

app.controller('MyCtrl', function($scope,rest,$rootScope,$window) {
	//test

    $scope.height=window.screen.availHeight;
	$scope.load = VIEWS_LOCALE.main.loading;
	$scope.sessionkey = "";
	$scope.pdtid = "";
	$scope.data = rest;
	$scope.loading=false;
	$scope.wrapper=false;
    $scope.data.init(null,null,'/servlets/binserv/Fair');
    $scope.elem = {option:0};
    $rootScope.sql = sql;
    //getsheet切换页面
    $scope.toggle = function(index,type){
		//$scope.loading=true;
		$scope.funcs=new Array();
		$scope.table=new Array();
	  };


});

//主列表控制器,嵌套在MyCtrl控制器中
//$scope:当前作用域，继承MyCtrl的作用域;rest:rest服务注入，内部封装了$http请求服务;$init：存储页面请求参数的服务;$rootScope：顶层作用域
//$rootScope中用于各个模块共享的数据有： orderid:订单编号,total:列表的总页数,page：当前页码数,pageCnt:每页显示条目数
app.controller('ListCtrl',function($scope,rest,init,$rootScope,$window){
	$scope.req=rest;

	$rootScope.orderid=init.orderid;
	$rootScope.total=1;
	$rootScope.page=1;
	$scope.pdtHeight=screen.availHeight-340;
	$rootScope.pageCnt=parseInt($scope.pdtHeight/60);
	$rootScope.cellHeight=60;
	$rootScope.isEndUser = init.isEndUser;
    $rootScope.localQry='N';
	$scope._pageCnt=$rootScope.pageCnt;
	//b2b查询参数
	$rootScope.fairid=init.fairid;
	$rootScope.querytype=init.type;
	$rootScope.categoryfir=init.categoryfir;
	$rootScope.categorysec=init.categorysec;
  $rootScope.categorythr=init.categorythr;
	$rootScope.fairtype=init.fairtype=="null"?"singleMonth":init.fairtype;
	$rootScope.dim1=init.dim1;
	$rootScope.dim2=init.dim2;
  $rootScope.dim3=init.dim3;
    $rootScope.transindex=init.index+((init.curpage==null?1:init.curpage)-1)*(init.itemsPerPage==null?50:init.itemsPerPage);
    $rootScope.orderby=init.orderby;
    $scope.isRecent=init.isRecent;
    $scope.pdtid=init.pdtid;
    $scope.orderid=init.orderId;
    $scope.jumpPage=1;
	$scope.pdts={};
    $scope.req.init(null,null,'/servlets/binserv/Fair');
    $scope.pdtHtml="";
    $scope.imgHtml="";
    $scope.sql='1=1';
    $scope.desc="";
    $rootScope.loadIdx=init.loadIdx;
    $scope.isfav="favorite";



  //获取请求页数据方法定义 page：请求的页码序号，pageCnt：每页条目数,orderid：订单id,sessionkey:用于登录验证，index:当前页中选中的条目序号
    //此方法属于$rootScope作用域 用于模块间共享
    $rootScope.load= function(page,pageCnt,sessionkey,sql,desc){
		var trans =
		{'id': 1,
	     'command': 'com.agilecontrol.fair.FairCmd',
	     'params': {
	     	cmd: "B2bOrderList_Guest",
	     	page:page,
	     	pageCnt:pageCnt,
	     	myindex:$rootScope.index==null?0:$rootScope.index,
	     	transindex:$rootScope.transindex,
	     	orderby:$rootScope.orderby,
	     	sessionkey:sessionkey,
	     	desc:desc,
	     	querytype:$rootScope.querytype,
	     	fairId:$rootScope.fairid,
	     	fairtype:$rootScope.fairtype,
	     	dim1:$rootScope.dim1,
	     	dim2:$rootScope.dim2,
        dim3:$rootScope.dim3,
	     	categoryfir:$rootScope.categoryfir,
	     	categorysec:$rootScope.categorysec,
        categorythr:$rootScope.categorythr,
	     	pdtid:$scope.pdtid==null?-1:$scope.pdtid,
	     	orderid:$scope.orderid==null?-1:$scope.orderid,
	     	isSupply:isSupply,
	     	b2b_params:init.b2b_params,
	     	top_name:init.top_name,
	     	localQry:$rootScope.localQry,
        selectedMc:init.selectedMc,
	     	operation:"getPdt",
	     }
	 };

		$scope.req.sendOneRequest(trans,function(response){
			var data = response.data[0].result;
			if(data==null)
				{
				   alert(response.data[0].message);
				   return;
				}
/*			$scope.allsku=data.allsku;
			$scope.allqty=data.allqty;
			$scope.allamt=data.allamt;*/
			$scope.pdts = data.pdt;
			if(jQuery("#listhead").next("p")!=undefined){
				jQuery("#listhead").next("p").remove();
			}
			if(data.pdt.length==0){
				jQuery("#listhead").after("<p>暂无数据!</p>")
				return;
			}
      $scope.$parent.loading=false;
      $scope.$parent.wrapper=true;
			fairid = data.fairid;
			$rootScope.total = data.totalpage;
            if(data.index!=-1){
            	$rootScope.page=data.page;
            	$rootScope.index=data.index;
            	$scope.jumpPage=data.page;
            }
            else
            	$rootScope.index=0;
			$scope.allamt = data.orderhtml.allamt;
            $scope.handle($scope.pdts,$rootScope.index,$scope.orderhtml);

		});
    };
    $rootScope.load($rootScope.page,$rootScope.pageCnt,$rootScope.sessionkey,$scope.sql,"");

    //将获取的数据加载到页面 data：获取的数据,index：当前页选中的条目序号
    $scope.handle = function(data,index,order){
		$scope.pdtHtml = data[index].html;
		var imageArray = data[index].image;
		var hurl = data[index].imageurl;
		var images = new Array();
		$scope.murl="/pdt/m/"+imageArray[0];
		for(var i=0;i<imageArray.length;i++){
			var t = {
				surl:"/pdt/s/"+imageArray[i]
			}
			images.push(t);
		}
		$scope.images=images;
		if(null==hurl||hurl==undefined) $scope.imageurl=[];
		else{
           $scope.hurl=hurl.split('/');
           }
		//$scope.imgHtml = "<img style='height:100%' src='/pdt/m/"+data[index].image+"'/>";

		jQuery('#pdtinfor').html($scope.pdtHtml);
		//jQuery('#pdtpic').html($scope.imgHtml);
		$scope.$parent.pdtid = data[index].id;
		$scope.$parent.sessionkey = $rootScope.sessionkey;

		//调用MyCtrl模块的方法来显示矩阵
		toggleStyle(index);
    };



	//切换商品 index:选中的商品在列表中的序号
	$scope.togglePdt = function(index,node){
    node.target.focus();
			$rootScope.index = index;
	    $rootScope.transindex=null;
    //  $rootScope.load($rootScope.page,$rootScope.pageCnt,$rootScope.sessionkey,$scope.sql,"");
    $scope.handle($scope.pdts,$rootScope.index,$scope.orderhtml);

	};
	$rootScope.enterSearch=function(e){
		if(e.keyCode=='13'){
			$scope.search();
		}
	};


	$scope.search = function(){
		$rootScope.pageCnt=$scope._pageCnt;
		$rootScope.transindex=null;
        if(sql!='1=1')
    	  {
    	    desc="";
    	    $scope.desc=desc;
    	  }

		$scope.sql= sql;

		$rootScope.sql = $scope.sql;

         $rootScope.index=0;
         $rootScope.page=1;
         //搜索则重置条件搜索当前活动的所有商品，fairid可区分日单和月单商品 2015.11.27
         $rootScope.querytype='search';
         $rootScope.localQry = 'Y';
		 $rootScope.load(1,$rootScope.pageCnt,$rootScope.sessionkey,$scope.sql,$scope.desc);

		sql = '1=1';
	    desc=$scope.desc;
	    $scope.desc="";
	    $scope.sql='1=1';
		exp = "";
		jQuery("#pdt_desc").val("");
		jQuery("#pdt_desc").attr('readonly',false);

	};

    $scope.refresh=function(){
        if($scope.jumpPage>$rootScope.total||$scope.jumpPage<1){
    		alert("页码超出范围");
    		$scope.jumpPage=$rootScope.page;
    		 $rootScope.load($rootScope.page,$scope._pageCnt,$rootScope.sessionkey,$scope.sql,desc);
    		return;
    	}
    	else{
    	     $rootScope.load($scope.jumpPage,$scope._pageCnt,$rootScope.sessionkey,$scope.sql,desc);
    	     $rootScope.page=$scope.jumpPage;
    	     $rootScope.pageCnt=$scope._pageCnt;
    	}
    }

	//翻页控制
	$scope.start=function(){
					$rootScope.pageCnt=$scope._pageCnt;
	    if($rootScope.page==1){
	    	alert('已经是第一页');
	    }
	    else{
            	$rootScope.page=1;
		    	    $scope.jumpPage=$rootScope.page;
	            $rootScope.transindex=null;
		          $rootScope.index = 0;
            }
      $rootScope.load(1,$rootScope.pageCnt,$rootScope.sessionkey,$scope.sql,desc);
	};
	$scope.back=function(){
					$rootScope.pageCnt=$scope._pageCnt;
		    if($rootScope.page==1)
		    	alert('已经是第一页');
		    else{
		    	$rootScope.page = $rootScope.page-1;
		    	$scope.jumpPage=$rootScope.page;
	            $rootScope.transindex=null;
	        	$rootScope.index = 0;
		    }
		     $rootScope.load($rootScope.page,$rootScope.pageCnt,$rootScope.sessionkey,$scope.sql,desc);

	};
	$scope.next=function(){
					$rootScope.pageCnt=$scope._pageCnt;
		    if($rootScope.page==$rootScope.total)
		    	alert('已经是最后一页');
		    else{
		    	$rootScope.page = $rootScope.page+1;
		    	$scope.jumpPage=$rootScope.page;
	         $rootScope.transindex=null;
		       $rootScope.index = 0;
		    }
		    $rootScope.load($rootScope.page,$rootScope.pageCnt,$rootScope.sessionkey,$scope.sql,desc);
	};
	$scope.end=function(){
					$rootScope.pageCnt=$scope._pageCnt;
	    if($rootScope.page==$rootScope.total)
	    	alert('已经是最后一页');
	    else{
		$rootScope.page = $rootScope.total;
	    $scope.jumpPage=$rootScope.page;
      $rootScope.transindex=null;
		  $rootScope.index = 0;
		}
					    $rootScope.load($rootScope.total,$rootScope.pageCnt,$rootScope.sessionkey,$scope.sql,desc);

	};
	$scope.toggleImage=function(url){
		var t = url.split('/');
		$scope.murl="/pdt/m/"+t[t.length-1];

	};
    $scope.maximum=function(url){
    	var t = url.split('/');
    	jQuery("#mask").addClass("mask");
    	$scope.ispop=true;
    	$rootScope.ismask=true;
    	$rootScope.lurl="/pdt/l/"+t[t.length-1];
    }
    $rootScope.hidepop=function(){
        $scope.ispop=false;
        $rootScope.ismask=false;
    }
    $scope.ordercenter = function(){
    	window.location.replace("/fair/ipad/B2B/orderCenter.jsp?loadIdx="+$rootScope.loadIdx);
    };

});
/*app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
        	//var functionCall = scope.$eval(attrs.ngEnter);
            if(event.which === 13) {
               scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});*/

function toggleStyle(index)
{
	var s="#pdt"+index;
	jQuery('#listtb td').removeClass('selected');
	jQuery(s).addClass('selected');
	}

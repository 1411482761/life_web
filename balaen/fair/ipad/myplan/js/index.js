

/* App Module */

var app = angular.module('app');


/* Controllers */


var allowEnd=true;
app.controller('mainCtrl',function($scope,$http,$location,rest){
	var vm =$scope.vm={
	        plist:[],
	        target:0,//总计划
	        sumA:0,  //计划合计
	        doplan:0,
	        allorder:0, //实际订货合计
	        allprice:0, //吊牌额合计
	        wanprice:0, //吊牌额合计折合成万
	        zhanbi:0,  //占比
	        avgRebate:0, //平均折扣率
	        proAllprice:0 //预估全年吊牌额
	    };
	var md=$scope.md={
	        mlist:[],
	        sumA:0,
	        pnum:0,
	        doplan:0,
	        planOrder:0
	    };
	//提交请求，获取数据
	$scope.data = rest;
    $scope.data.init(null,null,'/servlets/binserv/Fair');
    var trans = {'id': 1, 'command': 'com.agilecontrol.fair.FairCmd', 'params': {cmd: "LoadBudget",type:"loadAll"}};
	$scope.data.sendOneRequest(trans,function(response){
		var data=response.data[0].result;
		if(data==null){
			alert(response.data[0].message);
			return;
		}
		vm.plist=data.data1;
		if(data.data0.length>0){
			vm.target=data.data0[0].sumamt_target;
			vm.zhanbi=data.data0[0].percentage;
			vm.avgRebate=data.data0[0].ave_discourate;
		}
		md.mlist=data.data2;
		
		//初始化页面数据
		for(var i=0; i< vm.plist.length; i++){
	        var price= vm.updatePrice(vm.plist[i].amt_plan, vm.plist[i].discount);
	        vm.plist[i].amt_list=price;
	    }
		for ( var i = 0; i < md.mlist.length; i++) {
			md.mlist[i].brandkey="a"+md.mlist[i].dimid1+"b";
		}
		var sum=0;
	    var pri=0;
	    var all=0;
	    for(var i=0; i< vm.plist.length; i++){
	    	sum=sum+parseFloat(vm.plist[i].amt_plan);
	        pri=pri+parseFloat(vm.plist[i].amt_list);
	        all=all+vm.plist[i].amt;
	    }
	    vm.sumA=sum.toFixed(2);
	    vm.allorder=all.toFixed(2);
	    vm.allprice=pri.toFixed(2);
	});
	
	
    $scope.mhide=true;
    //分解与返回切换显示
    $scope.mtoggle=function(pid,pnum,pname){
        $scope.mhide=!$scope.mhide;
        $scope.pid=pid;
        $scope.bkey="a"+pid+"b";
        $scope.pnum=pnum;
        $scope.pname=pname;
        var sum=0;
        var order=0;
        for ( var i = 0; i < md.mlist.length; i++) {
			if (md.mlist[i].dimid1==pid) {
				sum+=parseFloat(md.mlist[i].amtitem_plan);
				order+=md.mlist[i].amt;
			}
		}
        md.sumA=sum.toFixed(2);
        md.planOrder=order.toFixed(2);
    };
    //返回时初始化主页数据
    $scope.mback=function(sum){
    	$scope.mhide=!$scope.mhide;
    	for(var i=0; i< vm.plist.length; i++){
            if(vm.plist[i].m_dim_id==$scope.pid){
            	if (sum!=vm.plist[i].amt_plan) {
					var flag= confirm("当前品牌的模块总和与您之前所定的品牌计划不一致，返回会更新为当前值，是否确定？");
					if (flag) {
						vm.plist[i].amt_plan=parseFloat(sum);
					}else{
						$scope.mhide=!$scope.mhide;
						return;
					}
				}else{
					vm.plist[i].amt_plan=parseFloat(sum);
				}
            }
        }
    	var pri=0;
	    var all=0;
	    var sum=0;
	    for(var i=0; i< vm.plist.length; i++){
	        sum=sum+parseFloat(vm.plist[i].amt_plan);
	        pri=pri+parseFloat(vm.plist[i].amt_list);
	        all=all+vm.plist[i].amt;
	    }
	    vm.sumA=sum.toFixed(2);
	    vm.allorder=all.toFixed(2);
	    vm.allprice=pri.toFixed(2);
	    
    	
    };
  //主页计划改变时算出总和
    vm.change=function(pid){
        var sum=0;
        var pri=0;
        for(var i=0; i< vm.plist.length; i++){
        	if (vm.plist[i].amt_plan==undefined || typeof(vm.plist[i].amt_plan)!="number" || vm.plist[i].amt_plan==null) {
        		vm.plist[i].amt_plan=0;
			}
            sum=sum+parseFloat(vm.plist[i].amt_plan);
            if (vm.plist[i].m_dim_id==pid) {
            	vm.plist[i].amt_list=vm.updatePrice(vm.plist[i].amt_plan, vm.plist[i].discount);
			}
            pri=pri+parseFloat(vm.plist[i].amt_list);
        }
        vm.sumA=sum.toFixed(2);
        vm.allprice=pri.toFixed(2);
        allowEnd=false;
    };
    //本季占比改变--显示预估全年吊牌额
    vm.zhanbiChange=function(num1,num2){
        var con=num1/(num2*0.01);
        var ret = isFinite(con);
        if(!ret){
            con=0;
        }
        return con.toFixed(2);
    };
    //品牌计划改变--更新计划订货吊牌额
    vm.updatePrice=function(n1,n2){
        var con=n1/(n2*1);
        var ret = isFinite(con);
        if(!ret){
            con=0;
        }
        return con.toFixed(2);
    };
    //全年平均折扣率
    vm.rebateChange=function(num1,num2){
        var con=num1*num2;
        var ret = isFinite(con);
        if(!ret){
            con=0;
        }
        return con.toFixed(2);
    };
    //计算num1与num2的百分比
    vm.finished=function(num1,num2){
        var con=Math.round(num1 / num2 * 10000)/100.00;
        var ret = isFinite(con);
        if(!ret){
            con=0;
        }
        return con.toFixed(2);
    };
  //模块列表计划改变时更新总和
    md.change=function(dimid){
        var sum=0;
        for(var i=0; i< md.mlist.length; i++){
        	if (md.mlist[i].amtitem_plan==undefined || typeof(md.mlist[i].amtitem_plan)!="number" || md.mlist[i].amtitem_plan==null) {
        		md.mlist[i].amtitem_plan=0;
			}
        	if(md.mlist[i].dimid1==dimid){
        		sum=sum+parseFloat(md.mlist[i].amtitem_plan);
        	}
        }
        md.sumA=sum.toFixed(2);
        allowEnd=false;
    };
    $scope.notEnd=function(){
    	allowEnd=false;
    }
    //保存
    $scope.success=function(){
    	var fin=confirm("确定保存吗？");
    	if (fin) {
    		var flag=true;
    		for ( var i = 0; i < vm.plist.length; i++) {
    			var num=0;
    			for ( var j = 0; j < md.mlist.length; j++) {
    				if (vm.plist[i].m_dim_id==md.mlist[j].dimid1) {
    					num+=md.mlist[j].amtitem_plan;
    				}
    			}
    			if (vm.plist[i].amt_plan!=num.toFixed(2)) {
    				flag=false;
    				break;
    			}
    		}
    		if (flag) {
    			var data1={"target":vm.target,"plan":vm.sumA,"percentage":vm.zhanbi,"discount":vm.avgRebate};
    			var trans = {'id': 1, 'command': 'com.agilecontrol.fair.FairCmd', 'params': {cmd: "SaveBudget",type:"saveAll",one:data1,two:vm.plist,three:md.mlist}};
    			$scope.data.sendOneRequest(trans,function(response){
    				allowEnd=true;
    				alert(response.data[0].message);
    			});
    		}else{
    			alert("有品牌计划与其模块计划总和不一致，请完成分解！");
    		}
		}
    };
    //进入模块
    md.gotoModule=function(mname){
    	var pname=$scope.pname;
			var flag=true;
    		for ( var i = 0; i < vm.plist.length; i++) {
    			var num=0;
    			for ( var j = 0; j < md.mlist.length; j++) {
    				if (vm.plist[i].m_dim_id==md.mlist[j].dimid1) {
    					num+=md.mlist[j].amtitem_plan;
    				}
    			}
    			if (vm.plist[i].amt_plan!=num.toFixed(2)) {
    				flag=false;
    				break;
    			}
    		}
    	if (!flag) {
    		alert("有品牌计划与其模块计划总和不一致，请完成分解！");
    		return;
    	}	
		var cho= confirm("正在跳转下一操作，本界面数据将自动保存，是否继续？");
		if (cho) {
			for(var a=0; a< vm.plist.length; a++){
			   if(vm.plist[a].m_dim_id==$scope.pid){
			       if (md.sumA!=vm.plist[a].amt_plan) {
			    	   vm.plist[a].amt_plan=parseFloat(md.sumA);
			       }
			       var data1={"target":vm.target,"plan":vm.sumA,"percentage":vm.zhanbi,"discount":vm.avgRebate};
			       var trans = {'id': 1, 'command': 'com.agilecontrol.fair.FairCmd', 'params': {cmd: "SaveBudget",type:"saveAll",one:data1,two:vm.plist,three:md.mlist}};
			       $scope.data.sendOneRequest(trans,function(response){
			    		allowEnd=true;
			    		window.location.href="fairapp://display?settype=vm&dim1="+pname+"&dim2="+mname;
			       });
			    	return;
			   }
			 }
		}
    };
   //订单编辑
    md.gotoEdit=function(mname){
    	var pname=$scope.pname;
			var flag=true;
    		for ( var i = 0; i < vm.plist.length; i++) {
    			var num=0;
    			for ( var j = 0; j < md.mlist.length; j++) {
    				if (vm.plist[i].m_dim_id==md.mlist[j].dimid1) {
    					num+=md.mlist[j].amtitem_plan;
    				}
    			}
    			if (vm.plist[i].amt_plan!=num.toFixed(2)) {
    				flag=false;
    				break;
    			}
    		}
    	if (!flag) {
    		alert("有品牌计划与其模块计划总和不一致，请完成分解！");
    		return;
    	}	
		var cho= confirm("正在跳转下一操作，本界面数据将自动保存，是否继续？");
		if (cho) {
			for(var a=0; a< vm.plist.length; a++){
			   if(vm.plist[a].m_dim_id==$scope.pid){
			       if (md.sumA!=vm.plist[a].amt_plan) {
			    	   vm.plist[a].amt_plan=parseFloat(md.sumA);
			       }
			       var data1={"target":vm.target,"plan":vm.sumA,"percentage":vm.zhanbi,"discount":vm.avgRebate};
			       var trans = {'id': 1, 'command': 'com.agilecontrol.fair.FairCmd', 'params': {cmd: "SaveBudget",type:"saveAll",one:data1,two:vm.plist,three:md.mlist}};
			       $scope.data.sendOneRequest(trans,function(response){
			    		allowEnd=true;
			    		window.location.href="fairapp://web/fair/ipad/orderdetails.jsp?dim1="+encodeURIComponent(pname)+"&dim2="+encodeURIComponent(mname);
			       });
			    	return;
			   }
			 }
		}
    };
});

function AppBrowserClose(){
	var allowInfo=null;
	if (allowEnd) {
		return allowInfo;
	}else{
		var flag= confirm("您当前数据有误，仍然关闭当前窗口？");
		if (flag) {
			return allowInfo;
		}else{
			allowInfo="请修改当前计划！";
				return allowInfo;
		}
	}
}


//service












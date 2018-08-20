var app = angular.module('budget', [ 'ngRoute', 'app' ]);

app.config(function($routeProvider, $httpProvider) {
			if (!$httpProvider.defaults.headers.get) {
				$httpProvider.defaults.headers.get = {};
			}
			$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
			$httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
			$httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
			$routeProvider.when('/:sessionkey', {
				templateUrl : 'main.html',
				controller : 'MainCtrl',
			}).when('/item/:funitid/:isedit/:fname/:sessionkey', {
				templateUrl : 'item.html',
				controller : 'ItemCtrl'
			});
		});

app.controller('MainCtrl', function($scope, $http, $route, $routeParams,
		$location, rest) {
	$scope.sessionkey=$routeParams.sessionkey;
	$scope.goback=function(){
		window.location.replace("/fair/ipad/kpi.jsp?sessionkey="+$scope.sessionkey);
	};
	$scope.doSubmit=function(){
		var flag=confirm("确认提交吗？");
		if(flag){
			if($scope.sumAmt===$scope.sumxAmt){
				var trans = {
						'id' : 1,
						'command' : 'com.agilecontrol.fair.FairCmd',
						'params' : {
							cmd : "Budget",
							type : "doSubmit",
							funitid:$scope.pfunit.funitid
						}
				};
				rest.sendOneRequest(trans, function(response) {
					/*var msg = response.data[0].result.message;*/
				});
				$scope.getData();
			}else{
				alert("修改后的总提报金额与原有总提报金额不一致，请校验后再提交！");
			}
		}
	};
	$scope.doRatify=function(){
		var flag=confirm("确认批准吗？");
		if(flag){
			var trans = {
					'id' : 1,
					'command' : 'com.agilecontrol.fair.FairCmd',
					'params' : {
						cmd : "Budget",
						type : "doRatify",
						funitid:$scope.pfunit.funitid
					}
			};
			rest.sendOneRequest(trans, function(response) {
				/*var msg = response.data[0].result.message;
				alert(msg);*/
				$scope.getData();
			});
		}
	};
	$scope.doReject=function(){
		var flag=confirm("确认驳回吗？");
		if(flag){
			var trans = {
					'id' : 1,
					'command' : 'com.agilecontrol.fair.FairCmd',
					'params' : {
						cmd : "Budget",
						type : "doReject",
						funitid:$scope.pfunit.funitid
					}
			};
			rest.sendOneRequest(trans, function(response) {
				/*var msg = response.data[0].result.message;
				alert(msg);*/
				$scope.getData();
			});
		}
	};
	$scope.goItem=function(f){
		if($scope.edit){
			if(f.status==1){
				$scope.edit=true;
			}else{
				$scope.edit=false;
			}
		}
		window.location.href="#/item/"+f.funitid+"/"+$scope.edit+"/"+f.truename+"/"+$scope.sessionkey;
	};
	$scope.doReset=function(){
		var flag=confirm("确认初始化所有数据吗？");
		if(flag){
			var trans = {
					'id' : 1,
					'command' : 'com.agilecontrol.fair.FairCmd',
					'params' : {
						cmd : "Budget",
						type : "doReset",
						funitid:$scope.pfunit.funitid
					}
			};
			rest.sendOneRequest(trans, function(response) {
				/*var msg = response.data[0].result.message;
				alert(msg);*/
				$scope.getData();
			});
		}
	};
	rest.init(null, null, '/servlets/binserv/Fair');
	var trans = {
		'id' : 1,
		'command' : 'com.agilecontrol.fair.FairCmd',
		'params' : {
			cmd : "Budget",
			type : "loadAll"
		}
	};
	rest.sendOneRequest(trans, function(response) {
		var data = response.data[0].result;
		$scope.fsubmit = false;
		$scope.fratify = false;
		$scope.freject = false;
		$scope.freset = false;
		$scope.edit = false;
		if (data.puser.name === "buyers") {
			if(data.puser.u_mark<=3 && data.pfunit.bf_mark<=3){
				if (data.pfunit.status === "0" || data.pfunit.status === "2" || data.pfunit.status === "3") {
					$scope.fsubmit = true;
					$scope.edit = true;
				}
				if(data.pfunit.status === "0"){
					$scope.freset = true;
				}
			}else{
				return;
			}
		} else if (data.puser.name === "buyermng") {
			if(data.pfunit.u_name===data.puser.u_name){
				if (data.pfunit.bf_mark <= 3 && data.pfunit.status === "1") {
					$scope.fratify = true;
					$scope.freject = true;
				}/*else if (data.pfunit.bf_mark === 2 && data.pfunit.status === "2") {
					$scope.freject = true;
				}*/
			}else{
				return;
			}
		}
		$scope.flist = data.flist;
		$scope.pfunit = data.pfunit;
		$scope.puser = data.puser;
		var num=0;
		var num1=0;
		for ( var i = 0; i < $scope.flist.length; i++) {
			num=num+parseFloat($scope.flist[i].amt);
			num1=num1+parseFloat($scope.flist[i].xamt);
		}
		$scope.sumAmt=num.toFixed(2);
		$scope.sumxAmt=num1.toFixed(2);
	});
	$scope.getData=function(){
		rest.init(null, null, '/servlets/binserv/Fair');
		var trans = {
			'id' : 1,
			'command' : 'com.agilecontrol.fair.FairCmd',
			'params' : {
				cmd : "Budget",
				type : "loadAll"
			}
		};
		rest.sendOneRequest(trans, function(response) {
			var data = response.data[0].result;
			$scope.fsubmit = false;
			$scope.fratify = false;
			$scope.freject = false;
			$scope.edit = false;
			if (data.puser.name === "buyers") {
				if(data.puser.u_mark<=3 && data.pfunit.bf_mark<=3){
					if (data.pfunit.status === "0" || data.pfunit.status === "2" || data.pfunit.status === "3") {
						$scope.fsubmit = true;
						$scope.edit = true;
					}
					if(data.pfunit.status === "0"){
						$scope.freset = true;
					}
				}else{
					return;
				}
			} else if (data.puser.name === "buyermng") {
				if(data.pfunit.u_name===data.puser.u_name){
					if (data.pfunit.bf_mark <= 2 && data.pfunit.status === "1") {
						$scope.fratify = true;
						$scope.freject = true;
					}/*else if (data.pfunit.bf_mark === 2 && data.pfunit.status === "2") {
						$scope.freject = true;
					}*/
				}else{
					return;
				}
			}
			$scope.flist = data.flist;
			$scope.pfunit = data.pfunit;
			$scope.puser = data.puser;
			var num=0;
			var num1=0;
			for ( var i = 0; i < $scope.flist.length; i++) {
				num=num+parseFloat($scope.flist[i].amt);
				num1=num1+parseFloat($scope.flist[i].xamt);
			}
			$scope.sumAmt=num.toFixed(2);
			$scope.sumxAmt=num1.toFixed(2);
		});
	};
});
app.controller('ItemCtrl', function($scope, $http, $route, $routeParams,
		$location, rest) {
	$scope.checkAmt=function(item){
		var num=item.xamt.toFixed(2);
		item.xamt=parseFloat(num);
	}
	$scope.backSave=function(){
		if($scope.isedit){
			for ( var i = 0; i < $scope.items.length; i++) {

				if($scope.items[i].xamt == null || $scope.items[i].xamt=="null" || $scope.items[i].xamt == undefined || $scope.items[i].xamt == ""){
					$scope.items[i].xamt=0;
				}
				$scope.items[i].xamt=$scope.items[i].xamt*100;
			}
			var trans = {
					'id' : 1,
					'command' : 'com.agilecontrol.fair.FairCmd',
					'params' : {
						cmd : "Budget",
						type : "backSave",
						items:$scope.items
					}
			};
			rest.sendOneRequest(trans, function(response) {
				//var msg = response.data[0].result.message;
				window.location.href="#/"+$scope.sessionkey;
			});
		}else{
			window.location.href="#/"+$scope.sessionkey;
		}
	};
	$scope.fname=$routeParams.fname;
	$scope.sessionkey=$routeParams.sessionkey;
	$scope.isedit=false;
	var funitid=$routeParams.funitid;
	var edit=$routeParams.isedit;
	if(edit==true || edit=="true"){
		$scope.isedit=true;
	}else{
		$scope.isedit=false;
	}
	rest.init(null, null, '/servlets/binserv/Fair');
	var trans = {
		'id' : 1,
		'command' : 'com.agilecontrol.fair.FairCmd',
		'params' : {
			cmd : "Budget",
			type : "loadItem",
			funitid:funitid
		}
	};
	rest.sendOneRequest(trans, function(response) {
		$scope.items = response.data[0].result.items;
		$scope.getSum=function(){
			var num=0;
			var num1=0;
			for ( var i = 0; i < $scope.items.length; i++) {
				num=num+parseFloat($scope.items[i].amt);
				num1=num1+parseFloat($scope.items[i].xamt);
			}
			$scope.sumAmt=num.toFixed(2);
			$scope.sumxAmt=num1.toFixed(2);
			return num.toFixed(2);
		};
	});
});

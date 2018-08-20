<%@ page language="java" pageEncoding="utf-8"%>
<%@ page import="java.util.*,org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals"%>
<html ng-app="app">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<%
	UserWebImpl userWeb =null;
	Locale locale=null;
	try{
		userWeb= ((UserWebImpl)WebUtils.getSessionContextManager(session).getActor(WebKeys.USER));
		locale=userWeb.getLocale();System.out.println("########## found userWeb=null##########221"+locale.toString());
	}catch(Throwable userWebException){
		System.out.println("########## found userWeb=null##########"+userWebException);
		locale=TableManager.getInstance().getDefaultLocale();
	}
	Date date = new Date();
	String id = request.getParameter("id");
	/* JSONArray ja=QueryEngine.getInstance().doQueryJSONArray("select id,name from m_product",new Object[]{}); */
%>
<script type="text/javascript" src="/fair/ipad/js/locale/locale_<%=locale.toString()%>.js"></script>
<link type="text/css" rel="stylesheet" href="/nea/core/themes/classic/01/css/portal.css?t=<%=date.getTime() %>">
<script type="text/javascript" src="/fair/ipad/js/angular.min.js"></script>
<script type="text/javascript" src="/fair/ipad/js/rest.js"></script>

<style type="text/css">
.gridStyle {
	width:90%;
	height:400px;
	overflow: auto;
	margin: 50px auto;
}
tr,td{
	border: 1px solid #A6A6A6;
}
table{
	border: 1px solid rgb(212, 212, 212);
	width: 100%;
	border-collapse:collapse;
}
td{
	width:100px;
	height:30px;
	text-align: center;
}
#loading{
	position: absolute;
    right: -0px;
    top: 0;
	color:red;
	background:red;
	color:#ffffff;
	width:150px;
	height: 30px;
    line-height: 30px;
    text-align: center;
}
#search{
	position: relative;
    left: 20px;
    top: 20;
    width: 300px;
}
</style>
<title></title>
</head>
<body ng-controller="MyCtrl">
	<div ng-hide="loading" id="search">{{search}}<input ng-model=vm.filter></div>
	<div id="loading" ng-show="loading">{{server}}</div>
	<div class='gridStyle'>
		<table  id='mytable'>
	 	<tr ng-repeat="row in myData | filter:vm.filter">
		 	<td >{{row[1]}}</td>
		 	<td ><a href="updatesku.jsp?id={{row[0]}}&sessionkey={{row[2]}}" target="_blank">{{edit}}</a></td> 
	 	</tr>
	</table>
	</div>
</body>
<script type="text/javascript">  
    angular.module('app').controller('MyCtrl', function($scope,rest) {
     $scope.search = VIEWS_LOCALE.itemlist.searchname;
     $scope.server = VIEWS_LOCALE.itemlist.servering;
     $scope.edit = VIEWS_LOCALE.itemlist.edit;
     $scope.data = rest;
     $scope.loading = true;
  	 $scope.data.init(null,null,'/servlets/binserv/Fair');
  		var trans = {'id': 1, 'command': 'com.agilecontrol.fair.MiscCmd', 'params': {cmd: "GetSheetWeb",orderid:<%=id%>}};
  		$scope.data.sendOneRequest(trans,function(response){
    	$scope.myData = response.data[0].result.data;
    	$scope.loading = false;
  		}); 
});
</script>  
</html>


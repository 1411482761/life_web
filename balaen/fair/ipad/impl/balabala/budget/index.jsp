<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	String sessionkey = request.getParameter("sessionkey");
	long time=System.currentTimeMillis();
%>
<!DOCTYPE html>
<html ng-app="budget">
<head lang="en">
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport"
	content="width=device-width initial-scale=1.0 maximum-scale=1.0 user-scalable=yes" />
<title>预算界面</title>
<link rel="stylesheet" href="/fair/ipad/css/bootstrap/bootstrap.min.css">
<link rel="stylesheet" href="/fair/ipad/impl/balabala/budget/css/budget.css?t=<%=time%>">
<script type="text/javascript" src='/fair/ipad/impl/js/angular.min.js'></script>
<script type="text/javascript" src='/fair/ipad/impl/js/angular-route.min.js'></script>
<script type="text/javascript" src="/fair/ipad/js/rest.js"></script>
<script src="/fair/ipad/impl/balabala/budget/js/budget.js?t=<%=time%>"></script> 

</head>
<body>
<%-- <div ng-controller="myCtrl"   ng-init="doInit(<%=sessionkey%>)">
</div> --%>
    <div ng-view></div>
</body>
</html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page
	import="com.agilecontrol.nea.core.web.config.*,org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals"%>
<%@ taglib uri="http://java.fckeditor.net" prefix="FCK"%>
<%@ page import="java.util.*"%>
<%
	UserWebImpl userWeb = null;
	Locale locale = null;
	int userId = 0;
	try {
		userWeb = ((UserWebImpl) WebUtils.getSessionContextManager(
				session).getActor(WebKeys.USER));
		userId = userWeb.getUserId();
	} catch (Throwable userWebException) {
	}
	String date = String.valueOf(new Date().getTime());
	int time = ConfigValues.get("fair.ranklist.refresh.interval", 1);
	int exchange_time = ConfigValues.get(
			"fair.ranklist.exchange.interval", 1);
	int fairid = Integer.parseInt(request.getParameter("fairid"));
%>
<!DOCTYPE html>
<html ng-app="myapp">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport"
	content="width=device-width initial-scale=1.0 maximum-scale=1.0 user-scalable=yes" />
<link rel="stylesheet" href="/fair/ipad/css/bootstrap/bootstrap.min.css">
<link type="text/css" rel="StyleSheet"
	href="/fair/ipad/css/common/caravan.css?=<%=date%>" />
<script src="/fair/ipad/js/AngularJS/angular.min1.4.2.js"></script>
<script type="text/javascript" src="/fair/ipad/js/rest.js"></script>
<script type="text/javascript" src="/fair/ipad/js/caravan.js?=<%=date%>"></script> 
<title>众筹活动</title>
</head>
<body>
	<div ng-controller="myCtrl" ng-init="getShowData('<%=fairid %>')">
		<div class="container" >
			<ul ng-repeat="item in data">
			<li class="cmodel" ng-bind="item.name"></li>
			<li class="cname" ng-bind="item.value"></li>
			<li class="corder" ng-bind="item.qty"></li>
			<li class="corder" ng-bind="item.price"></li>
			<li class="cgrap" ng-bind="item.qty_next_diff"></li>
			<li class="cgrap" ng-bind="item.price_next"></li>
			</ul>
		</div>
	</div>
</body>
</html>
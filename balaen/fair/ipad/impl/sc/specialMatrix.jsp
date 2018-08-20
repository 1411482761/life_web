<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.agilecontrol.nea.core.web.config.*,org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals" %>
<%@ taglib uri="http://java.fckeditor.net" prefix="FCK" %>
<% 
    String sessionkey=request.getParameter("sessionkey");
    String pdtId= request.getParameter("id");

	 if("gunit".equals(QueryEngine.getInstance().doQueryOne("select value from ad_param where name='fair.analyze.urltype'"))){
		 request.getRequestDispatcher("/fair/ipad/gunit.jsp?pdtid="+pdtId+"&sessionkey="+sessionkey).forward(request,response);
		 return;
	}
	 if("gunitmark".equals(QueryEngine.getInstance().doQueryOne("select value from ad_param where name='fair.analyze.urltype'"))){
		 request.getRequestDispatcher("/fair/ipad/pdt_suggest.jsp?pdtid="+pdtId+"&sessionkey="+sessionkey).forward(request,response);
		 return;
	}
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html style="width:100%;height:100%;" lang="en" ng-app="specialMCtrl">

<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="Cache-Control" content= "no-cache"> 
<meta http-equiv="Expires" content= "0">
<meta name="apple-touch-fullscreen" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
<link rel="stylesheet" href="/fair/ipad/css/common/main.css" type="text/css" media="screen" title="no title" charset="utf-8">
	<link rel="stylesheet" href="/fair/ipad/impl/skechers/css/ionic.css">
<link rel="stylesheet" href="css/sM.css" type="text/css" media="screen" title="no title" charset="utf-8">
<script language="javascript" src="/fair/ipad/js/jquery.js"></script>

	<script src="/fair/ipad/impl/skechers/js/ionic.bundle.js"></script>
	<script src="/fair/ipad/impl/skechers/js/angular-cookies.js"></script>
	<script src="/fair/ipad/impl/skechers/js/ionic-toast.bundle.js"></script>

<script type="text/javascript">jQuery.noConflict();</script>

<script language="javascript" src="js/sM.js" charset="utf-8"></script>
<%--<script language="javascript" src="/nea/core/js/rest.js"></script>--%>
<title>特殊下单界面</title>
</head>

<body style='width:100%;height:100%; margin: 0;'  ng-controller="MySMCtrl">
	<div class="bar bar-header">
		<div class="h1 title">特殊下单模式</div>
	</div>

	<div class="content has-header">

	<div class="row">
		<div class="col">
			<div class="col-demo">样衣款号：</div>
		</div>
		<div class="col col-75">
			<div class="col-demo" ng-bind="yykh"></div>
		</div>
	</div>

	<div class="row">
		<div class="col">
			<div class="col-demo">波段属性：</div>
		</div>
		<div class="col">
			<div class="col-demo" ng-bind="bdsx"></div>
		</div>
		<div class="col">
			<div class="col-demo">波段排名：</div>
		</div>
		<div class="col">
			<div class="col-demo" ng-bind="bdpm"></div>
		</div>
	</div>

	<div class="row">
		<div class="col">
			<div class="col-demo">总订货数：</div>
		</div>
		<div class="col">
			<div class="col-demo" ng-bind="zdhs"></div>
		</div>
		<div class="col">
			<div class="col-demo">总订排名：</div>
		</div>
		<div class="col">
			<div class="col-demo" ng-bind="zdpm"></div>
		</div>
	</div>

	<div class="row">
		<div class="col">
			<div class="col-demo">代理订货：</div>
		</div>
		<div class="col">
			<div class="col-demo" ng-bind="dldh"></div>
		</div>
		<div class="col">
			<div class="col-demo">代理下单：</div>
		</div>
		<div class="col">
			<div class="col-demo"><input type="number" ng-model="dlxd" style="width:100%;background-color:rgb(57,141,238)"></div>
		</div>
	</div>

	<div class="row">
		<div class="col">
			<div class="col-demo">自营订货：</div>
		</div>
		<div class="col">
			<div class="col-demo" ng-bind="zydh"></div>
		</div>
		<div class="col">
			<div class="col-demo">自营下单：</div>
		</div>
		<div class="col">
			<div class="col-demo"><input type="number" ng-model="zyxd" style="width:100%;background-color:rgb(57,141,238)"></div>
		</div>
	</div>

	<div class="row">
		<div class="col">
			<div class="col-demo">提前下单：</div>
		</div>
		<div class="col">
			<div class="col-demo" ng-bind="tqxd"></div>
		</div>
		<div class="col">
			<div class="col-demo">预留快返：</div>
		</div>
		<div class="col">
			<div class="col-demo"><input type="number" ng-model="ylkf" style="width:100%;background-color:rgb(57,141,238)"></div>
		</div>
	</div>

	<div class="row">
		<div class="col">
			<div class="col-demo">下单类型：</div>
		</div>
		<div class="col">
			<div class="col-demo" ng-bind="xdlx"></div>
		</div>
		<div class="col">
			<div class="col-demo">下单总数：</div>
		</div>
		<div class="col">
			<div class="col-demo" ng-bind="xdzs"></div>
		</div>
	</div>

	<div class="row">
		<div class="col">
			<div class="col-demo">备注：<div id="demo" style="display:none"><%=pdtId%></div></div>
		</div>
		<div class="col col-50">
			<div class="col-demo"><input type="text" ng-model="bz" style="width:100%;background-color:rgb(57,141,238)"></div>
		</div>
		<div class="col">
			<div class="col-demo">
				<button class="button button-large button-assertive" ng-click="save()">保存</button>
			</div>
		</div>
	</div>
	</div>

	</body>
</html>
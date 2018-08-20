<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<%@ page import="java.util.Date,com.agilecontrol.nea.core.web.config.*,org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals" %>  
<%
  String date = String.valueOf(new Date().getTime());
  String name = request.getParameter("name");
  String cmd=ConfigValues.get("report.cmd", "com.agilecontrol.fair.FairCmd");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta content="text/html;charset=utf-8" http-equiv="Content-Type">
	<title>表配置页面</title>
	<link type="text/css" href="/fair/ipad/grid/css/share.css?t=<%=date %>" rel="StyleSheet"/>
	<script type="text/javascript" src="/fair/ipad/js/prototype.js?t=<%=date %>"></script>
	<script type="text/javascript" src="/fair/ipad/grid/js/jquery.min.js?t=<%=date %>"></script>
	<script type="text/javascript">jQuery.noConflict();</script>
	<script language="javascript" src="/nea/core/js/rest.js?t=<%=date %>"></script>
	<script type="text/javascript" src="/fair/ipad/grid/js/jquery-ui.min.js?t=<%=date %>"></script>
	<script type="text/javascript" src="/fair/ipad/grid/js/jquery.touch-punch.min.js?t=<%=date %>"></script>
	<link type="text/css" href="/fair/ipad/grid/css/index.css?t=<%=date %>" rel="StyleSheet"/>
	<script type="text/javascript" src="/fair/ipad/grid/js/jquery.shapeshift.js?t=<%=date %>"></script>
	<script type="text/javascript" src="/fair/ipad/grid/js/loadgridcontrol.js?t=<%=date %>"></script>
</head>
<body>
	<!--表-->
	<ul class="nav"></ul>
	<!--拖拽按钮-->
	<div class="secktions"></div>
	<!--表配置容器-->
	<div class="container">
		<div class="bm"></div>
		<div class="wd">维度：</div>
		<div class="dimension" id="dimension">
		</div>
		<div class="wd dl">度量：</div>
		<div class="dimension metric" id="metric">
			<!-- <div>销售金额</div>
			<div>吊牌金额</div>
			<div>数量</div> -->
		</div>
		<!--垃圾桶-->
		<div class="trash"></div>
	 </div>
	 <!--右边栏 表名-->
	 <div class="target"></div>
	 <div class="updatename"><p>数据库名字</p><input></div>
	 <!--提交按钮-->
	 <div class="submit">
		<button onclick="window.location.replace('/fair/ipad/grid/rptconfig.jsp?name=<%=name%>')">返回</button><button onclick="lc._savetabledef()">确认</button><button style="display:none;">跳转</button><button style="display:none;">整表删除</button>
	 </div>
</body>
<script type="text/javascript">
		jQuery(document).ready(function(){
			lc.init('<%=cmd%>');
		});
	</script>
</html>